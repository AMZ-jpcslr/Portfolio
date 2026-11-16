// Inlined next to the shared dialog before the page's content is painted.
function startOpening() {
  const dialog = document.currentScript.previousElementSibling;
  if (typeof dialog.showModal !== 'function') return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 700px)');
  const image = dialog.querySelector('img');
  let pending = true;
  let historyVisit = performance.getEntriesByType('navigation')[0]?.type === 'back_forward';
  let restored = false;
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

  async function playIfVisible() {
    if (!pending || document.hidden) return;
    pending = false;
    if (motion.matches) return;

    const controller = new AbortController();
    const { signal } = controller;
    const previousFocus = document.activeElement;
    let timer;
    let objectUrl;
    function finish(reason) {
      if (signal.aborted) return;
      controller.abort();
      clearTimeout(timer);
      stop = undefined;
      if (dialog.open) dialog.close();
      dialog.classList.remove('opening-ready', 'opening-finished');
      image.removeAttribute('src');
      if (objectUrl) URL.revokeObjectURL(objectUrl);
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
    image.addEventListener('error', () => finish('unavailable'), { signal });
    image.addEventListener('load', () => {
      clearTimeout(timer);
      dialog.classList.add('opening-ready');
      focusSkip();
      // The animation includes the final 500 ms hold after the character falls.
      timer = setTimeout(() => {
        dialog.classList.add('opening-finished');
        timer = setTimeout(() => finish('complete'), 160);
      }, 2755);
    }, { once: true, signal });

    dialog.showModal();
    notify('start', historyVisit ? 'history' : 'access');
    // Allow a cold mobile download; the skip button remains active throughout.
    timer = setTimeout(() => finish('unavailable'), 4500);
    try {
      const path = mobile.matches ? '/assets/opening/sp.webp?v=paper-2' : '/assets/opening/pc.webp?v=paper-2';
      if (!restored) {
        image.src = path;
        return;
      }
      const response = await fetch(path, { signal, priority: 'high' });
      if (!response.ok) throw new Error('Opening image unavailable');
      const blob = await response.blob();
      if (signal.aborted) return;
      // A fresh image identity restarts the single-play artwork on a history restoration.
      // The underlying HTTP URL stays stable and can be reused from the browser cache.
      objectUrl = URL.createObjectURL(blob);
      image.src = objectUrl;
    } catch {
      finish('unavailable');
    }
  }

  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    historyVisit = true;
    restored = true;
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
  mobile.addEventListener('change', () => stop?.('resize'));
  playIfVisible();
}

export function renderOpening() {
  return `<dialog class="notebook-opening" aria-label="からくり修理屋のイントロ">
    <div class="opening-stage">
      <img alt="" fetchpriority="high">
      <form method="dialog"><button class="opening-skip" autofocus>イントロをスキップ →</button></form>
    </div>
  </dialog><script>(${startOpening.toString()})();</script>`;
}
