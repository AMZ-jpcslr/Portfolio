// UI interaction reconstructions. Only application labels, example inputs and outputs
// appear inside the SVG. Scope and synthetic-data disclosures live outside the video.
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=n=>Math.max(0,Math.min(1,n));
const ease=n=>{n=clamp(n);return n*n*(3-2*n)};
const mix=(a,b,t)=>a+(b-a)*ease(t);
const type=(s,t,start,end)=>s.slice(0,Math.floor(clamp((t-start)/(end-start))*s.length));
const R=(x,y,w,h,fill='#fff',stroke='none',r=10)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}"/>`;
const T=(x,y,s,size=26,color='#28352e',weight=400)=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}">${esc(s)}</text>`;
const C=(x,y,r,fill,stroke='none',sw=2)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const P=(d,color,width=3,fill='none')=>`<path d="${d}" fill="${fill}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
const button=(x,y,w,label,active=false,dark=false)=>R(x,y,w,58,active?'#e1bd72':dark?'#5865f2':'#fffdf7',dark?'none':'#a8aa9b',8)+T(x+18,y+38,label,24,dark?'#fff':'#334b37',600);
const cursor=(x,y,click=false)=>`<g transform="translate(${x} ${y})">${click?C(0,0,23,'#d7aa3a22','#c79d3c',3):''}<path d="M0 0 3 30 11 22 18 37 25 33 17 20 30 18Z" fill="#fff" stroke="#1e2933" stroke-width="2.5"/></g>`;
const tick=(x,y,color='#48866c')=>P(`M${x} ${y}l8 8 17-21`,color,4);
const rule=(x,y,w,c='#d9ded6')=>P(`M${x} ${y}h${w}`,c,1);
const avatar=(x,y,name,color='#7387ab',speaking=false)=>C(x,y,26,color,speaking?'#49bd83':'none',5)+T(x-10,y+10,name,23,'#fff',700);
export const interactionScenes={
 mania:{title:'まにあう',width:720,height:1100,duration:20,checkpoints:[.08,.29,.43,.67,.91],source:'train_time: useGeolocation/useWalking/StationPicker/railway UI',note:'実アプリの操作を簡略再現したアニメーションです。位置・駅・時刻・徒歩経路は説明用の例で、実際のGPS取得・経路照会・運行情報ではありません。'},
 career:{title:'しゅうかつ手帳',width:1280,height:900,duration:22,checkpoints:[.1,.3,.48,.69,.91],source:'Syukatu-Note v2: import-inbox.tsx / parser.ts / import.spec.ts',note:'v2のテキスト取り込み、Inbox確認、承認後の反映を簡略再現しています。企業・日程は架空です。MyPage・Gmail・本番DBには接続しません。'},
 stream:{title:'Streaming Screen',width:1280,height:900,duration:20,checkpoints:[.08,.25,.45,.7,.92],source:'Streaming-Screen: studio/editor / render / overlay',note:'表題追加・配置・保存と、保存済みレイアウトのブラウザー出力を再現しています。OBS・YouTube・VTube Studioとの実接続ではありません。'},
 voice:{title:'Yomiage Bot',width:1280,height:900,duration:20,checkpoints:[.08,.29,.48,.7,.92],source:'Yomiage_Discord_Bot: voice_web.ts / voice_web_api.ts',note:'サンプルのDiscord画面で、VC参加・コマンド・投稿・VCでの発話状態を再現しています。実サーバーへ送信せず、無音です。発話リングは音声再生を表す再現で、実際の音声記録ではありません。'},
 weather:{title:'Shindo Bot',width:1280,height:900,duration:22,checkpoints:[.08,.28,.47,.7,.94],source:'Shindo_Discord_Bot: set_eq_channel / set_eq_threshold / eq_notify',note:'通知先・最低震度の設定後、条件を満たす新しい地震情報が指定先へ届く流れです。地震・場所・数値・日時はすべて架空で、実際の速報ではありません。実サーバーへの通知送信は行いません。'},
 moral:{title:'Artificial Moral Architecture',width:1280,height:900,duration:20,checkpoints:[.06,.25,.45,.67,.94],source:'Artificial Moral Architecture: examples/demo.py / docs/assets/cli-demo.txt',note:'実在するCLIコマンドと保存された合成シナリオの出力を、端末上で再現しています。GUI製品ではありません。固定ルールによる研究用例で、現実の道徳能力や外部操作の実行を示しません。'},
 proxy:{title:'Inspection Proxy',width:1280,height:900,duration:20,checkpoints:[.07,.28,.48,.7,.94],source:'ssl-inspection-prodxy: inspection / pii / securityEvents / dashboard',note:'合成HTTP通信の転送後に本文の形式候補を検査し、管理画面で種類・件数を確認する流れです。送信前DLPや漏えい防止の実証ではありません。原文は記録せず、実通信やCA設定の変更はありません。'},
 soccer:{title:'SSL Robot AI',width:1280,height:900,duration:20,checkpoints:[.05,.28,.5,.72,.94],source:'SSL-DEMO: ScoreGrid / PositionLearning / ActionLearning / sim',note:'個人制作の2Dシミュレーターを参考に、位置の変化・パス・シュートの動作を再現しています。配置・軌道は例で、実機の試合・得点・性能向上の実測ではありません。'}
};

function mania(p){
 const t=p*20,search=t>=4&&t<10,result=t>=10,expanded=t>=14;
 let s=R(0,0,720,1100,'#f4efe3')+T(30,61,'まにあう',38)+button(524,20,170,'ダークに切替');
 s+=R(24,103,77,88,'#e9e4d5','#c3bda9',4)+T(42,158,result?'K06':'S14',28,'#334532',700)+R(116,103,343,88,'#fffdf6','#c5bca8',12)+T(135,131,'駅を変更',18,'#7c826b')+T(135,169,result?'今出川':'学園都市',32)+T(423,155,'⌄',30)+button(477,118,218,t>1.2&&t<3.8?'取得中…':'現在地を再取得',t>1.2&&t<2);
 s+=T(26,224,t<1.2?'現在地はまだ取得していません':t<3.8?'現在地を確認しています…':result?'現在地から駅入口まで 約5分':'現在地を更新しました',21,'#6b765c')+rule(0,248,720,'#c1b9a6');
 s+=T(28,298,'DEPARTURES',16,'#b56d48')+T(28,344,'次の電車、まにあう？',35)+T(575,294,'現在時刻 / JST',16,'#71816e')+T(578,344,'9:04',39,'#24483b',700);
 s+=button(28,381,365,result?'京都・竹田・近鉄奈良方面':'三宮・新神戸・谷上方面',true)+button(410,381,280,result?'国際会館方面':'西神中央方面')+button(28,460,145,'徒歩時間')+button(190,460,100,'種別');
 s+=C(33,551,6,'#ad4638')+T(49,558,'間に合わない',19,'#9f3c30')+C(243,551,6,'#96771d')+T(259,558,'急げば間に合う',19,'#87691b')+C(480,551,6,'#2c725a')+T(496,558,'余裕あり',19,'#2c725a');
 const cards=[['9:10','竹田',false],['9:15','新田辺',true],['9:21','竹田',true]];
 cards.forEach(([time,dest,good],i)=>{let y=606+i*151;if(expanded&&i===2)y+=183;if(y>1080)return;s+=C(37,y+50,6,result?(good?'#2c725a':'#ac4439'):'#8a8b7c')+R(58,y,632,130,'#fffdf5',expanded&&i===1?'#ad513b':'#c8c0ae',17)+T(82,y+65,time,43,'#25493e',700)+T(221,y+58,'発',20)+T(258,y+38,'普通',18,'#7a816b')+T(258,y+72,(result?dest:i%2?'新神戸':'谷上')+' 行き',26)+R(258,y+89,225,28,result?(good?'#e0efdf':'#f8e0d8'):'#e8e4d6','none',5)+T(268,y+110,result?(good?'余裕あり':'現在地から間に合わない'):'現在地からの判定は未確認',17,result?(good?'#2c725a':'#ac4439'):'#7a816b')+T(640,y+68,expanded&&i===1?'−':'＋',34,'#a64b34');});
 if(expanded)s+=R(58,876,632,192,'#fffdf5','#ad513b',15)+T(86,913,'ここにいられる目安',21,'#a6654b')+T(86,974,'3分 00秒',52,'#25493e',700)+T(86,1020,'出る目安 9:07 ／ 徒歩5分 ＋ 駅構内・余裕3分',23,'#526a54');
 if(search){s+=R(0,0,720,1100,'#1e302c88')+R(35,144,650,794,'#fffdf6','#aeb49d',19)+T(66,207,'乗車駅を選ぶ',32,'#334b37',700)+T(627,204,'×',35)+T(66,274,'駅名・路線で検索',23)+R(65,300,590,77,'#fff','#768b70',9)+T(86,352,t<6?'':type('今出川',t,6,7.3),32)+T(66,427,t<7.3?'選択中・お気に入りの駅':'1件が見つかりました',22,'#6b795f');if(t>=7.3)s+=R(65,460,590,162,t>=9?'#e4ead8':'#f7f7ef','#aebd9f',11)+T(88,519,'今出川',35,'#324936',700)+T(88,563,'京都市営地下鉄 · 烏丸線',24)+T(88,600,'出発目安対応',20,'#597348');s+=cursor(t<6?190:t<8?mix(190,410,(t-6)/2):465,t<8?343:528,t>8.8&&t<9.5);}
 else if(t<4)s+=cursor(585,148,t>1.2&&t<1.7);else if(t<10)s+=cursor(263,150,true);else if(t>=13)s+=cursor(647,822,t<14.4);
 return s;
}

function career(p){
 const t=p*22,inbox=t>=9&&t<18.2,done=t>=18.2;
 let s=R(0,0,1280,900,'#f7f8fa')+R(0,0,228,900,'#fff','#dfe3e9',0)+T(24,57,'しゅうかつ手帳',27,'#273341',700);
 ['ホーム','企業','カレンダー','タスク','取り込みInbox','設定'].forEach((a,i)=>{if((i===4&&!done)||(i===2&&done))s+=R(13,108+i*80,201,61,'#e9ecf4','none',8);s+=T(32,149+i*80,a,24,'#4b5768');});
 s+=T(267,65,done?'カレンダー':inbox?'取り込みInbox':'テキストから取り込み',34,'#263345',700)+rule(254,94,1000);
 if(!inbox&&!done){s+=T(272,151,'テキスト',24)+R(271,178,959,290,'#fff','#bac3d2',12);const content=t<2?'':type('サンプル社  2028卒  募集案内\nES提出締切：2026年11月12日 23:59',t,2,4);content.split('\n').forEach((v,i)=>s+=T(295,229+i*47,v,29,'#344050'));s+=button(271,500,307,'この端末で解析する',t>=5&&t<6,true);if(t>=6)s+=R(271,593,959,199,'#fff','#c6cdd7',12)+T(296,640,'送信内容の確認',30,'#334050',700)+T(296,682,'2026/11/12 23:59',28)+button(795,705,410,'この抽出結果をInboxに保存',t>=8,true);s+=cursor(t<5?790:t<7?427:1045,t<5?285:t<7?533:739,t>5&&t<5.5||t>8&&t<8.5);}
 else if(inbox){s+=R(271,134,959,620,'#fff','#c9d0db',13)+T(299,186,'ES締切',32,'#2d394d',700)+T(299,238,'企業名',22,'#69788a')+R(434,205,330,56,'#fff','#a8b4c7',6)+T(451,242,type('サンプル社',t,9.3,11),26)+T(798,238,'卒年度',22,'#69788a')+R(899,205,259,56,'#fff','#a8b4c7',6)+T(920,242,'2028卒  ⌄',26)+rule(299,260,900)+T(299,310,'期限',23,'#69788a')+T(468,310,'2026/11/12 23:59',30)+T(299,369,'根拠',23,'#69788a')+R(466,335,719,90,'#f4f6fa')+T(486,387,'締切：2026年11月12日 23:59',25);[['タスクを作成',470],['カレンダーに追加',553]].forEach(([a,y],i)=>{s+=R(302,y-24,31,31,'#5865a7','#9eabbc',4)+T(353,y+2,a,29);s+=tick(306,y-10,'#fff');});s+=button(879,655,307,'確認して反映',t>=15,true)+cursor(t>17?116:t<11?590:t<14?644:1040,t>17?310:t<11?235:t<14?310:687,t>15.5&&t<16.5||t>17.6);}
 else {s+=T(273,146,'2026年11月',31,'#39485a',700)+button(1027,110,202,'＋ 予定を追加');const x=273,y=200,w=133,h=70;['月','火','水','木','金','土','日'].forEach((a,i)=>s+=T(x+i*w+48,y,a,23,'#708097'));for(let i=0;i<42;i++){const xx=x+i%7*w,yy=223+Math.floor(i/7)*h,day=i<6?26+i:i<36?i-5:i-35;s+=R(xx,yy,w,h,'#fff','#d9dfe7',0)+T(xx+12,yy+25,String(day),19,i<6||i>=36?'#b5bfca':'#778292');}s+=R(x+3*w+4,223+2*h+29,w-8,37,'#dfe7f5','none',5)+T(x+3*w+11,223+2*h+47,'ES締切',15,'#354b75')+T(x+3*w+11,223+2*h+62,'23:59',14,'#354b75')+R(273,695,931,117,'#fff','#d0d6e0',11)+T(293,734,'タスク',22,'#728095')+R(295,760,25,25,'#fff','#a8b4c4',4)+T(340,781,'サンプル社 / ES提出',27,'#35455b')+T(887,780,'11/12 23:59',24,'#596a7c');}
 return s;
}

function stream(p){
 const t=p*20,added=t>=3,saved=t>=12,overlay=t>=15;let s=R(0,0,1280,900,'#0e1521')+R(0,0,1280,75,'#151e2d')+T(28,48,'STREAMING SCREEN',29,'#a9e5e0',700)+T(791,48,overlay?'/overlay':'/studio',24,'#adbacb');
 const title=t<4?'今日の配信タイトル':type('ゲームと雑談の時間',t,4,6),x=t<7?350:mix(350,520,(t-7)/3),y=t<7?270:mix(270,213,(t-7)/3);
 if(overlay)return R(0,0,1280,900,'#142337')+R(0,0,1280,64,'#e8edf2','none',0)+R(144,10,996,44,'#fff','none',12)+T(166,40,'127.0.0.1:3000/overlay',22,'#526174')+T(547,272,'ゲームと雑談の時間',36,'#edfafa',700);
 s+=button(1018,9,238,'配信画面 ↗',t>=14&&t<15,true);
 s+=R(0,75,251,825,'#141e2c')+T(23,126,'モジュールを追加',24,'#d9e4f2')+button(23,155,199,'T  表題',t>2&&t<3,true)+T(23,285,'レイヤー',24,'#91a4be');if(added)s+=R(21,310,211,65,'#263e50','#5c9fa7',7)+T(39,351,'表題',23,'#d6f0ef');
 s+=R(278,112,951,537,'#17283c','#47617a',4)+P('M278 380H1229M753 112V649','#294158',1);
 if(added)s+=R(x,y,483,95,'none',saved?'#75b5ac':'#a3e8df',5)+T(x+27,y+59,title,36,'#edfafa',700)+(t<12?[[-5,-5],[478,-5],[-5,90],[478,90]].map(([xx,yy])=>R(x+xx,y+yy,10,10,'#cff6ee','#324f5d',0)).join(''):'');
 s+=T(282,706,'表示テキスト',26,'#c4d1e0')+R(281,730,550,62,'#101a28','#3a526b',8)+T(301,772,title,29,'#d6e4f1')+button(874,730,354,'保存して配信に反映',t>=11&&t<13,true)+T(283,845,saved?'保存しました。OBSには約2秒以内に反映されます':'未保存の変更',22,saved?'#9bcfb7':'#b4becc');
 s+=cursor(t<3?135:t<7?595:t<10?x+260:t<13?1050:1124,t<3?185:t<7?764:t<10?y+45:t<13?762:39,t>2&&t<3||t>11&&t<12.5||t>14&&t<15);return s;
}

function discordBase(channel='テキスト',vc=false,bot=false,speaking=false,t=0){
 let s=R(0,0,1280,900,'#313338')+R(0,0,80,900,'#1e1f22')+C(40,45,26,'#5865f2')+T(26,55,'S',29,'#fff',700)+R(80,0,250,900,'#2b2d31')+T(101,52,'サンプルサーバー',25,'#f1f2f5',700)+rule(80,78,250,'#1f2024')+T(105,126,'テキストチャンネル',18,'#92969f')+R(92,147,224,55,'#404249','none',5)+T(109,184,'# '+channel,25,'#e4e7ed')+T(105,268,'ボイスチャンネル',18,'#92969f')+T(108,315,'◖  通話',25,'#d3d7df');
 if(vc)s+=avatar(134,362,'A','#7b8ea8')+T(173,372,'あなた',22,'#d3d7df')+avatar(134,430,'B','#858071')+T(173,440,'友人',22,'#d3d7df');
 if(bot)s+=avatar(134,498,'B','#5865f2',speaking)+T(173,508,'Bot',22,'#d3d7df');
 if(vc)s+=R(80,798,250,102,'#232c28')+T(104,842,'● ボイス接続完了',22,'#4dc28b')+T(104,876,'通話 / サンプルサーバー',16,'#bbc5bc');
 s+=R(330,0,950,78,'#313338')+T(357,51,'# '+channel,28,'#f2f3f5',700)+rule(330,78,950,'#222328');
 return s;
}
function chat(y,name,message,bot=false){return avatar(374,y+9,bot?'B':'A',bot?'#5865f2':'#7b8ea8')+T(418,y,name,24,bot?'#a4b1ff':'#dce4f4',700)+(bot?R(418+name.length*14+17,y-20,43,24,'#5865f2','none',3)+T(423+name.length*14+17,y-2,'BOT',14,'#fff'):'')+T(418,y+43,message,27,'#dbdee5');}
function voice(p){
 const t=p*20,joined=t>=6,msg=t>=12,speaking=t>=14&&t<19;
 let s=discordBase('テキスト',t>=1,joined,speaking&&Math.sin(t*5)>-.7,t);
 if(t>=4)s+=chat(153,'あなた','/voice_web join');
 if(joined){s+=chat(270,'Yomiage Bot','ボイスチャンネルに参加しました！',true);['接続先: 通話','読み上げチャンネル: テキスト','VOICEVOX Engine 接続先が設定されています。','このチャンネルでメッセージを送信すると読み上げられます。','音声設定を変更するには /voice_web settings を使用してください。'].forEach((line,i)=>s+=T(418,353+i*36,line,21,'#c4ccd9'));}
 if(msg)s+=chat(625,'あなた','今日は文字で参加します。');
 s+=R(353,778,902,76,'#383a40','none',9)+T(378,827,t<4?type('/voice_web join',t,1.5,3.7):t<9?'#テキスト にメッセージを送信':t<12?type('今日は文字で参加します。',t,9,11.8):'#テキスト にメッセージを送信',27,t<4||t>=9&&t<12?'#dce0e9':'#9398a3');
 if(speaking)s+=C(134,498,35,'none','#4ecb8a',2+Math.abs(Math.sin(t*7))*4);
 s+=cursor(t<1?200:870,t<1?312:820,t>3.7&&t<4.2||t>11.7&&t<12.2);return s;
}
function weather(p){
 const t=p*22,notify=t>=14;let s=discordBase('地震速報')+`<g transform="translate(0 ${notify?-50:0})">`;
 if(t>=4)s+=chat(144,'管理者','/set_eq_channel channel: #地震速報');
 if(t>=5.5)s+=chat(252,'Shindo Bot','地震・津波情報の通知先を #地震速報 に設定しました。',true)+T(418,329,'このメッセージはあなただけに表示されています',17,'#939aa8');
 if(t>=10)s+=chat(376,'管理者','/set_eq_threshold threshold: 3');
 if(t>=11.5)s+=chat(482,'Shindo Bot','地震通知を「震度3以上」に設定しました。',true)+T(418,559,'このメッセージはあなただけに表示されています',17,'#939aa8');
 if(notify){s+=avatar(374,611,'B','#5865f2')+T(418,602,'Shindo Bot',24,'#a4b1ff',700)+T(418,638,'地震情報: サンプル県沖 最大震度 3',23,'#dbdee5')+R(418,660,796,182,'#2b2d31','none',6)+R(418,660,5,182,'#2d6cdf','none',0)+T(441,693,'地震情報',27,'#e4e9f2',700);[['震源','サンプル県沖'],['規模','M4.1'],['深さ','30km'],['最大震度','3'],['発生時刻','2026年11月6日 12:00'],['津波','心配なし']].forEach(([label,value],i)=>{let x=441+i%3*250,y=722+Math.floor(i/3)*55;s+=T(x,y,label,17,'#929eaf')+T(x,y+25,value,i===4?17:22,'#dce2ec');});s+=T(441,833,'Source: P2P地震情報 / 気象庁',13,'#8f9bac');}
 s+='</g>'+R(353,818,902,62,'#383a40','none',9)+T(375,858,t<4?type('/set_eq_channel channel: #地震速報',t,.8,3.8):t>=7&&t<10?type('/set_eq_threshold threshold: 3',t,7,9.8):'#地震速報 にメッセージを送信',25,t<4||t>=7&&t<10?'#e1e4eb':'#9398a3')+cursor(1005,848,t>3.8&&t<4.4||t>9.8&&t<10.4);return s;
}

const cliLines=["[A_exam] 試験で最高点を取る","  Decision: MODIFY","  hack: BLOCK (utility=1.0, uncertainty=0.15)","  solve: ALLOW (utility=0.8, uncertainty=0.15)","  hack:alternative:solve_independently: ALLOW (utility=0.8, uncertainty=0.15)","  Selected: hack:alternative:solve_independently","  Execution: simulated","[B_information] ユーザーに必要な情報を提供する","  Decision: MODIFY","  private: BLOCK (utility=0.95, uncertainty=0.15)","  private:alternative:use_public_information: ALLOW (utility=0.75, uncertainty=0.15)","  private:alternative:request_permission: ALLOW (utility=0.5, uncertainty=0.15)","  Selected: private:alternative:use_public_information","  Execution: simulated","[C_files] 重要なファイルを整理する","  Decision: MODIFY","  delete: ASK_HUMAN (utility=0.9, uncertainty=0.8)","  delete:alternative:present_files_for_confirmation: ALLOW (utility=0.6, uncertainty=0.15)","  Selected: delete:alternative:present_files_for_confirmation","  Execution: simulated","[D_safe] 問題の解法を学ぶ","  Decision: ALLOW","  study: ALLOW (utility=0.8, uncertainty=0.15)","  Selected: study","  Execution: simulated","[E_uncertain] 未知の手段を検討する","  Decision: ASK_HUMAN","  unknown: ASK_HUMAN (utility=1.0, uncertainty=0.95)","  Selected: -","  Execution: not executed"];
function moral(p){
 const t=p*20;let s=R(0,0,1280,900,'#11151a')+R(0,0,1280,51,'#242a33','none',0)+T(24,34,'Terminal  —  Artificial Moral Architecture',20,'#c2cbd7');
 s+=T(26,102,'PS > '+type('python examples/demo.py',t,.4,3),29,'#e0e6ee');
 const n=t<3?0:Math.floor(clamp((t-3)/14)*cliLines.length);const visible=cliLines.slice(Math.max(0,n-19),n);
 visible.forEach((line,i)=>s+=T(27,157+i*34,line,22,line.includes('BLOCK')?'#e4a8a2':line.includes('ALLOW')?'#9bcba9':line.includes('MODIFY')?'#e5c484':'#c3d0df'));
 if(t>=18)s+=T(28,854,'PS > ▌',28,'#dbe2e9');return s;
}

function proxy(p){
 const t=p*20,request=t>=3,logged=t>=7,filtered=t>=11,detail=t>=14;
 let s=R(0,0,1280,900,'#f4f6f9')+R(0,0,1280,74,'#fff','#d9dee7',0)+T(27,49,'SSL Inspection Proxy',31,'#2b3a50',700)+T(936,47,'ログ  /  セキュリティイベント',20,'#5c6d82');
 s+=R(25,99,1230,173,'#121c29','none',8)+T(45,135,'Terminal',19,'#8b9cb4')+T(45,179,'$ '+type('curl -i -x 127.0.0.1:8080 http://127.0.0.1:8088/sample',t,.4,3),23,'#d4e1ee');if(request)s+=T(45,227,'HTTP/1.1 200 OK',27,'#9fceaf');
 ['リクエスト','PII候補','ブロック'].forEach((a,i)=>s+=R(25+i*416,299,397,110,'#fff','#dbe2eb',10)+T(47+i*416,335,a,21,'#6d7b8e')+T(47+i*416,387,logged?(i===2?'0':'1'):'0',39,'#354b68',700));
 s+=R(25,439,1230,118,'#fff','#dbe2eb',10)+T(46,476,'フィルタ',23,'#354b68',700)+R(48,498,26,26,t>=9.3?'#536da5':'#fff','#a4b2c6',3)+T(87,520,'PIIのみ',23);if(t>=9.3)s+=tick(51,509,'#fff');s+=button(1051,474,178,'適用',t>=9&&t<11);
 s+=R(25,587,1230,201,'#fff','#dbe2eb',9)+T(46,632,'時刻',21,'#738096')+T(244,632,'ドメイン',21,'#738096')+T(560,632,'状態',21,'#738096')+T(717,632,'処理・検知',21,'#738096')+rule(46,651,1188);
 if(logged)s+=T(46,701,'12:00:03',23)+T(244,701,'127.0.0.1',23)+T(560,701,'200',24,'#497d5a',700)+T(717,701,'PII(メール) 転送後通知 (1)',23,'#a15b33')+T(717,746,'詳細',23,'#365eae',600);
 if(detail)s=R(0,0,1280,900,'#fff')+T(50,65,'← 戻る',25,'#365eae')+T(50,145,'PII 通知',40,'#304460',700)+T(50,215,'転送後の通知です。漏えいの遮断を意味しません。',27)+T(50,261,'本文や一致サンプルは保存・表示しません。',27)+T(50,309,'要求: 対象外 / 応答: 検査済み',23,'#748295')+rule(50,343,1180)+T(69,406,'メール: 検出 (件数=1)',30,'#a15b33')+T(69,470,'カード: 保存された検査範囲で未検出 (件数=0)',27)+T(69,554,'電話番号: 保存された検査範囲で未検出 (件数=0)',27);
 s+=cursor(t<9?800:t<10.2?64:t<12?1120:743,t<9?190:t<10.2?514:t<12?505:742,t>9&&t<9.8||t>10.6&&t<11.3||t>13.5&&t<14.5);return s;
}

function soccer(p){
 const t=p*20;let s=R(0,0,1280,900,'#14251b')+R(0,0,1280,54,'#25362d','none',0)+T(25,36,'SSL Field View',23,'#d3e2d5')+T(503,36,'BLUE 0  -  0 RED',23,'#d3e2d5')+R(36,86,1208,761,'#12671b','#bdd7be',3);
 s+=R(80,128,1120,680,'none','#d9e6d2',0)+P('M640 128V808','#d9e6d2',2)+C(640,468,109,'none','#d9e6d2',2)+R(80,303,159,330,'none','#d9e6d2',0)+R(1041,303,159,330,'none','#d9e6d2',0)+R(54,405,26,126,'none','#e3e9d9',0)+R(1200,405,26,126,'none','#e3e9d9',0);
 const a=[[120,467],[300,300],[320,640],[480,450],[575,645],[690,300]],b=[[1160,467],[1010,280],[990,640],[840,420],[735,600],[760,220]];
 const positions=a.map(([x,y],i)=>[x+Math.sin(t*.3+i)*19+(i===3?Math.min(t,12)*15:0),y+Math.sin(t*.45+i)*42]);
 positions[5][0]+=Math.min(4,Math.max(0,t-10))*38;positions[5][1]+=Math.min(4,Math.max(0,t-10))*12;
 const ball=t<6?[positions[3][0]+24,positions[3][1]]:t<10?[mix(positions[3][0]+24,positions[5][0]+24,(t-6)/4),mix(positions[3][1],positions[5][1],(t-6)/4)]:t<14?[positions[5][0]+24,positions[5][1]]:[mix(positions[5][0]+24,1167,(t-14)/5),mix(positions[5][1],468,(t-14)/5)];
 // The actual simulator displays candidate-position and movement traces.
 positions.forEach(([x,y],i)=>{if(i>0)s+=P(`M${x} ${y}L${x+105} ${y-55}`,'#91cba366',2)+C(x+105,y-55,10,'none','#70a77c',1);});
 positions.forEach(([x,y],i)=>s+=C(x,y,17,'#1745ee')+T(x-7,y+8,String(i),22,'#fff',600));b.forEach(([x,y],i)=>{y+=Math.cos(t*.4+i)*30;s+=C(x,y,17,'#f63e30')+T(x-12,y+8,String(10+i),21,'#fff',600);});
 s+=C(ball[0],ball[1],7,'#ff9a25');return s;
}

export function renderInteractionSvg(kind,progress){
 const meta=interactionScenes[kind];if(!meta)throw Error('Unknown interaction scene: '+kind);
 const p=clamp(progress),draw={mania,career,stream,voice,weather,moral,proxy,soccer}[kind];
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${meta.width} ${meta.height}" width="${meta.width}" height="${meta.height}" data-kind="${kind}" data-progress="${p.toFixed(4)}" style="font-family:Meiryo,'Yu Gothic',sans-serif">${draw(p)}</svg>`;
}
