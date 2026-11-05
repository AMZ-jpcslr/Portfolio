import React from 'react';
import {AbsoluteFill,Composition,registerRoot,useCurrentFrame} from 'remotion';
import {featureFlows,renderFlowSvg} from '../../site/music/feature-flows.js';

function FlowFilm({kind}:{kind:string}){
 const frame=useCurrentFrame(),story=featureFlows[kind];
 const stage=Math.min(3,Math.floor(frame/120));
 const raw=(frame%120)/120,progress=Math.min(1,Math.max(0,(raw-.12)/.55));
 const eased=progress*progress*(3-2*progress);
 return <AbsoluteFill lang="ja" style={{background:'#f4f0e4',color:'#293c33',fontFamily:'Meiryo,"Yu Gothic",sans-serif'}}>
  <div style={{position:'absolute',top:23,left:48,right:48,display:'flex',justifyContent:'space-between',alignItems:'center',gap:20}}>
   <strong style={{fontSize:kind==='moral'?25:30}}>{story.title}</strong><span style={{fontSize:18,whiteSpace:'nowrap',color:'#58634e'}}>入力から結果まで / 動作イメージ・再現映像</span>
  </div>
  <div style={{position:'absolute',top:86,left:48,right:48,display:'flex',gap:10}}>{story.steps.map((s:string,i:number)=><div key={s} style={{flex:1,padding:'10px 14px',borderBottom:`4px solid ${i===stage?story.color:'#d3d7c8'}`,fontSize:16,color:i===stage?'#263f2c':'#737b68',fontWeight:i===stage?700:400}}><span style={{fontSize:12,marginRight:7}}>0{i+1}</span>{s}</div>)}</div>
  <div style={{position:'absolute',top:145,left:60,width:1120,height:667}} dangerouslySetInnerHTML={{__html:renderFlowSvg(kind,stage,eased)}}/>
  <div style={{position:'absolute',left:56,right:56,bottom:50,display:'flex',alignItems:'start',gap:22}}><strong style={{color:story.color,fontSize:25,whiteSpace:'nowrap'}}>0{stage+1} / 04</strong><p style={{fontSize:23,lineHeight:1.65,margin:0}}>{story.captions[stage]}</p></div>
  <div style={{position:'absolute',bottom:17,left:56,right:56,display:'flex',justifyContent:'space-between',gap:20,fontSize:12,color:'#69765c'}}><span>{kind==='moral'?'CLIの模式化 / 合成シナリオ / 外部操作なし':kind==='proxy'?'架空の通信 / PII本文通知は転送後 / 送信前DLPではありません':'架空データによる機能説明 / 実サービスの録画ではありません'}</span><span>機能フロー / 無音</span></div>
  <div style={{position:'absolute',bottom:0,left:0,height:4,width:`${frame/479*100}%`,background:story.color}}/>
 </AbsoluteFill>;
}
registerRoot(()=> <>{Object.keys(featureFlows).map(kind=><Composition key={kind} id={`Review-${kind}`} component={FlowFilm} width={1240} height={900} fps={24} durationInFrames={480} defaultProps={{kind}}/>)}</>);
