// Shared playback policy for actual recordings in summaries, records and details.
export function setupRecordedVideo(video,button,container=video?.parentElement){
 if(!video||!button)return()=>{};
 const motion=matchMedia('(prefers-reduced-motion:reduce)');let visible=false,userPaused=false,explicitPlay=false,disposed=false;
 video.muted=true;video.autoplay=false;
 function label(){const playing=!video.paused;container.dataset.running=String(playing);button.textContent=playing?'一時停止':'再生';button.setAttribute('aria-label',playing?'動作デモを一時停止':'動作デモを再生');button.setAttribute('aria-pressed',String(playing));}
 function sync(){if(disposed)return;const modal=document.querySelector('.book-summary[open]');const allowed=visible&&!document.hidden&&(!modal||modal.contains(video));if(allowed&&!userPaused&&(!motion.matches||explicitPlay))video.play().catch(label);else video.pause();label();}
 function toggle(){if(!video.paused){userPaused=true;explicitPlay=false}else{userPaused=false;explicitPlay=true}sync();}
 function changed(){explicitPlay=false;sync();}
 function error(){button.textContent='読み込みエラー';button.disabled=true;container.dataset.running='false';}
 const observer=new IntersectionObserver(entries=>{visible=entries.at(-1).isIntersecting;sync()},{threshold:.08});observer.observe(video);
 for(const event of ['play','pause'])video.addEventListener(event,label);
 video.addEventListener('error',error);video.querySelector('source')?.addEventListener('error',error);
 button.addEventListener('click',toggle);motion.addEventListener('change',changed);document.addEventListener('visibilitychange',sync);document.addEventListener('core-demo-modal',sync);video._resume=sync;label();
 return()=>{disposed=true;observer.disconnect();video.pause();button.removeEventListener('click',toggle);motion.removeEventListener('change',changed);document.removeEventListener('visibilitychange',sync);document.removeEventListener('core-demo-modal',sync);for(const event of ['play','pause'])video.removeEventListener(event,label);video.removeEventListener('error',error);video.querySelector('source')?.removeEventListener('error',error);delete video._resume;};
}
