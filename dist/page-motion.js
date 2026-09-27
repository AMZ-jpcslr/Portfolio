/** Page-level motion uses passive events and one paint per input, not a perpetual frame loop. */
export function createPageMotion({ paused = false, dialog }) {
  const root = document.documentElement;
  const heroArt = document.querySelector('.hero-art');
  const progress = document.querySelector('.reading-progress');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const pending = new Set();
  let stopped = paused;
  let suspended = false;
  let paintFrame = 0;
  let pointerFrame = 0;
  let activeCard = null;
  let pointer = null;

  const reveal = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      pending.delete(entry.target);
      reveal.unobserve(entry.target);
    }
  }, { threshold: 0, rootMargin: '0px 0px -32px 0px' });

  function mark(element, delay = 0, kind = 'rise') {
    if (!element) return;
    element.dataset.reveal = kind;
    element.style.setProperty('--reveal-delay', `${delay}ms`);
    if (stopped) element.classList.add('is-visible');
    else { pending.add(element); reveal.observe(element); }
  }

  document.querySelectorAll('.hero-copy > *').forEach((element, index) => {
    mark(element, index * 70, element.tagName === 'H1' ? 'title' : 'rise');
  });
  mark(document.querySelector('.hero-stage'), 180);
  mark(document.querySelector('.hero-art-index'), 360);
  mark(document.querySelector('.hero-bottom'), 360);
  mark(document.querySelector('.editorial-title'));
  document.querySelectorAll('.section-heading').forEach(element => mark(element));
  document.querySelectorAll('.project-card').forEach(element => mark(element));
  document.querySelectorAll('.approach-grid article').forEach((element, index) => mark(element, index * 110));
  document.querySelectorAll('.closing > :not(.closing-orbit)').forEach((element, index) => mark(element, index * 90));
  // Register targets before enabling concealment; an initialization failure keeps the page readable.
  root.classList.add('motion-ready');

  const ambient = new IntersectionObserver(entries => {
    for (const entry of entries) entry.target.classList.toggle('is-in-view', entry.isIntersecting);
  });
  document.querySelectorAll('.ambient-motion').forEach(element => ambient.observe(element));

  function paint() {
    paintFrame = 0;
    const scrollable = root.scrollHeight - innerHeight;
    progress.style.setProperty('--read-progress', scrollable > 0 ? Math.min(1, Math.max(0, scrollY / scrollable)) : 0);
    if (!suspended && innerWidth > 760) {
      heroArt.style.setProperty('--hero-drift', `${Math.min(28, Math.max(0, scrollY * .06))}px`);
    } else heroArt.style.removeProperty('--hero-drift');
  }
  function queuePaint() {
    if (!paintFrame) paintFrame = requestAnimationFrame(paint);
  }
  addEventListener('scroll', queuePaint, { passive: true });
  addEventListener('resize', queuePaint, { passive: true });
  // Card images and font loading may change the document's total height.
  new ResizeObserver(queuePaint).observe(document.body);

  function resetPointer() {
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    if (activeCard) {
      activeCard.style.removeProperty('--light-x');
      activeCard.style.removeProperty('--light-y');
    }
    activeCard = null;
  }
  function paintPointer() {
    pointerFrame = 0;
    if (!activeCard || suspended) return;
    const bounds = activeCard.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (pointer.x - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (pointer.y - bounds.top) / bounds.height));
    activeCard.style.setProperty('--light-x', `${x * 100}%`);
    activeCard.style.setProperty('--light-y', `${y * 100}%`);
  }
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (suspended || !finePointer.matches || event.pointerType === 'touch') return;
      if (activeCard !== card) resetPointer();
      activeCard = card;
      pointer = { x: event.clientX, y: event.clientY };
      if (!pointerFrame) pointerFrame = requestAnimationFrame(paintPointer);
    }, { passive: true });
    card.addEventListener('pointerleave', resetPointer);
    card.addEventListener('pointercancel', resetPointer);
  });
  finePointer.addEventListener('change', resetPointer);

  // Keyboard focus must never land on a visually concealed link.
  document.addEventListener('focusin', event => {
    const target = event.target.closest('[data-reveal]');
    if (target) {
      target.classList.add('is-visible');
      target.style.setProperty('--reveal-delay', '0ms');
      pending.delete(target);
      reveal.unobserve(target);
    }
  });
  let sections;
  function observeNavigation() {
    sections?.disconnect();
    sections = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        document.querySelectorAll('.header nav a[href^="#"]').forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: `-${Math.round(innerHeight * .12)}px 0px -${Math.round(innerHeight * .75)}px 0px` });
    document.querySelectorAll('#work, #approach, .hero').forEach(section => sections.observe(section));
  }
  observeNavigation();
  addEventListener('resize', observeNavigation, { passive: true });

  function syncSuspended() {
    suspended = stopped || document.hidden || dialog.open;
    root.classList.toggle('page-motion-idle', suspended);
    if (suspended) resetPointer();
    queuePaint();
  }
  function observeDetail() {
    for (const element of pending) {
      if (!element.isConnected || dialog.contains(element)) {
        reveal.unobserve(element);
        pending.delete(element);
      }
    }
    if (dialog.open) {
      dialog.querySelectorAll('.case-overview, .case-study > section, .detail-bottom').forEach(element => mark(element));
    }
    syncSuspended();
  }
  new MutationObserver(observeDetail).observe(dialog, { attributes: true, attributeFilter: ['open'] });
  new MutationObserver(observeDetail).observe(document.querySelector('#detail-content'), { childList: true });
  document.addEventListener('visibilitychange', syncSuspended);

  return {
    setPaused(value) {
      stopped = value;
      if (stopped) {
        for (const element of pending) { element.classList.add('is-visible'); reveal.unobserve(element); }
        pending.clear();
      }
      syncSuspended();
    }
  };
}
