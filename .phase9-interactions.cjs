const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const fs = require("node:fs");
async function main() {
  const targets = await (await fetch("http://127.0.0.1:9237/json/list")).json();
  const target = targets.find((entry) => entry.type === "page");
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener("open", resolve, { once: true }));
  let seq = 0;
  const pending = new Map();
  const errors = [];
  ws.addEventListener("message", ({ data }) => {
    const item = JSON.parse(data);
    if (item.id) {
      const wait = pending.get(item.id);
      if (!wait) return;
      pending.delete(item.id);
      item.error ? wait.reject(item.error) : wait.resolve(item.result);
    } else if (item.method === "Runtime.exceptionThrown") {
      errors.push(item.params.exceptionDetails.text);
    } else if (item.method === "Log.entryAdded" && item.params.entry.level === "error") {
      errors.push(item.params.entry.text);
    }
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++seq;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result?.value;
  };
  const click = (selector) => evaluate(`document.querySelector(${JSON.stringify(selector)})?.click(); true`);
  const nativeClick = async (selector) => {
    const point = await evaluate(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      el?.scrollIntoView({ block:'center' });
      const r = el?.getBoundingClientRect();
      return r ? { x:r.left+r.width/2, y:r.top+r.height/2 } : null;
    })()`);
    if (!point) return false;
    await send("Input.dispatchMouseEvent", { type:"mousePressed", x:point.x, y:point.y, button:"left", clickCount:1 });
    await send("Input.dispatchMouseEvent", { type:"mouseReleased", x:point.x, y:point.y, button:"left", clickCount:1 });
    return true;
  };
  const focus = (selector) => evaluate(`document.querySelector(${JSON.stringify(selector)})?.focus(); document.activeElement?.outerHTML.slice(0, 160)`);
  const key = async (name, code, vk) => {
    const params = { key: name, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk };
    await send("Input.dispatchKeyEvent", { type: "keyDown", ...params });
    if (name === "Enter") await send("Input.dispatchKeyEvent", { type: "char", ...params, text: "\r", unmodifiedText: "\r" });
    await send("Input.dispatchKeyEvent", { type: "keyUp", ...params });
  };
  const goto = async (hash) => {
    await send("Page.navigate", { url: "http://127.0.0.1:5178/#" + hash });
    for (let i = 0; i < 60; i++) {
      if (await evaluate(`document.querySelector('[data-active-scene]')?.id === ${JSON.stringify(hash)}`)) {
        await pause(350);
        return true;
      }
      await pause(100);
    }
    return false;
  };
  const checks = [];
  const check = (name, result, detail) => checks.push({ name, pass: !!result, detail });
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Log.enable");
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

  check("direct arrival", await goto("arrival"));
  check("first prev disabled", await evaluate("document.querySelector('button[aria-label=\"Previous section\"]')?.disabled"));
  await click('button[aria-label="Next section"]');
  await pause(850);
  check("next to About and hash", await evaluate("location.hash === '#behind-the-work' && document.querySelector('[data-active-scene]')?.id === 'behind-the-work'"));
  await focus('button[aria-label="Next section"]');
  await key("Enter", "Enter", 13);
  await pause(850);
  check("keyboard nav button to Work", await evaluate("location.hash === '#featured-work' && document.activeElement?.tagName === 'H1'"), await evaluate("({ hash:location.hash, active:document.querySelector('[data-active-scene]')?.id, focus:document.activeElement?.outerHTML.slice(0, 100) })"));
  await send("Page.navigate", { url: "http://127.0.0.1:5178/#quest-board" });
  await pause(600);
  await send("Page.navigate", { url: "http://127.0.0.1:5178/#craft" });
  await pause(600);
  await evaluate("history.back()");
  await pause(600);
  check("browser Back", await evaluate("location.hash === '#quest-board' && document.querySelector('[data-active-scene]')?.id === 'quest-board'"));
  await evaluate("history.forward()");
  await pause(600);
  check("browser Forward", await evaluate("location.hash === '#craft' && document.querySelector('[data-active-scene]')?.id === 'craft'"));

  await goto("quest-board");
  const serviceCount = await evaluate("document.querySelectorAll('.services-architecture__trigger').length");
  check("six services", serviceCount === 6, serviceCount);
  for (let i = 0; i < serviceCount; i++) {
    const before = await evaluate(`document.querySelectorAll('.services-architecture__trigger')[${i}].getAttribute('aria-expanded')`);
    await evaluate(`document.querySelectorAll('.services-architecture__trigger')[${i}].click()`);
    await pause(60);
    const toggled = await evaluate(`document.querySelectorAll('.services-architecture__trigger')[${i}].getAttribute('aria-expanded')`);
    check("service " + (i + 1) + " toggles", toggled !== before, { before, toggled });
    await evaluate(`document.querySelectorAll('.services-architecture__trigger')[${i}].click()`);
    const restored = await evaluate(`document.querySelectorAll('.services-architecture__trigger')[${i}].getAttribute('aria-expanded')`);
    check("service " + (i + 1) + " restores", restored === before, { before, restored });
  }
  await focus(".services-architecture__trigger");
  const beforeKeyboard = await evaluate("document.querySelector('.services-architecture__trigger')?.getAttribute('aria-expanded')");
  await key("Enter", "Enter", 13);
  check("keyboard service toggle", await evaluate(`document.querySelector('.services-architecture__trigger')?.getAttribute('aria-expanded') !== ${JSON.stringify(beforeKeyboard)}`));
  await key("ArrowDown", "ArrowDown", 40);
  check("service arrow key does not change scene", await evaluate("location.hash === '#quest-board'"));

  await goto("craft");
  const techCount = await evaluate("document.querySelectorAll('.technology-architecture button[aria-pressed]').length");
  check("technology controls", techCount > 10, techCount);
  await evaluate("document.querySelectorAll('.technology-architecture button[aria-pressed]')[1].click()");
  check("technology selection", await evaluate("document.querySelectorAll('.technology-architecture button[aria-pressed]')[1].getAttribute('aria-pressed') === 'true'"));
  await focus(".technology-architecture button[aria-pressed]");
  await key("Enter", "Enter", 13);
  check("keyboard technology selection", await evaluate("document.querySelector('.technology-architecture button[aria-pressed]')?.getAttribute('aria-pressed') === 'true'"));

  await goto("featured-work");
  check("three projects", await evaluate("document.querySelectorAll('.work-case').length === 3"));
  const videoStates = await evaluate("[...document.querySelectorAll('.work-case video')].map(v => ({ preload:v.preload, muted:v.muted, loop:v.loop, error:v.error?.code ?? null, ready:v.readyState, network:v.networkState }))");
  check("three videos configured", videoStates.length === 3 && videoStates.every((v) => v.preload === "metadata" && v.muted && v.loop && v.error === null), videoStates);
  const projectLinks = await evaluate("[...document.querySelectorAll('.work-case__actions a')].map(a => ({ href:a.href, target:a.target, rel:a.rel }))");
  check("six project action links", projectLinks.length === 6 && projectLinks.every((a) => a.target === "_blank" && a.rel.includes("noopener")), projectLinks);
  for (let i = 0; i < 3; i++) {
    await evaluate(`document.querySelectorAll('.work-case__notes-action')[${i}].click()`);
    await pause(120);
    check("notes " + (i + 1) + " dialog", await evaluate("!!document.querySelector('.project-notes__panel[role=dialog][aria-modal=true]') && document.querySelector('#root')?.inert"));
    const notesFocus = await evaluate("document.activeElement?.className");
    check("notes " + (i + 1) + " focus inside", String(notesFocus).includes("project-notes__scroll"), notesFocus);
    await key("Escape", "Escape", 27);
    await pause(160);
    const state = await evaluate(`({ open:!!document.querySelector('.project-notes__panel'), inert:document.querySelector('#root')?.inert, focus:document.activeElement === document.querySelectorAll('.work-case__notes-action')[${i}] })`);
    check("notes " + (i + 1) + " closes/restores", !state.open && !state.inert && state.focus, state);
  }

  await goto("connect");
  const contact = await evaluate("({email:document.querySelector('.connection-endpoint__email-value')?.textContent, mailto:document.querySelector('.connection-endpoint__email-actions a')?.getAttribute('href'), links:[...document.querySelectorAll('.connection-endpoint__route-actions a')].map(a => a.getAttribute('href'))})");
  check("contact canonical email", contact.email === "ablogjonelbryan@gmail.com" && contact.mailto === "mailto:ablogjonelbryan@gmail.com", contact);
  await click(".connection-endpoint__email-actions button");
  await pause(100);
  const copyStatus = await evaluate("document.querySelector('.connection-endpoint__feedback')?.textContent.trim()");
  check("copy email feedback", copyStatus === "Email copied.", copyStatus);
  await evaluate("Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true })");
  await nativeClick(".connection-endpoint__email-actions button");
  await pause(100);
  const fallbackStatus = await evaluate("document.querySelector('.connection-endpoint__feedback')?.textContent.trim()");
  check("legacy copy fallback", fallbackStatus === "Email copied.", fallbackStatus);

  await goto("ending");
  const footer = await evaluate("({buttons:[...document.querySelectorAll('.closing-footer__navigation button')].map(b=>b.textContent.trim()),resources:[...document.querySelectorAll('.closing-footer__resources a')].map(a=>a.getAttribute('href')),resume:[...document.querySelectorAll('a[href$=\".pdf\"]')].map(a=>a.getAttribute('href')),year:document.querySelector('.closing-footer')?.textContent.match(/20[0-9]{2}/)?.[0]})");
  check("footer resources and year", footer.resume.includes("/Jonel_Ablog_Resume.pdf") && footer.year === String(new Date().getFullYear()), footer);
  check("final next disabled", await evaluate("document.querySelector('button[aria-label=\"Next section\"]')?.disabled"));
  await click(".closing-footer__navigation button");
  await pause(850);
  check("footer internal navigation", await evaluate("location.hash === '#arrival'"));

  await click(".neli-summon-button");
  await pause(130);
  check("NELI opens and input focus", await evaluate("!!document.querySelector('#jbta-assistant-panel[role=dialog]') && document.activeElement?.id === 'jbta-assistant-input'"));
  await click(".neli-prompt-trigger");
  await pause(100);
  check("NELI suggestions", await evaluate("document.querySelectorAll('[role=menuitem]').length > 0"));
  await click(".neli-prompt-option");
  await pause(150);
  check("NELI answers suggested prompt", await evaluate("document.querySelectorAll('.neli-message--oracle').length >= 2"));
  await key("Escape", "Escape", 27);
  await pause(250);
  check("NELI Escape closes", await evaluate("document.querySelector('.neli-summon-button')?.getAttribute('aria-expanded') === 'false'"));
  await click('button[aria-label="Open section navigation"]');
  await pause(100);
  check("section menu opens", await evaluate("document.querySelectorAll('#scene-selection-menu [role=menuitem]').length === 7"));
  await click('#scene-selection-menu li:last-child [role=menuitem]');
  await pause(700);
  check("section menu destination", await evaluate("location.hash === '#ending'"));
  const screenshotDir = ".phase9-screenshots";
  fs.mkdirSync(screenshotDir, { recursive: true });
  for (const [width, height, hashes] of [
    [1440, 1000, ["arrival", "featured-work", "connect", "ending"]],
    [390, 844, ["arrival", "featured-work", "connect", "ending"]],
  ]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 600 });
    for (const hash of hashes) {
      await goto(hash);
      const screenshot = await send("Page.captureScreenshot", { format:"jpeg", quality:68, captureBeyondViewport:false });
      fs.writeFileSync(`${screenshotDir}/${width}-${hash}.jpg`, Buffer.from(screenshot.data, "base64"));
    }
  }
  console.log("HEADING_FOCUS_STYLE", await evaluate("(() => { const h=document.querySelector('[data-active-scene] h1'); const s=getComputedStyle(h); return {focus:document.activeElement===h, outline:s.outline, border:s.border, color:s.color}; })()"));
  await evaluate("document.activeElement?.blur()");
  const blurred = await send("Page.captureScreenshot", { format:"jpeg", quality:68, captureBeyondViewport:false });
  fs.writeFileSync(`${screenshotDir}/390-ending-blurred.jpg`, Buffer.from(blurred.data, "base64"));
  console.log("FUNCTIONAL_CHECKS", checks.length);
  console.log("FUNCTIONAL_FAILURES", JSON.stringify(checks.filter((item) => !item.pass), null, 2));
  console.log("RUNTIME_ERRORS", JSON.stringify(errors));
  ws.close();
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
