import { readFile, writeFile, cp, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { projects as existingProjects } from '../dist/projects.js';

export function siteOrigin(env = process.env) {
  const value = env.SITE_URL || env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL || 'https://portfolio-amz-jpcslr.vercel.app';
  const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('SITE_URL must be the site origin, e.g. https://portfolio.example.com');
  }
  return url.origin;
}

export function socialMetadata(origin, page = {}) {
  const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  const title = page.title || 'Kitaoka Yoma / AMZ — Notes & Works';
  const description = page.description || '社会や身近な問題に取り組む、個人開発と研究の記録。8作品の目的、設計、結果と現状を紹介します。';
  const alt = 'Kitaoka Yomaの個人開発と研究のポートフォリオ。';
  const image = `${origin}/og-image.png`;
  const pageUrl = origin + (page.path || '/');
  const og = { title, description, type: 'website', site_name: 'AMZ / Notes & Works', locale: 'ja_JP', url: pageUrl, image, 'image:type': 'image/png', 'image:width': '1200', 'image:height': '630', 'image:alt': alt };
  const twitter = { card: 'summary_large_image', title, description, image, 'image:alt': alt };
  return [
    '<!-- social-meta:start -->',
    ...Object.entries(og).map(([key, value]) => `<meta property="og:${key}" content="${escape(value)}">`),
    ...Object.entries(twitter).map(([key, value]) => `<meta name="twitter:${key}" content="${escape(value)}">`),
    `<link rel="canonical" href="${escape(pageUrl)}">`,
    '<!-- social-meta:end -->'
  ].join('\n  ');
}

export async function buildSocialMetadata() {
  const file = new URL('../dist/index.html', import.meta.url);
  const html = await readFile(new URL('../site/index.html', import.meta.url), 'utf8');
  const block = /<!-- social-meta:start -->[\s\S]*?<!-- social-meta:end -->/;
  if (!block.test(html)) throw new Error('Social metadata block missing from index.html');
  const origin = siteOrigin();
  for (const folder of ['music','assets','recreation']) await cp(new URL(`../site/${folder}/`, import.meta.url), new URL(`../dist/${folder}/`, import.meta.url), {recursive:true});
  await writeFile(file, html.replace(block, socialMetadata(origin)));
  const pages = [{kind:'mania',title:'まにあう',summary:'いつもの駅で、今乗れる電車の時刻をひと目で判断するための個人開発。'},...existingProjects];
  for(const page of pages){
    const folder=new URL(`../dist/projects/${page.kind}/`,import.meta.url);await mkdir(folder,{recursive:true});
    const title=`${page.title} — AMZ / Notes & Works`, escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
    await writeFile(new URL('index.html',folder),html.replace(block,socialMetadata(origin,{title,description:page.summary,path:`/projects/${page.kind}/`})).replace(/<title>[^<]*<\/title>/,`<title>${escape(title)}</title>`));
  }
  console.log(`Social sharing image: ${origin}/og-image.png`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await buildSocialMetadata();
  await import('./check.mjs');
}
