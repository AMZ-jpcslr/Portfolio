export function renderGearPair() {
  return `<span class="gear-pair" data-gears aria-hidden="true">
    <img class="gear-wheel gear-wheel--brass" src="/notebook/gears/brass-12.svg" width="96" height="96" alt="">
    <img class="gear-wheel gear-wheel--green" src="/notebook/gears/green-8.svg" width="68" height="68" alt="">
  </span>`;
}

export function renderGearRule() {
  return `<span class="gear-rule" aria-hidden="true">${renderGearPair()}</span>`;
}
