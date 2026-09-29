import { renderProductEvidence, renderReflection, renderTeamContext } from './product-evidence.js';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function renderCaseOverview(project) {
  const c = project.caseStudy;
  return `<aside class="case-overview" aria-label="制作の担当と目的"><div><span>DESIGN FOCUS / 設計の焦点</span><p>${escape(c.focus)}</p></div><dl><div><dt>制作体制</dt><dd>個人開発</dd></div><div><dt>本人が担う設計</dt><dd>課題設定・機能・仕様設計</dd></div><div><dt>実装へのAI活用</dt><dd>コーディングを中心に支援</dd></div></dl><p class="overview-role">開発全体では、課題設定・要件定義・設計に加え、評価設計、生成コードのレビュー、デバッグ・修正・テスト、実行結果の確認も本人が担当しています。</p></aside>`;
}

export function renderCaseStudy(project) {
  const p = project, c = p.caseStudy;
  return `<div class="detail-body case-study">
    <section class="case-wide"><div class="eyebrow">01 / PROBLEM</div><h3>課題設定</h3><p>${escape(p.challenge)}</p></section>
    ${renderProductEvidence(p)}
    <section class="case-wide"><div class="eyebrow">02 / PROCESS</div><h3>検討プロセスと、現在の構成</h3><p class="case-source-note">課題と現在の仕様をもとに、操作・構成の関係を整理しています。</p><ol class="process-list">${c.process.map((item,i)=>`<li><span class="process-number">0${i+1}</span><h4>${escape(item.title)}</h4><p>${escape(item.body)}</p></li>`).join('')}</ol></section>
    <section class="case-wide decision-section"><div class="eyebrow">03 / DECISION</div><h3>意思決定と、その理由</h3><h4 class="decision-title">${escape(c.decision.choice)}</h4><div class="decision-grid"><div><h4>現在の設計が扱う課題</h4><p>${escape(c.decision.reason)}</p></div><div><h4>制約・トレードオフ</h4><p>${escape(c.decision.tradeoff)}</p></div></div><p class="case-source-note">仕様から読み取れる設計の理由と制約を整理した説明です。開発当時の比較検討資料ではありません。</p></section>
    <section id="case-role" tabindex="-1"><div class="eyebrow">04 / MY ROLE</div><h3>担当範囲と、周囲との関わり</h3><p class="role-summary">${escape(c.role.scope)}</p><p>${escape(c.role.collaboration)}</p></section>
    <section><div class="eyebrow">05 / AI COLLABORATION</div><h3>AIの活用方法</h3><dl class="ai-responsibilities"><div><dt>この作品で設計したこと</dt><dd>${escape(c.ai.human)}</dd></div><div><dt>AIが担当</dt><dd>${escape(c.ai.assistant)}</dd></div></dl><p class="case-source-note">開発全体での本人の担当は、生成コードのレビュー・デバッグ・修正・テスト・実行結果の確認を含みます。</p></section>
    <section><div class="eyebrow">06 / IMPLEMENTATION</div><h3>設計を支える実装</h3><p>${escape(p.engineering)}</p><ul class="case-features">${p.features.map(f=>`<li>${escape(f)}</li>`).join('')}</ul></section>
    <section><div class="eyebrow">07 / OUTCOME</div><h3>${p.kind==='moral'?'研究の現在地':'利用者と、届いた価値'}</h3><div class="usage-callout"><strong>${escape(p.audience)}</strong><p>${escape(p.impact)}</p></div></section>
    ${renderReflection(p)}
    ${p.kind==='soccer'?`<section class="case-wide">${renderTeamContext()}</section>`:''}
    ${p.outlook?`<section class="case-wide outlook"><div class="eyebrow">NEXT</div><h3>今後の展望</h3><p>${escape(p.outlook)}</p></section>`:''}
  </div>`;
}
