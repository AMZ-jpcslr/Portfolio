import { projects } from './projects.js';
import { captions, renderDemoFrame } from './demos.js';
let demoTimer = null;
let demoStep = 0;
let demoPlaying = false;
let demoCompleted = false;
let reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const escape = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const wave = '<div class="wave" aria-hidden="true">' + '<i></i>'.repeat(20) + '</div>';
function miniature(p) {
  if (p.kind === 'voice') return `<div class="mini-discord"><div class="mini-sidebar"><b>amz community⌄</b><span>TEXT CHANNELS</span><p># general</p><p class="active"># voice-chat</p><span>VOICE CHANNELS</span><p>◖ General</p><p class="connected">● Voice connected</p></div><div class="mini-chat"><div class="mini-chat-header"># voice-chat</div><div class="mini-message"><i class="avatar human">A</i><div><b>Member</b><p>今から参加します！</p></div></div><div class="mini-message"><i class="avatar bot">y.</i><div><b>Yomiage <em>APP</em></b><p>メッセージを読み上げ中</p>${wave}</div></div><div class="mini-compose">＋ Message #voice-chat</div></div></div>`;
  if (p.kind === 'weather') return `<div class="mini-discord"><div class="mini-sidebar"><b>amz community⌄</b><span>INFORMATION</span><p># general</p><p class="active"># weather</p><span>BOT STATUS</span><p class="connected">● Monitoring</p></div><div class="mini-chat"><div class="mini-chat-header"># weather <small>DEMO</small></div><div class="mini-message"><i class="avatar weather-avatar">s.</i><div><b>Shindo <em>APP</em></b><div class="weather-embed"><span>☂ 気象情報 / サンプル</span><strong>これからの雨に備える。</strong><p>デモ市 · 降水予報</p><div class="rain-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><small>18:00　19:00　20:00</small></div></div></div></div></div>`;
  if (p.kind === 'stream') return `<div class="mini-studio"><div class="studio-bar">◫ Streaming Studio <span>1920 × 1080</span></div><div class="studio-body"><div class="studio-tools">＋<br>Ｔ<br>▧<br>◷</div><div class="studio-canvas"><div class="stream-heading">JUST<br><b>CHATTING.</b></div><div class="stream-clock">20:30 <small>ON AIR</small></div><div class="stream-comments"><span>LIVE CHAT</span><p>今日も楽しみ！</p><p>こんばんは 👋</p></div></div></div><div class="studio-bottom">LAYOUT EDITOR <span>● Saved</span></div></div>`;
  if (p.kind === 'moral') return `<div class="mini-moral"><div class="mini-label">MORAL DECISION PIPELINE <span>v0.1</span></div><div class="flow-top"><span>GOAL</span><p>What happens<br>if I do this?</p></div><div class="flow-connector">↓</div><div class="flow-options"><span class="blocked">BLOCK <small>有害な行動</small></span><span class="allowed">ALLOW <small>よりよい代替案</small></span></div><div class="flow-result">↳　予測する。評価する。選び直す。</div></div>`;
  if (p.kind === 'proxy') return `<div class="mini-proxy"><div class="mini-label">INSPECTION DASHBOARD <span>DEMO</span></div><div class="proxy-stats"><span><small>REQUESTS</small><b>024</b></span><span><small>DETECTED</small><b>002</b></span><span><small>BLOCKED</small><b>001</b></span></div><div class="proxy-row"><span>GET</span><span>example.com</span><em>200 OK</em></div><div class="proxy-row"><span>POST</span><span>example.test/form</span><em class="warn">PII</em></div><div class="proxy-row"><span>GET</span><span>blocked.test</span><em class="danger">BLOCK</em></div></div>`;
  if (p.kind === 'soccer') return `<div class="mini-soccer"><div class="soccer-meta">SSL SIMULATION <span>BLUE 00 : 00 YELLOW</span></div><div class="pitch"><div class="pitch-center"></div><div class="goal left"></div><div class="goal right"></div><i class="player b1">1</i><i class="player b2">2</i><i class="player b3">3</i><i class="player y1">1</i><i class="player y2">2</i><i class="player y3">3</i><i class="ball"></i></div><div class="soccer-bottom">POSITION → PASS → SHOOT <span>JAVA / 2D</span></div></div>`;
  return `<div class="mini-portfolio"><span>amz.</span><strong>Ideas into<br><em>everyday impact.</em></strong><div class="portfolio-blocks"><i></i><i></i><i></i></div><small>YOU ARE HERE ↗</small></div>`;
}
document.querySelector('#project-grid').innerHTML = projects.map(p => `<article class="project-card ${p.color}"><a class="project-open" href="#project=${p.id}" aria-label="${escape(p.title)}の詳細とデモを見る"><div class="project-visual"><div class="visual-meta"><span>${p.label}</span><span>${p.number} / 07</span></div><div class="miniature" aria-hidden="true">${miniature(p)}</div><span class="visual-open" aria-hidden="true">↗</span></div><div class="project-info"><div class="project-category">${p.category}</div><h3>${p.title}<span aria-hidden="true">↗</span></h3><p>${p.summary}</p><div class="tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div><div class="audience"><span>利用者・利用シーン</span><span>${escape(p.audience || '後日掲載予定')}</span></div></div></a></article>`).join('');

const dialog = document.querySelector('#project-dialog');
let activeProject;
let returnFocus;
function openProject(p) {
  stopDemo();
  activeProject = p;
  returnFocus = document.activeElement;
  document.querySelector('#detail-content').innerHTML = `<div class="detail-heading"><div class="eyebrow">${p.number} / ${p.category}</div><h2 id="detail-title">${p.title}</h2><p>${p.tagline}</p><div class="tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div></div><div class="detail-demo ${p.color}"><div class="demo-toolbar"><span>INTERACTIVE WALKTHROUGH</span><span>説明用デモ</span></div><div id="demo-screen" class="demo-screen" role="img" aria-label="説明用デモ"></div><p id="demo-status" class="demo-status" role="status" aria-live="polite"></p><div class="demo-controls"><button id="demo-play" class="button primary" type="button">▶ デモを再生</button><button id="demo-next" class="button secondary" type="button">次のステップ →</button><span id="demo-counter">01 / 03</span></div><ol class="demo-steps">${p.steps.map((s,i) => `<li class="${i===0?'current':''}"><span>0${i+1}</span>${s}</li>`).join('')}</ol><p class="demo-note">${p.demoNote}</p></div><div class="detail-body"><section><div class="eyebrow">THE IDEA</div><h3>何を解決するか</h3><p>${p.challenge}</p></section><section><div class="eyebrow">ENGINEERING</div><h3>実装の工夫</h3><p>${p.engineering}</p></section><section><div class="eyebrow">FEATURES</div><h3>主な機能</h3><ul>${p.features.map(f=>`<li>${f}</li>`).join('')}</ul></section><section><div class="eyebrow">PEOPLE & USE CASES</div><h3>利用者・利用シーン</h3><p>${escape(p.audience || '利用者・利用実績の情報は後日掲載予定です。')}</p></section></div><div class="detail-bottom"><span>コードと詳しい仕様はこちら</span><a class="button primary" href="https://github.com/AMZ-jpcslr/${p.id}" target="_blank" rel="noopener noreferrer">GitHubを見る ↗</a></div>`;
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('dialog-open');
  dialog.scrollTop = 0;
  document.querySelector('#close-dialog').focus();
  setupDemo();
}
function syncHash() {
  const id = location.hash.startsWith('#project=') ? location.hash.slice(9) : null;
  const p = projects.find(p => p.id === id);
  if (p) openProject(p); else if (dialog.open) dialog.close();
}
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { stopDemo(); document.body.classList.remove('dialog-open'); if(location.hash.startsWith('#project=')) history.replaceState(null, '', '#work'); if(returnFocus instanceof HTMLElement) returnFocus.focus({preventScroll:true}); });
window.addEventListener('hashchange', syncHash);
syncHash();
const motionButton = document.querySelector('#motion-toggle');
function setMotion() { if (reduced) stopDemo(); document.documentElement.classList.toggle('motion-paused', reduced); motionButton.disabled = matchMedia('(prefers-reduced-motion: reduce)').matches; motionButton.setAttribute('aria-pressed', String(reduced)); motionButton.textContent = motionButton.disabled ? '端末設定でアニメーション停止中' : reduced ? 'アニメーションを再開' : 'アニメーションを停止'; }
motionButton.addEventListener('click', () => { reduced = !reduced; setMotion(); });
setMotion();

function updateDemoControls() {
  const button = document.querySelector('#demo-play');
  if (!button) return;
  button.textContent = demoPlaying ? 'Ⅱ 一時停止' : demoCompleted ? '↻ もう一度再生' : '▶ デモを再生';
  button.setAttribute('aria-pressed', String(demoPlaying));
  button.disabled = reduced;
  button.title = reduced ? 'ページ下部の設定または端末設定でアニメーションが停止されています。「次のステップ」で操作できます。' : '';
  if (reduced) button.textContent = '自動再生は停止中';
  document.querySelector('#demo-next').textContent = demoStep === 2 ? '最初のステップへ ↺' : '次のステップ →';
}
function stopDemo() {
  clearTimeout(demoTimer);
  demoTimer = null;
  demoPlaying = false;
  document.querySelector('#demo-screen')?.classList.add('is-paused');
  updateDemoControls();
}
function renderStep() {
  const screen = document.querySelector('#demo-screen');
  screen.classList.remove('is-paused');
  screen.innerHTML = renderDemoFrame(activeProject, demoStep);
  screen.setAttribute('aria-label', `${activeProject.title}：${activeProject.steps[demoStep]}`);
  document.querySelector('#demo-status').textContent = captions[activeProject.kind][demoStep];
  document.querySelector('#demo-counter').textContent = `0${demoStep + 1} / 03`;
  document.querySelectorAll('.demo-steps li').forEach((li, i) => {
    li.classList.toggle('current', i === demoStep);
    if (i === demoStep) li.setAttribute('aria-current', 'step');
    else li.removeAttribute('aria-current');
  });
  updateDemoControls();
}
function queueDemoStep() {
  demoTimer = setTimeout(() => {
    if (!demoPlaying || !dialog.open) return;
    if (demoStep === 2) {
      demoCompleted = true;
      stopDemo();
      return;
    }
    demoStep++;
    renderStep();
    queueDemoStep();
  }, 3200);
}
function setupDemo() {
  demoStep = 0;
  demoCompleted = false;
  renderStep();
  document.querySelector('#demo-play').addEventListener('click', () => {
    if (reduced) return;
    if (demoPlaying) { stopDemo(); return; }
    if (demoCompleted || demoStep === 2) { demoStep = 0; demoCompleted = false; }
    demoPlaying = true;
    renderStep();
    queueDemoStep();
  });
  document.querySelector('#demo-next').addEventListener('click', () => {
    stopDemo();
    demoCompleted = false;
    demoStep = (demoStep + 1) % 3;
    renderStep();
  });
}
// Pause automatic step changes when the page is no longer visible.
// Each play-through ends after three steps; closing the dialog clears its timer.
document.addEventListener('visibilitychange', () => { if (document.hidden) stopDemo(); });
motionButton.addEventListener('click', updateDemoControls);
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
  reduced = e.matches;
  setMotion();
  updateDemoControls();
});
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.project-card, .approach-grid article').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}
