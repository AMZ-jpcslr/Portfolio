// Inlined immediately after the homepage dialog so the first paint can show the artwork.
function startOpening() {
  const dialog = document.currentScript.previousElementSibling;
  const navigation = performance.getEntriesByType('navigation')[0];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (typeof dialog.showModal !== 'function' || navigation?.type !== 'navigate' ||
      location.pathname !== '/' || location.hash || location.search || motion.matches || document.hidden) return;
  if (document.referrer && new URL(document.referrer).origin === location.origin) return;
  try {
    if (sessionStorage.getItem('workshop-intro-seen')) return;
    sessionStorage.setItem('workshop-intro-seen', '1');
  } catch {
    // If storage is disabled, navigation type and referrer still guard returns.
  }

  const mobile = matchMedia('(max-width: 700px)');
  const image = dialog.querySelector('img');
  const listeners = new AbortController();
  const options = { signal: listeners.signal };
  let timer;
  function finish() {
    if (dialog.open) dialog.close();
  }
  dialog.addEventListener('close', () => {
    clearTimeout(timer);
    listeners.abort();
    image.removeAttribute('src');
    if (!location.hash && !document.hidden) document.getElementById('main').focus({ preventScroll: true });
  }, { once: true });
  motion.addEventListener('change', finish, options);
  mobile.addEventListener('change', finish, options);
  window.addEventListener('pagehide', finish, options);
  window.addEventListener('hashchange', finish, options);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) finish();
  }, options);
  image.addEventListener('error', finish, options);
  image.addEventListener('load', () => {
    if (!dialog.open) return;
    clearTimeout(timer);
    dialog.classList.add('opening-ready');
    // The exported animation includes the 500 ms hold after the character falls.
    timer = setTimeout(() => {
      dialog.classList.add('opening-finished');
      timer = setTimeout(finish, 160);
    }, 2755);
  }, options);

  dialog.showModal();
  timer = setTimeout(finish, 900);
  image.src = mobile.matches ? '/assets/opening/sp.webp' : '/assets/opening/pc.webp';
}

export function renderOpening() {
  return `<dialog class="notebook-opening" aria-label="からくり修理屋のイントロ">
    <div class="opening-stage">
      <img alt="" fetchpriority="high">
      <form method="dialog"><button class="opening-skip" autofocus>イントロをスキップ →</button></form>
    </div>
  </dialog><script>(${startOpening.toString()})();</script>`;
}
