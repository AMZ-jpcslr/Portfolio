// Inlined next to the shared dialog before the page's content is painted.
function startOpening() {
  const dialog = document.currentScript.previousElementSibling;
  if (typeof dialog.showModal !== 'function') return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let pending = true;
  let historyVisit = performance.getEntriesByType('navigation')[0]?.type === 'back_forward';
  let stop;

  function notify(name, reason) {
    document.dispatchEvent(new CustomEvent('notebook:opening' + name, { bubbles: true, detail: { reason } }));
  }

  // Native fragment navigation may have happened while the rest of the document was inert.
  function focusDestination(previousFocus) {
    if (historyVisit || !location.hash) {
      const destination = previousFocus && previousFocus !== document.body ? previousFocus : document.getElementById('main');
      destination?.focus({ preventScroll: true });
      return;
    }
    let id;
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch {
      return;
    }
    const target = document.getElementById(id);
    if (!target) return;
    if (target.tabIndex < 0 && !target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: 'instant', block: 'start' });
  }

  // The boiler fills the rack to 100, overshoots to 108, lets off steam, ticks a check and lifts away.
  const drums = dialog.querySelectorAll('.loader-drum');
  const machine = dialog.querySelector('.steam-loader');
  function show(value) {
    const shown = Math.round(value);
    machine.style.setProperty('--fill', Math.min(value, 108) / 100);
    String(shown).padStart(3, '0').split('').forEach((digit, index) => drums[index].style.setProperty('--digit', digit));
    dialog.querySelector('.loader-value').textContent = shown + '%';
  }

  function playIfVisible() {
    if (!pending || document.hidden) return;
    pending = false;
    // A visitor who walked in through the workshop doors does not need the boiler again.
    if (motion.matches || location.hash.startsWith('#work-') || document.documentElement.classList.contains('door-arriving')) return;

    const controller = new AbortController();
    const { signal } = controller;
    const previousFocus = document.activeElement;
    const timers = [];
    let frame;
    function finish(reason) {
      if (signal.aborted) return;
      controller.abort();
      timers.forEach(clearTimeout);
      cancelAnimationFrame(frame);
      stop = undefined;
      if (dialog.open) dialog.close();
      machine.classList.remove('loader-overshoot', 'loader-done', 'loader-lift');
      show(0);
      if (reason !== 'pagehide' && !document.hidden) focusDestination(previousFocus);
      notify('end', reason);
    }
    stop = finish;
    function skip(event) {
      event.preventDefault();
      finish('skip');
    }
    // A browser can resolve the URL fragment after the parser opens this dialog,
    // moving focus back to the inert document. Keep the visible skip action reachable.
    function focusSkip() {
      if (!signal.aborted && dialog.open && document.hasFocus() && !dialog.contains(document.activeElement)) {
        dialog.querySelector('.opening-skip').focus({ preventScroll: true });
      }
    }
    dialog.addEventListener('submit', skip, { signal });
    dialog.addEventListener('cancel', skip, { signal });
    dialog.addEventListener('focusout', () => queueMicrotask(focusSkip), { signal });
    window.addEventListener('load', () => requestAnimationFrame(focusSkip), { once: true, signal });

    dialog.showModal();
    notify('start', historyVisit ? 'history' : 'access');
    focusSkip();
    const start = performance.now();
    const ease = x => x < .5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2;
    function tick(now) {
      const t = now - start;
      show(t < 1500 ? ease(t / 1500) * 100 : 100 + 8 * Math.min(1, (t - 1500) / 260));
      if (t < 1760) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    timers.push(setTimeout(() => machine.classList.add('loader-overshoot'), 1500));
    timers.push(setTimeout(() => machine.classList.add('loader-done'), 2050));
    timers.push(setTimeout(() => machine.classList.add('loader-lift'), 2550));
    timers.push(setTimeout(() => finish('complete'), 3050));
  }

  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    historyVisit = true;
    pending = true;
    playIfVisible();
  });
  window.addEventListener('pagehide', () => {
    pending = false;
    stop?.('pagehide');
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop?.('hidden');
    else playIfVisible();
  });
  motion.addEventListener('change', () => {
    if (motion.matches) stop?.('reduced');
  });
  playIfVisible();
}

// Gear outlines are computed once at build time.
function gearPath(cx, cy, r, teeth) {
  const points = [];
  for (let i = 0; i < teeth * 2; i++) {
    const radius = i % 2 ? r * .78 : r;
    for (const side of [-.36, .36]) {
      const angle = (i + side) * Math.PI / teeth;
      points.push((cx + radius * Math.cos(angle)).toFixed(1) + ' ' + (cy + radius * Math.sin(angle)).toFixed(1));
    }
  }
  return 'M' + points.join('L') + 'Z';
}

function gear(className, cx, cy, r, teeth, fill, stroke) {
  return `<g class="${className}" style="transform-origin:${cx}px ${cy}px"><path d="${gearPath(cx, cy, r, teeth)}" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="${cx}" cy="${cy}" r="${(r * .42).toFixed(1)}" fill="none" stroke="${stroke}" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="${(r * .16).toFixed(1)}" fill="#eddaaa" stroke="${stroke}" stroke-width="2"/></g>`;
}

export function renderOpening() {
  const drum = '<span class="loader-drum"><span>0123456789</span></span>';
  return `<dialog class="notebook-opening" aria-label="工房の準備">
    <div class="steam-loader">
      <p class="loader-head" aria-hidden="true"><span lang="en">AMZ / PORTFOLIO</span><span>2026</span></p>
      <div class="loader-body">
        <svg class="loader-machine" viewBox="0 0 260 150" aria-hidden="true" focusable="false">
          ${gear('loader-gear loader-gear--big', 78, 88, 46, 14, '#cba569', '#6f513b')}
          ${gear('loader-gear loader-gear--small', 143, 52, 26, 8, '#8fa597', '#405a50')}
          ${gear('loader-gear loader-gear--tiny', 130, 116, 18, 6, '#cba569', '#6f513b')}
          <g class="loader-gauge"><circle cx="214" cy="66" r="28" fill="#efe6cf" stroke="#8a6a3c" stroke-width="5"/>
            <path d="M195 76A20 20 0 0 1 233 76" fill="none" stroke="#985333" stroke-width="2" stroke-dasharray="1.5 3.5"/><path d="M224 52A15 15 0 0 1 233 68" fill="none" stroke="#b0352a" stroke-width="3.5"/>
            <g class="loader-needle" style="transform-origin:214px 66px"><path d="M214 66L199 56" stroke="#3d3433" stroke-width="2.6" stroke-linecap="round"/></g><circle cx="214" cy="66" r="3.4" fill="#3d3433"/>
            <rect x="209" y="30" width="10" height="9" rx="1.5" fill="#8a6a3c"/></g>
          <g class="loader-steam" fill="none" stroke="#c9c0aa" stroke-width="3" stroke-linecap="round"><path d="M214 28q7-7 0-14q-7-7 0-14"/><path d="M226 30q6-6 0-12"/></g>
        </svg>
        <p class="loader-readout"><span class="loader-label" lang="en">LOADING</span><span class="loader-counter" aria-hidden="true">${drum.repeat(3)}<small>%</small></span><span class="loader-value sr-only">0%</span></p>
        <div class="loader-rack" aria-hidden="true"><span class="loader-fill"></span><span class="loader-stopper"></span>
          <img class="loader-pinion" src="/notebook/gears/brass-12.svg" width="28" height="28" alt=""></div>
        <svg class="loader-check" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><circle cx="20" cy="20" r="17" fill="#efe6cf" stroke="#8a6a3c" stroke-width="3"/><path pathLength="1" d="M12 21l6 6 11-13" fill="none" stroke="#405a50" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <p class="loader-ready">準備完了。工房へどうぞ</p>
      </div>
      <form method="dialog"><button class="opening-skip" autofocus>イントロをスキップ →</button></form>
    </div>
  </dialog><script>(${startOpening.toString()})();</script>`;
}
