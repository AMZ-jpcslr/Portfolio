const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function createSpatialGallery({host, projects, dialog}) {
  if (!host) return;
  const stage = host.querySelector('.spatial-stage');
  const container = host.querySelector('.spatial-canvas');
  const pause = host.querySelector('#spatial-pause');
  const status = host.querySelector('#spatial-status');
  const preference = matchMedia('(prefers-reduced-motion:reduce)');
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)');
  const step = Math.PI * 2 / projects.length;
  const list = host.querySelector('#spatial-projects');
  list.innerHTML = projects.map((p, i) => `<button type="button" data-spatial-index="${i}" aria-label="${escape(p.title)}を選ぶ" aria-pressed="${i === 0}">${p.number}</button>`).join('');
  const buttons = [...list.children];
  let selected = 0, scene = null, loading = false, failed = false;
  let localPaused = false, visible = false, pointer = null;
  let frame = 0, previousTime = 0, previousPaint = 0, time = .4;
  let angle = 0, targetAngle = 0, pointerX = 0, pointerY = 0, smoothX = 0, smoothY = 0;
  const globalPaused = () => preference.matches || document.documentElement.classList.contains('motion-paused');
  const stopped = () => localPaused || globalPaused();
  const canPlay = () => scene && !failed && visible && !document.hidden && !dialog.open && !stopped();

  function draw() {
    if (!scene || failed) return;
    scene.draw({angle: angle + (pointer ? 0 : Math.sin(time * .23) * .065), time, pointerX: smoothX, pointerY: smoothY});
  }
  function tick(now) {
    frame = 0;
    if (!canPlay()) return;
    const interval = 1000 / (scene.compact ? 30 : 60);
    if (!previousPaint || now - previousPaint >= interval - 1) {
      const delta = previousTime ? Math.min((now - previousTime) / 1000, .06) : 0;
      previousPaint = now; previousTime = now;
      time += delta;
      if (!pointer) angle += (targetAngle - angle) * (1 - Math.exp(-delta * 6));
      smoothX += (pointerX - smoothX) * .08;
      smoothY += (pointerY - smoothY) * .08;
      draw();
    }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame); frame = 0; previousTime = 0; previousPaint = 0;
    pause.disabled = failed || globalPaused();
    pause.setAttribute('aria-pressed', String(stopped() || failed));
    pause.textContent = failed ? '静止画で表示中' : preference.matches ? '端末設定で停止中' : globalPaused() ? '全体の動きを停止中' : localPaused ? '3Dを再生' : '3Dを一時停止';
    host.dataset.playback = failed ? 'static' : canPlay() ? 'playing' : 'paused';
    if (canPlay()) frame = requestAnimationFrame(tick);
  }
  function select(index, {snap = false} = {}) {
    selected = ((index % projects.length) + projects.length) % projects.length;
    const p = projects[selected];
    host.querySelector('#spatial-number').textContent = `${p.number} / ${String(projects.length).padStart(2, '0')}`;
    host.querySelector('#spatial-project-title').textContent = p.title;
    host.querySelector('#spatial-project-summary').textContent = p.summary;
    host.querySelector('#spatial-detail').href = `#project=${p.id}`;
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === selected)));
    // Take the shortest route, including from the last project back to the first.
    const desired = selected * step;
    targetAngle = angle + Math.atan2(Math.sin(desired - angle), Math.cos(desired - angle));
    if (snap || stopped() || !canPlay()) { angle = targetAngle; draw(); }
    sync();
  }
  function fallback() {
    failed = true;
    cancelAnimationFrame(frame); frame = 0;
    scene?.dispose(); scene = null;
    host.dataset.state = 'fallback';
    status.textContent = '静止画で表示しています。ボタンから作品の紹介を切り替えられます。';
    host.querySelector('#spatial-help').textContent = '作品番号・左右キーで切り替え';
    sync();
  }
  async function load() {
    if (loading || scene || failed) return;
    loading = true;
    host.dataset.state = 'loading';
    try {
      const {createProjectScene} = await import('./spatial-scene.js');
      scene = await createProjectScene({container, projects, onContextLost: fallback});
      scene.resize(); draw();
      host.dataset.state = 'ready';
      status.textContent = '3Dを表示しています';
      sync();
    } catch { fallback(); }
  }
  const preload = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    preload.disconnect(); load();
  }, {rootMargin:'180px 0px'});
  preload.observe(stage);
  const visibility = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting && entries[0].intersectionRatio >= .05;
    sync();
  }, {threshold:[0, .05]});
  visibility.observe(stage);
  new ResizeObserver(() => { scene?.resize(); draw(); }).observe(container);
  new MutationObserver(sync).observe(document.documentElement, {attributes:true, attributeFilter:['class']});
  new MutationObserver(sync).observe(dialog, {attributes:true, attributeFilter:['open']});
  document.addEventListener('visibilitychange', sync);
  preference.addEventListener('change', () => { pointerX = pointerY = smoothX = smoothY = 0; sync(); draw(); });
  pause.addEventListener('click', () => { localPaused = !localPaused; sync(); });
  buttons.forEach((button, i) => button.addEventListener('click', () => select(i)));
  function openSelectedProject() {
    const link = host.querySelector('#spatial-detail');
    link.focus({preventScroll:true});
    link.click();
  }
  host.querySelector('#spatial-prev').addEventListener('click', () => select(selected - 1));
  host.querySelector('#spatial-next').addEventListener('click', () => select(selected + 1));
  stage.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); openSelectedProject(); return;
    }
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    select(event.key === 'Home' ? 0 : event.key === 'End' ? projects.length - 1 : selected + (event.key === 'ArrowRight' ? 1 : -1));
  });
  stage.addEventListener('pointerdown', event => {
    if (event.button !== 0 || !event.isPrimary || !scene) return;
    pointer = {id:event.pointerId, x:event.clientX, y:event.clientY, angle, moved:false};
    stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointermove', event => {
    if (pointer && pointer.id === event.pointerId) {
      const dx = event.clientX - pointer.x;
      if (Math.abs(dx) > 7) pointer.moved = true;
      if (pointer.moved) {
        angle = pointer.angle - dx / stage.clientWidth * Math.PI * 1.4;
        targetAngle = angle;
        if (!canPlay()) draw();
      }
    } else if (finePointer.matches && event.pointerType === 'mouse' && !stopped()) {
      const bounds = stage.getBoundingClientRect();
      pointerX = (event.clientX - bounds.left) / bounds.width * 2 - 1;
      pointerY = (event.clientY - bounds.top) / bounds.height * 2 - 1;
    }
  }, {passive:true});
  function release(event, cancelled = false) {
    if (!pointer || event.pointerId !== pointer.id) return;
    const previous = pointer; pointer = null;
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    if (cancelled) { select(selected); return; }
    if (previous.moved) select(Math.round(angle / step));
    else {
      const index = scene?.hit(event.clientX, event.clientY);
      if (index !== undefined) { select(index, {snap:true}); openSelectedProject(); }
    }
  }
  stage.addEventListener('pointerup', event => release(event));
  stage.addEventListener('pointercancel', event => release(event, true));
  stage.addEventListener('lostpointercapture', event => release(event, true));
  stage.addEventListener('pointerleave', () => { pointerX = pointerY = 0; });
  window.addEventListener('blur', () => { if (pointer) { pointer = null; select(selected); } });
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(frame); frame = 0;
  });
  window.addEventListener('pageshow', sync);
  select(0, {snap:true});
}
