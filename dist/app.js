import { renderTimeline } from './timeline.js';
import { createPageMotion } from './page-motion.js';
import { projects } from './projects.js';
import { renderDemoScene } from './demos.js';
import { filmDuration } from './films.js';
import { renderCaseOverview, renderCaseStudy } from './case-study.js';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const count = String(projects.length).padStart(2, '0');
const preference = matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = preference.matches;
const dialog = document.querySelector('#project-dialog');
const motionButtons = [...document.querySelectorAll('[data-motion-toggle]')];
const players = new Set();
let detailPlayer = null;
let activeProject = null;
let returnFocus = null;
let pageHash = location.hash.startsWith('#project=') ? '#work' : location.hash || '#top';

class ScenePlayer {
  constructor(host, project, {detail = false, button = null} = {}) {
    Object.assign(this, {host, project, detail, button});
    this.userPlaying = true;
    this.scrubbing = false;
    this.visible = detail;
    this.viewport = null;
    host.classList.add('scene-host');
    host.dataset.sceneState = 'pending';
    if (button) button.addEventListener('click', () => this.toggle());
    players.add(this);
    if (detail) this.mount();
    else {
      // Reserve the canvas immediately; build actors only shortly before they enter view.
      this.preload = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) this.mount();
      }, {rootMargin:'180px 0px'});
      this.preload.observe(host);
    }
    // The dialog's scroll container also clips visibility: stop its film while reading below it.
    this.visibility = new IntersectionObserver(entries => {
      const entry = entries[0];
      this.visible = entry.isIntersecting && entry.intersectionRatio >= .08;
      if (this.visible) this.mount();
      this.sync();
    }, {threshold:[0, .08]});
    this.visibility.observe(host);
    this.sync();
  }
  mount() {
    if (this.viewport) return;
    this.preload?.disconnect();
    this.host.innerHTML = renderDemoScene(this.project);
    this.viewport = this.host.querySelector('.scene-viewport');
    this.progress = this.viewport.querySelector('.sequence-progress > i');
    this.range = this.detail ? document.querySelector('#film-seek') : null;
    this.time = this.detail ? document.querySelector('#film-time') : null;
    this.resize = new ResizeObserver(entries => {
      for (const entry of entries) this.setScale(entry.contentRect.width);
    });
    this.resize.observe(this.viewport);
    this.setScale(this.viewport.clientWidth);
    this.host.dataset.sceneState = 'ready';
    this.sync();
    if (motionPaused && !preference.matches) this.setPosition(filmDuration / 2);
  }
  setScale(width) {
    if (width > 0 && width !== this.scaledWidth) {
      this.scaledWidth = width;
      this.viewport.style.setProperty('--scene-scale', width / 620);
    }
  }
  sync() {
    const run = this.userPlaying && !this.scrubbing && this.visible && !document.hidden && !motionPaused && (this.detail || !dialog.open);
    this.viewport?.classList.toggle('scene-paused', !run);
    if (this.viewport) this.viewport.dataset.playback = run ? 'playing' : 'paused';
    if (this.button) {
      this.button.textContent = motionPaused ? '動きを停止中' : this.userPlaying ? 'Ⅱ 一時停止' : '▶ 再生';
      this.button.setAttribute('aria-label', motionPaused ? `${this.project.title}：全体設定でアニメーション停止中` : `${this.project.title}のアニメーションを${this.userPlaying ? '一時停止' : '再生'}`);
      this.button.setAttribute('aria-pressed', String(this.userPlaying && !motionPaused));
      this.button.disabled = motionPaused;
    }
    if (this.detail) {
      updateDetailControls();
      clearInterval(this.clockTimer);
      this.clock = null;
      this.updateTime();
      // The film stays on its CSS clock. Only its numeric controls need 10 Hz updates.
      if (run) this.clockTimer = setInterval(() => this.updateTime(), 100);
    }
  }
  toggle() {
    if (motionPaused) return;
    this.userPlaying = !this.userPlaying;
    this.mount();
    this.sync();
  }
  updateTime() {
    if (!this.detail) return;
    const clock = this.clock ||= this.progress.getAnimations()[0];
    const seconds = ((Number(clock?.currentTime) || 0) / 1000) % filmDuration;
    const {range, time} = this;
    if (range && !this.scrubbing) range.value = String(seconds);
    const label = `0:${String(Math.floor(seconds)).padStart(2,'0')} / 0:${filmDuration}`;
    if (time && time.textContent !== label) time.textContent = label;
  }
  seek(seconds) {
    if (motionPaused) return;
    this.setPosition(seconds);
  }
  setPosition(seconds) {
    const position = Math.min(filmDuration - .001, Math.max(0, Number(seconds))) * 1000;
    for (const animation of this.viewport.getAnimations({subtree:true})) animation.currentTime = position;
    this.updateTime();
  }
  beginScrub() {
    if (motionPaused || this.scrubbing) return;
    this.scrubbing = true;
    this.sync();
  }
  endScrub() {
    if (!this.scrubbing) return;
    this.scrubbing = false;
    this.sync();
  }
  destroy() {
    clearInterval(this.clockTimer);
    this.resize?.disconnect(); this.visibility?.disconnect(); this.preload?.disconnect();
    players.delete(this);
  }
}

const grid = document.querySelector('#project-grid');
grid.innerHTML = projects.map(p => `<article class="project-card ${p.color}">
  <div class="project-visual"><div class="visual-meta"><span>${escape(p.label)}</span><span>${p.number} / ${count}</span></div>
    <a class="scene-link" href="#project=${p.id}" aria-label="${escape(p.title)}の詳細とデモを見る"><div class="card-scene" data-scene="${p.id}" aria-hidden="true"></div></a>
    <div class="card-motion-bar"><span>PRODUCT FILM · 24 SEC</span><button type="button" data-pause="${p.id}" aria-pressed="true">Ⅱ 一時停止</button></div>
  </div>
  <a class="project-open" href="#project=${p.id}"><div class="project-info"><div class="project-category">${p.category}</div><h3>${escape(p.title)}<span aria-hidden="true">↗</span></h3><p>${escape(p.summary)}</p><div class="tags">${p.tags.map(t=>`<span>${escape(t)}</span>`).join('')}</div><div class="audience"><span>${p.kind === 'moral' ? 'RESEARCH STATUS / 研究の現在地' : 'PEOPLE & IMPACT / 利用実績'}</span><span>${escape(p.audience)}</span></div><p class="audience-feedback">${escape(p.impact)}</p><div class="card-case-focus"><span>設計の焦点</span><p>${escape(p.caseStudy.focus)}</p><b>課題と開発プロセスを読む ↗</b></div></div></a>
</article>`).join('');
for (const p of projects) new ScenePlayer(document.querySelector(`[data-scene="${p.id}"]`), p, {button:document.querySelector(`[data-pause="${p.id}"]`)});
new ScenePlayer(document.querySelector('#hero-demo'), projects[0]);
document.querySelector('#project-timeline').innerHTML = renderTimeline(projects);
const pageMotion = createPageMotion({paused: motionPaused, dialog});

function syncPlayers() { for (const player of players) player.sync(); }
function updateDetailControls() {
  if (!detailPlayer) return;
  const button = document.querySelector('#demo-play');
  if (!button) return;
  button.textContent = motionPaused ? '自動再生は停止中' : detailPlayer.userPlaying ? 'Ⅱ 一時停止' : '▶ 再生';
  button.setAttribute('aria-pressed', String(detailPlayer.userPlaying && !motionPaused));
  button.disabled = motionPaused;
  document.querySelector('#film-playback-note').textContent = `24秒のストーリー · ${motionPaused || !detailPlayer.userPlaying ? '停止中' : '自動再生'}`;
  document.querySelector('#film-seek').disabled = motionPaused;
  document.querySelector('#film-restart').disabled = motionPaused;
}
function openProject(project) {
  detailPlayer?.destroy(); detailPlayer = null;
  activeProject = project;
  if (!dialog.open) returnFocus = document.activeElement;
  const p = project;
  document.querySelector('#detail-content').innerHTML = `<div class="detail-heading"><div class="eyebrow">${p.number} / ${p.category}</div><h2 id="detail-title">${escape(p.title)}</h2><p>${escape(p.tagline)}</p><div class="tags">${p.tags.map(t=>`<span>${escape(t)}</span>`).join('')}</div></div>
    <div class="detail-demo ${p.color}"><div class="demo-toolbar"><span>PRODUCT FILM</span><span id="film-playback-note">24秒のストーリー · 自動再生</span></div><div id="demo-screen" class="demo-screen" role="img" aria-label="${escape(p.title)}の機能再現アニメーション"></div><p class="demo-status">${p.steps.map(escape).join(" → ")}。ひと続きの動作として自動で繰り返します。</p><div class="demo-controls"><button id="demo-play" class="button primary" type="button">Ⅱ 一時停止</button><button id="film-restart" class="film-restart" type="button" aria-label="映像を最初から見る">↺ 最初から</button><output id="film-time" aria-label="再生時間" aria-live="off">0:00 / 0:24</output></div><label class="film-scrubber">再生位置<input id="film-seek" type="range" min="0" max="24" step="0.5" value="0" aria-label="映像の再生位置（秒）"></label><p class="demo-note">${escape(p.demoNote)}</p></div>
    ${renderCaseOverview(p)}
    ${renderCaseStudy(p)}<div class="detail-bottom"><span>コードと詳しい仕様はこちら</span>${p.liveUrl ? `<a class="button live-link" href="${escape(p.liveUrl)}" target="_blank" rel="noopener noreferrer">アプリを開く ↗</a>` : ''}<a class="button primary" href="https://github.com/AMZ-jpcslr/${p.id}" target="_blank" rel="noopener noreferrer">GitHubを見る ↗</a></div>`;
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('dialog-open'); dialog.scrollTop = 0;
  detailPlayer = new ScenePlayer(document.querySelector('#demo-screen'), p, {detail:true});
  updateDetailControls();
  document.querySelector('#demo-play').addEventListener('click',()=>detailPlayer.toggle());
  document.querySelector('#film-restart').addEventListener('click',()=>detailPlayer.seek(0));
  const seek = document.querySelector('#film-seek');
  seek.addEventListener('input', event => detailPlayer.seek(event.target.value));
  seek.addEventListener('pointerdown', () => detailPlayer.beginScrub());
  seek.addEventListener('keydown', event => {
    if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown'].includes(event.key)) detailPlayer.beginScrub();
  });
  seek.addEventListener('keyup', () => detailPlayer.endScrub());
  seek.addEventListener('blur', () => detailPlayer.endScrub());
  document.querySelector('#close-dialog').focus(); syncPlayers();
}
function syncHash() {
  const id = location.hash.startsWith('#project=') ? location.hash.slice(9) : null;
  const project = projects.find(p=>p.id===id);
  if(project) openProject(project);
  else {
    pageHash = location.hash || '#top';
    if(dialog.open) dialog.close();
  }
}
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{
  if(event.target!==dialog)return;
  const r=dialog.getBoundingClientRect();
  if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom)dialog.close();
});
dialog.addEventListener('close',()=>{
  detailPlayer?.destroy(); detailPlayer=null;
  document.body.classList.remove('dialog-open');
  if(location.hash.startsWith('#project='))history.replaceState(null,'',pageHash);
  syncPlayers();
  if (returnFocus instanceof HTMLElement && returnFocus !== document.body && !dialog.contains(returnFocus)) {
    returnFocus.focus({preventScroll:true});
  } else {
    const fallback = document.querySelector(`.scene-link[href="#project=${activeProject.id}"]`);
    fallback?.focus({preventScroll:true});
    fallback?.scrollIntoView({block:'center',behavior:'instant'});
  }
});
function setMotion() {
  syncPlayers();
  pageMotion.setPaused(motionPaused);
  document.documentElement.classList.toggle('motion-paused', motionPaused);
  for (const button of motionButtons) {
    button.disabled = preference.matches;
    button.setAttribute('aria-pressed', String(motionPaused));
    const compact = button.id === 'dialog-motion-toggle';
    button.textContent = preference.matches ? (compact ? '端末設定で停止中' : '端末設定でアニメーション停止中') : compact ? (motionPaused ? '全体の動きを再開' : '全体の動きを停止') : (motionPaused ? 'アニメーションを再開' : 'アニメーションを停止');
  }
}
for (const button of motionButtons) button.addEventListener('click',()=>{motionPaused=!motionPaused;setMotion();});
window.addEventListener('pointerup', () => detailPlayer?.endScrub());
window.addEventListener('pointercancel', () => detailPlayer?.endScrub());
window.addEventListener('blur', () => detailPlayer?.endScrub());
preference.addEventListener('change',event=>{motionPaused=event.matches;setMotion();});
document.addEventListener('visibilitychange',syncPlayers);
window.addEventListener('hashchange',syncHash);
setMotion(); syncHash();
