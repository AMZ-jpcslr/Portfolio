import { renderGearRule } from './gears.mjs';

const chapters = [
  {
    key: 'school',
    period: '2021.04 — 2024.03',
    title: '個人開発に没頭した高校時代',
    illustration: 'パソコンの前で頭をかく制服姿のからくり修理屋',
    paragraphs: [
      '須磨学園高等学校では、個人開発に没頭していました。学校のシステムを電子化しようとしたものの、うまくいきませんでした。自分で作ったもので何かを変えようとして、人生で初めて挫折を味わった時期です。',
    ],
  },
  {
    key: 'university',
    period: '2024.04 入学',
    title: '大学で広がった興味',
    illustration: 'スケッチブックを抱え、手のひらにSSLのサッカーロボットを載せたからくり修理屋',
    paragraphs: [
      '立命館大学の情報理工学部に入学し、ロボットサッカーの団体でRoboCupのSmall Size League（SSL）に取り組みました。個人開発を続けながら、新しい趣味としてイラストも描き始めました。いろいろなピッチコンテストにも足を運びました。',
    ],
  },
  {
    key: 'ubc',
    period: '2025.09 — 2026.04',
    title: 'カナダで学び、挑戦した日々',
    illustration: 'マフラーを巻き、開いた本から顔を上げる留学中のからくり修理屋',
    paragraphs: [
      'カナダのブリティッシュコロンビア大学（UBC）では、社会学と経営学を学びました。着いて2日目の夜、ホームシックで泣いたのも今ではいい思い出です。',
      '普段とは違う学問に触れるのが新鮮で、楽しくもありました。現地のビジネスプランコンテストにも参加しましたが、そこではボコボコにされました。',
    ],
  },
  {
    key: 'present',
    period: '現在',
    title: '就職活動中のいま',
    illustration: 'スーツを着て、両手で開いた手帳を読むからくり修理屋',
    paragraphs: [
      '今は就職活動の真っ最中です。大学ではMxD研究室に所属しています。就職活動を通じて、自分が将来何をしたいのかを、少しずつはっきりさせているところです。',
    ],
  },
];

const skills = [
  {
    title: 'Webアプリと画面設計',
    techniques: 'TypeScript / Next.js / JavaScript',
    experience: '応募の締切や選考予定を管理するカレンダーと、配信画面を編集するツールを作りました。使う人が最初に何を知りたいかを聞き、いつ、どの画面で操作するかを考えて設計しています。',
  },
  {
    title: '音声とリアルタイム通知',
    techniques: 'VOICEVOX / Discord / WebSocket',
    experience: 'Discordに入力した文章を通話中に読み上げるボットと、地震や気象の情報を届ける通知ボットを開発しました。受け取った情報を、音声や通知として会話の場に届けています。',
  },
  {
    title: 'AIの行動判断と検証',
    techniques: 'Python / シミュレーション',
    experience: 'AIが行動を選ぶ前に、周囲への影響を評価する仕組みを個人で研究しています。ロボットサッカーでは選手の位置を評価し、戦略をシミュレーションで試しています。',
  },
];

export const aboutTools = [
  { name: 'Figma', icon: 'figma', duration: '5か月', months: 5, use: '画面設計とプロトタイプ制作' },
  { name: 'VS Code', icon: 'vscode', duration: '5年', months: 60, use: 'コードの編集と開発' },
  { name: 'Google Colab', icon: 'googlecolab', duration: '1年', months: 12, use: 'Pythonノートブックでの実験' },
  { name: 'Blender', icon: 'blender', duration: '1年', months: 12, use: '3Dモデリング' },
  { name: 'MATLAB', icon: 'matlab', duration: '6か月', months: 6, use: '数値計算とデータの可視化' },
  { name: 'Vercel', icon: 'vercel', duration: '約6か月', months: 6, use: 'Webサイト・アプリの公開' },
  { name: 'Railway', icon: 'railway', duration: '約2年', months: 24, use: 'サーバー上でのアプリ運用' },
];

const qualifications = [
  ['TOEIC Listening &amp; Reading 公開テスト', '905点（2026年10月25日受験）'],
  ['TOEFL iBT', '72点（2025年7月）'],
  ['実用英語技能検定', '準1級'],
  ['日商簿記検定', '3級'],
];

function renderChapter(chapter, index) {
  const number = String(index + 1).padStart(2, '0');
  return `<li class="bio-chapter">
    <div class="bio-dateline"><span>${chapter.period}</span><span class="counter-row" aria-hidden="true">${renderDrum(number)}<span>/</span>${renderDrum('04')}</span></div>
    <div class="bio-chapter-layout">
      <figure class="bio-illustration bio-illustration--${chapter.key}" data-reveal>
        <img src="/assets/workshop/${chapter.key}.webp" alt="${chapter.illustration}" width="320" height="320" loading="lazy" decoding="async">
      </figure>
      <div class="bio-story" data-reveal>
        <h3>${chapter.title}</h3>
        ${chapter.paragraphs.map(paragraph => `<p>${paragraph}</p>`).join('')}
      </div>
    </div>
  </li>`;
}

const renderDrum = digits => [...String(digits)].map(digit => `<span class="counter-drum" data-drum>${digit}</span>`).join('');

// Digits sit on counter drums; the readable duration stays as plain text for assistive technology.
export function renderDuration(tool) {
  return `<span class="sr-only">${tool.duration}</span><span aria-hidden="true">${tool.duration.replace(/\d+/g, renderDrum)}</span>`;
}

export function renderToolName(tool) {
  return `<span class="tool-brand"><img src="/notebook/icons/${tool.icon}.svg" alt="" width="30" height="30" loading="lazy">${tool.name}</span>`;
}

function renderTool(tool) {
  return `<li class="bio-tool">
    <div class="bio-tool-heading"><strong>${renderToolName(tool)}</strong><span>${renderDuration(tool)}</span></div>
    <div class="bio-tool-track" aria-hidden="true"><span style="width: ${tool.months / 60 * 100}%"></span></div>
    <p>${tool.use}</p>
  </li>`;
}

export function renderAbout() {
  return `<article class="bio-notebook" aria-labelledby="bio-title">
    <a class="bio-back" href="/#about"><span aria-hidden="true">←</span> About Me に戻る</a>
    <header class="bio-header">
      <h1 id="bio-title">経歴とスキル</h1>
      <p>北岡 英磨 <span lang="en">/ Yoma Kitaoka</span></p>
      <nav class="bio-index" aria-label="経歴とスキルの目次">
        <a href="#history">経歴</a><a href="#skills">スキル</a><a href="#qualifications">資格</a><a href="#tools">ツール使用歴</a>
      </nav>
    </header>
    <section class="bio-section" aria-labelledby="history">
      <div class="bio-history-heading"><h2 id="history">これまでの歩み</h2>${renderGearRule()}</div>
      <ol class="bio-timeline">${chapters.map(renderChapter).join('')}</ol>
    </section>
    <section class="bio-section" aria-labelledby="skills">
      <h2 id="skills">制作で使っている技術</h2>
      <dl class="bio-skills">${skills.map(skill => `<div>
        <dt>${skill.title}<small>${skill.techniques}</small></dt>
        <dd>${skill.experience}</dd>
      </div>`).join('')}</dl>
    </section>
    <section class="bio-section" aria-labelledby="qualifications">
      <h2 id="qualifications">資格</h2>
      <dl class="bio-qualifications">${qualifications.map(([name, result]) => `<div><dt>${name}</dt><dd>${result}</dd></div>`).join('')}</dl>
    </section>
    <section class="bio-section" aria-labelledby="tools">
      <h2 id="tools">ツール使用歴</h2>
      <ul class="bio-tools">${aboutTools.map(renderTool).join('')}</ul>
    </section>
    <a class="bio-back" href="/#about"><span aria-hidden="true">←</span> About Me に戻る</a>
  </article>`;
}
