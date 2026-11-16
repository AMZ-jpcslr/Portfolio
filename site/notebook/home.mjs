import { aboutTools, renderToolName } from './about.mjs';
import { renderWorks } from './projects.mjs';
import { renderOpening } from './opening.mjs';
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
      <h1 id="welcome-title" lang="en"><span>Welcome to my</span> <span>portfolio site.</span></h1>
    </div>
    <div class="welcome-drawing">
      <span class="portrait-paper" aria-hidden="true"></span>
      <button type="button" class="portrait" data-portrait aria-label="からくり修理屋に顔を上げてもらう" aria-pressed="false" disabled>
        <img src="${illustrations}/working.webp" class="portrait-working" width="736" height="920" alt="懐中時計の歯車を調整しているからくり修理屋" fetchpriority="high">
        <img src="${illustrations}/looking-up.webp" class="portrait-looking" width="736" height="920" alt="" aria-hidden="true">
        <svg class="watch-gear" viewBox="462 279 65 65" aria-hidden="true" focusable="false">
          <defs><clipPath id="watch-tool-edge"><path d="M462 279H527V344H462V321L474 320.4 478.6 318.4 477.6 315.9 472 313.5 462 311.4Z"/></clipPath></defs>
          <g clip-path="url(#watch-tool-edge)">
            <circle cx="494.5" cy="312" r="29.2" fill="#8e6c5b"/>
            <g class="watch-gear-rotor">
              <path fill="#edc06d" stroke="#624736" stroke-width="2.1" stroke-linejoin="round"
                d="M483 288.6Q487.2 286.3 493.4 285.9L495.6 294.2Q498.4 294.2 501.1 295.1L508.2 289.1Q513.8 291.7 517.1 298.4L511.1 304.2Q512.1 307.8 512.7 311.7L521.4 315.4Q521 321.3 517.2 327.4L508.2 324.1Q505.8 326.3 503.7 327.4L503.6 336.8Q498.5 339 491.3 338.3L490.2 329.1Q486.8 328.5 485.1 327.3L477.7 332.4Q472.6 330.1 469.6 324.4L477.4 318.4Q476.6 315.1 476.6 312.7L467.6 309.3Q467.2 303.4 471.4 297.2L480.4 299.9Q482.4 297.6 483.6 296.8Z"/>
              <path d="M486.3 290.4l4.1-1.1" fill="none" stroke="#f8dc94" stroke-width="1.5" stroke-linecap="round"/>
            </g>
            <circle cx="494.5" cy="312" r="5.1" fill="#a27b69" stroke="#72503f" stroke-width="2"/>
          </g>
        </svg>
      </button>
    </div>
    <div class="welcome-entry">
      <a href="#message" class="workshop-entry" data-turn-gears>${renderGearPair()}<span>メッセージを読む</span><span class="workshop-entry-arrow" aria-hidden="true">↓</span></a>
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
