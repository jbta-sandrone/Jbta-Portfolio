const fs = require("node:fs");

const targetUrl = "http://127.0.0.1:5178/";
const sceneHashes = [
  "arrival", "behind-the-work", "featured-work", "quest-board",
  "craft", "connect", "ending",
];
const sizes = [
  [1440, 1000], [1280, 800], [1024, 768], [768, 1024],
  [430, 932], [390, 844], [360, 800], [1440, 600],
  [1024, 600], [390, 600], [390, 480],
];
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const targets = await (await fetch("http://127.0.0.1:9237/json/list")).json();
  const target = targets.find((item) => item.type === "page");
  if (!target) throw new Error("No Chrome page target");
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  let seq = 0;
  const pending = new Map();
  const issues = [];
  ws.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const item = pending.get(message.id);
      if (!item) return;
      pending.delete(message.id);
      message.error ? item.reject(message.error) : item.resolve(message.result);
    } else if (message.method === "Runtime.exceptionThrown") {
      issues.push("EXCEPTION: " + message.params.exceptionDetails.text);
    } else if (message.method === "Log.entryAdded" && message.params.entry.level === "error") {
      issues.push("LOG: " + message.params.entry.text);
    }
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++seq;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const response = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
    return response.result?.value;
  };
  const click = (selector) => evaluate(`(() => {
    const node = document.querySelector(${JSON.stringify(selector)});
    if (!node) return false;
    node.click();
    return true;
  })()`);
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Log.enable");
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: targetUrl });
  await pause(300);
  await evaluate("sessionStorage.removeItem('jbta-portfolio-intro-seen')");
  const started = Date.now();
  await send("Page.reload", { ignoreCache: true });
  let introMs = null;
  for (let i = 0; i < 100; i++) {
    await pause(100);
    const state = await evaluate("({ ready: document.readyState, present: !!document.querySelector('.portfolio-intro'), seen: sessionStorage.getItem('jbta-portfolio-intro-seen') })");
    if (!state.present && state.seen === "true") { introMs = Date.now() - started; break; }
  }
  console.log("INTRO_MS", introMs);
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  const matrix = [];
  for (const [width, height] of sizes) {
    await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 600 });
    for (const hash of sceneHashes) {
      await send("Page.navigate", { url: targetUrl + "#" + hash });
      let settled = false;
      for (let attempt = 0; attempt < 50; attempt++) {
        await pause(100);
        settled = await evaluate(`document.querySelector('[data-active-scene]')?.id === ${JSON.stringify(hash)}`);
        if (settled) break;
      }
      const row = await evaluate(`(() => {
        const active = document.querySelector('[data-active-scene]');
        const scroll = active?.querySelector('[data-scene-scroll]');
        const heading = active?.querySelector('h1');
        const box = heading?.getBoundingClientRect();
        const all = [...document.querySelectorAll('body *')];
        const overflow = all.filter((el) => {
          const r = el.getBoundingClientRect();
          const s = getComputedStyle(el);
          return r.width > 0 && r.right > innerWidth + 2 && s.position !== 'fixed' && s.visibility !== 'hidden';
        }).slice(0, 4).map((el) => el.tagName.toLowerCase() + '.' + el.className);
        return {
          hash: location.hash,
          active: active?.id,
          h1: heading?.textContent.trim().replace(/\\s+/g, ' ').slice(0, 90),
          h1Count: active?.querySelectorAll('h1').length,
          headingTop: box?.top,
          headingBottom: box?.bottom,
          bodyOverflow: document.documentElement.scrollWidth - innerWidth,
          sceneOverflow: scroll ? scroll.scrollWidth - scroll.clientWidth : null,
          sceneScroll: scroll ? scroll.scrollHeight - scroll.clientHeight : null,
          overflow,
          neli: !!document.querySelector('[aria-label*="Neli" i]'),
        };
      })()`);
      matrix.push({ size: width + "x" + height, settled, ...row });
    }
  }
  const failures = matrix.filter((row) =>
    row.active !== row.hash.slice(1) || row.h1Count !== 1 ||
    row.bodyOverflow > 1 || row.sceneOverflow > 1 || row.overflow.length
  );
  console.log("MATRIX_TOTAL", matrix.length);
  console.log("MATRIX_FAILURES", JSON.stringify(failures, null, 2));
  console.log("MATRIX_SUMMARY", JSON.stringify(matrix.reduce((sum, row) => {
    sum[row.size] ??= { cases: 0, failed: 0, maxSceneScroll: 0 };
    sum[row.size].cases++;
    if (!row.settled || row.bodyOverflow > 1 || row.sceneOverflow > 1 || row.overflow.length) sum[row.size].failed++;
    sum[row.size].maxSceneScroll = Math.max(sum[row.size].maxSceneScroll, row.sceneScroll ?? 0);
    return sum;
  }, {}), null, 2));
  console.log("BROWSER_ISSUES", JSON.stringify(issues));
  fs.writeFileSync(".phase9-matrix.json", JSON.stringify({ introMs, matrix, failures, issues }, null, 2));
  ws.close();
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
