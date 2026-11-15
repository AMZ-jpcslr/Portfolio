import { aboutTools, renderToolName } from './about.mjs';
import { renderOpening } from './opening.mjs';
import { renderWorks } from './projects.mjs';

const illustrations = '/assets/workshop';
const message = [
  '「社会の役に立ってから死ぬ」。これは、私が大切にしている人生の抱負です。自分がつくったもので誰かの困りごとを減らす。その小さな貢献を、積み重ねていきたいです。',
  '私の夢は、2112年にドラえもんをつくることです。世界中の「のび太」を助けたい。困ったときや、一人ではうまくいかないときに、その人に寄り添い、挑戦を支えられる存在を技術で実現したいと考えています。',
  '私は、つくることだけでなく、誰のどんな課題を解決するのか、何を優先してつくるのかを考えることにも面白さを感じています。利用者の声と実際の使われ方を確かめ、異なる専門性を持つ方々と協力しながら、使われ続けるプロダクトに育てていきたいです。',
];

function renderProfile() {
  return `<section class="profile paper-width" aria-labelledby="profile-name">
    <div class="profile-copy">
      <span class="section-label" lang="en">Profile</span>
      <img class="signature" src="${illustrations}/signature.svg" width="497" height="127" alt="" fetchpriority="high">
      <h1 id="profile-name">北岡 英磨</h1>
      <p class="profile-lead">技術で、身近な困りごとを減らす。</p>
    </div>
    <button type="button" class="portrait" data-portrait aria-label="からくり修理屋に挨拶する" aria-pressed="false" disabled>
      <span class="portrait-paper" aria-hidden="true"></span>
      <img src="${illustrations}/front.webp" class="portrait-front" width="689" height="887" alt="正面を向いて歯車を手にしたからくり修理屋" fetchpriority="high">
      <img src="${illustrations}/wave.webp" class="portrait-wave" width="689" height="887" alt="" aria-hidden="true">
    </button>
    <p class="profile-bio">立命館大学で情報理工学を学んでいます。個人開発や研究では、誰がどんな場面で困っているのかを考え、設計・実装を通じて解決策を試しています。</p>
    <a href="#message" class="next-note">メッセージを読む <span aria-hidden="true">↓</span></a>
  </section>`;
}

function renderMessage() {
  return `<section id="message" class="message paper-width" aria-labelledby="message-title">
    <div class="message-heading" data-reveal>
      <span class="section-label" lang="en">Message</span>
      <h2 class="ink-heading" id="message-title">一緒につくりたいこと</h2>
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
      <h2 id="about-title" class="english-heading" lang="en">About Me</h2>
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
      <p>誰かが挑戦するとき、そばにいるロボットはいつ手を貸し、いつ見守るといいだろう。そんな人と技術の関わりに興味があります。小さく作って使ってもらい、その人の声を聞いて作り直すことを大切にしています。</p>
      <a class="chapter-link" href="/about/">経歴とスキルを見る <span aria-hidden="true">→</span></a>
    </div>
  </section>`;
}

export function renderHome() {
  return renderOpening() + renderProfile() + renderMessage() + renderWorks() + renderAboutPreview();
}
