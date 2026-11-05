import React from 'react';
import {AbsoluteFill,Composition,registerRoot,useCurrentFrame} from 'remotion';
import {pvStories,pvSegmentAt,pvStageForBeat,renderPvContextSvg,renderPvProductSvg,renderShortPvSvg} from '../../site/music/product-pv.js';

const ease=(n:number)=>{const t=Math.max(0,Math.min(1,n));return 1-Math.pow(1-t,3)};
function PvScene({kind,beat,progress,opacity=1}:{kind:string;beat:number;progress:number;opacity?:number}){
 const story=pvStories[kind],closing=beat===6,context=beat<2,stage=pvStageForBeat(beat);
 const intro=ease(progress*5),headline=story.headlines[beat];
 const length=Math.max(...headline.map((line:string)=>[...line].reduce((n,c)=>n+(/[\x00-\x7f]/.test(c)?.55:1),0)));
 const size=Math.min(52,430/(length+.5)),ink=closing?'#f5f1e4':'#294a34',muted=closing?'#d0ddc8':'#718365';
 const art=context?renderPvContextSvg(kind,progress):renderPvProductSvg(kind,stage,Math.min(1,progress*1.5));
 return <AbsoluteFill style={{opacity}}>
  <div style={{position:'absolute',left:64,top:closing?165:200,width:440,transform:`translateY(${(1-intro)*16}px)`,opacity:intro}}>
   {closing&&<h2 style={{fontSize:kind==='moral'?37:51,lineHeight:1.25,margin:'0 0 25px',color:ink}}>{story.title}</h2>}
   <div style={{fontSize:size,fontWeight:700,lineHeight:1.42,color:ink,letterSpacing:0}}>{headline.map((line:string,i:number)=><div key={line} style={{whiteSpace:'nowrap',opacity:ease(progress*6-i*.4),transform:`translateY(${(1-ease(progress*6-i*.4))*13}px)`}}>{line}</div>)}</div>
   <div style={{width:54,height:4,background:story.color,margin:'25px 0 23px',transform:`scaleX(${intro})`,transformOrigin:'left'}}/>
   <div style={{display:'flex',flexDirection:'column',gap:10,color:muted,fontSize:17,lineHeight:1.7}}>{story.chips.map((chip:string)=><span key={chip}>— {chip}</span>)}</div>
  </div>
  <div style={{position:'absolute',left:context?521:510,top:context?147:165,width:context?663:674,transform:`translate(${(1-intro)*20}px,${Math.sin(progress*Math.PI)*-5}px) scale(${.985+intro*.015})`,transformOrigin:'center',opacity:intro}}>
   {!context&&<div style={{height:25,borderRadius:'15px 15px 0 0',border:'1px solid #c4ceb9',borderBottom:0,background:closing?'#d4e1cb':'#e7eddd',display:'flex',alignItems:'center',gap:5,paddingLeft:14}}>{['#93aa86','#b4c39e','#ccd5bf'].map(c=><span key={c} style={{width:5,height:5,borderRadius:6,background:c}}/>)}</div>}
   <div style={{background:context?'transparent':'#faf9f0',border:context?'none':'1px solid #c4ceb9',borderRadius:context?0:'0 0 15px 15px',padding:context?0:8,boxShadow:context?'none':'0 17px 38px #233b2218'}} dangerouslySetInnerHTML={{__html:art}}/>
  </div>
 </AbsoluteFill>;
}
function LongPv({kind}:{kind:string}){
 const frame=useCurrentFrame(),time=frame/24,story=pvStories[kind],segment=pvSegmentAt(time),progress=(time-segment.start)/(segment.end-segment.start),closing=segment.index===6;
 const fade=Math.min(1,(time-segment.start)/.34);
 return <AbsoluteFill lang="ja" style={{background:closing?'#263f32':'#f4f1e7',color:closing?'#f4f0e1':'#2c4b35',fontFamily:'Meiryo,"Yu Gothic",sans-serif',overflow:'hidden'}}>
  <div style={{position:'absolute',width:720,height:720,borderRadius:'50%',background:closing?'#ffffff06':story.color+'0c',left:670,top:54}}/>
  <div style={{position:'absolute',width:420,height:420,borderRadius:'50%',border:'1px solid '+(closing?'#b3c6a31a':'#8ca27720'),left:805,top:206}}/>
  <div style={{position:'absolute',left:63,top:38,right:63,display:'flex',alignItems:'center',justifyContent:'space-between'}}><div><div style={{fontSize:11,letterSpacing:2,color:closing?'#bacfb0':story.color,marginBottom:8,fontWeight:700}}>{story.category}</div><strong style={{fontSize:kind==='moral'?25:31}}>{story.title}</strong></div><span style={{fontSize:12,letterSpacing:1.2,color:closing?'#bed0b4':'#7b8b70'}}>PRODUCT PREVIEW / {segment.label}</span></div>
  {segment.index>0&&fade<1&&<PvScene kind={kind} beat={segment.index-1} progress={1} opacity={1-fade}/>}
  <PvScene kind={kind} beat={segment.index} progress={progress} opacity={fade}/>
  <div style={{position:'absolute',left:64,right:64,top:630,borderTop:'1px solid '+(closing?'#8da37f60':'#b8c7ac'),paddingTop:14,display:'block'}}><span style={{fontSize:16,color:closing?'#bbd0ae':story.color,whiteSpace:'nowrap',fontWeight:700,display:'block',marginBottom:8}}>{segment.label}</span><p style={{fontSize:46,lineHeight:1.42,margin:0,color:closing?'#e8eddf':'#425c46'}}>{story.detailCaptions[segment.index]}</p></div>
  <div style={{position:'absolute',bottom:22,left:64,right:64,display:'flex',justifyContent:'space-between',gap:20,fontSize:11,color:closing?'#b8caae':'#7a896e'}}><span>{story.shortCaution}</span><span style={{whiteSpace:'nowrap'}}>PV / 再現映像 / 無音</span></div>
  <div style={{position:'absolute',bottom:0,left:0,height:3,width:`${frame/719*100}%`,background:closing?'#b8ce9e':story.color}}/>
 </AbsoluteFill>;
}
function ShortPv({kind}:{kind:string}){
 const frame=useCurrentFrame(),time=frame/24,phase=time<4?0:time<8?1:2,start=[0,4,8][phase],duration=4,progress=(time-start)/duration;
 return <AbsoluteFill lang="ja" style={{background:'#f4f1e7',fontFamily:'Meiryo,sans-serif'}}><div style={{width:1240,margin:'0 auto',height:1188}} dangerouslySetInnerHTML={{__html:renderShortPvSvg(kind,phase,progress)}}/></AbsoluteFill>;
}
registerRoot(()=> <>{Object.keys(pvStories).flatMap(kind=>[<Composition key={'long-'+kind} id={`PV-Long-${kind}`} component={LongPv} width={1240} height={900} fps={24} durationInFrames={720} defaultProps={{kind}}/>,<Composition key={'short-'+kind} id={`PV-Short-${kind}`} component={ShortPv} width={1240} height={1188} fps={24} durationInFrames={288} defaultProps={{kind}}/>])}</>);
