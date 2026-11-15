import { aboutTools, renderToolName } from './about.mjs';
import { renderOpening } from './opening.mjs';
import { renderWorks } from './projects.mjs';
import { renderGearPair, renderGearRule } from './gears.mjs';

const illustrations = '/assets/workshop';
const message = [
  '「社会の役に立ってから死ぬ」。これは、私が大切にしている人生の抱負です。自分がつくったもので誰かの困りごとを減らす。その小さな貢献を、積み重ねていきたいです。',
  '私の夢は、2112年にドラえもんをつくることです。世界中の「のび太」を助けたい。困ったときや、一人ではうまくいかないときに、その人に寄り添い、挑戦を支えられる存在を技術で実現したいと考えています。',
  '私は、つくることだけでなく、誰のどんな課題を解決するのか、何を優先してつくるのかを考えることにも面白さを感じています。利用者の声と実際の使われ方を確かめ、異なる専門性を持つ方々と協力しながら、使われ続けるプロダクトに育てていきたいです。',
];

function renderWelcome() {
  return `<section class="welcome paper-width" aria-labelledby="welcome-title">
    <div class="welcome-copy">
      <span class="section-label" lang="en">WELCOME</span>
      <h1 id="welcome-title"><span>からくり工房へ、</span><span>ようこそ。</span></h1>
    </div>
    <button type="button" class="portrait" data-portrait aria-label="からくり修理屋に挨拶する" aria-pressed="false" disabled>
      <span class="portrait-paper" aria-hidden="true"></span>
      <img src="${illustrations}/front.webp" class="portrait-front" width="689" height="887" alt="正面を向いて歯車を手にしたからくり修理屋" fetchpriority="high">
      <img src="${illustrations}/wave.webp" class="portrait-wave" width="689" height="887" alt="" aria-hidden="true">
    </button>
    <div class="welcome-entry">
      <p>歯車を回して、制作ノートを開いてみてください。</p>
      <a href="#message" class="workshop-entry" data-turn-gears>${renderGearPair()}<span>制作ノートを開く</span><span class="workshop-entry-arrow" aria-hidden="true">↓</span></a>
    </div>
    <div class="welcome-mechanism" aria-hidden="true">${renderGearPair()}</div>
  </section>`;
}

function renderMessage() {
  return `<section id="message" class="message paper-width" aria-labelledby="message-title" tabindex="-1">
    <div class="message-heading" data-reveal>
      <span class="section-label" lang="en">Message</span>
      <h2 class="ink-heading" id="message-title">一緒につくりたいこと</h2>
      ${renderGearRule()}
    </div>
    <div class="message-body">${message.map(p => '<p data-reveal>' + p + '</p>').join('')}</div>
    <a class="works-guide" href="#works"><img src="${illustrations}/guide.webp" width="920" height="885" alt="" loading="lazy">
      <span><em>つくる、試す、直す。</em>作品一覧へ <b aria-hidden="true">↓</b></span>
    </a>
  </section>`;
}

function renderAboutPreview() {
  return `<section id="about" class="about-preview paper-width" aria-labelledby="about-title">
    <div class="about-cover">
      <div class="about-cover-heading"><h2 id="about-title" class="english-heading" lang="en">About Me</h2>${renderGearRule()}</div>
      <div class="nameplate"><span class="nameplate-type" aria-hidden="true">Yoma<br>Kitaoka</span>
        <span class="nameplate-jp">北岡 英磨<small>立命館大学 情報理工学部</small></span>
        <img src="${illustrations}/guide.webp" alt="" width="920" height="885" loading="lazy">
      </div>
    </div>
    <div class="about-info">
      <h3>ツール使用歴</h3>
      <ul class="tool-summary">${aboutTools.map(tool => `<li><div>${renderToolName(tool)}<small>${tool.duration}</small></div><i aria-hidden="true" style="--period:${100 * tool.months / 60}%"></i></li>`).join('')}</ul>
      <h3>スキル</h3>
      <ul class="skill-stamps"><li>画面設計</li><li>ボット開発</li><li>AI研究</li></ul>
      <p>2005年生まれ、兵庫県出身です。小学3年生のとき、初めてプログラミングに触れました。昔から人助けが好きで、誰かの力になれるとうれしくなります。今は、技術を使って人の困りごとを解決する仕事に就きたくて、就職活動に奔走しています。</p>
      <a class="chapter-link" href="/about/">経歴とスキルを見る <span aria-hidden="true">→</span></a>
    </div>
  </section>`;
}

export function renderHome() {
  return renderOpening() + renderWelcome() + renderMessage() + renderWorks() + renderAboutPreview();
}
