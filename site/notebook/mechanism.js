// からくり仕掛けの工房: belts, ratchets, louvre shutters, counter drums and a gas lamp.
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

function typeLabels() {
  const labels = [...document.querySelectorAll(':is(.section-label, .type-label) .type-text')];
  if (!labels.length || reduced.matches || !('IntersectionObserver' in window)) return;
  for (const text of labels) text.style.setProperty('--type-width', text.scrollWidth + 'px');
  document.documentElement.classList.add('typing-ready');
  whenVisible(labels, text => {
    text.parentElement.style.setProperty('--chars', text.textContent.length);
    text.parentElement.classList.add('typing');
  }, { threshold: 1 });
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

function wireShutters() {
  const cards = [...document.querySelectorAll('.work-card')];
  if (!cards.length || reduced.matches) return;
  document.documentElement.classList.add('shutter-ready');
  for (const card of cards) {
    card.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') card.classList.add('case-open'); });
    card.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') card.classList.remove('case-open'); });
    card.addEventListener('focus', () => card.classList.add('case-open'));
    card.addEventListener('blur', () => { if (!card.matches(':hover')) card.classList.remove('case-open'); });
  }
  // Touch screens cannot hover, so each case opens once it is well inside the view.
  if (!matchMedia('(hover: hover)').matches) whenVisible(cards, card => card.classList.add('case-open'), { threshold: 0.7 });
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

function addLampLever() {
  const footer = document.querySelector('.site-footer');
  if (!footer) return;
  const lever = document.createElement('button');
  lever.type = 'button';
  lever.className = 'night-lever';
  lever.setAttribute('role', 'switch');
  lever.setAttribute('aria-label', 'ガス灯を絞って夜の工房にする');
  lever.innerHTML = '<span class="night-lever-base" aria-hidden="true"><span class="night-lever-arm"></span></span><span class="night-lever-text" aria-hidden="true">夜の工房</span>';
  const night = document.documentElement.dataset.workshop === 'night';
  lever.setAttribute('aria-checked', String(night));
  setNight(night, false);
  const stamp = footer.querySelector('.stamp-button');
  if (stamp) stamp.before(lever);
  else footer.append(lever);
  lever.addEventListener('click', () => {
    const on = lever.getAttribute('aria-checked') !== 'true';
    lever.setAttribute('aria-checked', String(on));
    setNight(on, true);
    try { localStorage.setItem(storageKey, on ? 'night' : 'day'); } catch { /* The lever still works for this page. */ }
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
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => { note.hidden = true; }, 4500);
  });
}

export function wireWorkshopMechanisms() {
  pinCurrentPlate();
  typeLabels();
  runBelts();
  watchWelcome();
  wireShutters();
  rollCounters();
  addLampLever();
  hide2112();
}
