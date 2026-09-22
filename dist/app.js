import { projects } from './projects.js';
import { renderDemoScene } from './demos.js';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const count = String(projects.length).padStart(2, '0');
const preference = matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = preference.matches;
const dialog = document.querySelector('#project-dialog');
const motionButton = document.querySelector('#motion-toggle');
const players = new Set();
let detailPlayer = null;
let activeProject = null;
let returnFocus = null;

class ScenePlayer {
  constructor(host, project, {detail = false, button = null} = {}) {
    Object.assign(this, {host, project, detail, button});
    this.userPlaying = true;
    this.visible = detail;
    host.innerHTML = renderDemoScene(project);
    this.viewport = host.querySelector('.scene-viewport');
    this.resize = new ResizeObserver(entries => {
      for (const entry of entries) if (entry.contentRect.width > 0) this.viewport.style.setProperty('--scene-scale', entry.contentRect.width / 620);
    });
    this.resize.observe(this.viewport);
    this.viewport.style.setProperty('--scene-scale', this.viewport.clientWidth / 620);
    if (!detail) {
      this.visibility = new IntersectionObserver(entries => {
        this.visible = entries[0].isIntersecting;
        this.sync();
      }, {threshold: 0.08});
      this.visibility.observe(host);
    }
    if (button) button.addEventListener('click', () => this.toggle());
    players.add(this);
    this.sync();
  }
  sync() {
    const run = this.userPlaying && this.visible && !document.hidden && !motionPaused && (this.detail || !dialog.open);
    this.viewport.classList.toggle('scene-paused', !run);
    this.viewport.dataset.playback = run ? 'playing' : 'paused';
    if (this.button) {
      this.button.textContent = motionPaused ? '動きを停止中' : this.userPlaying ? 'Ⅱ 一時停止' : '▶ 再生';
      this.button.setAttribute('aria-label', `${this.project.title}のアニメーションを${this.userPlaying ? '一時停止' : '再生'}`);
      this.button.setAttribute('aria-pressed', String(this.userPlaying && !motionPaused));
      this.button.disabled = motionPaused;
    }
    if (this.detail) updateDetailControls();
  }
  toggle() {
    if (motionPaused) return;
    this.userPlaying = !this.userPlaying;
    this.sync();
  }
  destroy() {
    this.resize.disconnect(); this.visibility?.disconnect();
    players.delete(this);
  }
}

const grid = document.querySelector('#project-grid');
grid.innerHTML = projects.map(p => `<article class="project-card ${p.color}">
  <div class="project-visual"><div class="visual-meta"><span>${escape(p.label)}</span><span>${p.number} / ${count}</span></div>
    <a class="scene-link" href="#project=${p.id}" aria-label="${escape(p.title)}の詳細とデモを見る"><div class="card-scene" data-scene="${p.id}" aria-hidden="true"></div></a>
    <div class="card-motion-bar"><span>PRODUCT IN MOTION · 機能再現</span><button type="button" data-pause="${p.id}" aria-pressed="true">Ⅱ 一時停止</button></div>
  </div>
  <a class="project-open" href="#project=${p.id}"><div class="project-info"><div class="project-category">${p.category}</div><h3>${escape(p.title)}<span aria-hidden="true">↗</span></h3><p>${escape(p.summary)}</p><div class="tags">${p.tags.map(t=>`<span>${escape(t)}</span>`).join('')}</div><div class="audience"><span>${p.kind === 'moral' ? 'RESEARCH STATUS / 研究の現在地' : 'PEOPLE & IMPACT / 利用実績'}</span><span>${escape(p.audience)}</span></div><p class="audience-feedback">${escape(p.impact)}</p></div></a>
</article>`).join('');
for (const p of projects) new ScenePlayer(document.querySelector(`[data-scene="${p.id}"]`), p, {button:document.querySelector(`[data-pause="${p.id}"]`)});
new ScenePlayer(document.querySelector('#hero-demo'), projects[0]);

function syncPlayers() { for (const player of players) player.sync(); }
function updateDetailControls() {
  if (!detailPlayer) return;
  const button = document.querySelector('#demo-play');
  if (!button) return;
  button.textContent = motionPaused ? '自動再生は停止中' : detailPlayer.userPlaying ? 'Ⅱ 一時停止' : '▶ 再生';
  button.setAttribute('aria-pressed', String(detailPlayer.userPlaying && !motionPaused));
  button.disabled = motionPaused;
}
function openProject(project) {
  detailPlayer?.destroy(); detailPlayer = null;
  activeProject = project;
  if (!dialog.open) returnFocus = document.activeElement;
  const p = project;
  document.querySelector('#detail-content').innerHTML = `<div class="detail-heading"><div class="eyebrow">${p.number} / ${p.category}</div><h2 id="detail-title">${escape(p.title)}</h2><p>${escape(p.tagline)}</p><div class="tags">${p.tags.map(t=>`<span>${escape(t)}</span>`).join('')}</div></div>
    <div class="detail-demo ${p.color}"><div class="demo-toolbar"><span>PRODUCT WALKTHROUGH</span><span>機能の流れを再現 · 自動再生</span></div><div id="demo-screen" class="demo-screen" role="img" aria-label="${escape(p.title)}の機能再現アニメーション"></div><p class="demo-status">${p.steps.map(escape).join(" → ")}。ひと続きの動作として自動で繰り返します。</p><div class="demo-controls"><button id="demo-play" class="button primary" type="button">Ⅱ 一時停止</button><span>約19秒 / ループ再生</span></div><p class="demo-note">${escape(p.demoNote)}</p></div>
    <div class="detail-body"><section><div class="eyebrow">THE IDEA</div><h3>何を解決するか</h3><p>${escape(p.challenge)}</p></section><section><div class="eyebrow">ENGINEERING</div><h3>実装の工夫</h3><p>${escape(p.engineering)}</p></section><section><div class="eyebrow">FEATURES</div><h3>主な機能</h3><ul>${p.features.map(f=>`<li>${escape(f)}</li>`).join('')}</ul></section><section><div class="eyebrow">${p.kind === 'moral' ? 'RESEARCH STATUS' : 'PEOPLE & IMPACT'}</div><h3>${p.kind === 'moral' ? '研究の現在地' : '利用者と、届いた価値'}</h3><div class="usage-callout"><strong>${escape(p.audience)}</strong><p>${escape(p.impact)}</p></div></section>${p.outlook ? `<section class="outlook"><div class="eyebrow">WHAT COMES NEXT</div><h3>今後の展望 — 既存のAIモデルへの活用</h3><p>${escape(p.outlook)}</p></section>` : ''}</div><div class="detail-bottom"><span>コードと詳しい仕様はこちら</span><a class="button primary" href="https://github.com/AMZ-jpcslr/${p.id}" target="_blank" rel="noopener noreferrer">GitHubを見る ↗</a></div>`;
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('dialog-open'); dialog.scrollTop = 0;
  detailPlayer = new ScenePlayer(document.querySelector('#demo-screen'), p, {detail:true});
  updateDetailControls();
  document.querySelector('#demo-play').addEventListener('click',()=>detailPlayer.toggle());
  document.querySelector('#close-dialog').focus(); syncPlayers();
}
function syncHash() {
  const id = location.hash.startsWith('#project=') ? location.hash.slice(9) : null;
  const project = projects.find(p=>p.id===id);
  if(project) openProject(project); else if(dialog.open) dialog.close();
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
  if(location.hash.startsWith('#project='))history.replaceState(null,'','#work');
  syncPlayers();
  if(returnFocus instanceof HTMLElement)returnFocus.focus({preventScroll:true});
});
function setMotion() {
  syncPlayers();
  document.documentElement.classList.toggle('motion-paused', motionPaused);
  motionButton.disabled=preference.matches;
  motionButton.setAttribute('aria-pressed',String(motionPaused));
  motionButton.textContent=preference.matches ? '端末設定でアニメーション停止中' : motionPaused ? 'アニメーションを再開' : 'アニメーションを停止';
}
motionButton.addEventListener('click',()=>{motionPaused=!motionPaused;setMotion();});
preference.addEventListener('change',event=>{motionPaused=event.matches;setMotion();});
document.addEventListener('visibilitychange',syncPlayers);
window.addEventListener('hashchange',syncHash);
setMotion(); syncHash();
