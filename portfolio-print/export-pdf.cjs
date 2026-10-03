// Uses an existing local Chromium debugging session; no production dependency.
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const root = path.resolve(__dirname, '..');
const cache = path.join(root, 'node_modules/.cache/portfolio-pdf');
const endpoint = process.env.PDF_CDP_URL || 'http://127.0.0.1:9237';
const output = path.join(__dirname, 'Jonel_Bryan_Ablog_Portfolio.pdf');

async function main() {
  fs.mkdirSync(cache, { recursive: true });
  const response = await fetch(`${endpoint}/json/new?about:blank`, { method: 'PUT' });
  if (!response.ok) throw Error('Cannot create an isolated Chromium print tab');
  const target = await response.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
  let sequence = 0;
  const pending = new Map();
  const failures = [];
  ws.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const task = pending.get(message.id);
      if (!task) return;
      pending.delete(message.id);
      message.error ? task.reject(Error(JSON.stringify(message.error))) : task.resolve(message.result);
    } else if (message.method === 'Runtime.exceptionThrown') failures.push(message.params.exceptionDetails.text);
    else if (message.method === 'Network.loadingFailed') failures.push(message.params.errorText);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw Error(result.exceptionDetails.text);
    return result.result.value;
  };
  try {
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Network.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 794, height: 1123, deviceScaleFactor: 1, mobile: false });
    await send('Emulation.setEmulatedMedia', { media: 'print' });
    await send('Page.navigate', { url: pathToFileURL(path.join(__dirname, 'index.html')).href });
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      ready = await evaluate("document.readyState === 'complete' && document.querySelectorAll('.sheet').length === 8");
      if (ready) break;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (!ready) throw Error('The complete print document did not load');
    await evaluate('document.fonts.ready.then(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))');
    const pages = await evaluate(`Array.from(document.querySelectorAll('.sheet'), sheet => {
      const r = sheet.getBoundingClientRect();
      const content = sheet.querySelector('.page-content').getBoundingClientRect();
      const footer = sheet.querySelector('.page-footer').getBoundingClientRect();
      const outside = Array.from(sheet.querySelectorAll('*')).filter(el => {
        const b = el.getBoundingClientRect();
        return b.width > 0 && (b.left < r.left - 1 || b.right > r.right + 1 || b.bottom > r.bottom + 1);
      }).map(el => el.className || el.tagName);
      return { id: sheet.id, x:r.x + scrollX, y:r.y + scrollY, width:r.width, height:r.height,
        contentBottom:content.bottom-r.top, footerTop:footer.top-r.top,
        readable:content.bottom < footer.top-8, outside };
    })`);
    fs.writeFileSync(path.join(cache, 'pagination.json'), JSON.stringify(pages, null, 2));
    console.log(JSON.stringify(pages, null, 2));
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const result = await send('Page.captureScreenshot', {
        format: 'png', captureBeyondViewport: true,
        clip: { x: page.x, y: page.y, width: page.width, height: page.height, scale: 1 },
      });
      fs.writeFileSync(path.join(cache, `page-${i + 1}.png`), Buffer.from(result.data, 'base64'));
    }
    if (failures.length || pages.some(page => !page.readable || page.outside.length)) {
      throw Error('Print preflight failed. Inspect pagination.json and page images before export. ' + failures.join('; '));
    }
    const pdf = await send('Page.printToPDF', {
      printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false,
      generateTaggedPDF: true, generateDocumentOutline: true,
    });
    const buffer = Buffer.from(pdf.data, 'base64');
    const raw = buffer.toString('latin1');
    const pageCount = (raw.match(/\/Type\s*\/Page\b/g) || []).length;
    const uriMatches = [...raw.matchAll(/\/URI\s*\(([^)]+)\)/g)].map(match => match[1]);
    const manifest = JSON.parse(fs.readFileSync(path.join(cache, 'content-manifest.json'), 'utf8'));
    const missingLinks = manifest.links.filter(url => !uriMatches.includes(url));
    const report = {
      pageCount, bytes: buffer.length, links: uriMatches, missingLinks,
      embeddedFonts: /\/FontFile[23]?\b/.test(raw), tagged: /\/Marked\s+true/.test(raw),
      mediaBoxes: [...new Set(raw.match(/\/MediaBox\s*\[[^\]]+\]/g))], failures,
    };
    fs.writeFileSync(path.join(cache, 'pdf-verification.json'), JSON.stringify(report, null, 2));
    if (pageCount !== 8 || missingLinks.length || !report.embeddedFonts || !raw.startsWith('%PDF-')) {
      throw Error('PDF validation failed: ' + JSON.stringify(report));
    }
    fs.writeFileSync(output, buffer);
    console.log('PDF generated: ' + output);
    console.log(JSON.stringify(report, null, 2));
  } finally {
    ws.close();
    await fetch(`${endpoint}/json/close/${target.id}`).catch(() => {});
  }
}

main().catch(error => {
  console.error(error.message);
  console.error('Use the standalone document in Chrome/Edge and Print → Save as PDF if an existing Chromium debugging session is unavailable.');
  process.exitCode = 1;
});
