// Local browser regression checks. Run with THEME_QA_MODE=baseline before theme edits.
const fs = require('node:fs');
const url = process.env.QA_URL || 'http://127.0.0.1:5178/';
const port = process.env.QA_CDP_PORT || '9237';
const sizes = [[1440,1000],[1280,800],[1024,768],[768,1024],[430,932],[390,844],[360,800],[1440,600],[1024,600],[390,600],[390,480]];
const ids = ['arrival','behind-the-work','featured-work','quest-board','craft','connect','ending'];
const wait = ms => new Promise(r => setTimeout(r, ms));
async function main() {
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open',r,{once:true}));
  let seq=0; const pending=new Map(), checks=[], errors=[];
  ws.addEventListener('message',({data})=>{const m=JSON.parse(data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(p)m.error?p.reject(m.error):p.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text);});
  const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));});
  const ev=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
  const until=async expression=>{for(let i=0;i<150;i++){if(await ev(expression))return;await wait(100);}throw Error('Timeout: '+expression);};
  const check=(name,pass,detail)=>checks.push({name,pass:!!pass,detail});
  const media=async scheme=>send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:scheme},{name:'prefers-reduced-motion',value:'reduce'}]});
  const resize=async(w,h)=>{await send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:w<600});await send('Emulation.setTouchEmulationEnabled',{enabled:w<600,maxTouchPoints:1});await until(`innerWidth===${w} && innerHeight===${h}`);};
  let loadSequence=0;
  const load=async(hash='arrival')=>{const origin=await ev('performance.timeOrigin');await send('Page.navigate',{url:url+'?qa=theme-'+Date.now()+'-'+(++loadSequence)+'#'+hash});await until(`performance.timeOrigin!==${origin} && document.querySelectorAll('[data-portfolio-section]').length===7 && !document.querySelector('.portfolio-intro')`);await wait(250);};
  await send('Page.enable');await send('Runtime.enable');await media('light');
  await send('Page.addScriptToEvaluateOnNewDocument',{source:"sessionStorage.setItem('jbta-portfolio-intro-seen','true');"});
  await load();
  const baseline=process.env.THEME_QA_MODE==='baseline';
  const artifact=process.env.THEME_QA_ARTIFACTS || require('node:path').join(require('node:os').tmpdir(),'jbta-portfolio-theme-qa');
  fs.mkdirSync(artifact,{recursive:true});
  if(baseline) {
    const crypto=require('node:crypto'), cp=require('node:child_process');
    const files=cp.execSync('rg --files --hidden -g !node_modules -g !.git -g !dist -g !.theme-qa-artifacts').toString().trim().split(/\r?\n/);
    fs.writeFileSync(artifact+'/source-hashes.json',JSON.stringify(Object.fromEntries(files.map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')]))));
  }
  // A saved Dark preference correctly overrides the emulated Light OS. Force
  // the reference palette explicitly in baseline mode as well as comparison.
  await ev("localStorage.setItem('jbta-portfolio-theme','light')");await load();
  const saved=baseline?{}:fs.existsSync(artifact+'/light-baseline.json')?JSON.parse(fs.readFileSync(artifact+'/light-baseline.json')):null;
  if(!baseline&&!saved)console.log('No historical light capture found; run THEME_QA_MODE=baseline on the approved reference to enable that comparison.');
  const snapshot=()=>ev(`(() => {
    const keys=['color','backgroundColor','borderTopColor','borderLeftColor','borderBottomColor','borderRightColor','boxShadow','fill','stroke','fontFamily','fontSize','fontWeight','lineHeight','paddingTop','paddingBottom','paddingLeft','paddingRight','marginTop','marginBottom','width','height','display','position','top','bottom','borderRadius','filter','backgroundImage'];
    return [...document.querySelectorAll('main *, footer[data-portfolio-footer],footer[data-portfolio-footer] *, .neli-summon-button, .scene-nav__controls, .scene-nav__controls *')].map(el=>{const c=getComputedStyle(el);return {tag:el.tagName,id:el.id,cls:el.getAttribute('class'),css:Object.fromEntries(keys.map(k=>[k,c[k]]))};});
  })()`);
  for(const [w,h] of sizes) {
    await resize(w,h);await load();
    for(const id of ids){await ev(`document.getElementById('${id}').scrollIntoView({behavior:'instant'})`);await wait(50);}
    await wait(120);const current=await snapshot(),key=w+'x'+h;
    if(baseline)saved[key]=current;
    else if(saved) {
      const differences=[];const before=saved[key];
      // Intrinsic video height depends on whether metadata has arrived (a 0.875px
      // difference in the unchanged grid). Compare frame geometry here and test
      // live light/dark media geometry explicitly below, without masking frame shifts.
      const stable = node => node?.tag==='VIDEO' ? {...node,css:{...node.css,height:'metadata-dependent'}} : node;
      for(let i=0;i<Math.max(before.length,current.length);i++)if(JSON.stringify(stable(before[i]))!==JSON.stringify(stable(current[i])))differences.push({i,before:before[i],after:current[i]});
      check('light baseline '+key,differences.length===0,differences.slice(0,4));
    }
  }
  if(baseline) {fs.writeFileSync(artifact+'/light-baseline.json',JSON.stringify(saved));console.log('Captured light baseline at all 11 viewports; source hashes preserved.');ws.close();return;}
  // Browser preference precedence, live system following, persistence and storage failures.
  for(const [preference,system,expected] of [[null,'light','light'],[null,'dark','dark'],['dark','light','dark'],['light','dark','light']]) {
    await media(system);await ev(preference?`localStorage.setItem('jbta-portfolio-theme','${preference}')`:"localStorage.removeItem('jbta-portfolio-theme')");await load();
    check('preference '+preference+'/'+system,await ev(`document.documentElement.dataset.theme==='${expected}'`));
  }
  await ev("localStorage.removeItem('jbta-portfolio-theme')");await media('light');await load();await media('dark');await wait(100);
  check('live system preference',await ev("document.documentElement.dataset.theme==='dark'"));
  await ev("document.querySelector('.theme-toggle').click()");await media('light');await media('dark');await wait(100);
  check('manual preference wins after OS change',await ev("document.documentElement.dataset.theme==='light' && localStorage.getItem('jbta-portfolio-theme')==='light'"));
  for(const theme of ['dark','light']) {
    await ev(`if(document.documentElement.dataset.theme!=='${theme}')document.querySelector('.theme-toggle').click()`);
    await load();check('manual '+theme+' survives load',await ev(`document.documentElement.dataset.theme==='${theme}'`));
    const origin=await ev('performance.timeOrigin');await send('Page.reload');await until(`performance.timeOrigin!==${origin} && !!document.querySelector('.theme-toggle')`);
    check('manual '+theme+' survives refresh',await ev(`document.documentElement.dataset.theme==='${theme}'`));
  }
  const blocked=await send('Page.addScriptToEvaluateOnNewDocument',{source:"Storage.prototype.getItem=function(){throw Error('QA storage blocked')};Storage.prototype.setItem=function(){throw Error('QA storage blocked')};"});
  await media('dark');await load();check('storage failure safe',await ev("document.documentElement.dataset.theme==='dark' && !!document.querySelector('.theme-toggle')"));
  await ev("document.querySelector('.theme-toggle').click()");check('storage failure toggle safe',await ev("document.documentElement.dataset.theme==='light'"));await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:blocked.identifier});await load();
  // Capture the earliest state after the head bootstrap, before React mounts.
  const paint=await send('Page.addScriptToEvaluateOnNewDocument',{source:"addEventListener('DOMContentLoaded',()=>{window.__themeFirstPaint={theme:document.documentElement.dataset.theme,bg:document.documentElement.style.backgroundColor,meta:document.querySelector('meta[name=theme-color]').content};},{once:true});"});
  await ev("localStorage.setItem('jbta-portfolio-theme','dark')");
  for(const hash of ['arrival','featured-work','connect']) {await load(hash);check('dark initial paint '+hash,await ev("window.__themeFirstPaint?.theme==='dark' && window.__themeFirstPaint.bg==='rgb(9, 10, 12)' && window.__themeFirstPaint.meta==='#090a0c'"));}
  await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:paint.identifier});
  for(const theme of ['light','dark']) {
    await ev(`localStorage.setItem('jbta-portfolio-theme','${theme}')`);await load();
    for(const [w,h] of sizes) {
      await resize(w,h);await load();const key=theme+' '+w+'x'+h;
      for(const id of ids) {
        await ev(`document.getElementById('${id}').scrollIntoView({behavior:'instant'})`);await wait(140);
        const r=await ev(`(() => {const b=document.querySelector('.theme-toggle'),t=b.getBoundingClientRect(),n=document.querySelector('.scene-nav__controls').getBoundingClientRect(),a=document.querySelector('.neli-summon-button').getBoundingClientRect();const c=getComputedStyle(document.getElementById('${id}'));return {overflow:document.documentElement.scrollWidth>innerWidth,toggle:t.left>=0&&t.right<=innerWidth&&t.top>=0&&t.bottom<=innerHeight&&t.width>=44&&t.height>=44,hit:b.contains(document.elementFromPoint(t.left+t.width/2,t.top+t.height/2)),nav:t.bottom<n.top||t.right<n.left,avatar:t.bottom<a.top||t.top>a.bottom||t.right<a.left,bg:c.backgroundColor,color:c.color};})()`);
        check(key+' '+id,!r.overflow&&r.toggle&&r.hit&&r.nav&&r.avatar&&r.bg===(theme==='dark'?'rgb(9, 10, 12)':'rgb(248, 248, 245)'),r);
        if(process.argv.includes('--screenshots')&&((w===1440&&h===1000)||(w===768&&h===1024)||(w===390&&h===844))){await wait(300);fs.writeFileSync(artifact+'/'+theme+'-'+w+'-'+id+'.png',Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));}
      }
      await ev("document.getElementById('quest-board').scrollIntoView({behavior:'instant'})");
      for(const expanded of [false,true]) {
        await ev(`document.querySelectorAll('.services-architecture__trigger').forEach(b=>{if((b.getAttribute('aria-expanded')==='true')!==${expanded})b.click()})`);await wait(90);
        for(let step=0;step<=8;step++) {
          await ev(`(() => {const s=document.getElementById('quest-board');window.scrollTo({top:s.offsetTop+${step}/8*(s.offsetHeight-innerHeight),behavior:'instant'})})()`);
          const valid=await ev("(() => {const a=document.querySelector('.services-architecture__intro').getBoundingClientRect(),b=document.querySelector('.services-architecture__connection').getBoundingClientRect();return a.bottom+24<=b.top && document.documentElement.scrollWidth<=innerWidth && ![...document.querySelectorAll('#quest-board *')].some(e=>getComputedStyle(e).overflowY==='auto'&&e.scrollHeight>e.clientHeight+1)})()");
          check(key+' Services '+expanded+' step '+step,valid);
        }
      }
      // Exercise every mutually exclusive capability, not just the last one
      // selected by the loop above, including CTA clearance on short screens.
      for(let index=0;index<6;index++) {
        await ev(`(() => {const b=document.querySelectorAll('.services-architecture__trigger')[${index}];if(b.getAttribute('aria-expanded')!=='true')b.click()})()`);
        await wait(90);
        const detail=await ev(`(() => {const b=document.querySelectorAll('.services-architecture__trigger')[${index}],p=document.getElementById(b.getAttribute('aria-controls')),intro=document.querySelector('.services-architecture__intro').getBoundingClientRect(),system=document.querySelector('.services-architecture__system').getBoundingClientRect(),cta=document.querySelector('.services-architecture__connection').getBoundingClientRect();return {selected:b.getAttribute('aria-expanded')==='true'&&!p.inert&&p.getAttribute('aria-hidden')==='false',count:document.querySelectorAll('.services-architecture__trigger[aria-expanded="true"]').length,clear:cta.top>=Math.max(intro.bottom,system.bottom)+24,overflow:document.documentElement.scrollWidth>innerWidth};})()`);
        check(key+' Services capability '+(index+1),detail.selected&&detail.count===1&&detail.clear&&!detail.overflow,detail);
      }
      await ev("document.querySelector('.neli-summon-button').click()");await wait(100);
      check(key+' NELI original media',await ev("[...document.querySelectorAll('.neli-summon-portrait,.neli-header-portrait,.neli-message-portrait')].length>=3&&[...document.querySelectorAll('.neli-summon-portrait,.neli-header-portrait,.neli-message-portrait')].every(e=>getComputedStyle(e).filter==='none'&&e.naturalWidth>0)&&document.documentElement.scrollWidth<=innerWidth"));
      await ev("document.querySelector('.neli-titlebar-button').click()");await wait(80);
      if((w===1440&&h===1000)||(w===390&&h===844)) {
        await ev("document.getElementById('arrival').scrollIntoView({behavior:'instant'})");await wait(100);
        fs.writeFileSync(artifact+'/'+theme+'-'+w+'.png',Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
      }
    }
  }
  // A theme change must not move any existing layout box, including loaded media.
  await resize(1440,1000);await load();
  await ev("document.getElementById('featured-work').scrollIntoView({behavior:'instant'})");
  await wait(500);
  const geometry=()=>ev("JSON.stringify([...document.querySelectorAll('main *, footer[data-portfolio-footer] *, .neli-summon-button, .scene-nav__controls')].map(e=>{const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height]}))");
  const beforeGeometry=await geometry();await ev("document.querySelector('.theme-toggle').click()");await wait(100);
  check('live theme change preserves every layout box',beforeGeometry===await geometry());
  const key=async(k,code,vk)=>{await send('Input.dispatchKeyEvent',{type:'keyDown',key:k,code,windowsVirtualKeyCode:vk});if(k===' '||k==='Enter')await send('Input.dispatchKeyEvent',{type:'char',text:k==='Enter'?'\r':' ',key:k,windowsVirtualKeyCode:vk});await send('Input.dispatchKeyEvent',{type:'keyUp',key:k,code,windowsVirtualKeyCode:vk});};
  await ev("document.querySelector('.theme-toggle').focus()");await key('Tab','Tab',9);await ev("document.querySelector('.theme-toggle').focus()");
  check('theme toggle visible keyboard focus',await ev("getComputedStyle(document.querySelector('.theme-toggle')).outlineWidth==='3px' && document.querySelector('.theme-toggle').getAttribute('aria-label').startsWith('Switch to ')"));
  const keyboardBefore=await ev('document.documentElement.dataset.theme');await key(' ','Space',32);
  check('Space toggles theme',keyboardBefore!==await ev('document.documentElement.dataset.theme'));
  await key('Enter','Enter',13);check('Enter toggles theme',keyboardBefore===await ev('document.documentElement.dataset.theme'));
  for(const theme of ['light','dark']) {
    await ev(`localStorage.setItem('jbta-portfolio-theme','${theme}')`);await load();
    check(theme+' browser theme-color',await ev(`document.querySelector('meta[name="theme-color"]').content==='${theme==='dark'?'#090a0c':'#f8f8f5'}'`));
    for(const [w,h] of [[1440,1000],[768,1024],[390,844],[390,480]]) {
      await resize(w,h);await ev("document.querySelector('.work-case__notes-action').scrollIntoView({block:'center',behavior:'instant'})");await wait(150);
      const position=await ev('scrollY');
      await ev("document.querySelector('.work-case__notes-action').click()");await wait(150);
      check(theme+' '+w+'x'+h+' notes palette/lock',await ev(`document.getElementById('root').inert && document.body.style.position==='fixed' && getComputedStyle(document.querySelector('.project-notes__panel')).backgroundColor==='${theme==='dark'?'rgb(14, 16, 20)':'rgb(248, 248, 245)'}'`));
      if(process.argv.includes('--screenshots'))fs.writeFileSync(artifact+'/'+theme+'-'+w+'-'+h+'-notes.png',Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
      await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:130,y:150});await wait(50);
      if(w>=768)check(theme+' '+w+' notes cursor',await ev("document.querySelector('.portfolio-cursor') && getComputedStyle(document.querySelector('.portfolio-cursor')).pointerEvents==='none'"));
      await key('Escape','Escape',27);await wait(160);
      check(theme+' '+w+' notes restores position',await ev(`!document.getElementById('root').inert && Math.abs(scrollY-${position})<2 && !document.querySelector('.project-notes__panel')`));
      await ev("document.getElementById('arrival').scrollIntoView({behavior:'instant'})");await wait(150);
      check(theme+' '+w+' hero Explore not covered by toggle',await ev("(() => {const a=document.querySelector('.arrival-hero__explore').getBoundingClientRect(),b=document.querySelector('.theme-toggle').getBoundingClientRect();return a.bottom<=b.top||a.top>=b.bottom||a.right<=b.left||a.left>=b.right})()"));
    }
    await resize(1440,1000);await ev("document.querySelector('.neli-summon-button').click()");await wait(100);
    await ev("document.querySelector('.neli-prompt-trigger').click()");await wait(100);
    check(theme+' NELI all UI surfaces themed',await ev(`['.neli-panel','.neli-message-bubble--oracle','.neli-footer','.neli-suggestion-panel','.neli-command-input'].every(s=>getComputedStyle(document.querySelector(s)).backgroundColor==='${theme==='dark'?'rgb(14, 16, 20)':'rgb(255, 255, 255)'}')`));
    if(process.argv.includes('--screenshots'))fs.writeFileSync(artifact+'/'+theme+'-neli.png',Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
    check(theme+' all meaningful media unfiltered',await ev("[...document.querySelectorAll('main img,main video,.neli-summon-portrait,.neli-header-portrait,.neli-message-portrait')].every(e=>getComputedStyle(e).filter==='none' && getComputedStyle(e).mixBlendMode==='normal')"));
    await ev("document.querySelector('.neli-titlebar-button').click()");await wait(100);
    // Check primary/secondary/muted text and accented labels against every shared surface.
    const contrast=await ev(`(() => {
      const c=getComputedStyle(document.documentElement), rgb=h=>{h=h.trim().replace('#','');if(h.length===3)h=[...h].map(v=>v+v).join('');return h.match(/../g).map(v=>parseInt(v,16)/255);}, lum=h=>rgb(h).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0), ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05), val=n=>c.getPropertyValue('--portfolio-'+n).trim();
      return Object.fromEntries(['text','text-secondary','text-muted','accent'].map(n=>[n,Math.min(...['bg','surface','surface-muted','accent-soft'].map(s=>ratio(val(n),val(s))))]).concat([['button',ratio(val('on-accent'),val('accent-solid'))],['button-hover',ratio(val('on-accent'),val('accent-hover'))],['placeholder',ratio(val('placeholder'),val('surface'))]]));
    })()`);
    check(theme+' text/label/button contrast',Object.values(contrast).every(r=>r>=4.5),contrast);
  }
  await resize(390,480);
  const touchBefore=await ev('document.documentElement.dataset.theme');
  const touchPoint=await ev("(() => {const r=document.querySelector('.theme-toggle').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()");
  await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[touchPoint]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await wait(100);
  check('mobile touch theme toggle',touchBefore!==await ev('document.documentElement.dataset.theme'));
  // Fresh tabs have no intro/session injection. Record every frame through a normal
  // first intro to catch a wrong-color initial canvas, not only the final React UI.
  for(const hash of ['featured-work','connect']) {
    const target=await send('Target.createTarget',{url:'about:blank'});
    const {sessionId}=await send('Target.attachToTarget',{targetId:target.targetId,flatten:true});
    const fresh=async expression=>(await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},sessionId)).result.value;
    await send('Page.enable',{},sessionId);
    await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:'dark'},{name:'prefers-reduced-motion',value:'no-preference'}]},sessionId);
    const init=await send('Page.addScriptToEvaluateOnNewDocument',{source:"localStorage.removeItem('jbta-portfolio-theme');sessionStorage.removeItem('jbta-portfolio-intro-seen');window.__themeFrames=[];function frame(){if(document.documentElement){window.__themeFrames.push({theme:document.documentElement.dataset.theme,bg:getComputedStyle(document.documentElement).backgroundColor,intro:document.querySelector('.portfolio-intro')?getComputedStyle(document.querySelector('.portfolio-intro')).backgroundColor:null});}if(window.__themeFrames.length<400)requestAnimationFrame(frame);}requestAnimationFrame(frame);"},sessionId);
    const started=Date.now();await send('Page.navigate',{url:url+'?qa=paint-'+hash+'#'+hash},sessionId);
    let sawIntro=false;
    for(let i=0;i<80;i++){await wait(100);const ready=await fresh("({intro:!!document.querySelector('.portfolio-intro'),done:!!document.querySelector('main')&&!document.querySelector('.portfolio-intro')})");sawIntro=sawIntro||ready?.intro;if(ready?.done)break;}
    const frames=await fresh('window.__themeFrames');
    check('fresh OS dark first intro '+hash,sawIntro&&Date.now()-started>=3500);
    check('every initial paint stays dark '+hash,frames?.length>20&&frames.every(f=>f.theme==='dark'&&f.bg==='rgb(9, 10, 12)'&&(!f.intro||f.intro==='rgb(9, 10, 12)')),frames?.length);
    // Allow the existing two-frame post-intro native hash fallback to settle.
    await wait(300);
    check('fresh intro direct hash '+hash,await fresh(`Math.abs(document.getElementById('${hash}').getBoundingClientRect().top)<3`));
    await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:init.identifier},sessionId);
    await send('Page.navigate',{url:url+'?qa=paint-session-'+hash+'#'+hash},sessionId);await wait(500);
    check('same session skips intro '+hash,await fresh("!!document.querySelector('main')&&!document.querySelector('.portfolio-intro')"));
    await send('Target.closeTarget',{targetId:target.targetId});
  }
  check('no uncaught browser exceptions',errors.length===0,errors);
  fs.writeFileSync(artifact+'/results.json',JSON.stringify(checks,null,2));
  const failed=checks.filter(c=>!c.pass);console.log(JSON.stringify({checks:checks.length,passed:checks.length-failed.length,failed},null,2));ws.close();if(failed.length)process.exitCode=1;
}
main().catch(e=>{console.error(e);process.exit(1);});
