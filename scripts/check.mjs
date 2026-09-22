import { readFile, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { projects } from '../dist/projects.js';
import { captions, renderDemoScene } from '../dist/demos.js';
const root=path.resolve(fileURLToPath(new URL('../',import.meta.url)));
const html=await readFile(path.join(root,'dist/index.html'),'utf8');
const expected=['Yomiage_Discord_Bot','Shindo_Discord_Bot','Streaming-Screen','Artificial-Moral-Architecture','ssl-inspection-prodxy','SSL-DEMO'];
assert.deepEqual(projects.map(p=>p.id).sort(),expected.sort());
assert.equal(new Set(projects.map(p=>p.id)).size,6);
for(const project of projects){
  for(const field of ['title','summary','challenge','engineering','demoNote','audience','impact'])assert.ok(project[field]?.length, `${project.id}: missing ${field}`);
  assert.equal(project.steps.length,3);
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
assert.ok(!html.includes('全7件'));
for(const match of html.matchAll(/(?:src|href)="\.\/([^"]+)"/g))assert.ok((await stat(path.join(root,'dist',match[1]))).size>0);
for(const match of html.matchAll(/href="#project=([^"]+)"/g))assert.ok(projects.some(p=>p.id===match[1]));
for(const file of ['dist/app.js','dist/projects.js','dist/demos.js','scripts/serve.mjs','scripts/build.mjs'])execFileSync(process.execPath,['--check',path.join(root,file)],{stdio:'pipe'});
const vercel=JSON.parse(await readFile(path.join(root,'vercel.json'),'utf8'));
assert.equal(vercel.outputDirectory,'dist');assert.equal(vercel.buildCommand,'npm run build');
// The browser runs all actors on one continuous CSS clock; there are no JS step timers.
const app = await readFile(path.join(root,'dist/app.js'),'utf8');
const css = await readFile(path.join(root,'dist/demos.css'),'utf8');
assert.ok(!app.includes('demo-next') && !app.includes('DemoTimeline'));
assert.ok(!app.includes('setTimeout') && !app.includes('data-step'));
assert.ok(css.includes('--sequence-duration:18.6s'));
for(const name of ['continuous-ball','continuous-speaking','continuous-output','continuous-decision','continuous-log-three','continuous-camera-weather'])assert.ok(css.includes('@keyframes '+name));
console.log('PASS: 6 projects, usage stories, shared continuous animation scenes, 6-v-6, links, JS syntax, Vercel configuration and no step controls/timers.');

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
