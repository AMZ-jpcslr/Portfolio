import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export function siteOrigin(env = process.env) {
  const value = env.SITE_URL || env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL || 'https://portfolio-amz-jpcslr.vercel.app';
  const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('SITE_URL must be the site origin, e.g. https://portfolio.example.com');
  }
  return url.origin;
}

export function socialMetadata(origin) {
  const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  const title = 'AMZ — Developer Portfolio';
  const description = '日常の不便から、社会の課題まで。個人開発で問題解決の糸口をつくる。';
  const alt = 'AMZの開発ポートフォリオ。日常の不便から社会の課題まで、Discord Bot・防災・配信ツール・AI研究・通信・ロボットサッカー・就活支援の7分野。';
  const image = `${origin}/og-image.png`;
  const og = { title, description, type: 'website', site_name: title, locale: 'ja_JP', url: `${origin}/`, image, 'image:type': 'image/png', 'image:width': '1200', 'image:height': '630', 'image:alt': alt };
  const twitter = { card: 'summary_large_image', title, description, image, 'image:alt': alt };
  return [
    '<!-- social-meta:start -->',
    ...Object.entries(og).map(([key, value]) => `<meta property="og:${key}" content="${escape(value)}">`),
    ...Object.entries(twitter).map(([key, value]) => `<meta name="twitter:${key}" content="${escape(value)}">`),
    `<link rel="canonical" href="${escape(origin)}/">`,
    '<!-- social-meta:end -->'
  ].join('\n  ');
}

export async function buildSocialMetadata() {
  const file = new URL('../dist/index.html', import.meta.url);
  const html = await readFile(file, 'utf8');
  const block = /<!-- social-meta:start -->[\s\S]*?<!-- social-meta:end -->/;
  if (!block.test(html)) throw new Error('Social metadata block missing from index.html');
  const origin = siteOrigin();
  await writeFile(file, html.replace(block, socialMetadata(origin)));
  console.log(`Social sharing image: ${origin}/og-image.png`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await buildSocialMetadata();
  await import('./check.mjs');
}
