import{authorProject}from'./author-narratives.js';
import {projects as existing} from '/projects.js';
export const github='https://github.com/AMZ-jpcslr';
// Stable cloth colors, shared by each project's spine, search book and summary accent.
export const bookColors=Object.freeze({mania:'#e6ce9e',career:'#c7d1b5',stream:'#dec6b8',voice:'#c8d9dc',weather:'#ddd9b5',moral:'#d6c9dd',proxy:'#d7cfb5',soccer:'#bdd0be'});
export const bookColor=kind=>bookColors[kind];
export const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clipNotes={
 mania:'駅の検索、徒歩時間の変更、推薦された便と選択した便の確認を再現しています。駅名と時刻の組み合わせ・ダイヤは説明用の模擬例です。実際の運行情報や、公開アプリを録画した映像ではありません。',
 career:'公開募集の確認、応募予定への追加、カレンダーでの予定確認を再現しています。企業名・日程・応募記録は架空です。',
 stream:'テキストの追加・配置・配信出力への反映という操作を再現しています。OBSやYouTubeには接続していません。',
 voice:'参加・テキスト読み上げ・翻訳の流れを再現しています。実際のDiscord操作や音声の記録ではありません。会話・名前・翻訳内容は架空です。',
 weather:'通知先の設定と地震通知の流れを再現しています。実際のDiscord操作や現在の災害情報ではありません。表示する地震・数値は架空です。',
 moral:'行動案・影響評価・Dry Runの判断の流れを再現しています。実際の試験や外部操作は行っていません。',
 proxy:'サンプル通信・検出・ブロックの流れを再現しています。実際の通信記録や顧客データではありません。',
 soccer:'位置評価・パス・シュートの考え方を再現しています。選手位置や評価の色は説明用で、実機の試合や検証結果ではありません。'
};
const clips=Object.fromEntries(Object.entries(clipNotes).map(([kind,note])=>[kind,{type:'recreation',src:kind==='soccer'?'/recreation/media/soccer-v2.mp4':`/recreation/media/${kind}.mp4`,poster:`/recreation/media/${kind}.jpg`,size:'1240 × 900',note:'動作イメージ（再現映像）。'+note}]));
const short={career:'予定と応募機会を、一冊に。',stream:'配信の画面を、自分の手で。',voice:'声を出せないときも、会話へ。',weather:'いつもの場所で、災害を知る。',moral:'行動の前に、影響を考える。',proxy:'見えない通信を、理解する。',soccer:'位置取りを、数値で比較する。'};
const purposes={mania:'いつもの駅で、今乗れる電車の発車時刻をひと目で判断できるようにする。',career:'応募や締切、選考の予定をまとめ、自分の次の行動と新しい応募機会を見つけやすくする。',stream:'配信画面の専門知識がない人でも、自分でレイアウトを調整できるようにする。',voice:'声を出せない場面でも、テキスト入力でボイスチャットの会話に参加できるようにする。',weather:'PC作業中も、普段開いているDiscordで地震や気象の情報に気づけるようにする。',moral:'行動前の予測と、影響を受ける当事者の評価を、AIの行動選択につなぐ仕組みを探究する。',proxy:'通信の内容と検出結果を可視化し、何がやり取りされているか確認できるようにする。',soccer:'ロボットの移動先やパス相手を考えるため、候補位置とチーム全体の動きを比較できるようにする。'};
const sourceProjects=existing.map(p=>({...p,
 slug:p.kind,short:short[p.kind],repository:`${github}/${p.id}`,clip:clips[p.kind],
 audience:p.kind==='voice'?'約10人のサーバーで約1年半利用。実際の対象者は数人。':p.audience,
 caseStudy:p.kind==='voice'?{...p.caseStudy,role:{...p.caseStudy.role,collaboration:'私が個人で開発し、友人に使ってもらってきました。'}}:p.caseStudy,
 impact:p.kind==='proxy'?'母と営む小規模な会社で、通信内容の確認と理解のために使用しています。':p.impact,
 limits:p.kind==='moral'?'固定ルールと合成シナリオによる研究用の検証基盤です。現実の道徳能力や倫理的妥当性・安全性を実証したものではありません。':p.caseStudy.decision.tradeoff
}));
const mania={id:'mania',slug:'mania',kind:'mania',title:'まにあう',category:'MOBILITY / PERSONAL PRODUCT',short:'今出るなら、何時の電車？',tagline:'いつもの駅で、今乗れる電車をひと目で。',summary:'いつも使う駅で、今乗れる電車の時刻をひと目で判断できることを目指す個人開発です。',challenge:'慣れた経路では、徒歩時間を把握している人がまず知りたいのは電車の発車時刻です。一方、慣れていない出発地点では、徒歩時間と乗車の目安も判断材料になります。',engineering:'想定する利用者にプロトタイプやUIの別案を見せ、どの情報を先に必要とするかを聞いています。その声を、情報の優先順位を考える材料にしています。',tags:['Webアプリ','UIの検討'],audience:'20人近くが利用（本人申告。DAU・MAUの値ではありません）',impact:'発車時刻を最上段で分かりやすく示す方向を検討しています。最適な配置は検討中です。使いやすさがどれだけ改善するかも、まだ確かめられていません。',liveUrl:'https://train-time-three.vercel.app/',repository:github+'/train_time',repositoryCreatedAt:'2026-10-22T05:16:27Z',clip:clips.mania,limits:'時刻表と徒歩時間に基づく目安です。ここで紹介するUI候補はローカル試作で、公開版への採用や、使いやすさの改善効果を示すものではありません。',caseStudy:{role:{scope:'個人開発 / 課題設定・UIの検討・開発',collaboration:'想定する利用者に候補画面を見せ、最初に必要とする情報を聞いています。'},decision:{choice:'発車時刻を入口に、徒歩時間との関係を追えるようにする',reason:'慣れた経路での判断を支えながら、慣れない場所でも徒歩時間と乗車目安を確認できる構成を検討しています。',tradeoff:'必要な情報は出発地点や経路への慣れによって変わります。発車時刻を優先する意図はありますが、最適な配置は検証中です。'},process:[{title:'必要な情報を聞く',body:'プロトタイプやUIの別案を見せ、どの情報を先に知りたいかを聞いています。'},{title:'情報の順序を比べる',body:'発車時刻を優先し、徒歩時間や出る時刻の目安との関係が読める候補を比較しています。'},{title:'次に確かめる',body:'慣れた経路と慣れない出発地点で、情報の見つけやすさと判断に迷う箇所を確認していく段階です。'}]}};
// Verified read-only from train_time git origin and package.json after file-access authorization.
mania.repository='https://github.com/AMZ-jpcslr/train_time';
mania.tags=['React','TypeScript','Vite'];
const descriptions={
 mania:['次に乗れる電車は、何時何分？','今出たら、何時何分の電車に乗れる？'],
 career:['応募・締切・選考の予定管理','応募・締切・選考の予定をまとめて管理'],
 stream:['配信画面のレイアウト編集','配信画面のレイアウトを編集するツール'],
 voice:['テキスト読み上げ・翻訳','テキストを読み上げ、翻訳するDiscord Bot'],
 weather:['地震・気象情報の通知','地震・気象情報を通知するDiscord Bot'],
 moral:['AIの行動前の影響評価','AIの行動前に影響を評価する個人研究'],
 proxy:['通信の検査とログ確認','通信の検査とログ確認のためのプロキシ'],
 soccer:['位置評価のシミュレーション','ロボットサッカーの位置評価シミュレーター']
};
mania.limits='時刻表と徒歩時間に基づく目安です。画面の再現映像は機能の説明用で、公開版への採用や、使いやすさの改善効果を示すものではありません。';
export const lifecycle={
 mania:{label:'運用中',detail:'公開アプリをつくり、発車時刻を優先するUIを検討しています。'},
 career:{label:'運用中',detail:'公開して運用し、友人に使った感想を聞いています。'},
 stream:{label:'運用中',detail:'配信者の依頼で制作し、運用しています。'},
 voice:{label:'運用中',detail:'友人のDiscordサーバーで運用しています。'},
 weather:{label:'運用中',detail:'友人と使いながらDiscord上で運用しています。'},
 moral:{label:'研究中',detail:'固定ルールと合成シナリオで判断の仕組みを検証する個人研究です。'},
 proxy:{label:'運用中',detail:'母と営む小規模な会社で、通信の確認に使っています。'},
 soccer:{label:'活動成果',detail:'私がつくった位置評価の仕組みを、導入用プロトタイプとして活用してもらいました。'}
};
export const projects=[mania,...sourceProjects].map((p,i)=>({...p,status:lifecycle[p.kind],short:descriptions[p.kind][0],tagline:descriptions[p.kind][1],purpose:purposes[p.kind],trigger:p.painPoint||p.challenge,clip:p.clip?{...p.clip,src:p.clip.src||`/media/${p.kind}.mp4`,poster:p.clip.poster||`/media/${p.kind}.jpg`}:null,number:String(i+1).padStart(2,'0'),path:`/projects/${p.slug}/`})).map(authorProject);
export const chronology=[...projects].sort((a,b)=>Date.parse(a.repositoryCreatedAt)-Date.parse(b.repositoryCreatedAt));
export const philosophy=[
 {group:'課題を理解する',label:'01 / PROBLEM',title:'身近な問題と社会の課題から考える',body:'作るものを先に決めず、不便や疑問を出発点にします。分野を限定せず、個人の視点から取り組めることを探します。'},
 {group:'課題を理解する',label:'02 / CONTEXT',title:'誰が、どこで使うかを考える',body:'使う人や場面によって、必要な情報は変わります。利用する状況を理解し、何を先に伝えるかを考えます。'},
 {group:'課題を理解する',label:'03 / PERSPECTIVES',title:'自分と違う見方も取り入れる',body:'最初の案に固執せず、利用者の声や別の考え方に耳を傾けます。自分の想定と違う使い方も、見直すきっかけにします。'},
 {group:'試して改善する',label:'04 / PROTOTYPE',title:'試せる形を早く作る',body:'考えた機能や操作を、触って確かめられる試作にします。実際の画面を見ながら、必要なものと分かりにくいところを探します。'},
 {group:'試して改善する',label:'05 / LISTEN',title:'ヒアリングとレビューを聞く',body:'利用者に試してもらい、必要な情報や使いにくいところを聞きます。作り手の想像だけで使いやすさを決めないようにします。'},
 {group:'試して改善する',label:'06 / ITERATE',title:'利用者の声を改善につなげる',body:'レビューや実際の使われ方をもとに、機能や情報の順序を見直します。変更したあとも、困りごとが解消したか確かめることを大切にします。'},
 {group:'伝え方と研究姿勢',label:'07 / CLARITY',title:'迷わず判断できる情報を並べる',body:'何を最初に知りたいかを考え、必要な情報を見つけやすくします。見た目と分かりやすさの両方を考えて設計します。'},
 {group:'伝え方と研究姿勢',label:'08 / RESEARCH',title:'判断の影響と検証の範囲を考える',body:'AIの予測・影響評価・判断をつなぐ仕組みを個人研究で探究しています。合成シナリオでの検証と、現実の問題に対する能力の実証を区別します。'},
 {group:'伝え方と研究姿勢',label:'09 / OWNERSHIP',title:'AIを使い、自分で確かめる',body:'生成AIを実装支援に活用します。課題設定や設計、生成コードのレビュー、修正、テスト、実行結果の確認は自分で担います。'}
];
