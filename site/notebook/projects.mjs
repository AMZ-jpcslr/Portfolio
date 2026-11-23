import { narratives } from '../data/author-narratives.js';
import { insights } from '../data/case-insights.js';
import { renderGearRule } from './gears.mjs';

const catalogue = [
  {
    kind: 'mania', title: 'まにあう', category: '交通アプリ', device: 'phone', repo: 'train_time',
    summary: '歩く時間も含めて、次に乗れる電車が分かるアプリ。',
    image: '/assets/works/mania.webp', thumb: '/assets/works/mania-mobile.webp',
    alt: '駅と方面を選び、発車時刻と徒歩時間の目安を確認する画面',
    caption: '公開版の画面。駅と方面を選ぶと、発車が近い順に電車が並びます。',
    tags: ['React', 'TypeScript', 'Vite'], live: 'https://train-time-three.vercel.app/',
    clipCaption: '駅を検索して、徒歩時間を確かめるところ。位置情報はテスト用の値です。'
  },
  {
    kind: 'career', title: 'しゅうかつ手帳', category: '就活カレンダー', device: 'laptop', repo: 'Syukatu-Note',
    summary: '就活の締切と選考日程をまとめるカレンダー。',
    image: '/assets/works/career.webp', alt: '応募の締切や選考の予定をまとめたカレンダー',
    caption: 'カレンダー画面。表示している応募予定はデモ用です。',
    tags: ['Next.js', 'TypeScript', 'Supabase'], live: 'https://syukatu-note.vercel.app/',
    clipCaption: 'デモモードで、架空の日程を開いているところ。'
  },
  {
    kind: 'stream', title: 'Streaming Screen', category: '配信ツール', device: 'monitor', repo: 'Streaming-Screen',
    summary: 'OBSの配信画面を、画面上で組み立てるエディター。',
    image: '/assets/works/stream.webp', alt: 'レイヤー、キャンバス、選択中の要素の設定が並ぶ配信画面エディター',
    caption: '編集画面。左でレイヤーを選び、中央のキャンバスで位置を調整します。',
    tags: ['JavaScript', 'Node.js', 'OBS'],
    clipCaption: 'タイトルの位置を動かし、元に戻してから保存するところ。'
  },
  {
    kind: 'voice', title: 'Yomiage Bot', category: '読み上げBot', device: 'laptop', repo: 'Yomiage_Discord_Bot',
    summary: 'Discordの文章を、ボイスチャットで読み上げるBot。',
    image: '/interaction-demos/media/voice.jpg', alt: '説明用に再現したDiscord画面で、読み上げコマンドと投稿を示す',
    caption: 'Discordの画面を再現したデモです。ユーザー名と会話は架空です。',
    mediaType: '操作例（再現）', tags: ['TypeScript', 'VOICEVOX', 'DeepL'],
    clipCaption: 'ボイスチャンネルに参加して投稿するまでの流れを再現しています。音声は入っていません。'
  },
  {
    kind: 'weather', title: 'Shindo Bot', category: '防災通知Bot', device: 'tablet', repo: 'Shindo_Discord_Bot',
    summary: '地震や気象の情報を、Discordに知らせるBot。',
    image: '/assets/works/weather.webp', alt: '関東の地図に雨雲と千代田区付近の白丸を重ねたBotの出力画像',
    caption: '2026年9月22日にBotが生成した雨雲レーダーの保存画像。雨雲は気象庁、背景は地理院タイル。',
    mediaType: 'Botの出力画像', tags: ['TypeScript', 'WebSocket', '気象データ'],
    clipCaption: '通知先と震度の条件を設定するところ。地震情報とDiscordの画面は再現です。'
  },
  {
    kind: 'moral', title: 'Artificial Moral Architecture', category: '個人研究', device: 'laptop', repo: 'Artificial-Moral-Architecture',
    summary: '行動する前に、周りへの影響を評価するAIの研究。',
    image: '/recordings/media/moral.jpg', alt: '合成シナリオの判断結果を出力したPython CLIの実行画面',
    caption: '合成シナリオを入力したときのCLI出力。判断の過程が順に表示されます。',
    tags: ['Python', '行動判断', 'Dry Run'],
    clipCaption: '合成シナリオを入力し、判断結果とJSON出力を確かめるところ。'
  },
  {
    kind: 'proxy', title: 'Inspection Proxy', category: '通信検査ツール', device: 'monitor', repo: 'ssl-inspection-prodxy',
    summary: '通信の中身を検査し、ログで確かめられるツール。',
    image: '/recordings/media/proxy.jpg', alt: 'テスト用の通信ログと検出結果を表示した管理ダッシュボード',
    caption: '管理画面。ローカルで流したテスト用の通信のログを表示しています。',
    tags: ['JavaScript', 'Node.js', 'Docker'],
    clipCaption: '合成データを使い、管理画面でログを絞り込むところ。'
  },
  {
    kind: 'soccer', title: 'SSL Robot AI', category: '2Dシミュレーション', device: 'monitor', repo: 'SSL-DEMO',
    summary: 'ロボットサッカーの位置取りを試す2Dシミュレーター。',
    image: '/recordings/media/soccer.jpg', alt: '緑のフィールドで青と赤のロボットが動くJavaの2Dシミュレーター',
    caption: 'Javaで動かしている2Dシミュレーターの画面。',
    tags: ['Java', '位置評価', '2Dシミュレーション'],
    clipCaption: 'Javaのシミュレーター上で、ロボットが自動で動いている様子。'
  }
];

export const projectList = catalogue.map(project => ({
  ...project, slug: project.kind, path: `/projects/${project.kind}/`,
  repository: `https://github.com/AMZ-jpcslr/${project.repo}`
}));

const maniaText = [
  'いつもの駅から出かけるたびに、同じ経路を検索し直していました。駅まで歩く時間を足して、次に乗れる電車をすぐ知りたかったのが始まりです。',
  '課題設定から画面設計、実装まで一人で担当しました。試作の画面と別案を使ってくれている人に見せて、最初に何を知りたいかを聞きました。',
  '慣れた経路なら、知りたいのは発車時刻だけです。初めての場所から出るときは、歩く時間も要ります。そこで発車時刻を上に、歩く時間をその下に置きました。',
  '20人近くに使ってもらうと、「経路検索で足りる」「次の電車に乗ればいい」という声も出ました。どんな場面で困っている人に向けたアプリなのか、まだ絞り込めていません。並べ替えで使いやすくなったかも、これから確かめます。'
];

const mediaCredit = '<a href="https://www.jma.go.jp/bosai/nowc/">気象庁</a>・<a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>';
const esc = value => String(value).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[c]);

function renderCard(project) {
  return `<li><a id="work-${project.kind}" class="work-card" href="${project.path}">
    <div class="work-stage stage-${project.kind}" aria-hidden="true"><div class="work-device device-${project.device}"><img src="${project.thumb || project.image}" alt="" loading="lazy" decoding="async"></div></div>
    <div class="work-card-copy"><span class="work-category">${esc(project.category)}</span><span class="work-arrow" aria-hidden="true">↗</span>
      <h3>${esc(project.title)}</h3><p>${esc(project.summary)}</p>${project.mediaType ? `<small class="work-media-type">${esc(project.mediaType)}</small>` : ''}
    </div></a></li>`;
}

export function renderWorks() {
  return `<section id="works" class="work-gallery" aria-labelledby="work-gallery-heading">
    <header class="work-gallery-header"><h2 id="work-gallery-heading" lang="en">Works</h2><span>作品一覧</span>${renderGearRule()}</header>
    <ul class="work-grid">${projectList.map(renderCard).join('')}</ul></section>`;
}

function renderProjectImage(project) {
  const credit = project.kind === 'weather' ? ` <span class="work-source-links">画像の出典　${mediaCredit}</span>` : '';
  return `<figure class="work-figure">
      <a class="work-figure-open" href="${project.image}" aria-label="${esc(project.title)}の画像を原寸で開く"><img src="${project.image}" alt="${esc(project.alt)}" decoding="async"></a>
      <figcaption>${esc(project.caption)}${credit}</figcaption>
    </figure>`;
}

function renderNotes(project, copy) {
  const paragraphs = project.kind === 'mania' ? maniaText : [copy.trigger, copy.collaboration, copy.engineering, insights[project.kind].reflection];
  return ['課題', '自分の担当', '設計判断', '試して分かったこと'].map((label, index) => {
    const repair = project.kind === 'mania' && index === 3
      ? '<img class="work-repairer" src="/assets/workshop/repair.webp" alt="" width="84" height="97" loading="lazy">' : '';
    return `<section class="work-note"><div class="work-note-heading"><h2>${label}</h2>${repair}</div><div><p>${esc(paragraphs[index])}</p></div></section>`;
  }).join('');
}

function renderMedia(project) {
  const recorded = !['voice', 'weather'].includes(project.kind);
  const path = recorded ? 'recordings' : 'interaction-demos';
  return `<section class="work-film work-note"><div class="work-note-heading"><h2>${recorded ? '操作の記録' : '操作の再現'}</h2></div>
    <div><p>${esc(project.clipCaption)}</p><video controls playsinline preload="none" poster="/${path}/media/${project.kind}.jpg" aria-label="${esc(project.title)}の${recorded ? '操作記録' : '再現デモ'}">
        <source src="/${path}/media/${project.kind}.mp4" type="video/mp4"></video>
      <a href="/${path}/media/${project.kind}.mp4">動画ファイルを開く</a></div></section>`;
}

export function renderProject(kind) {
  const project = projectList.find(item => item.kind === kind);
  if (!project) return '';
  const copy = narratives[kind];
  return `<article class="work-story work-story-${kind}">
    <header class="work-story-head"><div class="work-story-nav"><a class="work-back" href="/#work-${kind}">← 作品一覧へ</a>${renderGearRule()}</div>
      <p class="work-category">${esc(project.category)}</p><h1>${esc(project.title)}</h1>
      <p class="work-story-intro">${esc(kind === 'mania' ? '今出たら、何時の電車に乗れる？' : copy.summary)}</p></header>
    <div class="work-spread"><div>${renderProjectImage(project)}</div><aside class="work-margin">
      <h2>設計メモ</h2><p class="work-margin-text">${esc(kind === 'mania' ? '発車時刻を一番上に置く' : insights[kind].reflectionTitle)}</p>
      <ul aria-label="使用技術">${project.tags.map(tag => `<li>${esc(tag)}</li>`).join('')}</ul></aside></div>
    <div class="work-notes">${renderNotes(project, copy)}${renderMedia(project)}</div>
    <nav class="work-links" aria-label="作品の関連リンク">
      <a class="work-back" href="/#work-${kind}">← 作品一覧に戻る</a>
      ${project.live ? `<a href="${project.live}">公開アプリを開く ↗</a>` : ''}
      <a class="github-link" href="${project.repository}"><img src="/notebook/icons/github.svg" alt="" width="16" height="16">GitHubで作品を見る <span aria-hidden="true">↗</span></a></nav>
  </article>`;
}
