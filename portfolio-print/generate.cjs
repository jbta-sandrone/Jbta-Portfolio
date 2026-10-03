// Standalone document generation. The live application's source is read, never changed.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const cp = require('node:child_process');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const out = __dirname;
const cache = path.join(root, 'node_modules/.cache/portfolio-pdf');
fs.mkdirSync(cache, { recursive: true });

const sources = new Map();
function source(file) {
  if (!sources.has(file)) sources.set(file, ts.createSourceFile(file, fs.readFileSync(path.join(root, file), 'utf8'), ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS));
  return sources.get(file);
}
function walk(node, predicate) {
  if (predicate(node)) return node;
  return ts.forEachChild(node, child => walk(child, predicate));
}
function literal(node, omitted = []) {
  if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node) || ts.isParenthesizedExpression(node)) return literal(node.expression, omitted);
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(n => literal(n, omitted));
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.filter(p => ts.isPropertyAssignment(p) && !omitted.includes(p.name.text)).map(p => [p.name.text, literal(p.initializer, omitted)]));
  throw Error('Unsupported content expression: ' + node.getText());
}
function constant(file, name, omitted = []) {
  const node = walk(source(file), n => ts.isVariableDeclaration(n) && n.name.getText() === name);
  if (!node?.initializer) throw Error('Missing source content: ' + file + ' / ' + name);
  return literal(node.initializer, omitted);
}
const decode = s => s.replace(/&(?:apos|quot|amp|lt|gt|nbsp);/g, e => ({'&apos;':"'",'&quot;':'"','&amp;':'&','&lt;':'<','&gt;':'>','&nbsp;':' '})[e]);
const normalized = s => decode(s).replace(/\s+/g, ' ').trim();
function attr(node, key) {
  if (!ts.isJsxElement(node)) return null;
  const a = node.openingElement.attributes.properties.find(a => ts.isJsxAttribute(a) && a.name.getText() === key);
  return a?.initializer && ts.isStringLiteral(a.initializer) ? a.initializer.text : null;
}
function element(file, key, value, within) {
  const match = walk(within || source(file), n => ts.isJsxElement(n) && (key === 'className' ? (attr(n, key) || '').split(/\s+/).includes(value) : attr(n, key) === value));
  if (!match) throw Error('Missing document source element: ' + value);
  return match;
}
function text(node) {
  if (ts.isJsxText(node)) return node.text;
  if (ts.isJsxElement(node)) return node.children.map(text).join(' ');
  if (ts.isJsxExpression(node) && node.expression) return String(literal(node.expression));
  return '';
}
function copy(file, key, value, within) { return normalized(text(element(file, key, value, within))); }
function paragraphs(node) {
  const result = [];
  function visit(n) { if (ts.isJsxElement(n) && n.openingElement.tagName.getText() === 'p') result.push(normalized(text(n))); else ts.forEachChild(n, visit); }
  visit(node); return result;
}
const aboutFile = 'src/scenes/BehindTheWork.tsx';
const hero = constant('src/data/hero.ts', 'hero');
const projects = constant('src/scenes/HallOfCreations.tsx', 'projects', ['video']);
const notes = constant('src/data/projectNotes.ts', 'projectNotes');
const services = constant('src/scenes/QuestBoard.tsx', 'services');
const technologies = constant('src/data/sceneFourTechnologyData.ts', 'techGroups', ['icon', 'orbit', 'brandColor', 'brandColorSecondary', 'lightTile']);
const contacts = constant('src/scenes/SignalObservatory.tsx', 'connectionItems', ['icon']);
const strengths = constant(aboutFile, 'strengths');
const principles = constant(aboutFile, 'principles');
const record = id => paragraphs(element(aboutFile, 'aria-labelledby', id));
const profile = {
  intro: paragraphs(element(aboutFile, 'className', 'about-profile__intro-copy')),
  education: record('about-education-title'),
  direction: record('about-direction-title'),
  focus: record('about-focus-title')[0],
};
const technologyNames = ids => ids.map(id => {
  const technology = technologies.flatMap(group => group.technologies).find(item => item.id === id);
  if (!technology) throw Error('Missing core technology: ' + id);
  return technology.name;
}).join(' · ');
const tagline = copy('src/scenes/Arrival.tsx', 'id', 'arrival-title');
const closing = copy('src/scenes/JourneysHorizon.tsx', 'id', 'ending-title');
const contactAside = element('src/scenes/SignalObservatory.tsx', 'className', 'connection-endpoint__intro-aside');
const contactIntro = walk(contactAside, n => ts.isJsxElement(n) && n.openingElement.tagName.getText() === 'p');
if (!contactIntro) throw Error('Missing contact introduction');
const contactCopy = normalized(text(contactIntro));
const serviceCopy = copy('src/scenes/QuestBoard.tsx', 'className', 'services-architecture__copy');
const year = new Date().getFullYear();
const h = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const p = value => `<p>${h(value)}</p>`;
const list = (items, cls = '') => `<ul class="${cls}">${items.map(item => `<li>${h(item)}</li>`).join('')}</ul>`;
const link = (label, url) => `<a href="${h(url)}">${h(label)} <span aria-hidden="true">↗</span></a>`;
const findContact = id => {const item = contacts.find(item => item.id === id);if (!item) throw Error('Missing contact: '+id);return item;};
const section = (projectId, id, kind) => {
  const s = notes[projectId]?.sections.find(s => s.id === id);
  if (!s || s.kind !== kind) throw Error('Source section changed: ' + projectId + '/' + id);
  return s;
};
const heading = (label, title, intro = '') => `<header class="page-heading"><p class="eyebrow">${h(label)}</p><h2>${h(title)}</h2>${intro ? p(intro) : ''}</header>`;
const block = (label, body, cls = '') => `<section class="record ${cls}"><h3>${h(label)}</h3>${body}</section>`;
const footer = number => `<footer class="page-footer"><span>${h(hero.name)}</span><span>Portfolio / ${year}</span><span>${String(number).padStart(2,'0')} / 08</span></footer>`;
const page = (number, id, body, cls = '') => `<section class="sheet ${cls}" id="${id}" aria-label="Page ${number}"><div class="page-content">${body}</div>${footer(number)}</section>`;

// There is no canonical deployed portfolio URL in the current source. Do not
// guess one or turn the source résumé path into a localhost/file hyperlink.
const portfolioUrl = null;
const pages = [];
pages.push(page(1, 'cover', `
  <header class="cover-marker"><span>PORTFOLIO / ${year}</span><span>SELECTED WORK</span></header>
  <div class="cover-identity"><p class="eyebrow">SOFTWARE + AI ENGINEERING</p><h1>${h(hero.name)}</h1><p class="positioning">${h(hero.subheadline)}</p></div>
  <div class="cover-statement"><h2>${h(tagline)}</h2><p>Responsive full-stack applications.<br>Practical AI-powered features.<br>Useful, human-centered experiences.</p></div>
  <svg class="cover-system" viewBox="0 0 260 260" aria-hidden="true" fill="none"><g stroke="var(--print-line)"><circle cx="130" cy="130" r="104"/><circle cx="130" cy="130" r="67"/><path d="M12 130h236M130 12v236M56 56l148 148M56 204 204 56"/></g><path d="M130 26a104 104 0 0 1 94 60" stroke="var(--print-accent)"/><rect x="113" y="113" width="34" height="34" fill="var(--print-paper)" stroke="var(--print-ink)"/><circle cx="204" cy="56" r="4" fill="var(--print-accent)"/><circle cx="56" cy="204" r="3" fill="var(--print-ink)"/></svg>
  <div class="cover-summary"><span>${String(projects.length).padStart(2,'0')} PROJECT CASE STUDIES</span><span>PROFILE · TECHNOLOGY · CAPABILITIES</span></div>
`, 'cover'));
pages.push(page(2, 'professional-profile', `
  ${heading('02 / PROFESSIONAL PROFILE', 'Behind the work.')}
  <div class="profile-columns"><div>
    ${block('About', profile.intro.map(p).join(''))}
    ${block('Education', `<p class="strong">${h(profile.education[0])}</p>${p(profile.education[1])}<p class="honor">${h(profile.education[2])}</p>${p(profile.education[3])}`)}
    ${block('Career direction', `<p class="strong">${h(profile.direction[0])}</p>${p(profile.direction[1])}`)}
  </div><div>
    ${block('Current focus', p(profile.focus), 'focus-record')}
    ${block('Professional strengths', list(strengths, 'indexed'))}
    ${block('Working principles', list(principles, 'indexed'))}
  </div></div>
  ${block('Core technologies', `<dl class="core-stack"><div><dt>Interface</dt><dd>${h(technologyNames(['react','typescript','css']))}</dd></div><div><dt>Application services</dt><dd>${h(technologyNames(['node','express','python','fastapi']))}</dd></div><div><dt>AI features</dt><dd>${h(technologyNames(['gemini','llm-integration','prompt-engineering']))}</dd></div></dl>`)}
`));
function architecture(projectId) {
  const a = section(projectId, 'architecture', 'architecture');
  return block('Architecture', `<ol class="system-flow">${a.steps.map((step,i) => `<li><span class="step-number">0${i+1}</span><span>${h(step)}</span></li>`).join('')}</ol><p class="system-note">${h(a.note)}</p>`);
}
function stack(projectId) {
  const a = section(projectId, 'technology', 'technology');
  return block('Technology', `<dl class="technology-stack">${a.groups.map(g => `<div><dt>${h(g.label)}</dt><dd>${h(g.items.join(' · '))}</dd></div>`).join('')}</dl>`);
}
projects.forEach((project,index) => {
  let main, secondary;
  if (project.id === 'i-nelory') {
    main = block('Purpose', section(project.id,'purpose','text').paragraphs.map(p).join('')) + block('What I built', list(section(project.id,'key-systems','list').items));
    secondary = block('AI search', section(project.id,'ai-search','text').paragraphs.map(p).join(''));
  } else if (project.id === 'cliq') {
    const overview = section(project.id,'overview','text').paragraphs[0];
    const capstone = overview.slice(overview.indexOf('It began as a capstone'));
    if (!capstone.startsWith('It began')) throw Error('Missing factual IntelliCLIQ project context');
    main = block('Project context', p(capstone)) + block('Customer systems', list(section(project.id,'customer-systems','list').items)) + block('Administration', list(section(project.id,'admin-systems','list').items));
    secondary = block('Guided AI recommendations', section(project.id,'smart-search','text').paragraphs.map(p).join(''));
  } else {
    const groups = section(project.id,'career-systems','groups').groups;
    main = block('Career systems', groups.map(g=>`<div class="capability-group"><h4>${h(g.title)}</h4>${p(g.detail)}</div>`).join(''));
    secondary = block('Engineering focus', p(section(project.id,'overview','text').paragraphs[1])) + block('AI usage + privacy', section(project.id,'privacy','text').paragraphs.map(p).join(''));
  }
  const actions = [project.liveUrl && link('Live Demo',project.liveUrl),project.githubUrl && link('GitHub repository',project.githubUrl)].filter(Boolean).join('');
  pages.push(page(index+3, 'project-'+project.id, `
    <header class="case-heading"><p class="eyebrow">${String(index+1).padStart(2,'0')} / SELECTED WORK <span>${h(project.category)}</span></p><h2>${h(project.title)}</h2><p class="descriptor">${h(project.descriptor)}</p>${p(project.description)}</header>
    <div class="case-columns"><div>${main}</div><aside aria-label="${h(project.title)} engineering details">${secondary}${stack(project.id)}</aside></div>
    ${architecture(project.id)}
    <nav class="project-links" aria-label="${h(project.title)} project links"><span class="eyebrow">EXPLORE THE PROJECT</span>${actions}</nav>
  `, 'case-study'));
});
pages.push(page(6, 'technology', `
  ${heading('06 / ENGINEERING SYSTEM', 'Technology, in context.', 'Interfaces, application services, data, AI features, and delivery.')}
  <div class="technology-records">${technologies.map((g,i)=>`<section class="technology-record"><div><span class="eyebrow">0${i+1}</span><h3>${h(g.label)}</h3><p>${h(g.eyebrow)}</p></div><ul>${g.technologies.map(t=>`<li>${h(t.name)}</li>`).join('')}</ul></section>`).join('')}</div>
  ${block('Project systems', `<table class="project-systems"><thead><tr><th>Project</th><th>Client</th><th>Application services</th><th>Data / supporting systems</th></tr></thead><tbody><tr><th>I-Nelory</th><td>React / TypeScript</td><td>Node / Express REST API</td><td>Prisma · PostgreSQL / Neon · Cloudinary · Gemini</td></tr><tr><th>IntelliCLIQ</th><td>HTML / CSS / JavaScript</td><td>Node.js / Express</td><td>Firebase Authentication + Realtime Database · Gemini</td></tr><tr><th>Nelume</th><td>React / TypeScript</td><td>Python / FastAPI</td><td>PDF processing · Gemini · Upstash Redis usage enforcement</td></tr></tbody></table>`)}
`));
pages.push(page(7, 'capabilities', `
  ${heading('07 / CAPABILITIES', 'From interface to intelligence.', serviceCopy)}
  <ol class="service-records">${services.map((s,i)=>`<li><span class="service-number">0${i+1}</span><div><h3>${h(s.title)}</h3>${p(s.description)}<p class="specialties">${h(s.specialties.join(' · '))}</p></div></li>`).join('')}</ol>
  ${block('Working principles', list(principles, 'principles-inline'))}
`));
const email = findContact('email'), github = findContact('github'), linkedin = findContact('linkedin'), resume = findContact('resume');
pages.push(page(8, 'contact', `
  ${heading('08 / CONTACT', 'Let’s connect.')}
  <h3 class="closing-statement">${h(closing)}</h3>${p(contactCopy)}
  <dl class="contact-directory"><div><dt>Email</dt><dd>${link(email.value,email.href)}</dd></div><div><dt>GitHub</dt><dd>${link('Code + projects',github.href)}<span class="printed-address">${h(github.href.replace('https://',''))}</span></dd></div><div><dt>LinkedIn</dt><dd>${link('Professional profile',linkedin.href)}<span class="printed-address">${h(linkedin.href.replace('https://',''))}</span></dd></div>${portfolioUrl ? `<div><dt>Portfolio</dt><dd>${link('Interactive portfolio',portfolioUrl)}<span class="printed-address">${h(portfolioUrl)}</span></dd></div>` : ''}<div><dt>Résumé reference</dt><dd>${h(path.basename(resume.href))}<span class="printed-address">Separate résumé document</span></dd></div></dl>
  <div class="document-note"><span class="eyebrow">APPLICATION EDITION</span><p>A concise companion to the interactive portfolio, presenting the professional profile, selected work, technologies, and capabilities.</p></div>
`));

const theme = fs.readFileSync(path.join(root,'src/styles/professional-system.css'),'utf8').match(/:root\s*\{([\s\S]*?)\}/)[1];
const token = name => {const v=theme.match(new RegExp('--portfolio-'+name+':\\s*(#[0-9a-fA-F]+)'));if(!v)throw Error('Missing light theme token: '+name);return v[1];};
const palette = {paper:token('bg'),ink:token('text'),secondary:token('text-secondary'),muted:token('text-muted'),accent:token('accent'),line:token('line'),strong:token('line-strong')};
const html = `<!doctype html>
<!-- Generated by node portfolio-print/generate.cjs. Do not hand-edit factual copy. -->
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${h(hero.name)} — Portfolio</title><meta name="description" content="Application-ready portfolio document for ${h(hero.name)}"><meta name="color-scheme" content="light"><link rel="stylesheet" href="portfolio-print.css"><style>:root{${Object.entries(palette).map(([key,value])=>`--print-${key}:${value}`).join(';')}}</style></head><body><div class="print-toolbar"><span>${h(hero.name)} · Application portfolio</span><button type="button" onclick="window.print()">Print / Save as PDF</button></div><main>${pages.join('\n')}</main></body></html>\n`;
fs.writeFileSync(path.join(out,'index.html'),html,'utf8');
fs.writeFileSync(path.join(cache,'content-manifest.json'),JSON.stringify({name:hero.name,positioning:hero.subheadline,year,pageCount:pages.length,portfolioUrl,projectIds:projects.map(p=>p.id),palette,sources:[...sources.keys()],links:[...html.matchAll(/href="([^"]+)"/g)].map(m=>decode(m[1])).filter(u=>!u.endsWith('.css'))},null,2));
const baseline = path.join(cache,'starting-hashes.json');
if (!fs.existsSync(baseline)) {
  const tracked=cp.execFileSync('git',['ls-files','-z'],{cwd:root}).toString().split('\0').filter(Boolean);
  fs.writeFileSync(baseline,JSON.stringify(Object.fromEntries(tracked.map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')]))));
}
console.log('Generated 8-page standalone print document: '+path.join(out,'index.html'));
