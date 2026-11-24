// からくり仕掛けの工房: belts, ratchets, cranked viewing cases, counter drums and a gas valve.
// Every effect is decoration on top of complete static HTML.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const storageKey = 'workshop-light';

function whenVisible(elements, callback, options = { threshold: 0.35 }) {
  if (!elements.length) return;
  if (!('IntersectionObserver' in window)) { elements.forEach(callback); return; }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      callback(entry.target);
    }
  }, options);
  for (const element of elements) observer.observe(element);
}

function pinCurrentPlate() {
  const path = location.pathname;
  for (const link of document.querySelectorAll('.site-nav a')) {
    const target = new URL(link.href, location.href);
    if (target.origin !== location.origin) continue;
    if (target.pathname === path && !target.hash) link.setAttribute('aria-current', 'page');
    // The works plate keeps its pin on the home page and on each work's own page.
    else if (target.hash === '#works' && (path === '/' || path.startsWith('/projects/'))) link.dataset.current = '';
  }
}

// Split-flap lettering: each letter clacks through a few cards before landing on its own.
const flapCards = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  digit: '0123456789',
  kana: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン'
};
const wide = /[　-ヿ㐀-鿿＀-￯]/;

function cardsFor(letter) {
  if (/[A-Z]/.test(letter)) return flapCards.upper;
  if (/[a-z]/.test(letter)) return flapCards.lower;
  if (/[0-9]/.test(letter)) return flapCards.digit;
  if (wide.test(letter)) return flapCards.kana;
  return '';
}

// Splits text into letters. "text" keeps one readable copy for assistive tech,
// "label" names a link by its words, and "hidden" is for text that is already decoration.
function splitFlaps(element, mode) {
  if ('flap' in element.dataset) return [...element.querySelectorAll('.flap-char')];
  element.dataset.flap = '';
  const words = element.textContent.replace(/[←↗→↓]/g, '').replace(/\s+/g, ' ').trim();
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) {
    const hidden = walker.currentNode.parentElement.closest('[aria-hidden="true"]');
    if (!hidden || hidden === element || !element.contains(hidden)) nodes.push(walker.currentNode);
  }
  for (const node of nodes) {
    const tokens = node.data.match(/\s+|[　-ヿ㐀-鿿＀-￯]|[^\s　-ヿ㐀-鿿＀-￯]+/g) || [];
    // One wrapper per text run keeps flex gaps in buttons from opening up between letters.
    const fragment = document.createElement('span');
    fragment.className = 'flap-line';
    for (const token of tokens) {
      if (/^\s+$/.test(token)) { fragment.append(token); continue; }
      const word = document.createElement('span');
      word.className = 'flap-word';
      for (const letter of Array.from(token)) {
        const char = document.createElement('span');
        char.className = 'flap-char';
        char.textContent = letter;
        word.append(char);
      }
      fragment.append(word);
    }
    node.replaceWith(fragment);
  }
  if (mode === 'text') {
    const face = document.createElement('span');
    face.setAttribute('aria-hidden', 'true');
    face.append(...element.childNodes);
    const copy = document.createElement('span');
    copy.className = 'sr-only';
    copy.textContent = words;
    element.append(copy, face);
  } else if (mode === 'label') {
    element.setAttribute('aria-label', words);
  }
  return [...element.querySelectorAll('.flap-char')];
}

function flipFlaps(element, { stagger = 1, turns = 4 } = {}) {
  if (reduced.matches) return;
  const chars = splitFlaps(element).filter(char => cardsFor(char.dataset.final ?? char.textContent));
  if (!chars.length) return;
  clearInterval(element.flapTimer);
  element.classList.add('flapping');
  // Read every width first, then pin them, so the line does not shuffle while cards change.
  const finals = chars.map(char => char.dataset.final ?? char.textContent);
  const widths = chars.map(char => char.getBoundingClientRect().width);
  chars.forEach((char, index) => {
    char.dataset.final = finals[index];
    if (!char.style.width) char.style.width = widths[index] + 'px';
  });
  let tick = 0;
  const last = (chars.length - 1) * stagger + turns + 2;
  element.flapTimer = setInterval(() => {
    tick++;
    chars.forEach((char, index) => {
      const start = index * stagger;
      if (tick <= start) return;
      const end = start + turns + (index % 3);
      if (tick > end + 1) return;
      const cards = cardsFor(finals[index]);
      char.textContent = tick > end ? finals[index] : cards[Math.floor(Math.random() * cards.length)];
      char.animate([{ transform: 'rotateX(75deg)', filter: 'brightness(.6)' }, { transform: 'none' }], { duration: 55, easing: 'ease-out' });
    });
    if (tick > last) { clearInterval(element.flapTimer); element.classList.remove('flapping'); }
  }, 60);
}

function wireFlaps() {
  const labels = [...document.querySelectorAll(':is(.section-label, .type-label) .type-text')];
  for (const label of labels) splitFlaps(label, label.closest('[aria-hidden="true"]') ? 'hidden' : 'text');
  const headings = [...document.querySelectorAll('main :is(h1:not(#welcome-title), h2)')];
  for (const heading of headings) splitFlaps(heading, 'text');
  const keys = [...document.querySelectorAll('.site-nav a, .chapter-link')];
  for (const key of keys) splitFlaps(key, 'label');
  if (reduced.matches) return;
  whenVisible(labels, label => flipFlaps(label, { stagger: 1, turns: 5 }), { threshold: 1 });
  whenVisible(headings, heading => flipFlaps(heading, { stagger: 1, turns: 3 }), { threshold: .6 });
  for (const key of keys) {
    key.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') flipFlaps(key, { stagger: 0, turns: 3 }); });
    key.addEventListener('focus', () => flipFlaps(key, { stagger: 0, turns: 3 }));
  }
}

// Every press springs back like a typewriter key.
function springKeys() {
  if (reduced.matches) return;
  document.addEventListener('click', event => {
    const key = event.target.closest('button, .site-nav a, .chapter-link, .workshop-entry, .github-link, .work-card');
    if (!key) return;
    key.classList.remove('key-spring');
    void key.offsetWidth;
    key.classList.add('key-spring');
    key.addEventListener('animationend', () => key.classList.remove('key-spring'), { once: true });
  });
}

// Moving between pages: a geared arm grips the page's edge and pulls it away like a kamishibai card,
// showing the next card with a flap board naming the destination. On arrival it pulls that card away too.
const armHousing = `<svg viewBox="0 0 150 150" aria-hidden="true" focusable="false">
  <path d="M60 6h90v132H74q-14 0-14-14z" fill="#3a322c" stroke="#120e0b" stroke-width="2"/>
  <path d="M66 12h84v120H78q-12 0-12-12z" fill="none" stroke="#c69a56" stroke-width="2"/>
  <circle cx="72" cy="20" r="3.4" fill="#d9b877" stroke="#3a2a19"/><circle cx="72" cy="124" r="3.4" fill="#d9b877" stroke="#3a2a19"/><circle cx="140" cy="20" r="3.4" fill="#d9b877" stroke="#3a2a19"/><circle cx="140" cy="124" r="3.4" fill="#d9b877" stroke="#3a2a19"/>
  <g class="arm-idler"><path d="M133.9 49.9L133.9 54.1L128.6 55.7L127.6 58.8L130.9 63.2L128.5 66.5L123.2 64.8L120.7 66.6L120.7 72.2L116.8 73.5L113.6 68.9L110.4 68.9L107.2 73.5L103.3 72.2L103.3 66.6L100.8 64.8L95.5 66.5L93.1 63.2L96.4 58.8L95.4 55.7L90.1 54.1L90.1 49.9L95.4 48.3L96.4 45.2L93.1 40.8L95.5 37.5L100.8 39.2L103.3 37.4L103.3 31.8L107.2 30.5L110.4 35.1L113.6 35.1L116.8 30.5L120.7 31.8L120.7 37.4L123.2 39.2L128.5 37.5L130.9 40.8L127.6 45.2L128.6 48.3Z" fill="#8fa597" stroke="#2d4038" stroke-width="2" stroke-linejoin="round"/><circle cx="112" cy="52" r="6" fill="#efe6cf" stroke="#2d4038" stroke-width="2"/></g>
  <g class="arm-pinion"><path d="M125.9 93.0L125.9 97.0L119.7 98.8L119.0 101.9L123.8 106.2L122.1 109.8L115.7 108.7L113.7 111.2L116.2 117.1L113.1 119.7L107.8 115.9L104.9 117.3L104.6 123.7L100.7 124.6L97.6 118.9L94.4 118.9L91.3 124.6L87.4 123.7L87.1 117.3L84.2 115.9L78.9 119.7L75.8 117.1L78.3 111.2L76.3 108.7L69.9 109.8L68.2 106.2L73.0 101.9L72.3 98.8L66.1 97.0L66.1 93.0L72.3 91.2L73.0 88.1L68.2 83.8L69.9 80.2L76.3 81.3L78.3 78.8L75.8 72.9L78.9 70.3L84.2 74.1L87.1 72.7L87.4 66.3L91.3 65.4L94.4 71.1L97.6 71.1L100.7 65.4L104.6 66.3L104.9 72.7L107.8 74.1L113.1 70.3L116.2 72.9L113.7 78.8L115.7 81.3L122.1 80.2L123.8 83.8L119.0 88.1L119.7 91.2Z" fill="#cba569" stroke="#5b4128" stroke-width="2" stroke-linejoin="round"/><circle cx="96" cy="95" r="12" fill="none" stroke="#5b4128" stroke-width="2"/><circle cx="96" cy="95" r="5" fill="#b0352a" stroke="#3a1410" stroke-width="1.5"/><path d="M96 71v48M72 95h48" stroke="#5b4128" stroke-width="2.5"/></g>
</svg>`;
const armClamp = `<svg class="arm-clamp" viewBox="0 0 52 72" aria-hidden="true" focusable="false">
  <path class="clamp-jaw clamp-jaw--top" d="M48 30V10q0-6-6-6H10q-8 0-8 8v14h10v-12h28v16z" fill="#cba569" stroke="#3a2a19" stroke-width="2" stroke-linejoin="round"/>
  <path class="clamp-jaw clamp-jaw--bottom" d="M48 42v20q0 6-6 6H10q-8 0-8-8V46h10v12h28V42z" fill="#cba569" stroke="#3a2a19" stroke-width="2" stroke-linejoin="round"/>
  <rect x="34" y="26" width="18" height="20" rx="3" fill="#3a322c" stroke="#120e0b" stroke-width="2"/>
  <circle cx="43" cy="36" r="4" fill="#d9b877" stroke="#3a2a19"/>
  <rect x="2" y="22" width="10" height="5" rx="1.5" fill="#b0352a"/><rect x="2" y="45" width="10" height="5" rx="1.5" fill="#b0352a"/>
</svg>`;

function buildArm(arriving) {
  const arm = document.createElement('div');
  arm.className = 'card-arm' + (arriving ? ' card-arm--arrive' : '');
  arm.setAttribute('aria-hidden', 'true');
  arm.innerHTML = '<div class="arm-housing">' + armHousing + '</div><div class="arm-rack">' + armClamp + '</div>';
  // Kept outside <body> so that moving the page does not carry the machine with it.
  document.documentElement.append(arm);
  return arm;
}

function buildBoard(text, arriving) {
  const board = document.createElement('p');
  board.className = 'card-board' + (arriving ? ' card-board--arrive' : '');
  board.setAttribute('aria-hidden', 'true');
  board.textContent = text;
  document.documentElement.append(board);
  return board;
}

function wireDoors() {
  const root = document.documentElement;
  const cleanUp = () => document.querySelectorAll('.card-arm, .card-board').forEach(node => node.remove());
  if (root.classList.contains('card-arriving')) {
    buildArm(true);
    if (window.workshopCard && window.workshopCard !== '1') buildBoard(window.workshopCard, true);
    setTimeout(() => { root.classList.remove('card-arriving'); cleanUp(); }, 1300);
  }
  addEventListener('pageshow', event => { if (event.persisted) { root.classList.remove('card-leaving', 'card-arriving'); cleanUp(); } });
  if (reduced.matches) return;
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.target || link.hasAttribute('download')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname === location.pathname) return;
    event.preventDefault();
    const label = (link.getAttribute('aria-label') || link.textContent).replace(/[←↗→↓]/g, '').replace(/\s+/g, ' ').trim().slice(0, 18);
    try { sessionStorage.setItem('workshop-door', label || '1'); } catch { /* The arm only works on this side. */ }
    cleanUp();
    const board = buildBoard(label, false);
    buildArm(false);
    root.classList.add('card-leaving');
    setTimeout(() => flipFlaps(board, { stagger: 1, turns: 3 }), 450);
    setTimeout(() => { location.href = url.href; }, 1200);
  });
}

// Turning a gear pair by hand: the same --gear-kick the welcome button uses.
function turnGears(pair, degrees, seconds) {
  if (!pair) return;
  const current = parseFloat(pair.style.getPropertyValue('--gear-kick')) || 0;
  pair.style.setProperty('--gear-turn', seconds + 's');
  pair.style.setProperty('--gear-kick', (current + degrees) + 'deg');
  setTimeout(() => pair.style.removeProperty('--gear-turn'), seconds * 1000 + 50);
}

// A belt runs only while the gear that drives it turns.
function runBelts() {
  if (reduced.matches) return;
  const run = (belt, pair) => {
    belt.classList.remove('belt-run');
    void belt.offsetWidth;
    belt.classList.add('belt-run');
    turnGears(pair, -180, .9);
  };
  whenVisible([...document.querySelectorAll('.gear-rule')], rule => run(rule, rule.querySelector('[data-gears]')), { threshold: 1 });
  const welcomeBelt = document.querySelector('.welcome-belt');
  if (welcomeBelt) whenVisible([welcomeBelt], belt => setTimeout(() => run(belt, document.querySelector('.welcome-mechanism [data-gears]')), 1600), { threshold: 0 });
}

function watchWelcome() {
  const welcome = document.querySelector('.welcome');
  if (!welcome || !('IntersectionObserver' in window)) { welcome?.classList.add('welcome-visible'); return; }
  new IntersectionObserver(([entry]) => welcome.classList.toggle('welcome-visible', entry.isIntersecting)).observe(welcome);
}

// Screenshots stay in view; a crank pans each one from top to bottom on hover, focus or touch.
function wireCases() {
  const cards = [...document.querySelectorAll('.work-card')];
  for (const image of document.querySelectorAll('.case-window > img')) {
    if (image.complete) continue;
    const frame = image.parentElement;
    frame.classList.add('case-loading');
    const done = () => frame.classList.remove('case-loading');
    image.addEventListener('load', done, { once: true });
    image.addEventListener('error', done, { once: true });
  }
  if (!cards.length || reduced.matches) return;
  for (const card of cards) {
    card.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') card.classList.add('case-open'); });
    card.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') card.classList.remove('case-open'); });
    card.addEventListener('focus', () => card.classList.add('case-open'));
    card.addEventListener('blur', () => { if (!card.matches(':hover')) card.classList.remove('case-open'); });
  }
  // Touch screens cannot hover, so each case is cranked once while it sits well inside the view.
  if (!matchMedia('(hover: hover)').matches) {
    whenVisible(cards, card => {
      card.classList.add('case-open');
      setTimeout(() => card.classList.remove('case-open'), 3200);
    }, { threshold: 0.7 });
  }
}

// The odometer hangs on a chain from the tip of the reading bar and swings as the page moves.
function hangReadingTag() {
  const meter = document.querySelector('.reading-progress');
  const odometer = meter?.querySelector('.reading-odometer');
  if (!odometer) return;
  const hanger = document.createElement('span');
  hanger.className = 'reading-hanger';
  hanger.setAttribute('aria-hidden', 'true');
  hanger.innerHTML = '<span class="reading-hook"></span><span class="reading-chain"></span>';
  odometer.before(hanger);
  hanger.append(odometer);
  // Grab the tag and drag it along the bar to move through the page.
  hanger.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    event.preventDefault();
    hanger.setPointerCapture(event.pointerId);
    hanger.classList.add('dragging');
    const move = moveEvent => {
      const root = document.scrollingElement;
      const ratio = Math.min(1, Math.max(0, moveEvent.clientX / meter.clientWidth));
      root.scrollTop = ratio * (root.scrollHeight - root.clientHeight);
    };
    const release = () => {
      hanger.classList.remove('dragging');
      hanger.removeEventListener('pointermove', move);
    };
    hanger.addEventListener('pointermove', move);
    hanger.addEventListener('pointerup', release, { once: true });
    hanger.addEventListener('pointercancel', release, { once: true });
  });
  if (reduced.matches) return;
  let last = scrollY;
  let angle = 0;
  let speed = 0;
  let frame = 0;
  function swing() {
    speed = speed * .86 - angle * .07;
    angle += speed;
    hanger.style.setProperty('--swing', angle.toFixed(2) + 'deg');
    frame = Math.abs(angle) > .05 || Math.abs(speed) > .05 ? requestAnimationFrame(swing) : 0;
  }
  addEventListener('scroll', () => {
    const delta = scrollY - last;
    last = scrollY;
    // The tip runs ahead and the tag lags behind it, like a weight on a chain.
    speed += Math.max(-3, Math.min(3, delta * .05));
    if (!frame) frame = requestAnimationFrame(swing);
  }, { passive: true });
}

function rollDrum(drum, digit, steps = 8) {
  let tick = 0;
  const timer = setInterval(() => {
    drum.textContent = ++tick >= steps ? digit : String((Number(drum.textContent) + 1) % 10);
    drum.animate([{ transform: 'translateY(-35%)' }, { transform: 'none' }], { duration: 70, easing: 'ease-out' });
    if (tick >= steps) clearInterval(timer);
  }, 80);
}

function rollCounters() {
  const drums = [...document.querySelectorAll('[data-drum]')];
  if (!drums.length || reduced.matches) return;
  whenVisible(drums, drum => rollDrum(drum, drum.textContent), { threshold: 1 });
}

function setNight(on, switching) {
  const root = document.documentElement;
  if (switching && !reduced.matches) {
    root.classList.add('workshop-switching');
    setTimeout(() => root.classList.remove('workshop-switching'), 600);
  }
  if (on) root.dataset.workshop = 'night';
  else delete root.dataset.workshop;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', on ? '#29231f' : '#f7f3e9');
}

const lanternArt = `<svg viewBox="0 0 32 44" aria-hidden="true" focusable="false">
  <circle class="lantern-glow" cx="16" cy="23" r="15"/>
  <path d="M11 7a5 5 0 0 1 10 0" fill="none" stroke="#6f513b" stroke-width="2"/>
  <path d="M10 11h12l-2.5-4h-7z" fill="#cba569" stroke="#6f513b" stroke-width="1.2" stroke-linejoin="round"/>
  <rect class="lantern-glass" x="9.5" y="11" width="13" height="22" rx="3"/>
  <g class="lantern-flame"><path d="M16 17.5c3.2 4 4 7.2 0 10.5c-4-3.3-3.2-6.5 0-10.5z" fill="#f39b3c"/><path d="M16 21c1.6 2.2 2 3.9 0 5.6c-2-1.7-1.6-3.4 0-5.6z" fill="#fff4cf"/></g>
  <path class="lantern-smoke" d="M16 18q-2-3 0-6t0-6" fill="none" stroke="#9a9184" stroke-width="1.6" stroke-linecap="round"/>
  <rect x="15" y="27.5" width="2" height="4" fill="#3a322c"/>
  <g stroke="#6f513b" stroke-width="1.6"><path d="M9.8 11v22M22.2 11v22"/></g>
  <rect x="7" y="32.5" width="18" height="5" rx="1.6" fill="#cba569" stroke="#6f513b" stroke-width="1.2"/>
  <rect x="9.5" y="37.5" width="13" height="2.5" rx="1" fill="#6f513b"/>
</svg>`;

const skyDial = `<svg class="sky-dial" viewBox="-50 -50 100 100" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="sky-day" x1="0" y1="-50" x2="0" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#8fc3dd"/><stop offset="1" stop-color="#f4e2b4"/></linearGradient>
    <linearGradient id="sky-night" x1="0" y1="50" x2="0" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#141a33"/><stop offset="1" stop-color="#36406b"/></linearGradient>
  </defs>
  <path d="M-50 0a50 50 0 0 1 100 0z" fill="url(#sky-day)"/>
  <path d="M-50 0a50 50 0 0 0 100 0z" fill="url(#sky-night)"/>
  <g transform="translate(-19 -24) scale(.85)"><g stroke="#e0922f" stroke-width="2" stroke-linecap="round">${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<line x1="0" y1="-11" x2="0" y2="-14" transform="rotate(${a})"/>`).join('')}</g><circle r="8" fill="#f5b544" stroke="#c97a22" stroke-width="1.5"/></g>
  <g transform="translate(19 24) rotate(180) scale(.9)"><path d="M-2-9a9 9 0 1 0 9 12a7 7 0 1 1-9-12z" fill="#f2e6c2" stroke="#c9b98a" stroke-width="1"/></g>
  <g fill="#f2e6c2"><circle cx="-10" cy="30" r="1.3"/><circle cx="-30" cy="14" r="1"/><circle cx="8" cy="40" r="1"/><circle cx="40" cy="8" r="1.2"/></g>
  <g fill="#fffaf0" opacity=".85"><path d="M14-30q4-5 9-1q5-3 7 2q4 1 2 4h-20q-2-3 2-5z"/></g>
  <line x1="-50" y1="0" x2="50" y2="0" stroke="#6f513b" stroke-width="1.2"/>
</svg>`;

// A lantern in the header: a gust blows it out for the night workshop, a struck match lights it again.
function addLantern() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'lantern-switch';
  button.setAttribute('role', 'switch');
  button.setAttribute('aria-label', '夜の工房（ランタンの灯りを消す）');
  button.innerHTML = '<span class="lantern">' + lanternArt + '<span class="lantern-gust" aria-hidden="true"><i></i><i></i><i></i></span><span class="lantern-match" aria-hidden="true"></span></span>';
  // Behind the lantern a sky dial turns half a revolution with each press: the sun sets and the moon rises.
  button.insertAdjacentHTML('afterbegin', '<span class="sky-window" aria-hidden="true">' + skyDial + '</span>');
  let turns = document.documentElement.dataset.workshop === 'night' ? 1 : 0;
  button.style.setProperty('--sky-turn', turns * 180 + 'deg');
  const night = document.documentElement.dataset.workshop === 'night';
  button.setAttribute('aria-checked', String(night));
  setNight(night, false);
  header.append(button);
  let timers = [];
  button.addEventListener('click', () => {
    const on = button.getAttribute('aria-checked') !== 'true';
    timers.forEach(clearTimeout);
    turns++;
    button.style.setProperty('--sky-turn', turns * 180 + 'deg');
    button.classList.remove('lantern-gusting', 'lantern-striking');
    button.setAttribute('aria-checked', String(on));
    try { localStorage.setItem(storageKey, on ? 'night' : 'day'); } catch { /* The lantern still works for this page. */ }
    if (reduced.matches) { setNight(on, false); return; }
    void button.offsetWidth;
    // The room changes at the moment the flame goes out, or catches.
    if (on) {
      button.classList.add('lantern-gusting');
      timers = [setTimeout(() => setNight(true, true), 380), setTimeout(() => button.classList.remove('lantern-gusting'), 1300)];
    } else {
      button.classList.add('lantern-striking');
      timers = [setTimeout(() => setNight(false, true), 560), setTimeout(() => button.classList.remove('lantern-striking'), 950)];
    }
  });
}

// Five presses on the gear stamp roll the counter to the year the workshop is aiming for.
function hide2112() {
  const stamp = document.querySelector('.stamp-button');
  if (!stamp) return;
  const note = document.createElement('p');
  note.className = 'year-2112';
  note.setAttribute('role', 'status');
  note.hidden = true;
  note.innerHTML = '<span class="counter-row" aria-hidden="true">' + '<span class="counter-drum">0</span>'.repeat(4) +
    '</span><span><span class="sr-only">2112年。</span>ドラえもんの生まれる年へ、修理は続きます。</span>';
  document.body.append(note);
  const drums = note.querySelectorAll('.counter-drum');
  let presses = 0;
  let hideTimer = 0;
  stamp.addEventListener('click', () => {
    if (++presses % 5) return;
    stamp.classList.remove('spinning');
    void stamp.offsetWidth;
    stamp.classList.add('spinning');
    note.hidden = false;
    [...'2112'].forEach((digit, index) => {
      if (reduced.matches) drums[index].textContent = digit;
      else { drums[index].textContent = '0'; rollDrum(drums[index], digit, 6 + index * 3); }
    });
    note.classList.remove('toast-leaving');
    clearTimeout(hideTimer);
    // Like a toast: it drops from the top, stays three seconds, then lifts away.
    hideTimer = setTimeout(() => {
      if (reduced.matches) { note.hidden = true; return; }
      note.classList.add('toast-leaving');
      hideTimer = setTimeout(() => { note.hidden = true; note.classList.remove('toast-leaving'); }, 300);
    }, 3000);
  });
}

// Toy: grab any gear pair beside a heading and fling it; it spins on with momentum and lets off steam.
function spinnableGears() {
  if (reduced.matches) return;
  for (const pair of document.querySelectorAll(':is(.gear-rule, .welcome-mechanism) [data-gears]')) {
    if (pair.closest('a, button')) continue;
    pair.classList.add('gear-toy');
    let angle = 0;
    let speed = 0;
    let frame = 0;
    let travelled = 0;
    const set = () => pair.style.setProperty('--gear-kick', angle.toFixed(1) + 'deg');
    const pointerAngle = event => {
      const box = pair.querySelector('.gear-wheel--brass').getBoundingClientRect();
      return Math.atan2(event.clientY - (box.top + box.height / 2), event.clientX - (box.left + box.width / 2)) * 180 / Math.PI;
    };
    function coast(last) {
      frame = requestAnimationFrame(now => {
        const step = Math.min(48, now - last);
        angle += speed * step;
        travelled += Math.abs(speed * step);
        speed *= Math.pow(.965, step / 16);
        set();
        if (travelled > 1440) { travelled = 0; puff(pair); }
        if (Math.abs(speed) > .01) coast(now);
        else { frame = 0; pair.style.removeProperty('--gear-turn'); }
      });
    }
    pair.addEventListener('pointerdown', event => {
      event.preventDefault();
      cancelAnimationFrame(frame);
      angle = parseFloat(pair.style.getPropertyValue('--gear-kick')) || 0;
      pair.style.setProperty('--gear-turn', '0s');
      pair.setPointerCapture(event.pointerId);
      pair.classList.add('gear-grabbed');
      let previous = pointerAngle(event);
      let lastTime = event.timeStamp;
      speed = 0;
      const move = moveEvent => {
        const now = pointerAngle(moveEvent);
        let delta = now - previous;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        previous = now;
        angle += delta;
        travelled += Math.abs(delta);
        const elapsed = Math.max(1, moveEvent.timeStamp - lastTime);
        lastTime = moveEvent.timeStamp;
        speed = speed * .5 + (delta / elapsed) * .5;
        set();
      };
      const release = () => {
        pair.classList.remove('gear-grabbed');
        pair.removeEventListener('pointermove', move);
        // A tap with no drag still gives the wheel a friendly nudge.
        if (Math.abs(speed) < .05 && travelled < 4) speed = .6;
        speed = Math.max(-3, Math.min(3, speed));
        const belt = pair.closest('.gear-rule');
        if (belt && Math.abs(speed) > .3) { belt.classList.remove('belt-run'); void belt.offsetWidth; belt.classList.add('belt-run'); }
        coast(performance.now());
      };
      pair.addEventListener('pointermove', move);
      pair.addEventListener('pointerup', release, { once: true });
      pair.addEventListener('pointercancel', release, { once: true });
    });
  }
}

function puff(anchor) {
  const box = anchor.getBoundingClientRect();
  const cloud = document.createElement('span');
  cloud.className = 'steam-puff';
  cloud.setAttribute('aria-hidden', 'true');
  cloud.style.left = box.left + box.width * .3 + 'px';
  cloud.style.top = box.top + 'px';
  document.body.append(cloud);
  cloud.addEventListener('animationend', () => cloud.remove());
}

// Toy: a click on bare paper strikes a little brass cog and a few sparks off the page.
function paperSparks() {
  if (reduced.matches) return;
  let live = 0;
  document.addEventListener('click', event => {
    if (live > 6 || event.target.closest('a, button, input, textarea, select, label, img, svg, video, iframe, dialog, .gear-toy, .reading-hanger, .work-card')) return;
    if (String(getSelection()).trim()) return;
    const spark = document.createElement('span');
    spark.className = 'paper-spark';
    spark.setAttribute('aria-hidden', 'true');
    spark.style.left = event.clientX + 'px';
    spark.style.top = event.clientY + 'px';
    spark.style.setProperty('--drift', (Math.random() * 40 - 20).toFixed(0) + 'px');
    spark.innerHTML = '<img src="/notebook/gears/brass-12.svg" alt="" width="18" height="18"><i></i><i></i><i></i><i></i>';
    document.body.append(spark);
    live++;
    setTimeout(() => { spark.remove(); live--; }, 900);
  });
}

export function wireWorkshopMechanisms() {
  pinCurrentPlate();
  wireFlaps();
  springKeys();
  wireDoors();
  runBelts();
  watchWelcome();
  wireCases();
  rollCounters();
  hangReadingTag();
  spinnableGears();
  paperSparks();
  addLantern();
  hide2112();
}
