const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function renderCaseOverview(project) {
  const c = project.caseStudy;
  return `<aside class="case-overview" aria-label="制作の担当と目的"><div><span>DESIGN FOCUS / 設計の焦点</span><p>${escape(c.focus)}</p></div><dl><div><dt>制作体制</dt><dd>個人開発</dd></div><div><dt>本人の担当</dt><dd>課題設定・機能・仕様設計</dd></div><div><dt>AIの担当</dt><dd>コーディング全般</dd></div></dl></aside>`;
}

export function renderCaseStudy(project) {
  const p = project, c = p.caseStudy;
  return `<div class="detail-body case-study">
    <section class="case-wide"><div class="eyebrow">01 / PROBLEM</div><h3>課題設定</h3><p>${escape(p.challenge)}</p></section>
    <section class="case-wide"><div class="eyebrow">02 / PROCESS</div><h3>課題から機能へ、検討プロセス</h3><ol class="process-list">${c.process.map((item,i)=>`<li><span class="process-number">0${i+1}</span><h4>${escape(item.title)}</h4><p>${escape(item.body)}</p></li>`).join('')}</ol></section>
    <section class="case-wide decision-section"><div class="eyebrow">03 / DECISION</div><h3>意思決定と、その理由</h3><h4 class="decision-title">${escape(c.decision.choice)}</h4><div class="decision-grid"><div><h4>この設計で重視したこと</h4><p>${escape(c.decision.reason)}</p></div><div><h4>制約・トレードオフ</h4><p>${escape(c.decision.tradeoff)}</p></div></div><p class="case-source-note">設計の狙いは、課題と公開されている仕様をもとに整理しています。</p></section>
    <section><div class="eyebrow">04 / MY ROLE</div><h3>担当範囲と、周囲との関わり</h3><p class="role-summary">${escape(c.role.scope)}</p><p>${escape(c.role.collaboration)}</p></section>
    <section><div class="eyebrow">05 / AI COLLABORATION</div><h3>AIの活用方法</h3><dl class="ai-responsibilities"><div><dt>本人が担当</dt><dd>${escape(c.ai.human)}</dd></div><div><dt>AIが担当</dt><dd>${escape(c.ai.assistant)}</dd></div></dl></section>
    <section><div class="eyebrow">06 / IMPLEMENTATION</div><h3>設計を支える実装</h3><p>${escape(p.engineering)}</p><ul class="case-features">${p.features.map(f=>`<li>${escape(f)}</li>`).join('')}</ul></section>
    <section><div class="eyebrow">07 / OUTCOME</div><h3>${p.kind==='moral'?'研究の現在地':'利用者と、届いた価値'}</h3><div class="usage-callout"><strong>${escape(p.audience)}</strong><p>${escape(p.impact)}</p></div></section>
    ${p.outlook?`<section class="case-wide outlook"><div class="eyebrow">NEXT</div><h3>今後の展望</h3><p>${escape(p.outlook)}</p></section>`:''}
  </div>`;
}
