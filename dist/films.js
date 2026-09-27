// Art direction and editorial captions share the actors' 24-second CSS clock.
export const filmDuration = 24;
export const filmHeight = 450;
export const films = {
  voice: {title:'Yomiage Bot',label:'COMMUNICATION',accent:'#c4b0f3',hook:['声を出せない日も、','同じ会話へ。'],result:'友人約10人が利用',value:'テキストが、会話への入り口になる。',chapters:[['CONNECT','コマンドひとつで、ボイスチャンネルへ。'],['SPEAK','入力した言葉を、Botが声にする。'],['TRANSLATE','メンションした相手の言語へ。']]},
  weather: {title:'Shindo Bot',label:'DISASTER INFORMATION',accent:'#9ccaf5',hook:['地震の知らせを、','いつもの画面に。'],result:'友人約10人が利用',value:'PC作業中も、Discordで情報に気づく。',chapters:[['SET UP','地震情報の通知先を設定する。'],['DETECT','震度の条件と、通知の重複を確認。'],['DELIVER','震源・規模・震度を、ひとつの通知に。']]},
  stream: {title:'Streaming Screen',label:'CREATOR TOOLS',accent:'#efb7d1',hook:['イメージを、','そのまま配信画面に。'],result:'YouTuberからの依頼で制作',value:'専門知識がなくても、自分の画面をつくれる。',chapters:[['CREATE','テキストをひとつ、キャンバスへ。'],['ARRANGE','つかんで、動かして、組み立てる。'],['ON AIR','保存したレイアウトを、配信出力へ。']]},
  moral: {title:'Artificial Moral Architecture',label:'AI / PERSONAL RESEARCH',accent:'#c2dda0',hook:['AIが行動する、','その前を考える。'],result:'個人研究として検証中',value:'目標の先にいる、当事者のことまで。',chapters:[['PLAN','目標と、候補となる行動を用意。'],['EVALUATE','未来と、当事者への影響を評価する。'],['DECIDE','許可された代替案を選び、Dry Runへ。']]},
  proxy: {title:'Inspection Proxy',label:'NETWORK / SECURITY',accent:'#e2c48f',hook:['見えない通信に、','見える手がかりを。'],result:'母と営む会社で利用',value:'監視から、ネットの仕組みへの理解へ。',chapters:[['CAPTURE','ブラウザの通信が、ログに現れる。'],['INSPECT','送信内容から、個人情報の形式を検出。'],['CONTROL','対象ドメインをブロックし、記録する。']]},
  soccer: {title:'SSL Robot AI',label:'SIMULATION / TEAM PLAY',accent:'#94d5b5',hook:['次の一手を、','チームの力に。'],result:'立命館大学 Ri-oneで活用',value:'位置のスコアリングを、導入に向けた試作へ。',chapters:[['SCAN','空間を評価し、パスの受け手を探す。'],['CONNECT','相手の守備を避けて、パスをつなぐ。'],['SHOOT','開いたコースへ、最後の一手。']]},
  career: {title:'しゅうかつ手帳',label:'CAREER WORKSPACE',accent:'#9ecbd0',hook:['就活の予定も、','次の一歩も、一冊に。'],result:'友人数人が利用',value:'予定を整え、知らなかった応募先に出会う。',chapters:[['DISCOVER','みんなが公開した募集を見つける。'],['MAKE IT YOURS','引用して、自分の応募予定にする。'],['PLAN YOUR DAY','締切と選考を、カレンダーで見渡す。']]}
};
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderFilm(kind,body) {
  const f=films[kind];
  if(!f) throw new Error('Missing film: '+kind);
  return `<div class="scene-viewport continuous cinema" data-kind="${kind}" style="--film-accent:${f.accent}"><div class="scene-scaler">
    <div class="film-atmosphere"><i></i><i></i></div><div class="film-grid"></div>
    <div class="film-topline"><span><i></i> ${esc(f.label)}</span><span>AMZ / PRODUCT FILM</span></div>
    <div class="film-stage"><div class="film-screen"><div class="scene-camera">${body}</div></div></div>
    <div class="film-intro"><div class="film-kicker">${esc(f.title)}</div><div class="film-hook">${f.hook.map((line,i)=>`<span style="--line:${i}">${esc(line)}</span>`).join('')}</div><div class="film-intro-rule"></div><small>DESIGNED AROUND REAL PROBLEMS.</small></div>
    <div class="film-chapters">${f.chapters.map((ch,i)=>`<div class="film-chapter chapter-${i}"><span>0${i+1} / ${esc(ch[0])}</span><p>${esc(ch[1])}</p></div>`).join('')}</div>
    <div class="film-outro"><span class="film-outro-mark">↗</span><small>PEOPLE & POSSIBILITY</small><strong>${esc(f.result)}</strong><p>${esc(f.value)}</p><span class="film-signature">${esc(f.title)} <b>by AMZ</b></span></div>
    <div class="film-timeline" aria-hidden="true"><i></i><i></i><i></i></div>
    <div class="sequence-progress" aria-hidden="true"><i></i></div>
  </div></div>`;
}
