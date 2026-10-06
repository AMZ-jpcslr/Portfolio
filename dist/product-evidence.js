import { projects } from './projects.js';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const github = (repo, path) => `https://github.com/AMZ-jpcslr/${repo}/blob/master/${path}`;

export const featuredIds = projects.filter(project => project.featured).map(project => project.id);
export const evidence = {
  'Syukatu-Note': {
    summary: '公開募集と個人の記録を分け、引用から日程管理へつなぐ。',
    context: '複数企業・ポジションへの応募を管理する就活生が対象です。募集を見つけたときと、締切・選考予定を確認するときの両方を扱います。',
    images: [
      {src:'./assets/career-calendar.png',width:1440,height:1211,title:'予定をまとめて見る',alt:'しゅうかつ手帳のデモ環境のカレンダー。応募締切や選考予定を種類ごとに表示。',caption:'実アプリのデモ環境。企業名はサンプル、応募日程・選考状況は架空です。実際の募集日程や私の応募履歴ではありません。'},
      {src:'./assets/career-selection.png',width:1440,height:1199,title:'応募ごとに選考を管理する',alt:'しゅうかつ手帳のデモ環境の応募詳細。選考、タスク、ES、面接のタブと選考ステップ。',caption:'実アプリのデモ環境。応募に紐づく選考ステップと、タスク・ES・面接の入口を確認できます。入力内容は撮影用です。'}
    ],
    source: github('Syukatu-Note','scripts/capture-readme.spec.ts'),
    model: [
      ['共有する情報','公開募集','企業に対して複数の募集・ポジション。募集名、職種、締切、情報元を持つ。'],
      ['引用する','自分専用の応募情報','募集ごとに独立したコピーを作成。応募状況や志望度は自分で管理する。'],
      ['個人で管理する','選考・予定・タスク','応募に紐づけて日程や進行状態を管理。カレンダーは元の日程から表示を組み立てる。'],
      ['個人で記録する','ES・面接記録','同じ応募に紐づく私的な記録。公開募集を引用しても他人の記録はコピーしない。']
    ],
    boundary:'公開募集 → 引用 → 個人の応募、という一方向の関係です。個人の選考・タスク・ES・面接記録は応募に紐づきます。公開募集の更新は個人コピーへ自動同期せず、利用者が更新を反映する操作を選びます。',
    operations:['公開募集の内容と情報元を確認する','募集ごとに引用して自分の応募情報を作る','選考日程やタスクを登録・調整する','カレンダーで予定を確認する'],
    references:[['共有と個人コピーの構成',github('Syukatu-Note','docs/architecture.md')],['引用の実装',github('Syukatu-Note','src/lib/repository.ts')]],
    outcome:'友人約10人に使ってもらい、感想を聞きました（2026年9月時点）。公開された応募情報の引用には、予定管理だけでなく、他の人の応募先を知る面白さも感じてもらえました。',
    limit:'この反応だけでは、引用する募集を迷わず選べるか、締切の見落としが減ったかまでは判断できません。',
    next:'次は、同じ企業に複数の募集がある場面で、必要な募集だけ引用し、予定を確認するまでの操作を見たいと考えています。元の募集が更新された際に、反映範囲を理解できるかも確認する対象です。'
  },
  'Streaming-Screen': {
    summary:'編集する画面と、配信に出る画面を分ける。',
    context:'小規模YouTuberからの依頼で制作しました。配信画面の専門知識がない人が、タイトルや時計などの配置を自分で調整する場面を想定しています。',
    images:[{src:'./assets/stream-editor.png',width:1680,height:1229,title:'選択した要素を見ながら編集する',alt:'Streaming Screenの実際の編集画面。左にモジュールとレイヤー、中央にキャンバス、右に選択要素の設定。',caption:'実アプリを一時的なデータ領域で起動した撮影用レイアウトです。OBS未接続。依頼者が配信中の画面や、初期テンプレートではありません。'}],
    source:github('Streaming-Screen','docs/capture-screenshots.cjs'),
    model:[
      ['選ぶ','モジュール','表題・テキスト・画像・時計など、表示する要素を追加する。'],
      ['調整する','編集中のレイアウト','要素の位置・サイズ・表示順を変更。ドラッグと数値入力を使える。'],
      ['保存する','保存済みレイアウト','保存ボタンで通常のレイアウト変更を反映。編集途中の状態と区別する。'],
      ['表示する','配信用出力','保存済みデータを読み、編集枠のない画面をOBSのブラウザソースへ表示する。']
    ],
    boundary:'左のレイヤー、中央のキャンバス、右の設定は、同じモジュールを別の観点で扱います。配信用の画面は保存済みデータを参照します。VTube Studioの配置反映は別の操作で、OBSのソースを直接変更します。',
    operations:['モジュールを選んで追加する','キャンバス上で配置し、必要なら数値で調整する','「保存して配信に反映」を押す','配信用出力で保存した配置を確認する'],
    references:[['編集・出力の仕様',github('Streaming-Screen','README.md')],['保存処理',github('Streaming-Screen','studio/editor.js')],['配信用出力',github('Streaming-Screen','studio/overlay.html')]],
    outcome:'私が個人で制作し、依頼者に使ってもらいました。配信画面の専門知識がなくても、直感的に操作できると感想をもらっています。',
    limit:'操作時間や成功率を測った結果ではありません。特に、編集状態と保存済み状態の違いを初めて使う人が理解できるかは、感想だけでは分かりません。',
    next:'次は、モジュールの追加から保存・出力確認までを初めて行う様子を見て、選択中の要素と保存の状態を把握しやすいか確かめたいと考えています。'
  }
};

export function renderFeatured(projects) {
  return featuredIds.map(id => {
    const p=projects.find(p=>p.id===id), e=evidence[id], shot=e.images[0];
    return `<a class="featured-card" href="#project=${p.id}"><div class="featured-image"><img src="${shot.src}" width="${shot.width}" height="${shot.height}" alt="${escape(shot.alt)}" loading="lazy" decoding="async"><span>実画面 / デモデータ</span></div><div class="featured-copy"><span>${p.number} / ${String(projects.length).padStart(2, '0')} · ${escape(p.label)} · 個人開発</span><h3>${escape(p.title)} <span aria-hidden="true">↗</span></h3><p>${escape(e.summary)}</p><div class="card-pain-point"><span>PAIN POINT / 制作のきっかけ</span><p>${escape(p.painPoint)}</p></div><small>${escape(p.audience)}</small><b>課題・操作・情報設計を読む</b></div></a>`;
  }).join('');
}

function renderModel(project, e) {
  const box = ([label,title,body]) => `<div class="model-node"><span>${escape(label)}</span><h4>${escape(title)}</h4><p>${escape(body)}</p></div>`;
  if (project.kind === 'career') return `<div class="information-diagram" role="group" aria-label="公開募集から独立した応募情報を作り、その下に個人の予定と記録を持つ関係図"><div class="shared-zone"><span class="zone-label">共有する範囲</span>${box(e.model[0])}</div><p class="model-connector">↓ 引用して独立したコピーを作る</p><div class="private-zone"><span class="zone-label">自分専用の範囲</span>${box(e.model[1])}<p class="model-connector">↓ 同じ応募に紐づく情報</p><div class="model-branches">${box(e.model[2])}${box(e.model[3])}</div></div></div>`;
  return `<ol class="information-model">${e.model.map(([label,title,body],i)=>`<li><span>${String(i+1).padStart(2,'0')} / ${escape(label)}</span><h4>${escape(title)}</h4><p>${escape(body)}</p></li>`).join('')}</ol>`;
}

export function renderProductEvidence(project) {
  const e=evidence[project.id];
  if (!e) return '';
  return `<section class="case-wide" id="case-screens" tabindex="-1"><div class="eyebrow">SCREENS / 実画面</div><h3>実際の画面と、操作する対象</h3><p>${escape(e.context)}</p><div class="evidence-gallery">${e.images.map(shot=>`<figure><a href="${shot.src}" target="_blank" rel="noopener noreferrer" aria-label="${escape(shot.title)}の画像を大きく見る（新しいタブ）"><img src="${shot.src}" width="${shot.width}" height="${shot.height}" alt="${escape(shot.alt)}" loading="lazy" decoding="async"></a><figcaption><strong>${escape(shot.title)}</strong><p>${escape(shot.caption)}</p><span>画像を選ぶと拡大表示 ↗</span></figcaption></figure>`).join('')}</div><p class="case-source-note">各リポジトリのREADME用キャプチャを掲載。<a href="${e.source}" target="_blank" rel="noopener noreferrer">撮影に使った設定とデータ ↗</a></p></section>
  <section class="case-wide" id="case-design" tabindex="-1"><div class="eyebrow">INFORMATION DESIGN / 現在の仕様を説明する図</div><h3>情報の関係と、操作の流れ</h3><p class="diagram-caption">現在の実装をもとに、このポートフォリオ用に作成した図です。</p>${renderModel(project, e)}<p class="information-boundary">${escape(e.boundary)}</p><h4>基本の操作</h4><ol class="operation-flow">${e.operations.map(text=>`<li>${escape(text)}</li>`).join('')}</ol><div class="evidence-links">${e.references.map(([label,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${escape(label)} ↗</a>`).join('')}</div></section>`;
}

export function renderReflection(project) {
  const e=evidence[project.id];
  return e ? `<section class="case-wide reflection"><div class="eyebrow">REFLECTION / 反応と次の検証</div><h3>分かったことと、これから確かめたいこと</h3><div class="reflection-grid"><div><h4>利用者から聞けたこと</h4><p>${escape(e.outcome)}</p></div><div><h4>まだ確かめられていないこと</h4><p>${escape(e.limit)}</p></div></div><h4>次に確かめたい操作</h4><p>${escape(e.next)}</p></section>` : '';
}

export function renderTeamContext() {
  return `<div class="team-context"><div><span class="eyebrow">RI-ONE / 団体での活動</span><h3>ゴールキーパーの経験を、<br>ロボットの戦略に生かす。</h3><p>立命館大学の公認団体Ri-oneに所属し、戦略班で、ロボットをどう動かし、どう使って攻めるかを考えています。小学校から高校までの10年間、サッカーでゴールキーパーを務めた経験から、主にゴールキーパーを担当するロボットの戦略に携わっています。活動ではJavaを使用しています。</p></div><aside><span>このサイトで紹介する個人制作</span><h4>SSL Robot AI</h4><p>候補位置をマップ上でスコアリングする個人制作の試作です。Ri-oneへ導入するシステムのプロトタイプとして活用されました。Ri-oneでの戦略班の活動とは別に、私が個人で制作しました。</p></aside></div>`;
}
