// Group masks suggest writing, not Japanese stroke order. Text remains semantic.
const motion=globalThis.matchMedia?.('(prefers-reduced-motion:reduce)')??{matches:true,addEventListener(){}},active=new Map(),placed=new Set();let observer,tailObserver;
function show(el){delete el.dataset.drawPending;el.dataset.drawn='true';if(el.dataset.eventId)placed.add(el.dataset.eventId);const a=active.get(el);if(a){a.finish();active.delete(el)}observer?.unobserve(el)}
function finishAll(){observer?.disconnect();tailObserver?.disconnect();for(const animation of active.values())animation.finish();active.clear();globalThis.document?.querySelectorAll('[data-draw-pending]').forEach(show)}
export function revealDrawTarget(target){if(!target)return;const scope=target.closest('section')||target;for(const el of scope.querySelectorAll('[data-draw-pending]')){const r=el.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)show(el)}for(const [el]of active)if(scope.contains(el)||el.contains(target))show(el);for(let el=target;el;el=el.parentElement)if(el.dataset.drawPending)show(el)}
motion.addEventListener('change',()=>{if(motion.matches)finishAll()});
globalThis.document?.addEventListener('focusin',event=>revealDrawTarget(event.target));
globalThis.window?.addEventListener('resize',finishAll,{passive:true});
function observe(el){if(el.dataset.drawn)return;if(el.dataset.eventId&&placed.has(el.dataset.eventId)){show(el);return}const rect=el.getBoundingClientRect();if(rect.height>innerHeight*2){show(el);return}if(rect.top>=innerHeight*.8)el.dataset.drawPending='true';observer.observe(el)}
export function observeDrawParts(root){if(observer&&!motion.matches)root.querySelectorAll('.diary-list>li').forEach(observe)}
export function setupDrawReveals(root){
 finishAll();if(motion.matches)return;
 const groups=root.querySelectorAll('.home-intro>div,.section-heading>div,.closing-paper>h2,.closing-paper>p,.key-copy,.activity-card>div,.activity-aside,.principle-cards>article,.detail-heading>h1,.detail-heading>.detail-summary,.detail-facts>div,.detail-block>h2,.detail-block>p,.decision-panel,.detail-process>li,.diary-heading,.diary-list>li');
 const bottom=Math.min(160,Math.round(innerHeight*.2));
 observer=new IntersectionObserver(entries=>{let stagger=0,noteStagger=0;for(const entry of entries){if(!entry.isIntersecting)continue;const el=entry.target,needed=Math.min(entry.boundingClientRect.height*.15,innerHeight*.12,120);if(entry.intersectionRect.height<needed)continue;observer.unobserve(el);if(el.dataset.drawn)continue;el.dataset.drawn='true';delete el.dataset.drawPending;
  const note=el.classList.contains('diary-entry');if(note)placed.add(el.dataset.eventId);
  const angle=note?getComputedStyle(el).getPropertyValue('--note-angle').trim()||'0deg':'0deg';
  const frames=note?[{transform:`translateY(-24px) rotate(${angle}) scale(1.025)`,opacity:0},{transform:`translateY(1px) rotate(${angle}) scale(1.008)`,opacity:1,offset:.72},{transform:`translateY(0) rotate(${angle}) scale(1)`,opacity:1}]:[{clipPath:'inset(0 100% 0 0)',opacity:.35},{clipPath:'inset(0 0% 0 0)',opacity:1}];
  const animation=el.animate(frames,{duration:note?480:560,delay:note?Math.min(noteStagger++*90,360):Math.min(stagger++*45,135),easing:'cubic-bezier(.2,.6,.3,1)',fill:'backwards'});active.set(el,animation);animation.onfinish=()=>active.delete(el);
 }},{threshold:[0,.05,.1,.15,.2,.35],rootMargin:'0px 0px -'+bottom+'px 0px'});groups.forEach(observe);
 const footer=document.querySelector('.site-footer');if(footer){tailObserver=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){document.querySelectorAll('[data-draw-pending]').forEach(show);tailObserver.disconnect()}},{threshold:.01});tailObserver.observe(footer)}
}
