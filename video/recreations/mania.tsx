import React from 'react';
import {AbsoluteFill, Composition, Easing, interpolate, registerRoot, useCurrentFrame, useVideoConfig} from 'remotion';

// Independently authored local recreation. Inputs and semantics checked against
// train_time/src/departure-lab/{model,main,TicketMachine}.tsx (read-only).
// This is a film, not a live application or a recording of the application.
const C = {ink:'#15251e', cream:'#f4eedb', amber:'#ffda7a', metal:'#c6d0c5', edge:'#839987', muted:'#bdd0bd'};
const smooth=(t:number,a:number,b:number)=>interpolate(t,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.inOut(Easing.cubic)});
const clickTimes=[1.5,3.1,4.5,7.2,8.25,9.3,13.8,17.6];
const track=[[0,1140,752],[.8,1140,752],[1.4,310,692],[1.7,310,692],[2.6,530,398],[3.2,530,398],[4.3,810,520],[4.7,810,520],[5.3,1140,752],[6.6,1140,752],[7.1,935,692],[7.5,935,692],[8.1,440,418],[8.5,440,418],[9.2,795,520],[9.5,795,520],[10,1140,752],[13,1140,752],[13.7,948,535],[14.1,948,535],[15,1140,752],[17,1140,752],[17.5,945,599],[17.9,945,599],[18.6,1140,752],[20,1140,752]];
function Pointer({t}:{t:number}){
 const i=Math.max(0,track.findIndex((p,n)=>n<track.length-1&&t>=p[0]&&t<track[n+1][0]));
 const a=track[i],b=track[i+1],p=smooth(t,a[0],b[0]);
 const tap=clickTimes.find(c=>t>=c&&t<c+.5),r=tap===undefined?0:(t-tap)/.5;
 return <div style={{position:'absolute',left:a[1]+(b[1]-a[1])*p,top:a[2]+(b[2]-a[2])*p,zIndex:9}}>
  {tap!==undefined&&<div style={{position:'absolute',width:18+r*64,height:18+r*64,border:`3px solid ${C.amber}`,borderRadius:'50%',transform:'translate(-50%,-50%)',opacity:1-r}}/>}
  <svg width="29" height="37" viewBox="0 0 29 37" style={{transform:`scale(${tap!==undefined&&r<.25?.86:1})`,transformOrigin:'0 0',filter:'drop-shadow(1px 2px 3px #0008)'}}><path d="M2 2 L3 29 L10 22 L16 34 L22 31 L16 19 L26 18 Z" fill="#fffef4" stroke={C.ink} strokeWidth="2.5"/></svg>
 </div>;
}
function Key({children,active=false,style={}}:{children:React.ReactNode;active?:boolean;style?:React.CSSProperties}){return <div style={{background:active?C.amber:'#e8ece1',color:C.ink,border:'1px solid #8da08e',borderBottom:'4px solid #718572',padding:'14px 20px',fontSize:21,fontWeight:700,...style}}>{children}</div>}
function Mania(){
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
 const stationSheet=t>=1.5&&t<4.65,walkSheet=t>=7.2&&t<9.45;
 const shibuya=t>=4.65,walk=t>=9.45?6:1,manual=t>=13.95&&t<17.75;
 const recommended=walk===1?'14:08':'14:15',selected=manual?'14:22':recommended;
 const remaining=manual?13:walk===1?4:6,leave=`14:${String(remaining).padStart(2,'0')}`;
 const station=shibuya?'渋谷':'大阪',line=shibuya?'東急東横線':'JR京都線・JR神戸線';
 const dest=shibuya?'元町・中華街':'米原';
 const service=(time:string)=>shibuya?(time==='14:08'?'急行':time==='14:15'?'特急':'各駅停車'):(time==='14:08'?'快速':time==='14:15'?'新快速':'普通');
 const phase=t<5.6?0:t<11.8?1:t<17.75?2:3;
 const captions=['駅名を入力して、出発する駅を選ぶ。','徒歩時間を変えると、今出る目安の便も変わる。','一本後を選び、出る時刻と残り時間を見比べる。','自動選択に戻して、今出る場合の目安を確認。'];
 const changeAt=manual?13.95:t>=17.75?17.75:walk===6?9.45:shibuya?4.65:0;
 const flash=1-smooth(t,changeAt,changeAt+.75);
 const modalTime=stationSheet?1.5:7.2,modalIn=smooth(t,modalTime,modalTime+.25);
 return <AbsoluteFill lang="ja" style={{background:'#151c19',color:C.cream,fontFamily:'Meiryo,"Yu Gothic",sans-serif'}}>
  <style>{`*{box-sizing:border-box} .mania-num{font-family:'Bahnschrift','Arial Narrow',sans-serif;font-variant-numeric:tabular-nums} .mania-small{font-size:17px;line-height:1.6}`}</style>
  <div style={{position:'absolute',left:62,top:35,right:62,display:'flex',alignItems:'center',justifyContent:'space-between'}}><b style={{fontSize:28}}>まにあう <span style={{fontSize:18,fontWeight:400,color:'#c6cabe',marginLeft:14}}>Maniaū</span></b><span style={{fontSize:21,border:'1px solid #8f805f',color:'#dfc38f',padding:'8px 15px'}}>動作イメージ（再現映像）</span></div>
  <div style={{position:'absolute',left:62,top:110,width:1116,height:630,background:C.metal,border:'1px solid #8b9a8d',overflow:'hidden',color:C.ink}}>
   <div style={{height:60,background:'#20372c',color:C.cream,padding:'15px 25px',display:'flex',justifyContent:'space-between',alignItems:'center'}}><b style={{fontSize:25,letterSpacing:2}}>まにあう <span style={{fontSize:17,fontWeight:400,letterSpacing:0,marginLeft:15}}>出発の目安</span></b><span style={{fontSize:17}}>模擬ダイヤ ・ 固定時計 14:00</span></div>
   <div style={{position:'absolute',left:24,top:80,width:620,height:268,background:'#102219',border:'6px solid #748a76',outline:'1px solid #d7e0d3',padding:'16px 23px',color:C.cream}}>
    <div style={{fontSize:18,color:C.muted,display:'flex',justifyContent:'space-between'}}><span>今出れば、何時の電車？</span><span>今出る目安</span></div>
    <div style={{display:'flex',alignItems:'center',gap:18,marginTop:13,borderLeft:`5px solid ${shibuya?'#d07a86':'#78b6d6'}`,paddingLeft:13}}><strong style={{fontSize:31}}>{station}</strong><span style={{fontSize:18}}>{line}<br/>{shibuya?'横浜・元町中華街方面':'京都・米原方面'}</span></div>
    <div style={{display:'flex',alignItems:'center',gap:22,height:109}}><strong className="mania-num" style={{fontSize:95,lineHeight:1,color:C.amber,letterSpacing:2}}>{recommended}</strong><span style={{fontSize:22,color:C.amber}}>発</span><div style={{fontSize:22,lineHeight:1.8}}><b>{service(recommended)}</b><br/><span style={{fontSize:19}}>{dest} 行き</span></div></div>
    <div style={{borderTop:'1px dashed #748a76',paddingTop:9,fontSize:18,color:C.muted}}>徒歩 {walk}分 ＋ 駅構内・余裕 3分で計算</div>
   </div>
   <div style={{position:'absolute',left:670,top:80,width:420,height:268,background:C.cream,padding:'20px 24px',boxShadow:'0 4px 0 #819381',borderTop:`5px solid ${manual?'#b17a35':'#7a8e72'}`,transform:`translateY(${flash*3}px)`}}>
    <div style={{display:'flex',justifyContent:'space-between',fontSize:18,borderBottom:'1px dashed #a5aa90',paddingBottom:11}}><b>出発メモ</b><span>{manual?'手動で選択':'自動で選択'}</span></div>
    <div style={{fontSize:22,marginTop:12}}>選んだ便 <b className="mania-num" style={{fontSize:33,marginLeft:10}}>{selected}</b> 発</div>
    <div style={{display:'flex',alignItems:'end',justifyContent:'space-between',marginTop:10}}><div><span style={{fontSize:17}}>ここを出る目安</span><div className="mania-num" style={{fontSize:44,fontWeight:700}}>{leave}</div></div><div style={{textAlign:'right'}}><span style={{fontSize:17}}>ここにいられる目安</span><div><b className="mania-num" style={{fontSize:55,color:'#294d34'}}>{remaining}</b><span style={{fontSize:21}}> 分</span></div></div></div>
    <div style={{borderTop:'1px dashed #a5aa90',fontSize:16,marginTop:9,paddingTop:9,color:'#53634e'}}>時刻表による目安 ／ 乗車券ではありません</div>
   </div>
   <div style={{position:'absolute',left:24,top:369,width:620}}>
    <div style={{display:'flex',justifyContent:'space-between',fontSize:18,marginBottom:10}}><b>別の便を選ぶ</b><span>種別：すべて</span></div>
    {['14:08','14:15','14:22'].map(time=><div key={time} style={{height:45,display:'flex',alignItems:'center',background:time===selected?'#364f3c':'#e4e9df',color:time===selected?C.cream:C.ink,borderBottom:'1px solid #a5b2a3',padding:'0 16px',gap:20}}><strong className="mania-num" style={{fontSize:27,width:86}}>{time}</strong><span style={{fontSize:18,width:100}}>{service(time)}</span><span style={{fontSize:17,flex:1}}>{dest}</span><span style={{fontSize:16}}>{time===selected?'✓ 選択中':time===recommended?'今出る目安':'＋'}</span></div>)}
   </div>
   <div style={{position:'absolute',left:670,top:369,width:420}}><div style={{fontSize:18,marginBottom:10}}>選んだ便から、次の便へ</div><Key active={manual} style={{textAlign:'center',height:58}}>条件に合う一本後 →</Key><Key style={{textAlign:'center',marginTop:12,height:53,background:!manual?'#d8dfd2':'#e8ece1',color:!manual?'#5c6b57':C.ink}}>自動選択に戻す</Key></div>
   <div style={{position:'absolute',left:24,right:24,bottom:18,display:'flex',gap:18}}><Key style={{width:620,height:58,display:'flex',justifyContent:'space-between'}}><span>駅・路線 <b style={{marginLeft:25}}>{station}</b></span><span>駅名で探す →</span></Key><Key style={{flex:1,height:58,display:'flex',justifyContent:'space-between'}}><span>駅までの徒歩</span><span>{walk}分　変更</span></Key></div>
   {(stationSheet||walkSheet)&&<div style={{position:'absolute',inset:0,background:`rgba(10,25,17,${.54*modalIn})`}}><div style={{position:'absolute',left:218,top:70,width:680,height:482,background:'#d1dbcf',border:'6px solid #7e947f',boxShadow:'0 14px 35px #08180c77',padding:28,opacity:modalIn,transform:`translateY(${(1-modalIn)*25}px)`}}>
    <div style={{display:'flex',justifyContent:'space-between',fontSize:28,fontWeight:700,paddingBottom:17,borderBottom:'1px solid #8a9c83'}}><span>{stationSheet?'駅・路線を選ぶ':'駅までの徒歩時間'}</span><span style={{fontSize:23}}>×</span></div>
    {stationSheet?<><p style={{fontSize:18,margin:'17px 0'}}>模擬ダイヤの比較用3駅から、駅名で検索</p><div style={{fontSize:17,marginBottom:8}}>駅名・路線名で探す</div><div style={{background:'#fffdf4',border:'3px solid #6b826c',height:58,padding:'9px 15px',fontSize:25}}>{t<3.1?<span style={{color:'#7c8775'}}>大阪、渋谷、東京</span>:t<3.5?'渋':'渋谷'}<span style={{opacity:Math.floor(t*3)%2===0?1:0,borderRight:'2px solid #314b34',marginLeft:3}}/></div><div style={{fontSize:17,margin:'13px 0'}}>{t<3.1?'3':'1'}駅 ／ 比較用の出発目安</div><div style={{background:t>=4.5?'#ead799':'#edf0e5',border:'1px solid #8d9e83',padding:'16px 20px',height:104}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><strong style={{fontSize:30}}>{t<3.1?'大阪':'渋谷'}</strong><b style={{fontSize:20}}>この駅で表示 →</b></div><span style={{fontSize:18}}>{t<3.1?'JR西日本 ／ JR京都線・JR神戸線':'東急電鉄 ／ 東横線'}</span></div><p style={{fontSize:16}}>駅と方面は比較例です。実際の運行情報ではありません。</p></>:<><p style={{fontSize:19,lineHeight:1.8,margin:'20px 0'}}>現在地から駅の入口まで。<br/>駅構内と乗車の余裕は、別に3分を加えます。</p><div style={{display:'flex',alignItems:'center',gap:15}}><div className="mania-num" style={{width:210,height:76,background:'#fffdf4',border:'3px solid #6b826c',padding:'5px 22px',fontSize:47}}>{t<8.25?'1':'6'}<span style={{borderRight:'2px solid #314b34',marginLeft:5,opacity:Math.floor(t*3)%2===0?1:0}}/></div><b style={{fontSize:26}}>分</b><span style={{fontSize:17}}>0〜90分の整数</span></div><Key active={t>=9.3} style={{marginTop:28,textAlign:'center',background:t>=9.3?C.amber:'#304e37',color:t>=9.3?C.ink:C.cream}}>この時間で目安を見る →</Key><p style={{fontSize:16}}>この再現では、位置情報を取得しません。</p></>}
   </div></div>}
  </div>
  <div style={{position:'absolute',left:62,top:766,right:62,display:'flex',gap:24,alignItems:'center'}}><span className="mania-num" style={{fontSize:26,color:'#dfc38f'}}>0{phase+1} / 04</span><span style={{fontSize:24}}>{captions[phase]}</span></div>
  <div style={{position:'absolute',left:62,bottom:33,color:'#c1c8b9',fontSize:17}}>駅・時刻は説明用の模擬例 ／ 14:00固定 ／ 遅延・運休は反映していません</div>
  <div style={{position:'absolute',bottom:0,left:0,width:`${frame/479*100}%`,height:3,background:'#d8bb85'}}/>
  <Pointer t={t}/>
 </AbsoluteFill>;
}
registerRoot(()=> <Composition id="Mania-Local-Recreation" component={Mania} width={1240} height={900} fps={24} durationInFrames={480}/>);
