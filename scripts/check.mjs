import { readFile, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { projects } from '../dist/projects.js';
import { captions, renderDemoScene } from '../dist/demos.js';
import { films, filmDuration } from '../dist/films.js';
import { renderCaseOverview, renderCaseStudy } from '../dist/case-study.js';
const root=path.resolve(fileURLToPath(new URL('../',import.meta.url)));
const html=await readFile(path.join(root,'dist/index.html'),'utf8');
const expected=['Yomiage_Discord_Bot','Shindo_Discord_Bot','Streaming-Screen','Artificial-Moral-Architecture','ssl-inspection-prodxy','SSL-DEMO','Syukatu-Note'];
assert.deepEqual(projects.map(p=>p.id).sort(),expected.sort());
assert.equal(new Set(projects.map(p=>p.id)).size,7);
for(const project of projects){
  for(const field of ['title','summary','challenge','engineering','demoNote','audience','impact'])assert.ok(project[field]?.length, `${project.id}: missing ${field}`);
  assert.equal(project.steps.length,3);
  const c = project.caseStudy;
  assert.ok(c?.focus && c.process.length === 3, `${project.id}: missing design process`);
  for (const stage of c.process) assert.ok(stage.title && stage.body);
  for (const field of ['choice','reason','tradeoff']) assert.ok(c.decision[field]);
  assert.ok(c.role.scope && c.role.collaboration && c.ai.human && c.ai.assistant);
  const caseHtml = renderCaseOverview(project) + renderCaseStudy(project);
  assert.ok(!/undefined|NaN/.test(caseHtml));
  for (const label of ['課題設定','検討プロセス','意思決定','担当範囲','AIの活用方法']) assert.ok(caseHtml.includes(label));
  assert.equal(captions[project.kind].length,3);
  const scene=renderDemoScene(project);
  assert.ok(scene.includes('scene-camera') && scene.includes('scene-viewport continuous'));
  assert.ok(!/undefined|NaN|<script/.test(scene));
  if(project.kind==='voice')assert.ok(scene.includes('vc-bot') && scene.includes('speaker-avatar'));
  if(project.kind==='soccer'){
    assert.equal((scene.match(/class="robot blue-team/g)||[]).length,6);
    assert.equal((scene.match(/class="robot red-team/g)||[]).length,6);
    assert.ok(scene.includes('score-cells'));
  }
}
assert.ok(projects.find(p=>p.kind==='moral').outlook.includes('既存のAIモデル'));
assert.ok(!html.includes('あったらいいな'));
assert.ok(html.includes('7つの個人開発'));
for(const match of html.matchAll(/(?:src|href)="\.\/([^"]+)"/g))assert.ok((await stat(path.join(root,'dist',match[1]))).size>0);
for(const match of html.matchAll(/href="#project=([^"]+)"/g))assert.ok(projects.some(p=>p.id===match[1]));
for(const file of ['dist/app.js','dist/page-motion.js','dist/projects.js','dist/demos.js','dist/films.js','dist/case-study.js','scripts/serve.mjs','scripts/build.mjs'])execFileSync(process.execPath,['--check',path.join(root,file)],{stdio:'pipe'});
const vercel=JSON.parse(await readFile(path.join(root,'vercel.json'),'utf8'));
assert.equal(vercel.outputDirectory,'dist');assert.equal(vercel.buildCommand,'npm run build');
// The browser runs all actors on one continuous CSS clock; there are no JS step timers.
const app = await readFile(path.join(root,'dist/app.js'),'utf8');
const css = await readFile(path.join(root,'dist/demos.css'),'utf8');
assert.ok(!app.includes('demo-next') && !app.includes('DemoTimeline'));
assert.ok(!app.includes('setTimeout') && !app.includes('data-step'));
assert.ok(css.includes('--sequence-duration:24s'));
assert.equal(filmDuration,24);
const filmCss = await readFile(path.join(root,'dist/films.css'),'utf8');
for(const p of projects) {
  assert.equal(films[p.kind].chapters.length,3);
  const scene=renderDemoScene(p);
  for(const hook of ['film-intro','film-stage','film-chapters','film-outro']) assert.ok(scene.includes(hook));
}
assert.ok(app.includes('getAnimations({subtree:true})') && app.includes('clearInterval(this.clockTimer)'));
assert.ok(filmCss.includes('prefers-reduced-motion:reduce'));
assert.ok(renderDemoScene(projects.find(p=>p.kind==='career')).includes('ES・面接記録は公開されません'));

for(const name of ['continuous-ball','continuous-speaking','continuous-output','continuous-decision','continuous-log-three','continuous-camera-weather'])assert.ok(css.includes('@keyframes '+name));
console.log('PASS: 7 projects, usage stories, cinematic films and synchronized seeking, 6-v-6, links, JS syntax, Vercel configuration and no step controls/timers.');

// Sharing crawlers must find a public image in the initial HTML, without JS.
const meta = name => html.match(new RegExp(`<meta (?:property|name)="${name}" content="([^"]+)"`))?.[1];
const imageUrl = new URL(meta('og:image'));
assert.equal(imageUrl.protocol, 'https:');
assert.equal(imageUrl.pathname, '/og-image.png');
assert.equal(meta('twitter:image'), meta('og:image'));
assert.equal(meta('twitter:card'), 'summary_large_image');
const png = await readFile(path.join(root,'dist/og-image.png'));
assert.equal(png.subarray(0,8).toString('hex'), '89504e470d0a1a0a');
assert.equal(png.readUInt32BE(16), Number(meta('og:image:width')));
assert.equal(png.readUInt32BE(20), Number(meta('og:image:height')));
assert.ok(meta('og:image:alt'));
console.log('PASS: public OGP / X image URLs and PNG dimensions.');

const readme = await readFile(path.join(root,'README.md'),'utf8');
const images = [...readme.matchAll(/!\[[^\]]*\]\((docs\/images\/[^)]+)\)/g)];
assert.ok(images.length >= 4);
for (const [,imagePath] of images) {
  const data = await readFile(path.join(root,imagePath));
  assert.equal(data.subarray(0,3).toString('hex'),'ffd8ff');
  assert.ok(data.length > 1024);
}
const unsafe = structuredClone(projects[0]);
unsafe.caseStudy.decision.reason = '<img src=x onerror=alert(1)>';
assert.ok(renderCaseStudy(unsafe).includes('&lt;img'));
assert.ok(!renderCaseStudy(unsafe).includes('<img'));
console.log('PASS: all case studies, design ownership, escaped content and README screenshots.');
