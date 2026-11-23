import { narratives } from '../data/author-narratives.js';
import { insights } from '../data/case-insights.js';
import { renderGearRule } from './gears.mjs';

const catalogue = [
  {
    kind: 'mania', title: 'まにあう', category: '交通アプリ', device: 'phone', repo: 'train_time',
    summary: '次に乗れる電車を、駅までの徒歩時間から調べる。',
    image: '/assets/works/mania.webp', thumb: '/assets/works/mania-mobile.webp',
    alt: '駅と方面を選び、発車時刻と徒歩時間の目安を確認する画面',
    caption: '公開版の画面。駅と方面を選ぶと、発車順に電車が並びます。',
    tags: ['React', 'TypeScript', 'Vite'], live: 'https://train-time-three.vercel.app/',
    clipCaption: '駅検索と徒歩時間の確認。テスト用の位置情報で動かした実アプリの記録。'
  },
  {
    kind: 'career', title: 'しゅうかつ手帳', category: '就活カレンダー', device: 'laptop', repo: 'Syukatu-Note',
    summary: '応募の締切と選考予定をカレンダーで管理。',
    image: '/assets/works/career.webp', alt: '応募の締切や選考の予定をまとめたカレンダー',
    caption: '日程が集まるカレンダー画面。表示している応募予定はデモ用です。',
    tags: ['Next.js', 'TypeScript', 'Supabase'], live: 'https://syukatu-note.vercel.app/',
    clipCaption: '実アプリのデモモードで架空の日程を開く操作。'
  },
  {
    kind: 'stream', title: 'Streaming Screen', category: '配信ツール', device: 'monitor', repo: 'Streaming-Screen',
    summary: 'OBSの配信レイアウトを画面上で編集。',
    image: '/assets/works/stream.webp', alt: 'レイヤー、キャンバス、選択中の要素の設定が並ぶ配信画面エディター',
    caption: 'レイヤーを選び、中央のキャンバスで配置を調整する編集画面。',
    tags: ['JavaScript', 'Node.js', 'OBS'],
    clipCaption: '実エディターで表題の位置を変え、変更を戻して保存する操作。'
  },
  {
    kind: 'voice', title: 'Yomiage Bot', category: '読み上げBot', device: 'laptop', repo: 'Yomiage_Discord_Bot',
    summary: 'Discordの通話で入力した文章を読み上げる。',
    image: '/interaction-demos/media/voice.jpg', alt: '説明用に再現したDiscord画面で、読み上げコマンドと投稿を示す',
    caption: 'Discord上の操作を再現したデモ。ユーザー名と会話は架空です。',
    mediaType: '操作例（再現）', tags: ['TypeScript', 'VOICEVOX', 'DeepL'],
    clipCaption: 'ボイスチャンネルへの参加と投稿の流れを再現。映像は無音です。'
  },
  {
    kind: 'weather', title: 'Shindo Bot', category: '防災通知Bot', device: 'tablet', repo: 'Shindo_Discord_Bot',
    summary: '地震や気象の情報をDiscordに通知。',
    image: '/assets/works/weather.webp', alt: '関東の地図に雨雲と千代田区付近の白丸を重ねたBotの出力画像',
    caption: '2026年9月22日にBotが生成した雨雲レーダーの保存画像。雨雲は気象庁、背景は地理院タイル。',
    mediaType: 'Botの出力画像', tags: ['TypeScript', 'WebSocket', '気象データ'],
    clipCaption: '通知先と条件を設定する操作例。地震情報とDiscord画面は再現です。'
  },
  {
    kind: 'moral', title: 'Artificial Moral Architecture', category: '個人研究', device: 'laptop', repo: 'Artificial-Moral-Architecture',
    summary: 'AIが行動する前に、周囲への影響を評価。',
    image: '/recordings/media/moral.jpg', alt: '合成シナリオの判断結果を出力したPython CLIの実行画面',
    caption: '合成シナリオを入力し、判断の過程を追った実際のCLI出力。',
    tags: ['Python', '行動判断', 'Dry Run'],
    clipCaption: '合成シナリオに対する判断とJSON出力を実際のCLIで確認。'
  },
  {
    kind: 'proxy', title: 'Inspection Proxy', category: '通信検査ツール', device: 'monitor', repo: 'ssl-inspection-prodxy',
    summary: '通信の内容を検査し、ログを確認。',
    image: '/recordings/media/proxy.jpg', alt: 'テスト用の通信ログと検出結果を表示した管理ダッシュボード',
    caption: 'ローカルのテスト用通信を通し、ログを表示した管理画面。',
    tags: ['JavaScript', 'Node.js', 'Docker'],
    clipCaption: '合成データを使い、管理画面でログを絞り込む操作。'
  },
  {
    kind: 'soccer', title: 'SSL Robot AI', category: '2Dシミュレーション', device: 'monitor', repo: 'SSL-DEMO',
    summary: '位置を評価してロボットサッカーの戦略を試す。',
    image: '/recordings/media/soccer.jpg', alt: '緑のフィールドで青と赤のロボットが動くJavaの2Dシミュレーター',
    caption: 'Javaで動かした2Dシミュレーターの画面。ロボットの位置と戦略を試します。',
    tags: ['Java', '位置評価', '2Dシミュレーション'],
    clipCaption: '実際のJavaシミュレーターでロボットが自律的に動く様子。'
  }
];

export const projectList = catalogue.map(project => ({
  ...project, slug: project.kind, path: `/projects/${project.kind}/`,
  repository: `https://github.com/AMZ-jpcslr/${project.repo}`
}));

const maniaText = [
  'いつもの駅から出かけるたびに同じ経路を検索し直していました。駅まで歩く時間を含めて、次に乗れそうな電車の時刻をすぐ確かめたいと考えました。',
  '個人開発として課題設定、画面設計、実装を担当。プロトタイプと画面の別案を利用者に見せ、最初に必要な情報を聞きました。',
  '慣れた経路なら発車時刻だけで判断できます。初めての出発地点では徒歩時間も必要です。そこで発車時刻を先に示し、必要に応じて歩く時間を確認できる順序にしました。',
  '経路検索で足りる人や、次の電車に乗ればよいと感じる人もいました。この声をもとに、どんな出発場面で必要とされるかを見直しています。配置を変えたことによる使いやすさは検証中です。'
];

const mediaCredit = '<a href="https://www.jma.go.jp/bosai/nowc/">気象庁</a>・<a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>';
const esc = value => String(value).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[c]);


function renderCard(project) {
  return `<li><a id="work-${project.kind}" class="work-card" href="${project.path}">
    <div class="case-bezel" aria-hidden="true"><div class="case-window"><img src="${project.image}" alt="" loading="lazy" decoding="async">
      <span class="case-glint"></span></div>
      <span class="case-crank"><img class="case-gear" src="/notebook/gears/brass-12.svg" width="96" height="96" alt=""><i></i></span></div>
    <div class="work-card-copy"><span class="work-category"><span class="work-no" aria-hidden="true"></span>${esc(project.category)}</span><span class="work-arrow" aria-hidden="true">↗</span>
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
      <h2>設計メモ</h2><p class="work-margin-text">${esc(kind === 'mania' ? '発車時刻を先に。歩く時間は、その次に。' : insights[kind].reflectionTitle)}</p>
      <ul aria-label="使用技術">${project.tags.map(tag => `<li>${esc(tag)}</li>`).join('')}</ul></aside></div>
    <div class="work-notes">${renderNotes(project, copy)}${renderMedia(project)}</div>
    <nav class="work-links" aria-label="作品の関連リンク">
      <a class="work-back" href="/#work-${kind}">← 作品一覧に戻る</a>
      ${project.live ? `<a href="${project.live}">公開アプリを開く ↗</a>` : ''}
      <a class="github-link" href="${project.repository}"><img src="/notebook/icons/github.svg" alt="" width="16" height="16">GitHubで作品を見る <span aria-hidden="true">↗</span></a></nav>
  </article>`;
}
