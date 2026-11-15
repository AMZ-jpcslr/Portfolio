import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const dist = new URL('../dist/', import.meta.url);
const notebookSource = new URL('../site/notebook/', import.meta.url);
const kinds = ['mania', 'career', 'stream', 'voice', 'weather', 'moral', 'proxy', 'soccer'];
const routes = ['/', '/about/', ...kinds.map(kind => `/projects/${kind}/`)];
const ids = new Map();
const links = [];
const pages = new Map();
let origin;
for (const pathname of routes) {
  const html = await readFile(new URL('.' + pathname + 'index.html', dist), 'utf8');
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.ok(canonical, `Missing canonical on ${pathname}`);
  const url = new URL(canonical);
  origin ??= url.origin;
  assert.equal(url.origin, origin);
  assert.equal(url.pathname, pathname);
  assert.ok(html.includes(`property="og:url" content="${url.href}"`));
  assert.ok(html.includes(`property="og:image" content="${origin}/og-image.png?v=workshop-20261116"`));
  assert.match(html, /<html lang="ja">/);
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /<main id="main"[^>]*>[\s\S]*?<h1\b/, `Content must be rendered without JavaScript on ${pathname}`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `Invalid primary heading count on ${pathname}`);
  assert.equal(html.includes('<dialog class="notebook-opening"'), pathname === '/', `Unexpected opening placement on ${pathname}`);
  assert.doesNotMatch(html, /<!-- notebook-content -->|採用担当の方へ|href="[^"]*#search"|role="search"|id="search"/);
  const pageIds = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(pageIds).size, pageIds.length, `Duplicate id on ${pathname}`);
  ids.set(pathname, new Set(pageIds));
  for (const tag of html.matchAll(/<img\b[^>]*>/g)) assert.match(tag[0], /\salt="[^"]*"/, `Image missing alt on ${pathname}`);
  for (const attr of html.matchAll(/\s(?:href|src|poster)="([^"]+)"/g)) links.push([url, attr[1]]);
  pages.set(pathname, html);
}

// Check all local static resources and every on-page anchor used by the navigation.
const checkedFiles = new Set();
for (const [page, target] of links) {
  const url = new URL(target.replaceAll('&amp;', '&'), page);
  if (url.origin !== origin) continue;
  if (ids.has(url.pathname) && url.hash) {
    assert.ok(ids.get(url.pathname).has(decodeURIComponent(url.hash.slice(1))), `Unresolved anchor at ${page.pathname}: ${target}`);
  }
  const filename = url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname;
  if (checkedFiles.has(filename)) continue;
  assert.ok((await stat(new URL('.' + filename, dist))).isFile(), `Missing file at ${page.pathname}: ${target}`);
  checkedFiles.add(filename);
}
for (const kind of kinds) assert.ok(pages.get('/').includes(`href="/projects/${kind}/"`), `Missing work link: ${kind}`);
assert.doesNotMatch(pages.get('/'), /この夢に向けた一歩として/);
for (const variant of ['pc', 'sp']) {
  const asset = await readFile(new URL(`assets/opening/${variant}.webp`, dist));
  assert.equal(asset.toString('ascii', 8, 12), 'WEBP');
  assert.ok(asset.includes(Buffer.from('ANIM')) && asset.includes(Buffer.from('ANMF')), `Missing animation for ${variant}`);
}
const aboutText = pages.get('/about/').replace(/<[^>]+>/g, '').replaceAll('&amp;', '&').replace(/\s+/g, '');
for (const label of ['UBC', 'MATLAB', 'TOEIC Listening & Reading 公開テスト 905点', '2026年10月25日受験', 'TOEFL iBT 72点', '2025年7月', '実用英語技能検定準1級', '日商簿記検定3級']) {
  assert.ok(aboutText.includes(label.replace(/\s+/g, '')), `Missing About Me information: ${label}`);
}
for (const [pathname, html] of pages) {
  assert.doesNotMatch(html, /TOEIC[^<]{0,100}\bIP\b|(?:875|885)\s*点/, `Stale qualification on ${pathname}`);
}
const css = await readFile(new URL('style.css', notebookSource), 'utf8');
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /:focus-visible/);

// Keep generated assets in lockstep with their public source, including illustrations.
async function verifyAssets(relative = '') {
  const folder = new URL(relative, notebookSource);
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const name = relative + entry.name;
    if (entry.isDirectory()) await verifyAssets(name + '/');
    else if (!entry.name.endsWith('.mjs')) {
      const [sourceBytes, distBytes] = await Promise.all([readFile(new URL(name, notebookSource)), readFile(new URL('notebook/' + name, dist))]);
      assert.ok(sourceBytes.equals(distBytes), `Stale asset: ${name}`);
    }
  }
}
await verifyAssets();
console.log(`PASS: ${routes.length} static notebook routes, metadata, local assets, anchors, labels and source parity in ${fileURLToPath(dist)}.`);
