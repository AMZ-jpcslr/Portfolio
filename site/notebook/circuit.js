// The workshop of 2112: circuit light, CRT monitors, nixie tubes and a night switch.
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

function lightCurrentPlate() {
  const path = location.pathname;
  for (const link of document.querySelectorAll('.site-nav a')) {
    const target = new URL(link.href, location.href);
    if (target.origin !== location.origin) continue;
    if (target.pathname === path && !target.hash) link.setAttribute('aria-current', 'page');
    // The works plate stays lit on the home page and on each work's own page.
    else if (target.hash === '#works' && (path === '/' || path.startsWith('/projects/'))) link.dataset.lit = '';
  }
}

function typeLabels() {
  const labels = [...document.querySelectorAll(':is(.section-label, .type-label) .type-text')];
  if (!labels.length || reduced.matches || !('IntersectionObserver' in window)) return;
  for (const text of labels) text.style.setProperty('--type-width', text.scrollWidth + 'px');
  document.documentElement.classList.add('typing-ready');
  whenVisible(labels, text => {
    text.style.setProperty('--chars', text.textContent.length);
    text.parentElement.classList.add('typing');
  }, { threshold: 1 });
}

function sparkCircuits() {
  whenVisible([...document.querySelectorAll('.gear-rule, .circuit-trace')], element => element.classList.add('circuit-live'), { threshold: 0.6 });
}

function runHologram() {
  const welcome = document.querySelector('.welcome');
  if (!welcome || !('IntersectionObserver' in window)) { welcome?.classList.add('holo-visible'); return; }
  new IntersectionObserver(([entry]) => welcome.classList.toggle('holo-visible', entry.isIntersecting)).observe(welcome);
}

function powerMonitors() {
  const cards = [...document.querySelectorAll('.work-card')];
  if (!cards.length || reduced.matches) return;
  document.documentElement.classList.add('crt-ready');
  for (const card of cards) {
    card.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') card.classList.add('crt-on'); });
    card.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') card.classList.remove('crt-on'); });
    card.addEventListener('focus', () => card.classList.add('crt-on'));
    card.addEventListener('blur', () => { if (!card.matches(':hover')) card.classList.remove('crt-on'); });
  }
  // Touch screens cannot hover, so each monitor switches on once it is well inside the view.
  if (!matchMedia('(hover: hover)').matches) whenVisible(cards, card => card.classList.add('crt-on'), { threshold: 0.7 });
}

function flipNixies() {
  const tubes = [...document.querySelectorAll('[data-nixie]')];
  if (!tubes.length || reduced.matches) return;
  whenVisible(tubes, tube => {
    const digit = tube.textContent;
    let flips = 0;
    const timer = setInterval(() => {
      tube.textContent = ++flips >= 8 ? digit : String(Math.floor(Math.random() * 10));
      if (flips >= 8) clearInterval(timer);
    }, 75);
  }, { threshold: 1 });
}

function setNight(on, switching) {
  const root = document.documentElement;
  if (switching && !reduced.matches) {
    root.classList.add('workshop-switching');
    setTimeout(() => root.classList.remove('workshop-switching'), 500);
  }
  if (on) root.dataset.workshop = 'night';
  else delete root.dataset.workshop;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', on ? '#1a2325' : '#f7f3e9');
}

function addNightLever() {
  const footer = document.querySelector('.site-footer');
  if (!footer) return;
  const lever = document.createElement('button');
  lever.type = 'button';
  lever.className = 'night-lever';
  lever.setAttribute('role', 'switch');
  lever.setAttribute('aria-label', '夜の工房モード');
  lever.innerHTML = '<span class="night-lever-base" aria-hidden="true"><span class="night-lever-arm"></span></span><span class="night-lever-text" aria-hidden="true" lang="en">NIGHT</span>';
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
    try { localStorage.setItem(storageKey, on ? 'night' : 'day'); } catch { /* The switch still works for this page. */ }
  });
}

// Five presses on the gear stamp light the year the workshop is aiming for.
function hide2112() {
  const stamp = document.querySelector('.stamp-button');
  if (!stamp) return;
  const note = document.createElement('p');
  note.className = 'year-2112';
  note.setAttribute('role', 'status');
  note.hidden = true;
  note.innerHTML = '<span class="nixie-row" aria-hidden="true">' + [...'2112'].map(d => '<span class="nixie">' + d + '</span>').join('') +
    '</span><span><span class="sr-only">2112年。</span>ドラえもんの生まれる年へ、修理は続きます。</span>';
  document.body.append(note);
  let presses = 0;
  let hideTimer = 0;
  stamp.addEventListener('click', () => {
    if (++presses % 5) return;
    stamp.classList.remove('spinning');
    void stamp.offsetWidth;
    stamp.classList.add('spinning');
    note.hidden = false;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => { note.hidden = true; }, 4200);
  });
}

export function wireCircuitWorkshop() {
  lightCurrentPlate();
  typeLabels();
  sparkCircuits();
  runHologram();
  powerMonitors();
  flipNixies();
  addNightLever();
  hide2112();
}
