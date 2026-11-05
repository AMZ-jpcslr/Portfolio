import{drawPerson,drawTrain,drawStation,drawCity,drawIcon,drawBot,drawAvatar,drawRobot}from'./flow-illustrations.js';
// Shared storyboards for the lightweight previews and the rendered detail films.
// All examples are synthetic. Evidence and source revisions: docs/feature-flow-evidence.md.
const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const featureFlows={
 mania:{title:'まにあう',steps:['現在地と現在時刻を確認','駅入口までの徒歩時間を計算','到着の目安と時刻表を比較','今乗れる電車と出る目安へ'],captions:['9:04。位置情報を許可し、向かう駅と入口を選びます。','現在地から駅入口への徒歩経路を取得。例では徒歩5分です。','徒歩5分＋駅構内・余裕3分。9:12以降の発車を探します。','9:15発が目安。ここを9:07に出る計算で、あと3分です。'],note:'駅・時刻・経路は架空です。対応する駅入口と徒歩経路を取得できた場合の例。遅延・運休や実際の乗車を保証するものではありません。',source:'train_time / 0c00d25',color:'#60715a'},
 career:{title:'しゅうかつ手帳',steps:['MyPageの日程を持ってくる','日付と根拠を抽出してInboxへ','必要な項目を確認して承認','タスクとカレンダーに反映'],captions:['MyPageに届いたES締切のお知らせ。スマホでは日程部分を貼り付けます。','端末内のルール解析で締切を抽出。確認した候補を自分のInboxへ保存します。','締切の根拠と反映先を確認。タスク・カレンダーの追加も自分で選びます。','「確認して反映」を押した項目だけが、自分の手帳に入ります。'],note:'企業・日程・通知は架空です。v2取り込みフローを簡略再現。実際のMyPage・Gmail・本番データベースには接続しません。',source:'Syukatu-Note / 1b7edbe',color:'#636879'},
 stream:{title:'Streaming Screen',steps:['配信者が表題を追加','キャンバス上で配置を調整','保存して配信へ反映','OBSのブラウザソースに表示'],captions:['空のキャンバスへ「表題」を追加。配信タイトルを入力します。','表示を見ながらドラッグ。編集した配置は、まだ配信には出ません。','「保存して配信に反映」を押すと、保存済みレイアウトが更新されます。','/overlayをOBSのブラウザソースに設定。編集枠は配信に出ません。'],note:'最新版のモジュール式エディターを簡略再現。レイアウトは説明用です。OBS・YouTube・VTube Studioには接続していません。',source:'Streaming-Screen / f1cc00b',color:'#4e827e'},
 voice:{title:'Yomiage Bot',steps:['VCに参加してBotを呼ぶ','テキストチャンネルへ投稿','VOICEVOXで音声を生成','同じVCの友人に届く'],captions:['利用者がVCに入り、読み上げたいチャンネルで /voice_web join を実行します。','声を出せない利用者が、監視中のテキストチャンネルへ投稿します。','投稿を順番に処理し、VOICEVOXで音声に変換します。','Botが参加先のVCで読み上げ。テキストのまま同じ会話に加われます。'],note:'Discord・名前・会話は再現例で、音声はありません。翻訳は設定済み宛先へのメンション・返信で動く別機能で、訳文は自動読み上げしません。',source:'Yomiage_Discord_Bot / 70128b0',color:'#6b779b'},
 weather:{title:'Shindo Bot',steps:['通知先と最低震度を設定','配信元から地震情報を受信','条件と重複を確認','指定のDiscordへ通知'],captions:['管理者が #地震速報 と最低震度3を設定します。','配信元から新しい地震情報を取得。例の震度は3です。','通知条件を満たし、まだ送っていない情報かを確認します。','指定チャンネルへ地震情報を送ります。例は現在の速報ではありません。'],note:'地震・地域・数値は架空です。通知速度や防災性能の実測ではありません。最新版は地域の気象警報・雨雲画像にも対応しています。',source:'Shindo_Discord_Bot / 10451b9',color:'#9a7950'},
 moral:{title:'Artificial Moral Architecture',steps:['状況と行動候補を入力','未来と当事者への影響を評価','制約を先に適用して比較','安全な代替案をDry Run'],captions:['合成例：「必要な情報を提供する」。非公開情報を使う案と公開情報を使う案があります。','候補ごとの未来と当事者への影響を構造化して評価します。','非公開情報を使う案はBLOCK。許可された候補の中で目的への有用性を比較します。','最終判断はMODIFY。公開情報を使う代替案を選び、外部操作せずDry Runします。'],note:'CLIデモB_informationの判断を模式化した説明です。GUI製品の画面ではありません。固定ルール・合成シナリオによる研究で、現実の道徳能力を実証していません。',source:'Artificial-Moral-Architecture / 634707e',color:'#887193'},
 proxy:{title:'Inspection Proxy',steps:['ブラウザからサンプル通信','宛先の判定後に通信を転送','転送後に本文の形式を検査','候補の種類と件数を確認'],captions:['ブラウザが説明用サイトへ送った通信を、明示プロキシが中継します。','宛先のdenyルールに該当しない通信を転送。本文検査は送信前DLPではありません。','対象本文を上限付きメモリ内で検査。例ではメール形式の候補を1件検出します。','管理画面のセキュリティイベントへ種類・件数を記録。本文や検出原文は保存しません。'],note:'架空の通信による説明です。PII候補の本文通知は転送後で、送信前の漏えい防止ではありません。実通信・CA設定の変更は行いません。',source:'ssl-inspection-prodxy / 218b625',color:'#7e7955'},
 soccer:{title:'SSL Robot AI',steps:['2Dの位置とボールを入力','グリッド上の候補位置を評価','パス・シュートの行動を比較','成功・失敗で重みを更新'],captions:['2Dシミュレーター上の味方・相手・ボールの位置から考えます。','位置評価関数でグリッドを走査し、移動先の候補を比べます。','パス経路やゴールへの見通しなどから行動を比較します。','シミュレーションの成功・失敗を学習の更新へ。次の判断の重みに反映します。'],note:'配置・スコア・更新量は仕組みの説明用です。個人制作の2D試作で、実機の試合や性能向上の実測結果ではありません。',source:'SSL-DEMO / 7359aeb',color:'#557d67'}
};
const R=(x,y,w,h,fill='#fffdf7',stroke='#b6b9aa',r=9)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" ${w>=90&&h>=55?'style="filter:drop-shadow(0 2px 2px #34483812)"':''}/>`;
const T=(x,y,s,size=16,fill='#293c33',weight=400)=>`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}">${e(s)}</text>`;
const line=(x,y,x2,y2,color='#6a826b',dash='')=>`<path d="M${x} ${y}L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="3" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
const arrow=(x,y,x2,y2)=>line(x,y,x2,y2)+`<path d="M${x2-8} ${y2-6}l8 6-8 6" fill="none" stroke="#6a826b" stroke-width="3"/>`;
const tag=(x,y,s,w=110)=>R(x,y,w,30,'#e4eadc','#a4b398',5)+T(x+10,y+21,s,13);
const person=drawPerson;
const pin=(x,y)=>`<path d="M${x} ${y+17}q-23-26-14-40 14-19 28 0 9 14-14 40" fill="#b97c57"/><circle cx="${x}" cy="${y-14}" r="6" fill="#fff5df"/>`;
const train=drawTrain;
const tick=(x,y)=>`<path d="M${x} ${y}l8 8 17-20" fill="none" stroke="#587958" stroke-width="4" stroke-linecap="round"/>`;
const wave=(x,y,t)=>Array.from({length:8},(_,i)=>{const h=9+Math.abs(Math.sin(t*Math.PI*4+i*.9))*31;return R(x+i*11,y-h/2,5,h,'#7eb398','#7eb398',2)}).join('');
const timeCard=(x,y,time,label,good=false)=>R(x,y,194,66,good?'#dfe9d5':'#f3e8dd',good?'#73916b':'#c7ac97')+T(x+13,y+31,time,27,'#293c33',700)+T(x+13,y+53,label,12);
const pointer=(x,y)=>`<path d="M${x} ${y}l2 25 7-7 6 13 6-3-6-12 11-1z" fill="#e4b86c" stroke="#263b31" stroke-width="1.5"/>`;
function mania(stage,t){
 if(stage<2){
  const personX=stage===1?100+Math.min(t,1)*215:83;
  return T(22,28,'いつもの駅へ / 現在 9:04',17,'#3d5646',700)+R(22,44,436,224,'#edf1e4','#bac6ad',13)+drawCity()+T(38,76,'現在地',13,'#52684f',700)+pin(48,126)+drawStation(307,86)+(stage===1?`<path d="M101 191H238V167H329" fill="none" stroke="#fffdf0" stroke-width="11"/><path d="M101 191H238V167H329" fill="none" stroke="#819962" stroke-width="5" stroke-dasharray="9 5" class="flow-route"/>`+tag(155,105,'徒歩 5分',119):tag(152,104,'位置情報で設定',144))+person(personX,181,'#607c73')+T(38,256,stage===0?'位置を許可し、向かう駅の入口を選ぶ':'現在地 → 徒歩経路 → 駅入口',13,'#435c46');
 }
 if(stage===2){
  const card=(x,time,label,good)=>R(x,137,207,104,good?'#e2ecd9':'#f5e9dc',good?'#8fa47d':'#c8b79f',12)+`<g transform="translate(${x+12} 154) scale(.56)">${train(0,0)}</g>`+T(x+68,177,time,28,good?'#36573c':'#8a6954',700)+T(x+68,200,'発',13)+T(x+14,225,label,13,good?'#476344':'#8a6954');
  return T(22,29,'徒歩と余裕から、乗れる便を比べる',18,'#354e3c',700)+R(22,46,436,75,'#fffdf5','#b4c3a8',12)+drawIcon('clock',38,61,26)+T(76,83,'9:04 ＋ 徒歩5分 ＋ 余裕3分',20,'#3f5c42',700)+T(76,108,'9:12が、乗車の準備が整う目安',14,'#63715a')+card(22,'9:10','出る目安を過ぎています',false)+card(251,'9:15','徒歩で余裕あり / 余裕3分',true)+T(23,270,'9:12以降に発車する電車が対象です',14,'#435c46');
 }
 return R(22,18,436,250,'#f9f4e8','#b6bcaa',14)+T(40,47,'まにあう',19,'#344e3c',700)+tag(324,29,'現在 9:04',115)+R(40,62,399,32,'#eceede','#d0d6c4',6)+drawIcon('arrow',51,68,20)+T(81,84,'サンプル駅 / いつもの方面',14,'#53654e')+R(40,106,399,89,'#e2ecd9','#8fa47d',11)+`<g transform="translate(53 117) scale(.85)">${train(0,0)}</g>`+T(143,151,'9:15',43,'#2c4735',700)+T(278,150,'発',21)+T(145,179,'次の電車 / 徒歩で余裕あり',14,'#526749')+T(40,225,'9:07 に出る目安',23,'#2c4735',700)+tag(330,204,'あと3分',109)+T(40,251,'徒歩5分 ＋ 駅構内・余裕3分',14,'#5b6f53');
}
function career(stage,t){
 const head=T(22,28,'しゅうかつ手帳 / CAREER WORKSPACE v2',14,'#606878',700);
 if(stage===0)return head+person(61,161,'#737b90')+R(124,48,333,210,'#fff','#d7dce4')+drawIcon('document',142,59,23,'#7683a0')+T(174,80,'MyPageのお知らせ',18,'#303641',700)+R(143,98,293,96,'#f3f5f8','#e0e4e9')+T(157,125,'サンプル社 / ES提出',17)+T(157,157,'締切 2026/11/12 23:59 JST',16)+T(143,226,'日程部分をコピーして持ってくる',15)+pointer(324,167);
 if(stage===1)return head+R(22,48,436,210,'#fff','#d7dce4')+T(39,79,'テキストから取り込み',20,'#303641',700)+R(39,93,252,77,'#f8f9fb','#c8ced9')+T(53,122,'ES締切：2026/11/12',16)+T(53,149,'23:59 JST',16)+arrow(300,130,330,130)+tag(337,109,'日程候補',100)+R(39,188,214,41,'#303641','#303641',7)+T(54,215,'この端末で解析する',16,'#fff')+pointer(220,207)+T(279,221,'Inboxへ保存',15);
 if(stage===2)return head+R(22,48,436,210,'#fff','#d7dce4')+T(40,78,'自動取得Inbox / 確認待ち 1件',19,'#303641',700)+R(40,94,398,65,'#f7f8fb','#cbd2dd')+tick(54,126)+T(87,122,'ES締切 11/12 23:59',18)+T(88,146,'根拠：貼り付けたお知らせ',12)+tick(54,182)+T(88,185,'タスクを作る / カレンダーへ追加',15)+R(230,207,208,35,'#303641','#303641',6)+T(248,231,'確認して反映',16,'#fff')+pointer(389,216);
 return head+R(22,48,207,210,'#fff','#d7dce4')+T(39,80,'タスク',20,'#303641',700)+R(39,100,172,97,'#f5f6f9','#d3d9e2')+T(51,128,'サンプル社 ES提出',16)+T(51,159,'11/12 23:59',20,'#303641',700)+T(40,231,'選んだ項目だけ反映',14)+R(247,48,211,210,'#fff','#d7dce4')+drawIcon('calendar',263,59,22,'#7683a0')+T(293,80,'11月 / カレンダー',16)+Array.from({length:12},(_,i)=>R(264+i%4*43,95+Math.floor(i/4)*36,36,29,'#f7f8fb','#e1e5ea',3)).join('')+R(307,129,80,32,'#4e596c','#4e596c',4)+T(313,151,'12 ES締切',12,'#fff')+tick(411,226);
}
function stream(stage,t){
 const frame=R(20,22,440,242,'#101721','#364657')+T(35,48,'STREAMING SCREEN',12,'#a0e9dd',700);
 const titleBlock=(x,y,w=181)=>'<g class="flow-module">'+R(x,y,w,37,'#1f3a45','#9ae5d7',3)+T(x+10,y+25,'GAME & TALK',19,'#f7ffff',700)+'</g>';
 if(stage===3)return frame+T(39,82,'OBS / ブラウザソース',16,'#d6e4ed')+R(39,99,402,139,'#192838','#364657')+titleBlock(57,115,246)+T(57,211,'保存した配置が出力に反映',17,'#a0e9dd')+T(316,81,'/overlay',13,'#bcd8d7');
 const x=stage===0?155:stage===1?155+Math.min(t,1)*49:204,y=stage===0?142:stage===1?142-Math.min(t,1)*35:107;
 return frame+R(34,67,88,175,'#182330','#344658')+T(44,94,'追加',16,'#d7e9ef')+R(43,111,70,32,'#283c49','#5d8086',4)+T(53,133,'T 表題',14,'#d7e9ef')+R(136,67,309,175,'#152233','#465a69')+T(150,91,'キャンバス',13,'#aab8c7')+titleBlock(x,y)+pointer(stage===0?80:Math.min(x+133,400),stage===0?132:y+25)+T(151,222,stage===0?'表題を追加して入力':stage===1?'ドラッグで配置を調整':'保存済み',15,'#b9d6d3')+(stage===2?R(251,25,194,30,'#99e3d4','#99e3d4',4)+T(262,46,'保存して配信に反映',14,'#163e39')+tick(411,221):'');
}
function voice(stage,t){
 const bg=R(22,22,436,242,'#2e3240','#454d5b')+R(22,22,100,242,'#242936','#454d5b')+T(35,51,'MY SERVER',11,'#c9cedf',700)+T(35,88,'# テキスト',13,'#c9cedf')+T(35,132,'VC / 通話',14,'#d6dcec')+T(35,168,'● あなた',12,'#a5cda9')+T(35,195,'● 友人',12,'#c9cedf')+(stage>0?T(35,222,'● Bot',12,'#a5cda9'):'');
 if(stage===0)return bg+person(205,134,'#a4b0d5')+R(148,188,287,46,'#404c63','#6b7e9f')+T(160,217,'/voice_web join',19,'#ecf1ff')+T(147,69,'VCに参加してからBotを呼ぶ',15,'#ebedfa')+pointer(401,210);
 if(stage===1)return bg+T(143,55,'# テキスト',16,'#ebedfa')+R(143,78,291,97,'#3c4558','#6b7e9f')+T(157,109,'あなた',13,'#b5c8ed',700)+T(157,142,'声を出せないので文字で参加',16,'#f0f3fa')+R(143,201,291,32,'#424c61','#68778d',5)+T(156,223,'投稿 → 読み上げキューへ',14,'#ebedfa');
 if(stage===2)return bg+T(145,63,'投稿を順番に処理',17,'#f0f3fa')+R(145,83,128,57,'#46516a','#8596bd')+T(159,117,'テキスト',17,'#f0f3fa')+arrow(285,112,313,112)+R(326,83,110,57,'#435c59','#7ba19a')+T(340,116,'VOICEVOX',14,'#e3f2e8')+wave(240,191,t)+T(156,242,'音声を生成してVCへ送る',16,'#f0f3fa');
 return bg+T(145,61,'同じVCで会話に参加',18,'#f0f3fa',700)+drawBot(204,125)+drawAvatar(361,125)+T(191,174,'Bot',13,'#d4e9d7')+T(347,174,'友人',13,'#d3e0f4')+wave(247,125,t)+R(146,184,290,51,'#414b60','#73819d')+T(160,216,'「文字で参加」の投稿が声になる',16,'#f0f3fa');
}
function weather(stage,t){
 if(stage===0)return person(62,151,'#7d8e75')+R(125,32,333,230,'#303647','#4a5264')+T(143,66,'管理者 / 地震通知の設定',18,'#edf1fc',700)+R(143,84,296,60,'#434d62','#70809c')+T(156,110,'通知先 #地震速報',17,'#edf1fc')+T(156,132,'最低震度 3',15,'#edf1fc')+R(143,168,296,52,'#446755','#8aaa8d')+T(157,200,'設定を保存',18,'#f2f8ee')+pointer(386,194);
 if(stage===1)return T(23,35,'配信元から新しい情報を取得',19,'#3f5340',700)+R(23,57,190,190,'#f1e7d3','#c6b18a')+T(40,90,'架空の地震情報',17)+`<circle cx="117" cy="151" r="42" fill="#dfbc73"/>`+T(77,160,'震度 3',24,'#70502c',700)+T(39,226,'情報ID / DEMO-001',12)+arrow(227,150,264,150)+R(276,82,180,137,'#e4ebdc','#9cae90')+T(298,120,'Shindo Bot',22,'#344d38',700)+T(299,160,'新しい情報を受信',16)+T(299,191,'重複を確認',15);
 if(stage===2)return T(22,35,'通知する条件をひとつずつ確認',19,'#3f5340',700)+R(22,58,436,199,'#f9f7ee','#acb69f')+tick(47,110)+T(87,114,'震度3 ≧ 設定した最低震度3',18)+tick(47,159)+T(87,164,'このチャンネルには未送信',18)+arrow(87,200,144,200)+tag(159,183,'通知対象',137)+T(315,205,'#地震速報',15);
 return R(22,22,436,242,'#303647','#4a5264')+T(40,54,'# 地震速報',18,'#edf1fc',700)+R(40,74,398,169,'#414c60','#9a845d')+drawIcon('bell',55,84,21,'#f6daa3')+T(84,103,'地震情報【架空の例】',18,'#f6ead2',700)+T(56,136,'最大震度 3 / サンプル地域',18,'#edf1fc')+R(56,150,207,71,'#cddfe0','#afbf9c')+`<path d="M56 158q29-10 55 9l16 18 33-10 28 10 22-16 53 7v45H56z" fill="#b7cba5" stroke="#91ac88"/><path d="M76 208q27-26 48-11t42-4 41 4 42-13" stroke="#dce7ce" stroke-width="2" fill="none"/><circle cx="158" cy="184" r="21" fill="none" stroke="#b7845e" stroke-width="1" opacity=".65"/><circle cx="158" cy="184" r="12" fill="none" stroke="#b7845e" stroke-width="1"/><path d="m153 179 10 10m0-10-10 10" stroke="#9b5e49" stroke-width="2"/>`+T(65,215,'説明用マップ',8,'#4f6e61')+T(282,174,'指定先へ通知',15,'#edf1fc')+T(282,207,'現在の速報では',12,'#cfd5e0')+T(282,225,'ありません',12,'#cfd5e0');
}
function moral(stage,t){
 const bg=R(22,22,436,242,'#19222b','#4b5865')+T(39,52,'$ python examples/demo.py',16,'#a5cab4',700)+`<circle cx="408" cy="41" r="3" fill="#ad7767"/><circle cx="420" cy="41" r="3" fill="#c5ad73"/><circle cx="432" cy="41" r="3" fill="#779e82"/>`;
 if(stage===0)return bg+T(39,88,'[B_information]',19,'#e4d3a9',700)+T(39,124,'ユーザーに必要な情報を提供する',18,'#ebf0f4')+T(39,168,'候補 A  非公開情報を使う',17,'#ebf0f4')+T(39,206,'候補 B  公開情報を使う',17,'#ebf0f4');
 if(stage===1)return bg+T(39,88,'予測 → 当事者への影響 → 評価',19,'#ebf0f4',700)+R(39,109,188,121,'#443a45','#9a788e')+T(52,139,'非公開情報',18,'#f3dce4')+T(52,172,'権利・同意の侵害',15,'#f3dce4')+T(52,207,'有用性 0.95',15,'#e2d4c7')+R(243,109,197,121,'#30483e','#7a9b81')+T(257,139,'公開情報',18,'#e3f2e5')+T(257,172,'許可できる候補',15,'#e3f2e5')+T(257,207,'有用性 0.75',15,'#e2d4c7');
 if(stage===2)return bg+T(39,91,'道徳的制約を先に適用',21,'#ebf0f4',700)+T(39,135,'private: BLOCK',21,'#e4a999',700)+T(39,175,'use_public_information: ALLOW',17,'#a7d0ae',700)+T(39,221,'許可された候補の中で有用性を比較',16,'#d8e2e8');
 return bg+T(39,94,'Decision: MODIFY',26,'#a7d0ae',700)+T(39,138,'Selected:',16,'#c9d4df')+T(39,170,'use_public_information',21,'#ebf0f4')+T(39,215,'Execution: simulated',20,'#e4d3a9')+T(39,245,'外部操作は実行しません',13,'#c9d4df');
}
function proxy(stage,t){
 if(stage===0)return person(56,162,'#89866b')+R(123,35,335,222,'#f7f8f3','#b4bca8')+T(140,70,'BROWSER / サンプル通信',17,'#475641',700)+R(140,86,300,42,'#e6ebdd','#b4bca8')+T(154,113,'POST example.test/form',17)+R(140,145,300,62,'#fff','#b4bca8')+T(154,171,'メール形式を含む説明用の本文',16)+T(154,196,'（実データは使いません）',13)+pointer(400,211);
 if(stage===1)return T(22,36,'本文検査より先に、通信を転送',20,'#475641',700)+R(22,73,129,145,'#f3f5ec')+T(34,110,'ブラウザ',18)+R(177,73,129,145,'#e6ebdd')+T(190,108,'プロキシ',18)+T(190,145,'宛先を判定',14)+T(190,178,'deny対象外',14)+R(333,73,125,145,'#f3f5ec')+T(345,111,'送信先',18)+drawIcon('browser',47,139,74,'#78917b')+drawIcon('server',356,137,76,'#78917b')+arrow(147,164,176,164)+arrow(306,164,333,164)+T(37,257,'本文のPII通知は転送後。送信前DLPではありません。',14);
 if(stage===2)return T(22,35,'上限付きメモリで本文を検査',20,'#475641',700)+R(22,59,214,193,'#f9f8ee')+T(39,90,'対象本文 / メモリ内',16)+R(39,112,177,74,'#e6ebdd')+T(51,141,'Email形式の候補',17)+T(51,171,'検出数：1',18,'#4d684b',700)+T(39,223,'原文は永続保存しない',14)+arrow(247,154,275,154)+R(288,94,170,125,'#e6ebdd')+T(304,128,'イベントへ',19)+T(304,166,'種類・件数だけ',16)+T(304,194,'Email / 1',18,'#4d684b',700);
 return R(22,22,436,242,'#f6f7f0','#a4b098')+T(39,57,'SECURITY EVENTS',20,'#475641',700)+R(39,76,399,38,'#e3e9d9')+T(51,102,'イベント',14)+T(239,102,'種類',14)+T(355,102,'件数',14)+T(51,151,'PII候補の通知',18)+T(239,151,'Email',18)+T(365,151,'1',22,'#4b684c',700)+line(40,174,436,174)+T(40,210,'本文・メール原文は表示しない',18)+T(40,242,'検査できた範囲と失敗を区別して記録',14);
}
function pitch(stage,t){
 const positions=[[67,112],[83,213],[143,143],[190,218],[246,113],[298,193]],opps=[[176,100],[214,166],[287,87],[325,235],[366,140],[408,208]];
 const field=R(22,33,436,231,'#cbdcba','#8ca37a')+`<g opacity=".25" fill="#eaf1db">${[0,2,4,6].map(i=>`<rect x="${23+i*62}" y="34" width="61" height="229"/>`).join('')}</g><path d="M22 91h59v114H22m436-114h-59v114h59M22 111H10v74h12m436-74h12v74h-12" fill="none" stroke="#f4f6e7" stroke-width="2"/><path d="M14 111v74m4-74v74m444-74v74m4-74v74M10 129h12m-12 18h12m-12 19h12m436-37h12m-12 18h12m-12 19h12" stroke="#eef4e0" stroke-width=".8"/>`+line(240,33,240,264,'#f4f6e7')+`<circle cx="240" cy="148" r="34" fill="none" stroke="#f4f6e7" stroke-width="2"/>`+positions.map(([x,y],i)=>drawRobot(x,y,'#577da9',i+1)).join('')+opps.map(([x,y],i)=>drawRobot(x,y,'#b8755d',i+1)).join('');
 if(stage===0)return T(22,23,'2D WORLD / 味方・相手・ボール',15,'#425d3e',700)+field+`<circle cx="155" cy="141" r="6" fill="#e5c45e" stroke="#696039"/>`+tag(37,226,'位置を入力',119);
 if(stage===1)return field+Array.from({length:28},(_,i)=>`<circle cx="${55+i%7*60}" cy="${64+Math.floor(i/7)*55}" r="4" fill="#659467" opacity=".3"/>`).join('')+`<circle cx="278" cy="125" r="34" fill="#6eaa60" opacity=".35"/><circle cx="329" cy="192" r="26" fill="#d4b962" opacity=".35"/>`+tag(238,58,'候補を比較',125)+T(264,119,'0.82',17,'#345539',700)+T(315,192,'0.54',17,'#796842',700)+T(36,251,'評価値は説明用',13);
 if(stage===2)return field+`<path d="M155 141L278 125" stroke="#507a46" stroke-width="4" stroke-dasharray="8 5"/>`+`<circle class="flow-ball" cx="${155+Math.min(t,1)*123}" cy="${141-Math.min(t,1)*16}" r="6" fill="#e5c45e" stroke="#696039"/>`+tag(38,55,'パス / シュートを比較',225)+T(40,251,'位置と経路の評価から行動を選ぶ',14);
 return T(22,33,'行動の結果を、次の判断へ',21,'#425d3e',700)+R(22,52,205,199,'#e2ecd8','#9cb58c')+T(39,88,'シミュレーション',18)+T(39,129,'成功 / 失敗',24,'#425d3e',700)+T(39,169,'報酬を計算',18)+arrow(237,150,263,150)+R(276,52,182,199,'#f6f8f0','#9cb58c')+T(293,88,'重みを更新',21,'#425d3e',700)+Array.from({length:3},(_,i)=>R(295,109+i*32,72+i*25,14,'#9eb98f','#9eb98f',3)).join('')+T(294,231,'次の候補比較へ',16);
}
const scenes={mania,career,stream,voice,weather,moral,proxy,soccer:pitch};
export function renderFlowSvg(kind,stage=3,progress=.75){
 if(!scenes[kind])return'';
 return `<svg class="feature-flow-svg" viewBox="0 0 480 286" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="font-family:Meiryo,'Yu Gothic',sans-serif">${scenes[kind](stage,progress)}</svg>`;
}
