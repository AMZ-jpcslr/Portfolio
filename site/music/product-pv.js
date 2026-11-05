import{featureFlows,renderFlowSvg}from'./feature-flows.js';
import{drawPerson,drawStation,drawCity,drawIcon,drawBot,drawAvatar,drawRobot}from'./flow-illustrations.js';
const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const R=(x,y,w,h,fill='#fffdf7',stroke='#d0d9c5',r=10)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}"/>`;
const T=(x,y,s,size=16,color='#2c4835',weight=400)=>`<text x="${x}" y="${y}" font-family="Meiryo,'Yu Gothic',sans-serif" font-size="${size}" fill="${color}" font-weight="${weight}">${e(s)}</text>`;
const specs={
 "mania": {
  "hook": [
   "駅までの徒歩時間から",
   "乗れる電車を調べる"
  ],
  "intent": [
   "位置情報と時刻表で",
   "出発の目安を計算"
  ],
  "heads": [
   [
    "位置情報で",
    "現在地を設定"
   ],
   [
    "駅入口までの",
    "徒歩時間を取得"
   ],
   [
    "駅に着く時刻と",
    "列車の発車時刻を比較"
   ],
   [
    "9:15発に乗るなら",
    "9:07に出る目安"
   ]
  ],
  "tagline": [
   "乗れる列車と",
   "出る時刻が分かる"
  ],
  "context": "向かう駅を選ぶと、現在地から駅までの徒歩時間を使って、乗れる電車を調べます。",
  "purpose": "位置情報から徒歩経路を調べ、駅構内を歩く時間と余裕時間も加えて計算します。",
  "closing": "対応する駅への徒歩時間と時刻表から、乗れる列車と出発時刻の目安を表示します。",
  "shortScenes": [
   {
    "heading": [
     "位置情報で",
     "現在地を設定"
    ],
    "body": [
     "向かう駅と入口を選ぶと、",
     "現在地からの徒歩経路を調べます。"
    ]
   },
   {
    "heading": [
     "駅に着く時刻を計算"
    ],
    "body": [
     "徒歩5分＋余裕3分なら、",
     "9:04に出ると9:12到着の目安です。"
    ]
   },
   {
    "heading": [
     "間に合う列車を表示"
    ],
    "body": [
     "9:15発が乗車の目安。",
     "ここを9:07に出る計算です。"
    ]
   }
  ],
  "category": "MOBILITY",
  "shortCaution": "架空の駅・時刻・経路による再現。遅延や運休は反映しません。",
  "chips": [
   "位置情報と徒歩経路",
   "時刻表の目安"
  ]
 },
 "career": {
  "hook": [
   "日程のお知らせを",
   "手帳に取り込む"
  ],
  "intent": [
   "抽出した日程を確認し",
   "必要な項目だけ反映"
  ],
  "heads": [
   [
    "MyPageの日程を",
    "貼り付ける"
   ],
   [
    "日付と根拠を抽出し",
    "Inboxに保存"
   ],
   [
    "反映する項目と",
    "追加先を確認"
   ],
   [
    "承認した日程だけ",
    "タスクと予定に追加"
   ]
  ],
  "tagline": [
   "確認した日程を",
   "自分の手帳で管理"
  ],
  "context": "企業から届いた日程のお知らせを貼り付け、就活の締切や予定を整理します。",
  "purpose": "本文から日付の候補を抽出します。根拠を確認し、反映する項目は自分で選べます。",
  "closing": "取り込んだ日程を自分で確認・承認してから、タスクやカレンダーに追加できます。",
  "shortScenes": [
   {
    "heading": [
     "日程の文章を",
     "貼り付ける"
    ],
    "body": [
     "MyPageなどのお知らせから、",
     "端末内で日付の候補を抽出します。"
    ]
   },
   {
    "heading": [
     "反映する内容を確認"
    ],
    "body": [
     "抽出した日付と根拠を確認し、",
     "必要な項目と追加先を選びます。"
    ]
   },
   {
    "heading": [
     "承認した予定を追加"
    ],
    "body": [
     "「確認して反映」を押した項目だけ、",
     "タスクやカレンダーに入ります。"
    ]
   }
  ],
  "category": "CAREER WORKSPACE",
  "shortCaution": "企業と日程は架空です。MyPage・Gmail・本番DBには接続していません。",
  "chips": [
   "非公開のInbox",
   "確認してから反映"
  ]
 },
 "stream": {
  "hook": [
   "表題などを配置して",
   "配信画面を作る"
  ],
  "intent": [
   "画面を見ながら編集し",
   "保存して配信に反映"
  ],
  "heads": [
   [
    "表題を追加し",
    "文字を入力"
   ],
   [
    "ドラッグで",
    "表示位置を調整"
   ],
   [
    "保存して",
    "配信用の画面を更新"
   ],
   [
    "保存した画面を",
    "OBSに表示"
   ]
  ],
  "tagline": [
   "自分で編集した画面を",
   "配信に使える"
  ],
  "context": "表題などのモジュールを追加・配置して、配信用の画面レイアウトを作ります。",
  "purpose": "エディターで見た目を調整し、保存したレイアウトをOBSのブラウザソースに表示します。",
  "closing": "保存した画面をOBSで利用できます。編集中の枠や保存前の変更は配信に出ません。",
  "shortScenes": [
   {
    "heading": [
     "表題を追加し",
     "表示する文字を入力"
    ],
    "body": [
     "配信画面に置くモジュールを選び、",
     "表示内容を編集します。"
    ]
   },
   {
    "heading": [
     "配置を決めて保存"
    ],
    "body": [
     "ドラッグで位置を調整し、",
     "保存すると配信用の画面が更新されます。"
    ]
   },
   {
    "heading": [
     "OBSに画面を表示"
    ],
    "body": [
     "保存済みのレイアウトを、",
     "OBSのブラウザソースに表示します。"
    ]
   }
  ],
  "category": "CREATIVE TOOLS",
  "shortCaution": "説明用レイアウトの再現です。OBS・YouTube等には接続していません。",
  "chips": [
   "モジュール式エディター",
   "保存した画面をOBSへ"
  ]
 },
 "voice": {
  "hook": [
   "入力した文章を",
   "VCで読み上げる"
  ],
  "intent": [
   "声を出せないときも",
   "文字で会話に参加"
  ],
  "heads": [
   [
    "VCに参加して",
    "読み上げBotを呼ぶ"
   ],
   [
    "監視中のチャンネルに",
    "文章を投稿"
   ],
   [
    "投稿を順に処理し",
    "文章を音声に変換"
   ],
   [
    "同じVCにいる人へ",
    "Botが読み上げる"
   ]
  ],
  "tagline": [
   "文章を送ると",
   "同じVCに音声で届く"
  ],
  "context": "声を出せないとき、Discordに文章を投稿すると、Botが同じVCで読み上げます。",
  "purpose": "利用者がVCに入り、読み上げ対象のチャンネルでBotを呼んでから使います。",
  "closing": "投稿した文章を同じVCで読み上げます。翻訳は別機能で、訳文は自動読み上げしません。",
  "shortScenes": [
   {
    "heading": [
     "VCに入り",
     "Botを呼ぶ"
    ],
    "body": [
     "読み上げるチャンネルで、",
     "/voice_web join を実行します。"
    ]
   },
   {
    "heading": [
     "文章を音声に変換"
    ],
    "body": [
     "チャンネルに投稿した文章を、",
     "VOICEVOXで順番に音声化します。"
    ]
   },
   {
    "heading": [
     "同じVCで読み上げ"
    ],
    "body": [
     "Botが文章を読み上げるので、",
     "声を出せないときも会話に参加できます。"
    ]
   }
  ],
  "category": "COMMUNICATION",
  "shortCaution": "架空の会話・無音の再現。翻訳は別機能で、訳文は自動読み上げしません。",
  "chips": [
   "VOICEVOX読み上げ",
   "設定先への翻訳も"
  ]
 },
 "weather": {
  "hook": [
   "地震の情報を",
   "Discordで受け取る"
  ],
  "intent": [
   "通知先と条件を選び",
   "必要な情報を受信"
  ],
  "heads": [
   [
    "通知チャンネルと",
    "最低震度を設定"
   ],
   [
    "配信元から",
    "地震情報を取得"
   ],
   [
    "震度の条件と",
    "送信済みかを確認"
   ],
   [
    "条件に合う情報を",
    "指定先へ通知"
   ]
  ],
  "tagline": [
   "設定した条件の情報を",
   "Discordで確認できる"
  ],
  "context": "通知するチャンネルと最低震度を設定すると、条件に合う地震情報をDiscordへ届けます。",
  "purpose": "配信元から情報を取得し、震度の条件や重複を確認してから通知します。",
  "closing": "指定したDiscordで地震情報を受け取れます。この映像の地域・震度は架空です。",
  "shortScenes": [
   {
    "heading": [
     "通知先と",
     "最低震度を設定"
    ],
    "body": [
     "例では通知先を #地震速報、",
     "最低震度を3に設定します。"
    ]
   },
   {
    "heading": [
     "条件と重複を確認"
    ],
    "body": [
     "取得した情報の震度が条件に合い、",
     "未送信であることを確認します。"
    ]
   },
   {
    "heading": [
     "Discordに通知"
    ],
    "body": [
     "条件に合う地震情報を、",
     "指定したチャンネルへ送ります。"
    ]
   }
  ],
  "category": "INFORMATION",
  "shortCaution": "災害情報はすべて架空です。現在の速報や防災性能の実測ではありません。",
  "chips": [
   "地震・気象情報",
   "通知先と条件を設定"
  ]
 },
 "moral": {
  "hook": [
   "行動候補の影響を",
   "実行前に評価する"
  ],
  "intent": [
   "固定ルールで比較する",
   "個人研究のCLI試作"
  ],
  "heads": [
   [
    "状況と",
    "行動候補を入力"
   ],
   [
    "候補ごとの未来と",
    "当事者への影響を評価"
   ],
   [
    "制約を適用してから",
    "許可された候補を比較"
   ],
   [
    "公開情報を使う案を",
    "外部操作せず試行"
   ]
  ],
  "tagline": [
   "制約に合う代替案を",
   "Dry Runで確認する"
  ],
  "context": "状況と行動候補を入力し、予測した影響と固定ルールから判断する個人研究です。",
  "purpose": "CLIの合成例を使い、制約に反する案を除外してから、許可された候補を比較します。",
  "closing": "この例では公開情報を使う代替案を選びます。外部操作はせず、実行を模擬します。",
  "shortScenes": [
   {
    "heading": [
     "状況と候補を入力"
    ],
    "body": [
     "例では非公開情報を使う案と、",
     "公開情報を使う案を比較します。"
    ]
   },
   {
    "heading": [
     "制約で候補を絞る"
    ],
    "body": [
     "非公開情報を使う案はBLOCK。",
     "許可された候補の有用性を比べます。"
    ]
   },
   {
    "heading": [
     "代替案を模擬実行"
    ],
    "body": [
     "公開情報を使う案を選び、",
     "外部操作せずDry Runします。"
    ]
   }
  ],
  "category": "PERSONAL RESEARCH",
  "shortCaution": "個人研究の模式化です。現実の道徳能力を実証したものではありません。",
  "chips": [
   "固定ルールと合成例",
   "CLI / Dry Run"
  ]
 },
 "proxy": {
  "hook": [
   "ブラウザの通信を",
   "中継して検査する"
  ],
  "intent": [
   "宛先の判定と",
   "転送後の本文検査"
  ],
  "heads": [
   [
    "ブラウザの通信を",
    "プロキシで中継"
   ],
   [
    "宛先ルールを確認し",
    "許可した通信を転送"
   ],
   [
    "転送後の本文から",
    "個人情報の候補を検出"
   ],
   [
    "種類と件数を",
    "イベント画面で確認"
   ]
  ],
  "tagline": [
   "検出した種類と件数を",
   "原文を残さず記録"
  ],
  "context": "ブラウザの通信をプロキシで中継し、宛先の判定や対象本文の検査を行います。",
  "purpose": "本文の検査は転送後です。候補の種類と件数を記録し、本文や検出した原文は残しません。",
  "closing": "イベント画面で候補の種類と件数を確認できます。本文の送信前に止めるDLPではありません。",
  "shortScenes": [
   {
    "heading": [
     "通信の宛先を確認"
    ],
    "body": [
     "宛先のdenyルールに合わなければ、",
     "ブラウザの通信を転送します。"
    ]
   },
   {
    "heading": [
     "転送後に本文を検査"
    ],
    "body": [
     "対象本文を上限付きで検査し、",
     "メール形式などの候補を検出します。"
    ]
   },
   {
    "heading": [
     "種類と件数を記録"
    ],
    "body": [
     "イベント画面に種類と件数を表示。",
     "本文や検出した原文は保存しません。"
    ]
   }
  ],
  "category": "NETWORK TOOLS",
  "shortCaution": "架空の通信です。本文候補の検出は転送後で、送信前DLPではありません。",
  "chips": [
   "HTTP / HTTPSの中継",
   "種類・件数だけを記録"
  ]
 },
 "soccer": {
  "hook": [
   "2Dの配置から",
   "ロボットの行動を選ぶ"
  ],
  "intent": [
   "位置と行動を比較する",
   "個人制作の試作環境"
  ],
  "heads": [
   [
    "ボールと機体の",
    "配置を入力"
   ],
   [
    "候補位置を評価し",
    "数値で比較"
   ],
   [
    "パスやシュートなど",
    "次の行動を選択"
   ],
   [
    "成功・失敗に応じて",
    "評価の重みを更新"
   ]
  ],
  "tagline": [
   "2D環境で",
   "位置取りと行動を試せる"
  ],
  "context": "ボールやロボットの配置から候補位置を評価し、次の行動を選ぶ2D試作です。",
  "purpose": "位置取りやパスを数値で比較し、成功・失敗に応じた評価の更新を確かめます。",
  "closing": "2D環境で位置取りと行動選択を試せます。実機ロボットの試合や成績を示す映像ではありません。",
  "shortScenes": [
   {
    "heading": [
     "2Dの配置を入力"
    ],
    "body": [
     "ボールとロボットの位置から、",
     "候補となる位置を評価します。"
    ]
   },
   {
    "heading": [
     "次の行動を選ぶ"
    ],
    "body": [
     "評価した位置をもとに、",
     "パスやシュートなどを選びます。"
    ]
   },
   {
    "heading": [
     "結果を次の判断に反映"
    ],
    "body": [
     "成功・失敗に応じて重みを更新。",
     "次の位置取りや行動の判断に使います。"
    ]
   }
  ],
  "category": "ROBOTICS / 2D",
  "shortCaution": "個人制作の2D試作です。配置・数値は説明用で、実機の試合ではありません。",
  "chips": [
   "候補位置の評価",
   "結果に応じた更新"
  ]
 }
};
export const detailPvSegments=[{start:0,end:4,label:'使う場面'},{start:4,end:8,label:'ねらい'},{start:8,end:12,label:'操作'},{start:12,end:16,label:'体験'},{start:16,end:21,label:'特徴'},{start:21,end:26,label:'結果'},{start:26,end:30,label:'この作品'}];
export const pvStories=Object.fromEntries(Object.entries(specs).map(([kind,s])=>[kind,{...s,title:featureFlows[kind].title,color:featureFlows[kind].color,note:featureFlows[kind].note,headlines:[s.hook,s.intent,...s.heads,s.tagline],detailCaptions:[s.context,s.purpose,...featureFlows[kind].captions,s.closing],shortCaptions:s.shortScenes.map(scene=>scene.body.join(''))}]));
export function pvSegmentAt(time){const index=Math.max(0,detailPvSegments.findIndex(s=>time>=s.start&&time<s.end));return{...detailPvSegments[index],index};}
export function pvStageForBeat(beat){return[-1,-1,0,1,2,3,3][beat]??3;}
function laptop(x,y,w=286,h=177,dark=false){const bg=dark?'#202c38':'#fffdf7',edge=dark?'#516976':'#a8b9a2';return R(x,y,w,h,bg,edge,12)+R(x+10,y+12,w-20,h-28,dark?'#172431':'#edf2e7',edge,5)+`<path d="M${x-15} ${y+h}h${w+30}l-10 12H${x-5}z" fill="${edge}"/><path d="M${x+w/2-30} ${y+h}h60l-5 5h-50z" fill="#d5dfcf"/>`;}
function contextArt(kind,t){
 const phase=Math.sin(t*Math.PI*2),person=drawPerson(81,236,kind==='stream'?'#72899a':'#748574');
 if(kind==='mania')return R(16,45,448,269,'#ecf1e3','#bdc9b3',22)+`<g transform="translate(0 33)">${drawCity()}${drawStation(307,86)}${drawPerson(85+phase*3,181,'#607c73')}</g>`+R(40,66,116,40,'#fffaf0','#c6cbb6',9)+drawIcon('clock',50,76,20)+T(80,94,'9:04',24,'#3d5944',700)+`<path d="M153 238h100l35-40h39" stroke="#91a472" stroke-width="3" stroke-dasharray="7 6" fill="none"/>`;
 if(kind==='career')return R(20,274,439,12,'#c4d0bb','none',6)+person+laptop(157,94)+drawIcon('calendar',182,121,36,'#71829a')+T(229,147,'MY NOTE',23,'#637188',700)+R(182,165,232,65,'#fff','#d7dee7',7)+T(197,191,'サンプル社 / ES締切',16)+T(197,218,'11/12 23:59',22,'#384a5c',700)+`<g transform="rotate(${-6+phase*2} 133 105)">${R(105,60,68,85,'#fffaf0','#cfb992',8)}${drawIcon('document',119,76,38,'#9c8c69')}</g>`;
 if(kind==='stream')return R(18,275,443,12,'#9fb4b7','none',6)+person+laptop(156,85,288,184,true)+T(178,120,'LAYOUT STUDIO',14,'#a4ded2',700)+R(178,137,244,91,'#233748','#4d6c78',5)+R(190+phase*3,150,156,33,'#496b6f','#93d5c9',4)+T(203+phase*3,173,'GAME & TALK',17,'#fff',700)+T(296,212,'09:04',19,'#b2e3d6')+R(367,58,69,31,'#abd8c8','#7fae9d',7)+T(380,79,'LIVE',15,'#35584d',700);
 if(kind==='voice')return R(18,278,445,8,'#b9c9cd','none',4)+person+drawBot(251,172)+drawAvatar(402,172)+R(129,65,263,59,'#fffaf3','#b7c4bd',16)+T(147,101,'声を出せないので文字で参加',16,'#395748',700)+`<path d="M154 124l-18 20 39-20" fill="#fffaf3" stroke="#b7c4bd"/>`+Array.from({length:6},(_,i)=>R(300+i*12,171-(10+Math.abs(Math.sin(t*5+i))*23)/2,5,10+Math.abs(Math.sin(t*5+i))*23,'#88b798','none',3)).join('')+T(230,229,'Bot',14)+T(386,229,'友人',14)+T(193,286,'# テキスト → VCの会話へ',16,'#597568');
 if(kind==='weather')return R(18,279,445,9,'#aeb9ad','none',4)+person+laptop(157,95,286,177,true)+T(179,127,'# 地震速報',17,'#d9e4dd',700)+R(180,143,240,92,'#344a59','#8e9d78',8)+T(195,169,'地震情報【架空の例】',18,'#f3dc9c',700)+T(196,202,'最大震度 3',23,'#f0eee3',700)+`<circle cx="407" cy="81" r="30" fill="#e8d4a5" stroke="#c0a77c"/>`+drawIcon('bell',389,63,35,'#896c3e');
 if(kind==='moral')return R(18,280,445,8,'#c2b9ca','none',4)+person+laptop(157,92,286,181,true)+T(179,125,'$ python examples/demo.py',13,'#b6d4b9')+T(180,164,'Prediction → Evaluation',16,'#e4e9df',700)+T(180,199,'Decision: MODIFY',22,'#b5d5b6',700)+T(180,232,'Execution: simulated',14,'#d8c6a0')+R(77,55,124,45,'#f7eef7','#c5b3ce',16)+T(94,83,'その先は？',18,'#816d8b',700);
 if(kind==='proxy')return R(21,282,438,8,'#c7ceb8','none',4)+drawPerson(65,235,'#8a8e6c')+laptop(139,95,198,166)+T(158,127,'example.test',15,'#52664b',700)+drawIcon('browser',176,145,72,'#8ba17b')+drawIcon('server',364,119,80,'#8ba17b')+`<path d="M327 182h47" stroke="#889b74" stroke-width="3" stroke-dasharray="6 5"/>`+R(267,228,176,41,'#e5ebda','#bbc9ac',8)+T(283,254,'Email候補 / 1件',17,'#536b48',700);
 return laptop(44,66,391,227,true)+R(60,86,359,187,'#cbdcba','#8ca37a',6)+`<path d="M240 86v187m-180-130h42v73H60m359-73h-42v73h42" fill="none" stroke="#f4f6e7" stroke-width="2"/><circle cx="240" cy="179" r="28" fill="none" stroke="#f4f6e7" stroke-width="2"/>`+[[97,137],[118,232],[179,167],[211,232],[294,132],[322,219]].map(([x,y],i)=>drawRobot(x,y,'#577da9',i+1)).join('')+[[190,115],[266,197],[337,116],[364,245],[385,166],[408,224]].map(([x,y],i)=>drawRobot(x,y,'#b8755d',i+1)).join('')+`<circle cx="${190+t*90}" cy="${163-t*20}" r="5" fill="#dfbb58" stroke="#927b3d"/>`+T(75,317,'2D SIMULATION / 位置取りを比較',16,'#54734b',700);
}
export function renderPvContextSvg(kind,t=.5){return `<svg class="pv-context-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 340" aria-hidden="true" focusable="false">${contextArt(kind,t)}</svg>`;}
export function renderPvProductSvg(kind,stage,t=.75){return renderFlowSvg(kind,stage,t).replace('class="feature-flow-svg"','class="pv-product-svg"');}
export function renderShortPvSvg(kind,phase=2,t=.75){
 const s=pvStories[kind],scene=s.shortScenes[phase],headline=scene.heading;
 const titleSize=kind==='moral'?17:22;
 const picture=phase===0?renderPvContextSvg(kind,t).replace('<svg class="pv-context-svg"','<svg x="14" y="187" width="452" height="245" class="pv-context-svg"'):renderPvProductSvg(kind,phase===1?2:3,t).replace('<svg class="pv-product-svg"',`<svg x="20" y="195" width="440" height="237" class="pv-product-svg"`).replace('viewBox="0 0 480 286"',phase===1?'viewBox="8 42 464 238"':'viewBox="0 0 480 286"');
 return `<svg class="product-pv-svg" style="display:block;width:100%;height:auto" viewBox="0 0 480 460" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><rect width="480" height="460" fill="#f4f1e7"/><circle cx="440" cy="43" r="115" fill="${s.color}" opacity=".07"/><path d="M24 20v33" stroke="${s.color}" stroke-width="4" stroke-linecap="round"/>${T(37,27,s.category,9,s.color,700)}${T(37,54,s.title,titleSize,'#304b38',700)}${headline.map((line,i)=>T(24,90+i*29,line,25,'#2d4935',700)).join('')}${scene.body.map((line,i)=>T(24,149+i*27,line,Math.min(22,432/[...line].reduce((n,c)=>n+(/[\x00-\x7f]/.test(c)?.55:1),0)),'#425c46')).join('')}<g class="pv-shot-art">${picture}</g>${T(24,450,kind==='moral'?'個人研究 / 合成例・CLIの模式化':kind==='weather'?'架空の災害情報 / 現在の速報ではありません':kind==='proxy'?'架空の通信 / 本文の候補検出は転送後':'架空データによる動作イメージ・再現',9,'#6f7d63')}</svg>`;
}
