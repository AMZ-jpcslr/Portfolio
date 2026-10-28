// The visual stays inside its own button. Navigation waits for one short peel cycle.
const flights=new Map(),replaying=new WeakSet();let pending=null;
export function decoratePaper(root=document){
 for(const el of root.querySelectorAll('a,button')){
  if(el.matches('.piano-key,.wordmark,.skip-link,.notebook-tab,.search-book'))continue;el.classList.add('paper-action');
  if(el.tagName==='A'&&/^https:\/\/github\.com\//.test(el.href)&&!el.querySelector('.github-mark')){const img=document.createElement('img');img.className='github-mark';img.src='/assets/github-mark.svg';img.width=18;img.height=18;img.alt='';img.setAttribute('aria-hidden','true');el.prepend(img)}
 }
}
function removeFlight(el){const item=flights.get(el);if(!item)return;flights.delete(el);item.animation.cancel();item.clone.remove();el.classList.remove('paper-peeled');el.removeAttribute('aria-busy');if(item.originalLabel===null)el.removeAttribute('aria-label');item.resolve()}
function cancelPending(){if(!pending)return;const old=pending;pending=null;removeFlight(old.el)}
function peel(el){
 removeFlight(el);while(flights.size>=2)removeFlight(flights.keys().next().value);
 const rect=el.getBoundingClientRect(),style=getComputedStyle(el),clone=document.createElement('span');clone.innerHTML=el.innerHTML;clone.setAttribute('aria-hidden','true');clone.inert=true;clone.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));clone.className='paper-action note-flight';
 Object.assign(clone.style,{position:'absolute',left:'0',top:'0',width:style.width==='auto'?el.offsetWidth+'px':style.width,height:style.height==='auto'?el.offsetHeight+'px':style.height,margin:'0',font:style.font,lineHeight:style.lineHeight,padding:style.padding,display:style.display,alignItems:style.alignItems,justifyContent:style.justifyContent,gap:style.gap,gridTemplateColumns:style.gridTemplateColumns,gridTemplateRows:style.gridTemplateRows,flexDirection:style.flexDirection,borderRadius:style.borderRadius,outline:'none'});clone.style.setProperty('background',style.background,'important');clone.style.setProperty('color',style.color,'important');
 const originals=[...el.querySelectorAll('*')];[...clone.querySelectorAll('*')].forEach((child,i)=>{const c=getComputedStyle(originals[i]);Object.assign(child.style,{font:c.font,display:c.display,margin:c.margin,color:c.color,position:c.position,top:c.top,right:c.right,bottom:c.bottom,left:c.left})});
 const originalLabel=el.getAttribute('aria-label');if(originalLabel===null)el.setAttribute('aria-label',el.textContent.trim());clone.style.whiteSpace='nowrap';el.append(clone);el.classList.add('paper-peeled');let resolve;const done=new Promise(r=>resolve=r);
 const animation=clone.animate([{transform:'perspective(600px) translateY(0) rotateX(0) rotateZ(0)',opacity:1},{transform:'perspective(600px) translateY(-19px) rotateX(-33deg) rotateZ(-4deg)',opacity:1,offset:.23},{transform:'perspective(600px) translateY(-36px) rotateX(-18deg) rotateZ(-5deg) scale(.98)',opacity:0,offset:.43},{transform:'perspective(600px) translateY(-19px) rotateX(-12deg) rotateZ(-3deg)',opacity:0,offset:.57},{transform:'perspective(600px) translateY(-7px) rotateX(5deg) rotateZ(1deg)',opacity:1,offset:.84},{transform:'none',opacity:1}],{duration:680,easing:'linear'});
 flights.set(el,{animation,clone,resolve,originalLabel});animation.onfinish=()=>removeFlight(el);return done;
}
export function initPaperUI(){
 const header=document.querySelector('.site-header'),size=()=>document.documentElement.style.setProperty('--menu-height',`${Math.ceil(header.getBoundingClientRect().height)}px`);new ResizeObserver(size).observe(header);size();decoratePaper();
 const toggle=header.querySelector('.menu-toggle');const closeMenu=()=>{header.dataset.menuOpen='false';toggle?.setAttribute('aria-expanded','false');size()};
 toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));header.dataset.menuOpen=String(open);size()});
 header.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu()});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&header.dataset.menuOpen==='true'){closeMenu();toggle.focus()}});window.addEventListener('popstate',closeMenu);
 matchMedia('(max-width:820px)').addEventListener('change',closeMenu);
 new MutationObserver(()=>decoratePaper(document.querySelector('main'))).observe(document.querySelector('main'),{childList:true,subtree:true});
 document.addEventListener('click',event=>{
  const el=event.target.closest('a,button');if(!el||replaying.has(el)||!el.matches('.paper-action,.notebook-tab'))return;
  if(matchMedia('(prefers-reduced-motion:reduce)').matches||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button>0)return;
  if(el.matches('.notebook-tab'))return;
  const navigates=el.tagName==='A'||el.matches('[data-preview],[data-summary-close]');
  if(navigates){event.preventDefault();event.stopImmediatePropagation();if(pending?.el===el)return;cancelPending();document.dispatchEvent(new CustomEvent('portfolio-paper-intent',{detail:{element:el}}));const state={el};pending=state;el.setAttribute('aria-busy','true');peel(el).then(()=>{if(pending!==state||!el.isConnected)return;pending=null;replaying.add(el);try{el.click()}finally{replaying.delete(el)}});}else{peel(el)}
 },{capture:true});
 matchMedia('(prefers-reduced-motion:reduce)').addEventListener('change',event=>{if(event.matches){const action=pending;pending=null;for(const el of [...flights.keys()])removeFlight(el);if(action?.el.isConnected){replaying.add(action.el);try{action.el.click()}finally{replaying.delete(action.el)}}}});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&pending){event.preventDefault();cancelPending()}});
 window.addEventListener('popstate',()=>{cancelPending();for(const el of [...flights.keys()])removeFlight(el)},{capture:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelPending();for(const el of [...flights.keys()])removeFlight(el)}});
}
