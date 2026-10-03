const fs = require("node:fs");
const baseUrl = process.env.QA_URL || "http://127.0.0.1:5178/";
const cdpPort = process.env.QA_CDP_PORT || "9237";
const sections = ["arrival", "behind-the-work", "featured-work", "quest-board", "craft", "connect", "ending"];
const labels = ["Introduction", "About", "Selected Work", "Services", "Technology", "Contact", "Closing"];
const sizes = [[1440,1000],[1280,800],[1024,768],[768,1024],[430,932],[390,844],[360,800],[1440,600],[1024,600],[390,600],[390,480]];
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const targets = await (await fetch(`http://127.0.0.1:${cdpPort}/json/list`)).json();
  const ws = new WebSocket(targets.find((entry) => entry.type === "page").webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener("open", resolve, { once:true }));
  let sequence = 0;
  const pending = new Map(), runtimeErrors = [], failedResources = [], videoRequests = new Set();
  ws.addEventListener("message", ({data}) => {
    const message = JSON.parse(data);
    if (message.id) {
      const task = pending.get(message.id);
      if (!task) return;
      pending.delete(message.id);
      message.error ? task.reject(message.error) : task.resolve(message.result);
    } else if (message.method === "Runtime.exceptionThrown") runtimeErrors.push(message.params.exceptionDetails.text);
    else if (message.method === "Log.entryAdded" && message.params.entry.level === "error") runtimeErrors.push(message.params.entry.text);
    else if (message.method === "Network.responseReceived" && message.params.response.status >= 400) failedResources.push(message.params.response.url);
    else if (message.method === "Network.requestWillBeSent" && message.params.type === "Media" && /\.mp4(?:\?|$)/.test(message.params.request.url)) videoRequests.add(message.params.request.url);
  });
  const send = (method, params={}) => new Promise((resolve,reject) => {
    const id=++sequence; pending.set(id,{resolve,reject}); ws.send(JSON.stringify({id,method,params}));
  });
  const evaluate = async (expression) => {
    const result=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});
    if (result.exceptionDetails) throw Error(result.exceptionDetails.text);
    return result.result?.value;
  };
  const until = async (expression, max=10000) => {
    for (let elapsed=0;elapsed<max;elapsed+=100) { if(await evaluate(expression)) return true; await pause(100); }
    return false;
  };
  const reload = async () => {
    const origin=await evaluate("performance.timeOrigin");
    const position=await evaluate("({x:scrollX,y:scrollY})");
    await send("Page.reload",{ignoreCache:false});
    // Mounting precedes App's two-frame reload-position correction. Do not
    // start an interaction that the pending restoration would then undo.
    const restored=await until(`performance.timeOrigin!==${origin} && document.readyState==='complete' && !document.querySelector('.portfolio-intro') && document.querySelectorAll('[data-portfolio-section]').length===7 && Math.abs(scrollY-${position.y})<3 && Math.abs(scrollX-${position.x})<3`);
    if(!restored)throw Error("Reload did not finish or restore the document position");
    await evaluate("new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))");
  };
  const checks=[];
  const check=(name,pass,detail)=>checks.push({name,pass:!!pass,detail});
  const click=(selector)=>evaluate(`document.querySelector(${JSON.stringify(selector)})?.click()`);
  const point=async(selector)=>{
    return evaluate(`(() => {const el=document.querySelector(${JSON.stringify(selector)}); el?.scrollIntoView({block:"center",behavior:"instant"});const r=el?.getBoundingClientRect();return r?{x:r.left+r.width/2,y:r.top+r.height/2}:null;})()`);
  };
  const nativeClick=async(selector)=>{
    const p=await point(selector);if(!p)throw Error("Missing "+selector);
    await send("Input.dispatchMouseEvent",{type:"mousePressed",...p,button:"left",clickCount:1});
    await send("Input.dispatchMouseEvent",{type:"mouseReleased",...p,button:"left",clickCount:1});
  };
  const key=async(name,code,vk,modifiers=0)=>{
    const params={key:name,code,windowsVirtualKeyCode:vk,nativeVirtualKeyCode:vk,modifiers};
    await send("Input.dispatchKeyEvent",{type:"keyDown",...params});
    if(name==="Enter" || name===" ") await send("Input.dispatchKeyEvent",{type:"char",...params,text:name==="Enter"?"\r":" ",unmodifiedText:name==="Enter"?"\r":" "});
    await send("Input.dispatchKeyEvent",{type:"keyUp",...params});
  };
  const resize=async(width,height,touch=false)=>{
    await send("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:1,mobile:touch});
    await send("Emulation.setTouchEmulationEnabled",{enabled:touch,maxTouchPoints:1});
    if(!await until(`innerWidth===${width} && innerHeight===${height}`,2000))throw Error(`Viewport emulation failed: ${width}x${height}`);
  };
  const motion=async(value)=>send("Emulation.setEmulatedMedia",{features:[{name:"prefers-reduced-motion",value}]});
  const scrollToSection=async(id)=>{
    await evaluate(`document.getElementById(${JSON.stringify(id)}).scrollIntoView({block:"start",behavior:"instant"})`);
    await pause(140);
  };
  const nativeScrollKey=async(name,code,vk)=>{
    await key(name,code,vk);
    // Native Chromium keyboard scrolling is compositor-animated even with the
    // application's reduced motion enabled. Finish one key before the next.
    await pause(250);
    let last=await evaluate("scrollY"),stable=0;
    for(let elapsed=0;elapsed<2000&&stable<4;elapsed+=50){
      await pause(50);const next=await evaluate("scrollY");
      stable=Math.abs(next-last)<0.5?stable+1:0;last=next;
    }
  };
  await send("Page.enable");await send("Runtime.enable");await send("Log.enable");await send("Network.enable");
  // Run the unchanged interaction suite against either palette.
  if (["light","dark"].includes(process.env.QA_THEME)) {
    await send("Page.addScriptToEvaluateOnNewDocument",{source:`localStorage.setItem('jbta-portfolio-theme',${JSON.stringify(process.env.QA_THEME)})`});
  }
  await resize(1440,1000);await motion("no-preference");
  // Reset the session and use a full navigation, so the intro/direct-hash check is real.
  await send("Page.navigate",{url:baseUrl});
  await until("!!document.querySelector('.portfolio-intro') || !!document.querySelector('main')");
  await evaluate("sessionStorage.removeItem('jbta-portfolio-intro-seen')");
  videoRequests.clear();
  const introStart=Date.now();
  await send("Page.navigate",{url:baseUrl+"?qa=continuous#connect"});
  await until("!!document.querySelector('.portfolio-intro')");
  const introLocked=await evaluate("document.body.style.position === 'fixed'");
  check("intro document lock",introLocked);
  await until("!document.querySelector('.portfolio-intro') && !!document.querySelector('[data-portfolio-footer]')",15000);
  const introMs=Date.now()-introStart;
  await pause(300);
  check("normal intro timing",introMs>=3500&&introMs<=6500,introMs);
  check("first-session direct hash after intro",await evaluate("Math.abs(document.getElementById('connect').getBoundingClientRect().top)<3 && document.querySelector('.scene-nav__current-label')?.textContent==='Contact'"));
  check("initial project videos deferred",await evaluate("[...document.querySelectorAll('.work-case video')].every(v=>!v.getAttribute('src'))")&&videoRequests.size===0,videoRequests.size);
  await motion("reduce");
  // Motion's preference is initialized when components mount: test each real load mode.
  await reload();
  await pause(200);
  await evaluate("document.querySelector('.work-case video').scrollIntoView({block:'center',behavior:'instant'})");
  await until("!!document.querySelector('.work-case video').getAttribute('src')");
  await pause(180);
  check("approach loads only nearby videos",await evaluate("[...document.querySelectorAll('.work-case video')].filter(v=>v.getAttribute('src')).every(v=>v.getBoundingClientRect().top<innerHeight+201&&v.getBoundingClientRect().bottom>-201)&&!!document.querySelector('.work-case video').getAttribute('src')&&!document.querySelectorAll('.work-case video')[2].getAttribute('src')"),videoRequests.size);
  check("one main / one page h1 / seven ordered sections",await evaluate(`document.querySelectorAll('main').length===1 && document.querySelectorAll('h1').length===1 && JSON.stringify([...document.querySelectorAll('main > [data-portfolio-section]')].map(s=>s.id))===${JSON.stringify(JSON.stringify(sections))}`));
  check("page-level footer",await evaluate("!!document.querySelector('footer[data-portfolio-footer]') && !document.querySelector('footer[data-portfolio-footer]').closest('main')"));
  check("main native document scroller",await evaluate("document.scrollingElement===document.documentElement && document.scrollingElement.scrollHeight>innerHeight*7 && getComputedStyle(document.body).overflowY!=='hidden'"));
  await motion("reduce");
  await scrollToSection("arrival");
  await evaluate("window.__qaPushes=0;const originalPush=history.pushState;history.pushState=function(...args){window.__qaPushes++;return originalPush.apply(this,args)}");
  await evaluate("document.querySelector('.arrival-hero__actions button').focus({preventScroll:true})");
  const passiveBefore=await evaluate("({history:history.length,hash:location.hash,focus:document.activeElement.outerHTML})");
  await scrollToSection("craft");
  check("passive scroll updates active only",await evaluate(`document.querySelector('.scene-nav__current-label').textContent==='Technology' && window.__qaPushes===0 && history.length===${passiveBefore.history} && location.hash===${JSON.stringify(passiveBefore.hash)} && document.activeElement.outerHTML===${JSON.stringify(passiveBefore.focus)}`));
  const historyBefore=await evaluate("history.length"), beforeNavY=await evaluate("scrollY");
  await nativeClick('button[aria-label="Previous section"]');await pause(250);
  check("pointer previous / single explicit history entry",await evaluate(`location.hash==='#quest-board' && window.__qaPushes===1 && history.length<=${historyBefore+1} && Math.abs(document.getElementById('quest-board').getBoundingClientRect().top)<3 && !document.activeElement.matches('[data-section-heading]')`),await evaluate("({hash:location.hash,pushes:window.__qaPushes,history:history.length,y:scrollY,top:document.getElementById('quest-board').getBoundingClientRect().top})"));
  await evaluate("history.back()");await pause(300);
  check("Back exact position",await evaluate(`Math.abs(scrollY-${beforeNavY})<3`),{expected:beforeNavY,actual:await evaluate("scrollY")});
  await evaluate("history.forward()");await pause(300);
  check("Forward restores destination",await evaluate("Math.abs(document.getElementById('quest-board').getBoundingClientRect().top)<3"));
  await evaluate("document.querySelector('button[aria-label=\"Next section\"]').focus()");
  await key("Enter","Enter",13);await pause(250);
  check("keyboard next focuses destination",await evaluate("location.hash==='#craft' && document.activeElement.id==='craft-title'"));
  await click('button[aria-label="Open section navigation"]');await pause(100);
  check("navigator seven menu choices",await evaluate("document.querySelectorAll('#scene-selection-menu [role=menuitem]').length===7"));
  await click('#scene-selection-menu li:nth-child(4) button');await pause(250);
  check("menu goes to Services and focuses heading",await evaluate("location.hash==='#quest-board' && document.activeElement.id==='quest-board-title'"));
  await evaluate("window.scrollBy({top:180,behavior:'instant'})");
  await evaluate("new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))");
  const refreshY=await evaluate("scrollY");
  await reload();await pause(550);
  check("mid-page refresh exact position / session intro skip",await evaluate(`Math.abs(scrollY-${refreshY})<3 && !document.querySelector('.portfolio-intro')`),{expected:refreshY,actual:await evaluate("scrollY")});

  await scrollToSection("arrival");await evaluate("document.activeElement.blur()");
  const nativeHistory=await evaluate("history.length"), nativeHash=await evaluate("location.hash");
  await nativeScrollKey("ArrowDown","ArrowDown",40);
  check("native ArrowDown",await evaluate("scrollY>0 && scrollY<200"));
  await nativeScrollKey("ArrowUp","ArrowUp",38);
  check("native ArrowUp",await evaluate("scrollY<3"));
  await nativeScrollKey("PageDown","PageDown",34);
  check("native PageDown",await evaluate("scrollY>500"));
  await nativeScrollKey("PageUp","PageUp",33);
  check("native PageUp",await evaluate("scrollY<500"));
  await nativeScrollKey("End","End",35);
  check("native End / final active section",await evaluate("Math.abs(scrollY+innerHeight-document.scrollingElement.scrollHeight)<4 && document.querySelector('.scene-nav__current-label').textContent==='Closing'"));
  await nativeScrollKey("Home","Home",36);
  check("native Home / first boundary",await evaluate("scrollY<3 && document.querySelector('button[aria-label=\"Previous section\"]').disabled"));
  await nativeScrollKey(" ","Space",32);check("native Space",await evaluate("scrollY>300"),await evaluate("({y:scrollY,focus:document.activeElement.tagName,locked:document.body.style.position})"));
  await send("Input.dispatchMouseEvent",{type:"mouseWheel",x:700,y:500,deltaX:0,deltaY:240});await pause(200);
  check("native wheel / no passive history pollution",await evaluate(`scrollY>500 && history.length===${nativeHistory} && location.hash===${JSON.stringify(nativeHash)}`));

  const matrix=[];
  for(const [width,height] of sizes){
    await resize(width,height,width<600);
    for(let i=0;i<sections.length;i++){
      await send("Page.navigate",{url:baseUrl+"#"+sections[i]});
      await until(`Math.abs(document.getElementById(${JSON.stringify(sections[i])})?.getBoundingClientRect().top ?? 99999)<3`);
      await pause(140);
      const row=await evaluate(`(() => {
        const el=document.getElementById(${JSON.stringify(sections[i])}),h=el.querySelector('[data-section-heading]'),r=h.getBoundingClientRect();
        const nested=[el,...el.querySelectorAll('*')].filter(node=>{const s=getComputedStyle(node);return /^(auto|scroll)$/.test(s.overflowY)&&node.scrollHeight>node.clientHeight+2;}).map(node=>node.className);
        return {count:document.querySelectorAll('[data-portfolio-section]').length,unique:document.querySelectorAll('#'+el.id).length,active:document.querySelector('.scene-nav__current-label').textContent,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,headingSafe:r.left>=-1&&r.right<=document.documentElement.clientWidth+1,nested,sectionHeight:el.offsetHeight};
      })()`);
      matrix.push({size:width+"x"+height,id:sections[i],...row});
      check("viewport "+width+"x"+height+" / "+sections[i],row.count===7&&row.unique===1&&row.active===labels[i]&&row.overflow<=1&&row.headingSafe&&row.nested.length===0,row);
    }
    await point('.work-case__notes-action');
    const notesY=await evaluate('scrollY');
    await click('.work-case__notes-action');await pause(130);
    check('viewport '+width+'x'+height+' / notes fit',await evaluate("(() => {const r=document.querySelector('.project-notes__panel').getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight&&document.body.style.position==='fixed';})()"));
    if(width<600){
      await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:4,y:190}]});
      await send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:4,y:70}]});
      await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(80);
      check('viewport '+width+'x'+height+' / modal touch background lock',await evaluate(`document.body.style.top==='-${notesY}px' && scrollY===0`));
    }
    await click('.project-notes__close');await pause(140);
    check('viewport '+width+'x'+height+' / modal restores page',await evaluate(`!document.body.style.position&&Math.abs(scrollY-${notesY})<2`));
    await click('.neli-summon-button');await until("!!document.querySelector('.neli-panel')",2000);await pause(130);
    check('viewport '+width+'x'+height+' / NELI and navigator fit',await evaluate("['.neli-panel','.scene-nav'].every(selector=>{const r=document.querySelector(selector)?.getBoundingClientRect();return r&&r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight})&&!document.body.style.position"));
    const neliY=await evaluate('scrollY');await evaluate("window.scrollBy({top:80,behavior:'instant'})");
    check('viewport '+width+'x'+height+' / page scroll around NELI',await evaluate(`Math.abs(scrollY-${neliY})>50&&!!document.querySelector('.neli-panel')`));
    await send("Input.dispatchMouseEvent",{type:"mousePressed",x:2,y:200,button:"left",clickCount:1});
    await send("Input.dispatchMouseEvent",{type:"mouseReleased",x:2,y:200,button:"left",clickCount:1});
    await until("!document.querySelector('.neli-panel')",2000);
    check('viewport '+width+'x'+height+' / NELI outside close',await evaluate("!document.querySelector('.neli-panel')&&document.querySelector('.neli-summon-button').getAttribute('aria-expanded')==='false'"));
    await evaluate("new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))");
    const staleHashPosition=await evaluate("({y:scrollY,hash:location.hash})");
    await reload();await pause(300);
    check('viewport '+width+'x'+height+' / refresh under stale hash',await evaluate(`Math.abs(scrollY-${staleHashPosition.y})<3&&location.hash===${JSON.stringify(staleHashPosition.hash)}`),{before:staleHashPosition,after:await evaluate("scrollY")});
  }
  await resize(390,844,true);await scrollToSection("arrival");await evaluate("document.activeElement.blur()");
  await send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:210,y:560}]});
  await send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:210,y:430}]});await pause(40);
  await send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:210,y:260}]});
  await send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});await pause(300);
  check("native touch scroll",await evaluate("scrollY>50"));
  check("coarse-pointer native cursor fallback",await evaluate("!document.documentElement.classList.contains('portfolio-cursor-enabled')"));
  await resize(1440,1000,false);await scrollToSection("quest-board");
  const serviceCount=await evaluate("document.querySelectorAll('.services-architecture__trigger').length");
  check("six preserved services",serviceCount===6,serviceCount);
  for(let i=0;i<serviceCount;i++){
    const before=await evaluate(`document.querySelectorAll('.services-architecture__trigger')[${i}].getAttribute('aria-expanded')`);
    await evaluate(`document.querySelectorAll('.services-architecture__trigger')[${i}].click()`);await pause(20);
    check("service "+(i+1)+" expansion state",await evaluate(`document.querySelectorAll('.services-architecture__trigger')[${i}].getAttribute('aria-expanded')!==${JSON.stringify(before)}`));
  }
  await evaluate("document.querySelector('.services-architecture__trigger').focus()");
  const serviceBefore=await evaluate("document.querySelector('.services-architecture__trigger').getAttribute('aria-expanded')");
  await key("Enter","Enter",13);
  check("keyboard service interaction",await evaluate(`document.querySelector('.services-architecture__trigger').getAttribute('aria-expanded')!==${JSON.stringify(serviceBefore)}`));
  await scrollToSection("craft");await evaluate("document.querySelectorAll('.technology-architecture__node')[1].focus()");
  await key("Enter","Enter",13);
  check("technology inspector keyboard selection",await evaluate("document.querySelectorAll('.technology-architecture__node')[1].getAttribute('aria-pressed')==='true'"));
  check("technology groups and nodes preserved",await evaluate("document.querySelectorAll('.technology-architecture__layer').length===5 && document.querySelectorAll('.technology-architecture__node').length===22"));

  await motion("no-preference");
  await reload();
  for(let i=0;i<3;i++){
    await evaluate(`document.querySelectorAll('.work-case video')[${i}].scrollIntoView({block:'center',behavior:'instant'})`);
    await until(`document.querySelectorAll('.work-case video')[${i}].readyState>=2`,8000);await pause(250);
    await until(`!document.querySelectorAll('.work-case video')[${i}].paused`,4000);
    const state=await evaluate(`({ready:document.querySelectorAll('.work-case video')[${i}].readyState,playing:!document.querySelectorAll('.work-case video')[${i}].paused,error:document.querySelectorAll('.work-case video')[${i}].error?.code??null,playingCount:[...document.querySelectorAll('.work-case video')].filter(v=>!v.paused).length,loaded:[...document.querySelectorAll('.work-case video')].filter(v=>v.getAttribute('src')).length,hidden:document.hidden,reduced:matchMedia('(prefers-reduced-motion:reduce)').matches})`);
    check("project video "+(i+1)+" plays in viewport",state.ready>=2&&state.playing&&state.error===null&&state.playingCount<=1,state);
  }
  await motion("reduce");
  await reload();
  await pause(200);
  check("reduced-motion videos paused",await evaluate("[...document.querySelectorAll('.work-case video')].every(v=>v.paused)"));
  for(let i=0;i<3;i++){
    const selector=`.work-case:nth-child(${i+1}) .work-case__notes-action`;
    await evaluate(`document.querySelectorAll('.work-case__notes-action')[${i}].scrollIntoView({block:'center',behavior:'instant'})`);
    // Let passive navigation settle before measuring its label-dependent width.
    await until("document.querySelector('.scene-nav__current-label').textContent==='Selected Work'");
    const before=await evaluate("({y:scrollY,width:document.querySelector('main').getBoundingClientRect().width,navX:document.querySelector('.scene-nav').getBoundingClientRect().left})");
    await evaluate(`document.querySelectorAll('.work-case__notes-action')[${i}].click()`);await pause(150);
    check("notes "+(i+1)+" dialog and lock",await evaluate(`!!document.querySelector('[role=dialog][aria-modal=true]')&&document.getElementById('root').inert&&document.body.style.position==='fixed'&&Math.abs(document.querySelector('main').getBoundingClientRect().width-${before.width})<1&&Math.abs(document.querySelector('.scene-nav').getBoundingClientRect().left-${before.navX})<1`),{before,after:await evaluate("({fixed:document.body.style.position,inert:document.getElementById('root').inert,width:document.querySelector('main').getBoundingClientRect().width,navX:document.querySelector('.scene-nav').getBoundingClientRect().left})")});
    await evaluate("document.querySelector('.project-notes__scroll').scrollTop=220");
    check("notes own document scroll",await evaluate("document.querySelector('.project-notes__scroll').scrollTop>0"));
    await evaluate("(()=>{const items=document.querySelector('.project-notes__panel').querySelectorAll('button:not(:disabled),a[href],[tabindex]:not([tabindex=\"-1\"])');items[items.length-1].focus()})()");
    await key("Tab","Tab",9);
    check("notes focus trap",await evaluate("document.activeElement===document.querySelector('.project-notes__close')"));
    await key("Escape","Escape",27);await pause(180);
    check("notes "+(i+1)+" exact restoration",await evaluate(`!document.querySelector('.project-notes__panel')&&!document.getElementById('root').inert&&Math.abs(scrollY-${before.y})<2&&document.activeElement===document.querySelectorAll('.work-case__notes-action')[${i}]`));
    void selector;
  }
  await scrollToSection("connect");
  check("canonical mailto / profile / resume destinations",await evaluate("document.querySelector('.connection-endpoint__email-actions a').getAttribute('href')==='mailto:ablogjonelbryan@gmail.com' && document.querySelectorAll('.connection-endpoint__route-actions a').length===4 && !!document.querySelector('a[href=\"/Jonel_Ablog_Resume.pdf\"]')"));
  await nativeClick(".connection-endpoint__email-actions button");await pause(100);
  check("copy email feedback",await evaluate("document.querySelector('.connection-endpoint__feedback').textContent.trim()==='Email copied.'"));
  check("local resume and favicon",await evaluate("Promise.all(['/Jonel_Ablog_Resume.pdf','/jbta-logo.png'].map(async url=>(await fetch(url,{method:'HEAD'})).status)).then(status=>status.every(code=>code===200))"));
  await nativeClick(".neli-summon-button");await pause(150);
  check("NELI open / input focus",await evaluate("document.activeElement.id==='jbta-assistant-input'"));
  await send("Input.insertText",{text:"What services does Jonel offer?"});await key("Enter","Enter",13);
  await until("document.querySelectorAll('.neli-message-bubble--oracle').length>=2");
  // The typing indicator also has .neli-message--oracle. Require actual answer
  // text so it cannot accidentally satisfy either conversation assertion.
  check("NELI local response",await evaluate("document.querySelectorAll('.neli-message-bubble--oracle').length>=2 && [...document.querySelectorAll('.neli-message-bubble--oracle')].at(-1).textContent.includes('full-stack web development')"));
  await click(".neli-prompt-trigger");await pause(100);await click(".neli-prompt-option");
  await until("document.querySelectorAll('.neli-message-bubble--oracle').length>=3");
  check("NELI suggestions",await evaluate("document.querySelectorAll('.neli-message-bubble--oracle').length>=3 && [...document.querySelectorAll('.neli-message-bubble--oracle')].at(-1).textContent.includes('Jonel Bryan Ablog')"));
  // Suggestions have an exit transition: an exiting option still handles
  // Escape locally until it is removed. Test panel Escape from its input.
  await until("!document.querySelector('.neli-suggestion-panel') && document.activeElement.id==='jbta-assistant-input'");
  await key("Escape","Escape",27);await until("!document.querySelector('.neli-panel')");check("NELI Escape",await evaluate("document.querySelector('.neli-summon-button').getAttribute('aria-expanded')==='false'"));
  await scrollToSection("ending");await nativeClick(".closing-frame__action button");await until("location.hash==='#connect'&&Math.abs(document.getElementById('connect').getBoundingClientRect().top)<3");
  check("closing CTA to Contact",await evaluate("location.hash==='#connect'&&Math.abs(document.getElementById('connect').getBoundingClientRect().top)<3"));
  await nativeClick(".closing-footer__return");await pause(250);
  check("footer Back to top",await evaluate("location.hash==='#arrival'&&scrollY<3"));
  await send("Input.dispatchMouseEvent",{type:"mouseMoved",x:200,y:300});await pause(100);
  check("viewport cursor decorative and non-blocking",await evaluate("!!document.querySelector('.portfolio-cursor')&&getComputedStyle(document.querySelector('.portfolio-cursor')).pointerEvents==='none'"));

  if(process.argv.includes("--screenshots")){
    fs.mkdirSync(".migration-qa-artifacts",{recursive:true});
    for(const [width,height] of [[1440,1000],[390,844],[390,480]]){
      await resize(width,height,width<600);
      for(const id of sections){
        await scrollToSection(id);
        const screenshot=await send("Page.captureScreenshot",{format:"jpeg",quality:65,captureBeyondViewport:false});
        fs.writeFileSync(`.migration-qa-artifacts/${width}x${height}-${id}.jpg`,Buffer.from(screenshot.data,"base64"));
      }
    }
  }
  await motion("reduce");await evaluate("sessionStorage.removeItem('jbta-portfolio-intro-seen')");
  const reducedStart=Date.now();await send("Page.reload",{ignoreCache:false});
  await until("!document.querySelector('.portfolio-intro')&&sessionStorage.getItem('jbta-portfolio-intro-seen')==='true'&&document.querySelectorAll('[data-portfolio-section]').length===7");
  const reducedIntroMs=Date.now()-reducedStart;
  check("fast reduced-motion intro",reducedIntroMs<1800,reducedIntroMs);
  await motion("no-preference");await evaluate("sessionStorage.removeItem('jbta-portfolio-intro-seen')");
  const slowFonts=await send("Page.addScriptToEvaluateOnNewDocument",{source:"Object.defineProperty(document.fonts,'ready',{value:new Promise(()=>{})})"});
  await send("Page.reload",{ignoreCache:false});
  await until("!!document.querySelector('.portfolio-intro')");
  await pause(3900);
  check("intro still gates incomplete readiness",await evaluate("!!document.querySelector('.portfolio-intro--building')&&!document.querySelector('.portfolio-intro__skip')"));
  await until("!!document.querySelector('.portfolio-intro__skip')",3000);
  await nativeClick(".portfolio-intro__skip");
  await until("!document.querySelector('.portfolio-intro')&&document.querySelectorAll('[data-portfolio-section]').length===7",4000);
  check("delayed intro Skip safely reveals document",await evaluate("!document.body.style.position&&!document.querySelector('.portfolio-intro')&&sessionStorage.getItem('jbta-portfolio-intro-seen')==='true'"));
  await send("Page.removeScriptToEvaluateOnNewDocument",{identifier:slowFonts.identifier});
  check("no runtime errors or failed local resources",runtimeErrors.length===0&&failedResources.length===0,{runtimeErrors,failedResources});
  const failed=checks.filter(item=>!item.pass);
  console.log(JSON.stringify({checks:checks.length,failures:failed,introMs,reducedIntroMs,viewportCases:matrix.length,videoRequests:videoRequests.size,runtimeErrors,failedResources},null,2));
  ws.close();if(failed.length)process.exitCode=1;
}
main().catch(error=>{console.error(error);process.exit(1);});
