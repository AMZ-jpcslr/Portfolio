// Small, dependency-free illustrations of the actual feature flows.
// No video, external requests, timers or live product data are used here.
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const coreDemos={
 mania:{steps:['いつもの駅と徒歩時間を設定','歩く時間と時刻表を照合','次に乗れる電車が分かる'],description:'駅まで徒歩5分の例で、時刻表から次に乗れる9:12発の電車を表示します。時刻・駅・ダイヤは架空です。'},
 career:{steps:['公開募集を見つける','自分の予定へ引用する','カレンダーで締切を確認'],description:'公開募集を自分の予定へコピーし、カレンダーに追加する流れです。企業名・日程は架空です。引用後は独立した予定になります。'},
 stream:{steps:['テキスト要素を追加','画面上で位置を調整して保存','保存した配置をOBSへ出力'],description:'テキストの配置を編集し、保存してから配信出力へ反映する流れです。OBSには接続していません。'},
 voice:{steps:['Discordにテキストを投稿','読み上げ・翻訳を処理','声を出せなくてもVCの会話へ'],description:'テキスト投稿から読み上げ・翻訳を経てボイスチャットに参加する流れです。実際の会話・音声ではありません。'},
 weather:{steps:['地震の情報を取得','通知条件と重複を確認','Discordの通知先へ届ける'],description:'情報取得後に震度条件と重複を確認してDiscordへ通知する流れです。架空の地震情報で、現在の速報ではありません。'},
 moral:{steps:['行動候補の影響を予測','当事者への影響を評価','許可した候補をDry Run'],description:'合成シナリオと固定ルールで影響を評価し、許可された候補だけをDry Runする個人研究の模式図です。外部操作や現実の倫理判断は行いません。'},
 proxy:{steps:['HTTP / HTTPSの通信を中継','個人情報の形式を検出','検出結果をログで確認'],description:'サンプル通信に含まれる個人情報の形式を検出し、ダッシュボードに記録する流れです。実際の通信・個人情報ではありません。'},
 soccer:{steps:['マップ上の候補位置を評価','パスと移動の候補を比較','結果をもとに重みを更新'],description:'候補位置の評価、行動の比較、成功・失敗による重み更新を示す2D試作の模式図です。実機や試合結果ではありません。'}
};
const rect=(x,y,w,h,cls='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" class="${cls}"/>`;
const text=(x,y,s,cls='')=>`<text x="${x}" y="${y}" class="${cls}">${esc(s)}</text>`;
const label=(x,y,s)=>text(x,y,s,'cd-small');
const arrow=(x,y)=>`<path d="M${x} ${y}h34m-8-7 8 7-8 7" class="cd-arrow"/>`;
const check=(x,y)=>`<path d="M${x} ${y}l7 7 14-17" class="cd-check"/>`;
const wave=()=>`<g class="cd-wave">${[12,26,40,20,34,16,30].map((h,i)=>`<rect x="${305+i*14}" y="${143-h/2}" width="6" height="${h}" rx="3"/>`).join('')}</g>`;
const scenes={
 mania:()=>`${label(22,30,'いつもの駅 / 架空の時刻表')}${rect(22,48,168,134)}${label(38,77,'サンプル駅')}${text(38,110,'駅まで 徒歩5分')}${text(38,148,'いま 9:04','cd-small')}${arrow(202,116)}${rect(248,48,210,134,'cd-tint')}${label(266,77,'次に乗れる電車')}${text(266,118,'9:12 発','cd-large cd-from-2')}${text(266,153,'9:09 駅に到着 → 乗車','cd-small cd-from-2')}${text(266,113,'時刻表を照合中','cd-at-1')}${text(266,113,'徒歩時間から探す','cd-at-0')}<path d="M32 212h416m-416 7h416" class="cd-track"/><g class="cd-train">${rect(42,192,82,24,'cd-solid')}<path d="M56 196v12m16-12v12m16-12v12m16-12v12" class="cd-train-window"/></g>`,
 career:()=>`${label(22,30,'公開募集 → 自分だけの予定')}${rect(22,48,186,142)}${label(38,76,'公開募集')}${text(38,109,'サンプル社')}${text(38,137,'説明会 / 11月12日','cd-small')}${rect(38,151,146,26,'cd-tint')}${text(62,170,'予定へ引用','cd-small')}${arrow(215,117)}${rect(264,48,194,142)}${label(281,76,'MY CALENDAR')}<g class="cd-calendar">${[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>rect(281+i%4*39,90+Math.floor(i/4)*26,33,20)).join('')}</g><g class="cd-from-2">${rect(318,114,76,27,'cd-solid')}${text(325,133,'説明会','cd-light cd-small')}${check(418,165)}</g><g class="cd-copy">${rect(154,95,92,34,'cd-solid')}${text(165,118,'募集のコピー','cd-light cd-small')}</g>${label(22,222,'引用後は独立した予定。元の変更は自動同期しません。')}`,
 stream:()=>`${label(22,30,'編集 → 保存 → 配信画面')}${rect(22,48,266,154)}${label(36,73,'EDITOR')}${rect(37,85,236,101,'cd-screen')}<g class="cd-layout-block">${rect(48,98,110,32,'cd-solid')}${text(60,120,'LIVE TALK','cd-light cd-small')}</g>${rect(313,76,145,112)}${label(325,101,'OBS OUTPUT')}<g class="cd-until-2">${rect(325,112,121,59,'cd-screen')}${label(337,146,'保存前の配置')}</g><g class="cd-from-2">${rect(325,112,121,59,'cd-screen')}${rect(349,142,88,22,'cd-solid')}${text(357,158,'LIVE TALK','cd-light cd-small')}</g>${arrow(278,130)}<g class="cd-from-2">${check(185,70)}${label(214,73,'保存済み')}</g>`,
 voice:()=>`${label(22,30,'Discord / 読み上げ・翻訳のイメージ')}${rect(22,48,436,158)}${label(38,76,'# テキスト')}${rect(38,89,204,45,'cd-tint')}${text(51,118,'マイクなしで参加します','cd-small')}${arrow(247,112)}<circle cx="359" cy="128" r="42" class="cd-bot"/>${text(341,115,'BOT','cd-small')}${wave()}<g class="cd-from-1">${rect(38,147,204,37)}${text(51,171,'I’ll join without a mic.','cd-small')}</g><g class="cd-from-2">${label(298,192,'VCへ読み上げ')}</g>`,
 weather:()=>`${label(22,30,'架空の地震情報 / 現在の速報ではありません')}${rect(22,53,130,137)}${label(36,80,'情報を取得')}<circle cx="86" cy="125" r="26" class="cd-quake"/>${text(68,131,'震度3','cd-small')}${arrow(162,121)}${rect(208,76,105,98)}${text(222,107,'条件確認','cd-small')}<g class="cd-from-1">${check(232,135)}${label(223,159,'重複なし')}</g>${arrow(318,121)}<g class="cd-notification">${rect(359,53,99,137,'cd-tint')}${label(369,80,'Discord')}${text(371,115,'地震情報','cd-small')}${text(371,142,'震度 3','cd-small')}${label(371,172,'通知先へ')}</g>`,
 moral:()=>`${label(22,30,'合成シナリオ / 固定ルールで検証')}${rect(22,52,127,141)}${label(37,81,'行動候補')}${text(37,117,'候補 A','cd-small')}${text(37,158,'候補 B','cd-small')}${arrow(155,121)}${rect(200,52,127,141,'cd-tint')}${label(214,81,'影響を評価')}${text(214,117,'当事者への影響','cd-small')}<g class="cd-from-1">${text(214,151,'A 保留 / B 許可','cd-small')}</g>${arrow(332,121)}${rect(375,52,83,141)}${label(385,81,'Dry Run')}<g class="cd-from-2">${check(395,119)}${text(385,158,'候補 B','cd-small')}</g>${label(22,222,'許可した候補のみ試行。外部操作は行いません。')}`,
 proxy:()=>`${label(22,30,'サンプル通信 / 実データは使用しません')}${rect(22,53,124,138)}${label(37,80,'REQUEST')}${text(37,111,'HTTP(S)','cd-small')}${rect(37,128,93,35,'cd-tint')}${label(46,150,'email形式')}${arrow(151,122)}${rect(194,53,117,138)}${label(208,80,'検査')}${text(208,113,'形式を照合','cd-small')}<g class="cd-from-1">${rect(206,133,93,31,'cd-solid')}${text(215,154,'形式を検出','cd-light cd-small')}</g>${arrow(317,122)}${rect(361,53,97,138)}${label(373,80,'LOG')}<g class="cd-from-2">${rect(374,100,70,10,'cd-tint')}${rect(374,120,52,10,'cd-tint')}${rect(374,140,62,10,'cd-solid')}${label(374,178,'記録を確認')}</g>`,
 soccer:()=>`${label(22,29,'2D位置評価 / 説明用の候補と数値')}${rect(22,44,292,171,'cd-pitch')}<path d="M168 44v171m-146-116h30v60H22m292-60h-30v60h30" class="cd-field-line"/><circle cx="168" cy="129" r="27" class="cd-field-line"/><g class="cd-from-1"><circle cx="212" cy="88" r="24" class="cd-score"/><circle cx="256" cy="161" r="18" class="cd-score cd-score-low"/>${label(198,61,'0.82')}${label(242,197,'0.54')}</g><circle cx="77" cy="146" r="10" class="cd-player"/><circle cx="212" cy="88" r="10" class="cd-player cd-player-move"/><circle cx="257" cy="161" r="10" class="cd-opponent"/><circle cx="186" cy="165" r="10" class="cd-opponent"/><circle cx="91" cy="136" r="5" class="cd-ball"/>${rect(331,44,127,171)}${label(344,74,'候補を比較')}${text(344,107,'パス / 位置取り','cd-small')}<g class="cd-from-2">${check(345,139)}${label(344,169,'結果を反映')}${label(344,193,'重みを更新')}</g>`
};
export function renderCoreDemo(kind){
 const d=coreDemos[kind];if(!d)return'';
 return `<figure class="core-demo" data-core-kind="${esc(kind)}" data-running="false" data-static="true"><div class="core-demo-bar"><span>機能の動き <small>約7秒 / 無音</small></span><button type="button" class="core-demo-toggle" aria-label="機能アニメーションを再生">再生</button></div><div class="core-demo-visual" aria-hidden="true"><svg viewBox="0 0 480 240" focusable="false">${scenes[kind]()}</svg><div class="core-demo-captions">${d.steps.map((s,i)=>`<span class="cd-caption cd-at-${i}"><b>0${i+1}</b> ${esc(s)}</span>`).join('')}</div><div class="core-demo-progress"></div></div><figcaption><strong>動作イメージ（簡易再現）</strong><span>${esc(d.description)}</span></figcaption></figure>`;
}
export function setupCoreDemo(figure){
 if(!figure)return()=>{};
 const button=figure.querySelector('.core-demo-toggle'),motion=matchMedia('(prefers-reduced-motion:reduce)');
 let visible=false,userPaused=false,started=false,disposed=false,explicitPlay=false;
 function sync(){
  if(disposed)return;
  const modal=document.querySelector('.book-summary[open]');
  const allowed=visible&&!document.hidden&&(!modal||modal.contains(figure));
  const running=allowed&&!userPaused&&(!motion.matches||explicitPlay);
  if(running)started=true;
  figure.dataset.static=String(!started);figure.dataset.running=String(running);
  button.textContent=running?'一時停止':'再生';button.setAttribute('aria-label',running?'機能アニメーションを一時停止':'機能アニメーションを再生');
 }
 const observer=new IntersectionObserver(entries=>{visible=entries.at(-1).isIntersecting;sync()},{threshold:.15});observer.observe(figure);
 const toggle=()=>{if(figure.dataset.running==='true'){userPaused=true;explicitPlay=false}else{userPaused=false;explicitPlay=true}sync()};
 const changed=()=>{explicitPlay=false;if(motion.matches)started=false;sync()};
 button.addEventListener('click',toggle);motion.addEventListener('change',changed);document.addEventListener('visibilitychange',sync);document.addEventListener('core-demo-modal',sync);
 sync();
 return()=>{disposed=true;observer.disconnect();figure.dataset.running='false';button.removeEventListener('click',toggle);motion.removeEventListener('change',changed);document.removeEventListener('visibilitychange',sync);document.removeEventListener('core-demo-modal',sync)};
}
