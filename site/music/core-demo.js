import{interactionDemos as recordings}from'./interaction-demos.js';
import {setupRecordedVideo} from './recorded-video.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const coreDemos=recordings;
export function renderCoreDemo(kind){
 const clip=recordings[kind];if(!clip)return '';
 if(clip.type==='unavailable')return `<figure class="core-demo recording-unavailable" data-core-kind="${esc(kind)}"><figcaption><strong>実動作動画を準備中</strong><span>${esc(clip.note)}</span></figcaption></figure>`;
 return `<figure class="core-demo" data-core-kind="${esc(kind)}" data-running="false"><div class="core-demo-bar"><span>動作デモ <small>約${Math.round(clip.shortDuration)}秒 / 無音</small></span><button type="button" class="core-demo-toggle" aria-label="動作デモを再生" aria-pressed="false">再生</button></div><div class="recording-screen" data-orientation="${clip.orientation}"><video class="core-demo-video" muted loop playsinline preload="none" poster="${clip.poster}" aria-label="${esc(clip.title)}の操作を再現した動作デモ"><source src="${clip.shortSrc}" type="video/mp4"></video></div><figcaption><strong>操作の再現アニメーション</strong><span>${esc(clip.summary)}</span><a href="${clip.shortSrc}">動画を大きく開く ↗</a></figcaption></figure>`;
}
export function setupCoreDemo(figure){return setupRecordedVideo(figure?.querySelector('video'),figure?.querySelector('button'),figure);}
