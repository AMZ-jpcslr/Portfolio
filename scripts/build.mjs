import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderAbout } from '../site/notebook/about.mjs';
import { renderHome } from '../site/notebook/home.mjs';
import { projectList, renderProject } from '../site/notebook/projects.mjs';

const source = new URL('../site/', import.meta.url);
const output = new URL('../dist/', import.meta.url);
const siteName = '北岡 英磨の制作ノート';
const homeDescription = '北岡英磨の個人開発と研究の制作ノート。8つの作品を実際の画面とともに紹介します。';

export function siteOrigin(env = process.env) {
  const value = env.SITE_URL || 'https://portfolio-amz-jpcslr.vercel.app';
  const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('SITE_URL must be the site origin, e.g. https://portfolio.example.com');
  }
  return url.origin;
}

function escape(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

export function socialMetadata(origin, page = {}) {
  const title = page.title || siteName;
  const description = page.description || homeDescription;
  const image = `${origin}/og-image.png?v=workshop-20261116`;
  const alt = '北岡英磨のポートフォリオ。工房の制作ノートと、からくり修理屋のイラスト。';
  const url = origin + (page.path || '/');
  const og = { title, description, type: 'website', site_name: siteName, locale: 'ja_JP', url, image, 'image:type': 'image/png', 'image:width': '1200', 'image:height': '630', 'image:alt': alt };
  const twitter = { card: 'summary_large_image', title, description, image, 'image:alt': alt };
  return [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}">`,
    ...Object.entries(og).map(([key, value]) => `<meta property="og:${key}" content="${escape(value)}">`),
    ...Object.entries(twitter).map(([key, value]) => `<meta name="twitter:${key}" content="${escape(value)}">`),
    `<link rel="canonical" href="${escape(url)}">`
  ].join('\n    ');
}

export async function buildSocialMetadata() {
  const template = await readFile(new URL('index.html', source), 'utf8');
  const meta = '<!-- notebook-metadata -->';
  const content = '<!-- notebook-content -->';
  if (!template.includes(meta) || !template.includes(content)) throw new Error('Notebook template markers are missing.');
  const origin = siteOrigin();
  await rm(output, { recursive: true, force: true });
  for (const name of ['assets', 'recordings', 'interaction-demos']) {
    await cp(new URL(name + '/', source), new URL(name + '/', output), { recursive: true });
  }
  await cp(new URL('notebook/', source), new URL('notebook/', output), {
    recursive: true,
    filter: from => !from.endsWith('.mjs')
  });
  for (const file of ['fonts.css', 'favicon.svg', 'og-image.png']) {
    await cp(new URL(file, source), new URL(file, output));
  }
  const pages = [
    { path: '/', title: siteName, description: homeDescription, render: renderHome },
    { path: '/about/', title: `経歴とスキル ｜ ${siteName}`, description: '高校・大学・UBC交換留学・現在の4章から、北岡英磨の歩みと制作に使っている技術、資格を紹介します。', render: renderAbout },
    ...projectList.map(project => ({
      path: project.path, title: `${project.title} ｜ ${siteName}`,
      description: project.summary, render: () => renderProject(project.kind)
    }))
  ];
  for (const page of pages) {
    const body = await page.render();
    if (typeof body !== 'string' || !body.trim()) throw new Error(`Missing content for ${page.path}`);
    let html = template.replace(meta, () => socialMetadata(origin, page)).replace(content, () => body);
    if (page.path === '/about/') html = html.replace('<a href="/about/">About Me</a>', '<a href="/about/" aria-current="page">About Me</a>');
    const folder = new URL('.' + page.path, output);
    await mkdir(folder, { recursive: true });
    await writeFile(new URL('index.html', folder), html.replace(/^[ \t]+(?=\r?$)/gm, ''));
  }
  console.log(`Built ${pages.length} static pages at ${origin}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await buildSocialMetadata();
  await import('./check.mjs');
}
