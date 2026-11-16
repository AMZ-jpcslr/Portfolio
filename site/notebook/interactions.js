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

function wirePortrait() {
  const portrait = document.querySelector('[data-portrait]');
  if (!portrait) return;
  portrait.disabled = false;
  portrait.addEventListener('click', () => {
    portrait.setAttribute('aria-pressed', String(portrait.getAttribute('aria-pressed') !== 'true'));
  });
  portrait.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse') portrait.setAttribute('aria-pressed', 'false');
  });
}

function introduceWelcome() {
  const cover = document.querySelector('.welcome');
  if (!cover) return;
  function arrive() {
    if (!location.hash && !document.hidden && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cover.classList.add('welcome-arriving');
    }
  }
  const intro = document.querySelector('.notebook-opening[open]');
  if (intro) intro.addEventListener('close', arrive, { once: true });
  else arrive();
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
window.addEventListener('hashchange', openLegacyBookmark);
wirePortrait();
introduceWelcome();
wireNotebookGears();
addNotebookStamp();
animateNotebookEntries();
