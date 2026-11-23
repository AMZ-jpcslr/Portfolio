import { introduceWelcome } from './welcome-ink.js';
import { wireCircuitWorkshop } from './circuit.js';

const legacyProjects = new Map([
  ['mania', 'mania'], ['Syukatu-Note', 'career'], ['Streaming-Screen', 'stream'],
  ['Yomiage_Discord_Bot', 'voice'], ['Shindo_Discord_Bot', 'weather'],
  ['Artificial-Moral-Architecture', 'moral'], ['ssl-inspection-prodxy', 'proxy'], ['SSL-DEMO', 'soccer'],
]);

function openLegacyBookmark() {
  if (location.pathname !== '/') return;
  const id = new URLSearchParams(location.hash.slice(1)).get('project');
  if (legacyProjects.has(id)) location.replace('/projects/' + legacyProjects.get(id) + '/');
}

function rememberWorkPosition() {
  const gallery = document.getElementById('works');
  const key = 'notebook-work-position';
  try {
    const storage = window.sessionStorage;
    const from = document.referrer ? new URL(document.referrer) : null;
    if (!gallery) {
      // A direct visit should not inherit a position from an earlier visit.
      if (performance.getEntriesByType('navigation')[0]?.type === 'navigate' &&
          (from?.origin !== location.origin || from.pathname !== '/')) storage.removeItem(key);
      return;
    }
    gallery.addEventListener('click', event => {
      const card = event.target.closest('a.work-card');
      if (!card || event.defaultPrevented || event.button !== 0 || event.ctrlKey ||
          event.metaKey || event.altKey || event.shiftKey) return;
      try {
        storage.setItem(key, JSON.stringify({
          id: card.id, top: card.getBoundingClientRect().top, width: innerWidth,
        }));
      } catch { /* The card fragment still works if storage is full. */ }
    });

    const card = document.getElementById(location.hash.slice(1));
    const saved = storage.getItem(key);
    storage.removeItem(key);
    if (!card?.matches('a.work-card') || !saved || !from) return;
    const position = JSON.parse(saved);
    if (from.origin !== location.origin || from.pathname !== card.pathname || position.id !== card.id ||
        position.width !== innerWidth || !Number.isFinite(position.top) || position.top >= innerHeight ||
        position.top + card.offsetHeight <= 0) return;
    const padding = getComputedStyle(document.documentElement).scrollPaddingTop;
    card.style.scrollMarginTop = 'calc(' + position.top + 'px - ' + padding + ')';
    card.focus({ preventScroll: true });
    card.scrollIntoView({ behavior: 'instant', block: 'start' });
  } catch { /* Native fragment navigation works without session storage. */ }
}

function wirePortrait() {
  const portrait = document.querySelector('[data-portrait]');
  if (!portrait) return;
  const images = portrait.querySelectorAll('img');
  let pointerType;
  Promise.all(Array.from(images, image => image.decode())).then(
    () => { portrait.disabled = false; },
    () => { /* Leave the available artwork static. */ }
  );
  portrait.addEventListener('pointerdown', event => { pointerType = event.pointerType; });
  portrait.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') portrait.setAttribute('aria-pressed', 'true');
  });
  portrait.addEventListener('click', event => {
    // WebKit can label the synthesized click after a tap as a mouse click.
    if (event.detail > 0 && pointerType === 'mouse') return;
    portrait.setAttribute('aria-pressed', String(portrait.getAttribute('aria-pressed') !== 'true'));
  });
  portrait.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse') portrait.setAttribute('aria-pressed', 'false');
  });
}

function wireNotebookGears() {
  const pairs = document.querySelectorAll('[data-gears]');
  if (!pairs.length) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const visible = new Set();
  let frame = 0;
  function requestTurn() {
    if (frame || reduced.matches || !visible.size) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const angle = (window.scrollY * .14) % 720;
      for (const pair of visible) pair.style.setProperty('--gear-scroll', angle.toFixed(2) + 'deg');
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      requestTurn();
    }, { rootMargin: '80px' });
    for (const pair of pairs) observer.observe(pair);
  } else {
    for (const pair of pairs) visible.add(pair);
    requestTurn();
  }
  window.addEventListener('scroll', requestTurn, { passive: true });
  reduced.addEventListener('change', requestTurn);

  let clicks = 0;
  document.querySelector('[data-turn-gears]')?.addEventListener('click', event => {
    if (reduced.matches || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    clicks++;
    for (const selector of ['[data-turn-gears] [data-gears]', '#message [data-gears]']) {
      document.querySelector(selector)?.style.setProperty('--gear-kick', (clicks * 60) + 'deg');
    }
  });
}

function trackReadingProgress() {
  const meter = document.querySelector('.reading-progress');
  const root = document.scrollingElement;
  const nixie = document.createElement('span');
  nixie.className = 'reading-nixie';
  nixie.setAttribute('aria-hidden', 'true');
  meter.append(nixie);
  let frame = 0;
  function update() {
    frame = 0;
    const range = root.scrollHeight - root.clientHeight;
    meter.hidden = range <= 0;
    if (meter.hidden) return;
    const position = Math.max(0, root.scrollTop);
    // Fractional pixels can leave the bottom just short of the integer scroll height.
    const ratio = position > 0 && range - position < 1 ? 1 : Math.min(1, position / range);
    meter.style.setProperty('--reading-ratio', ratio);
    const percent = String(Math.round(ratio * 100));
    meter.classList.toggle('reading-moving', position > 64);
    nixie.textContent = percent + '%';
    if (meter.getAttribute('aria-valuenow') !== percent) meter.setAttribute('aria-valuenow', percent);
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('pageshow', schedule);
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(document.body);
  update();
}

function addNotebookStamp() {
  const footer = document.querySelector('.site-footer');
  if (!footer) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'stamp-button';
  button.setAttribute('aria-label', '制作ノートに歯車の判を押す');
  button.setAttribute('aria-pressed', 'false');
  button.innerHTML = '<span class="stamp-imprint" aria-hidden="true">検印</span><span class="stamp-gear" aria-hidden="true">⚙</span>';
  footer.append(button);
  button.addEventListener('click', () => {
    const pressed = button.getAttribute('aria-pressed') === 'true';
    button.setAttribute('aria-pressed', String(!pressed));
    button.setAttribute('aria-label', pressed ? '制作ノートに歯車の判を押す' : '歯車の判を戻す');
  });
}

// Elements are visible in static HTML and whenever motion or observation is unavailable.
function animateNotebookEntries() {
  if (!('IntersectionObserver' in window)) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (!reduced.matches) entry.target.classList.add('ink-appears');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.08 });
  for (const element of document.querySelectorAll('[data-reveal]')) observer.observe(element);
}

openLegacyBookmark();
rememberWorkPosition();
trackReadingProgress();
window.addEventListener('hashchange', openLegacyBookmark);
wirePortrait();
introduceWelcome();
wireNotebookGears();
addNotebookStamp();
animateNotebookEntries();
wireCircuitWorkshop();
