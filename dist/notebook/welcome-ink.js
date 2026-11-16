// Centerlines for the two-line greeting. Each pen lift starts a separate stroke.
// Coordinates run from 0 to 100 across each letter's own ink bounds.
const strokes = {
  W: ['M3 4 L27 95 L49 10', 'M48 5 L74 95 L96 5'],
  e: ['M10 56 L90 48 C89 19 71 4 52 6 C18 6 8 32 10 56 C12 88 41 99 61 94 Q80 91 93 76'],
  l: ['M36 5 L52 5 L52 94 M21 95 L78 95'],
  c: ['M85 20 C72 1 48 3 30 16 C3 33 4 72 23 87 C41 102 72 99 93 77'],
  o: ['M52 6 C23 4 8 24 9 51 C10 80 27 96 52 95 C79 95 92 72 91 47 C90 22 77 7 52 6'],
  m: ['M5 7 L11 8 L11 93', 'M11 39 Q19 0 37 8 Q49 12 49 35 L49 92', 'M49 39 Q61 -1 77 8 Q90 11 90 37 L90 93'],
  t: ['M51 6 L47 77 Q48 107 92 83', 'M10 33 L92 33'],
  y: ['M4 6 L52 65', 'M92 6 L48 71 Q30 99 12 92'],
  p: ['M3 7 L19 7 L19 94', 'M19 21 Q40 -2 67 7 C104 18 99 52 75 63 Q49 74 20 62'],
  r: ['M6 9 L22 7 L22 92', 'M22 46 Q45 4 70 8 Q83 8 88 18'],
  f: ['M91 8 Q61 -2 49 23 L26 91 Q17 99 5 94', 'M20 38 L81 38'],
  i: ['M30 36 L52 36 L53 93 L80 93', 'M52 9 l1 1'],
  s: ['M87 18 Q76 4 52 7 C22 5 8 24 19 40 C36 58 70 52 83 70 C97 91 43 108 9 84'],
  '.': ['M49 49 l2 2'],
};

const inkWidth = { W: 19, m: 22, i: 64, l: 64, '.': 140 };
const svgNS = 'http://www.w3.org/2000/svg';
const lineDuration = 800;
const lineBreak = 50;

function svgElement(name, attributes) {
  const element = document.createElementNS(svgNS, name);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  return element;
}

function strokeMask(id, letter, box, italic, start, duration) {
  const mask = svgElement('mask', { id, maskUnits: 'userSpaceOnUse', x: box.x - 1, y: box.y - 1, width: box.w + 2, height: box.h + 2 });
  const pen = svgElement('g', { transform: 'translate(' + box.x + ' ' + box.y + ') scale(' + box.w / 100 + ' ' + box.h / 100 + ')' });
  const tracks = svgElement('g', {
    transform: italic ? 'matrix(.82 0 -.18 1 18 0)' : 'none',
    fill: 'none', stroke: 'white', 'stroke-width': inkWidth[letter] ?? 32,
    'stroke-linecap': 'round', 'stroke-linejoin': 'round',
  });
  const paths = strokes[letter];
  paths.forEach((d, index) => {
    const path = svgElement('path', { d, pathLength: 1, class: 'ink-trace' });
    path.style.setProperty('--start', start + index * duration / paths.length + 'ms');
    path.style.setProperty('--duration', duration / paths.length + 'ms');
    tracks.append(path);
  });
  // Let the last traces of ink spread into the glyph's fine serifs.
  const finish = svgElement('rect', { width: 100, height: 100, fill: 'white', class: 'ink-finish' });
  finish.style.setProperty('--start', start + duration * .88 + 'ms');
  pen.append(tracks, finish);
  mask.append(pen);
  return mask;
}

function renderLettering(heading) {
  const bounds = heading.getBoundingClientRect();
  const canvas = document.createElement('canvas').getContext('2d');
  if (!canvas || !bounds.width || !bounds.height) return null;
  const svg = svgElement('svg', { class: 'ink-lettering', 'aria-hidden': 'true', focusable: 'false', viewBox: '0 0 ' + bounds.width + ' ' + bounds.height, preserveAspectRatio: 'none' });
  const ending = svgElement('g', { class: 'ink-final-word' });
  const endingMasks = svgElement('defs', {});
  ending.append(endingMasks);
  let lastLine;
  let endingDuration;
  const lines = [...heading.querySelectorAll('span')];
  if (lines.some(line => [...line.textContent].some(letter => letter !== ' ' && !strokes[letter]))) return null;
  const range = document.createRange();
  for (const [row, line] of lines.entries()) {
    const content = line.firstChild;
    const font = getComputedStyle(line);
    const probe = document.createElement('i');
    probe.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
    line.append(probe);
    const baseline = probe.getBoundingClientRect().top - bounds.top;
    probe.remove();
    canvas.font = [font.fontStyle, font.fontWeight, font.fontSize, font.fontFamily].join(' ');
    const group = svgElement('g', { fill: font.color, 'font-family': font.fontFamily, 'font-size': font.fontSize, 'font-style': font.fontStyle, 'font-weight': font.fontWeight });
    const definitions = svgElement('defs', {});
    const duration = lineDuration / content.length;
    const lastWord = content.data.lastIndexOf(' ') + 1;
    for (let i = 0; i < content.length; i++) {
      const letter = content.data[i];
      if (letter === ' ') continue;
      range.setStart(content, i);
      range.setEnd(content, i + 1);
      const x = range.getBoundingClientRect().left - bounds.left;
      const m = canvas.measureText(letter);
      const box = { x: x - m.actualBoundingBoxLeft, y: baseline - m.actualBoundingBoxAscent, w: m.actualBoundingBoxLeft + m.actualBoundingBoxRight, h: m.actualBoundingBoxAscent + m.actualBoundingBoxDescent };
      const id = 'welcome-stroke-' + row + '-' + i;
      const isEnding = row === lines.length - 1 && i >= lastWord;
      const start = isEnding ? (i - lastWord) * duration : row * (lineDuration + lineBreak) + i * duration;
      const masks = isEnding ? endingMasks : definitions;
      masks.append(strokeMask(id, letter, box, row === 1, start, duration));
      const glyph = svgElement('text', { x, y: baseline, mask: 'url(#' + id + ')' });
      glyph.textContent = letter;
      (isEnding ? ending : group).append(glyph);
    }
    svg.append(definitions, group);
    lastLine = group;
    endingDuration = (content.length - lastWord) * duration;
  }
  return { svg, lastLine, ending, endingDuration };
}

export function introduceWelcome() {
  const cover = document.querySelector('.welcome');
  if (!cover) return;
  const heading = cover.querySelector('h1');
  const working = cover.querySelector('.portrait-working');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let visit = 0;
  function showStatic() {
    visit++;
    cover.classList.remove('welcome-writing', 'welcome-finishing');
    heading.parentElement.querySelector('.ink-lettering')?.remove();
  }
  function arrive() {
    showStatic();
    if (reduced.matches || document.hidden || location.hash) return;
    const lettering = renderLettering(heading);
    if (!lettering) return;
    const currentVisit = visit;
    const started = performance.now();
    heading.after(lettering.svg);
    cover.classList.add('welcome-writing');
    // Even on a slow connection, "Welcome to my portfolio" writes immediately.
    // The final word and underline share a finish with the decoded portrait.
    function finishTogether() {
      if (currentVisit !== visit) return;
      const remaining = 2 * lineDuration + lineBreak - (performance.now() - started);
      // With the 130ms underline, even a late portrait gets a full 600ms fade.
      const untilUnderline = Math.max(470, lettering.endingDuration, remaining);
      cover.style.setProperty('--underline-start', untilUnderline + 'ms');
      cover.style.setProperty('--ending-duration', lettering.endingDuration + 'ms');
      lettering.lastLine.append(lettering.ending);
      cover.classList.add('welcome-finishing');
    }
    working.decode().then(finishTogether, finishTogether);
  }
  cover.addEventListener('animationend', event => {
    if (event.animationName === 'ink-underline') showStatic();
  });
  document.addEventListener('notebook:openingstart', showStatic);
  document.addEventListener('notebook:openingend', arrive);
  reduced.addEventListener('change', showStatic);
  window.addEventListener('pagehide', showStatic);
  if (!document.querySelector('.notebook-opening[open]')) arrive();
}
