import { readFile, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { projects } from '../dist/projects.js';
import { captions, renderDemoFrame } from '../dist/demos.js';

const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const html = await readFile(path.join(root, 'dist/index.html'), 'utf8');
const expected = ['Yomiage_Discord_Bot', 'Shindo_Discord_Bot', 'Streaming-Screen', 'Artificial-Moral-Architecture', 'ssl-inspection-prodxy', 'SSL-DEMO', 'Portfolio'];
assert.deepEqual(projects.map(p => p.id).sort(), expected.sort(), 'All seven public repositories must be present');
assert.equal(new Set(projects.map(p => p.id)).size, projects.length, 'Duplicate project IDs');
for (const project of projects) {
  for (const field of ['title', 'summary', 'challenge', 'engineering', 'demoNote']) {
    assert.ok(typeof project[field] === 'string' && project[field].length > 0, `${project.id}: missing ${field}`);
  }
  assert.equal(typeof project.audience, 'string', 'Audience must be editable text');
  assert.equal(project.steps.length, 3, 'Every demo must have three steps');
  assert.equal(captions[project.kind].length, 3, 'Every step must have a caption');
  const frames = [0, 1, 2].map(step => renderDemoFrame(project, step));
  assert.equal(new Set(frames).size, 3, `${project.id}: duplicate demo frames`);
  for (const frame of frames) {
    assert.ok(frame.includes('demo-frame'), 'Missing frame animation wrapper');
    assert.ok(!/undefined|NaN|<script/i.test(frame), 'Invalid demo markup');
  }
  assert.throws(() => renderDemoFrame(project, -1), RangeError);
  assert.throws(() => renderDemoFrame(project, 3), RangeError);
}
for (const match of html.matchAll(/(?:src|href)="\.\/([^"]+)"/g)) {
  assert.ok((await stat(path.join(root, 'dist', match[1]))).size > 0, `Missing asset ${match[1]}`);
}
for (const match of html.matchAll(/href="#project=([^"]+)"/g)) {
  assert.ok(projects.some(p => p.id === match[1]), `Unknown linked project: ${match[1]}`);
}
for (const file of ['dist/app.js', 'dist/projects.js', 'dist/demos.js', 'scripts/serve.mjs']) {
  execFileSync(process.execPath, ['--check', path.join(root, file)], { stdio: 'pipe' });
}
const vercel = JSON.parse(await readFile(path.join(root, 'vercel.json'), 'utf8'));
assert.equal(vercel.outputDirectory, 'dist');
assert.equal(vercel.buildCommand, 'npm run build');
console.log('PASS: 7 repositories, 21 distinct demo frames, step bounds, local assets, links, JavaScript syntax and Vercel configuration.');
