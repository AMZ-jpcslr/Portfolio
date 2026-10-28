import React,{useRef,useLayoutEffect,useMemo} from 'react';
import {AbsoluteFill,Composition,registerRoot,useCurrentFrame,delayRender,continueRender} from 'remotion';
import {renderDemoScene,captions} from '../../dist/demos.js';
import {projects} from '../../dist/projects.js';
import '../../dist/demos.css';
import '../../dist/films.css';
import '../src/film.css';

const titles={career:'しゅうかつ手帳',stream:'Streaming Screen',voice:'Yomiage Bot',weather:'Shindo Bot',moral:'Artificial Moral Architecture',proxy:'Inspection Proxy',soccer:'SSL Robot AI'};
function Actors({kind,clock}){
 const ref=useRef(null),tracks=useRef(null);
 const html=useMemo(()=>({__html:renderDemoScene(projects.find(p=>p.kind===kind))}),[kind]);
 useLayoutEffect(()=>{
  const handle=delayRender('Synchronize reconstructed UI');
  if(!tracks.current){const original=ref.current.getAnimations({subtree:true});tracks.current=original.map(a=>{const effect=a.effect;const clone=new Animation(new KeyframeEffect(effect.target,effect.getKeyframes(),{...effect.getTiming(),fill:'both'}),document.timeline);clone.pause();a.cancel();effect.target.style.setProperty('animation','none','important');return clone;});}
  Promise.all(tracks.current.map(a=>a.ready)).then(()=>tracks.current.forEach(a=>a.currentTime=clock)).finally(()=>continueRender(handle));
 },[clock]);
 return <div ref={ref} className="remotion-actor" dangerouslySetInnerHTML={html}/>;
}
function Film({kind}){
 const frame=useCurrentFrame(),phase=Math.min(2,Math.floor(frame/96));
 const text=captions[kind];
 return <AbsoluteFill lang="ja" style={{background:'#151c19',color:'#f5f0e4',fontFamily:'Meiryo,"Yu Gothic",sans-serif',padding:'34px 62px'}}>
  <style>{`.remotion-actor,.remotion-actor *{font-family:Meiryo,'Yu Gothic',sans-serif!important}.remotion-actor{width:620px;height:350px}.remotion-actor .scene-camera{animation:none!important;transform:none!important;transition:none!important}`}</style>
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:27,height:55}}><b>{titles[kind]}</b><span style={{fontSize:21,color:'#d8bb85',border:'1px solid #8f805f',padding:'7px 15px'}}>動作イメージ・再現映像</span></div>
  <div style={{height:630,marginTop:20,overflow:'hidden',border:'1px solid #6a776b',background:'#f0eee5'}}><div style={{transform:'scale(1.8)',transformOrigin:'top left',width:620,height:350}}><Actors kind={kind} clock={frame/24*2000}/></div></div>
  <div style={{display:'flex',gap:20,marginTop:24,alignItems:'start'}}><span style={{fontSize:23,color:'#d8bb85',whiteSpace:'nowrap'}}>0{phase+1} / 03</span><p style={{fontSize:22,lineHeight:1.7,margin:0}}>{text[phase]}</p></div>
  <div style={{position:'absolute',bottom:0,left:0,height:3,width:`${frame/287*100}%`,background:'#d8bb85'}}/>
 </AbsoluteFill>;
}
registerRoot(()=> <>{Object.keys(titles).map(kind=><Composition key={kind} id={`Review-${kind}`} component={Film} width={1240} height={900} fps={24} durationInFrames={288} defaultProps={{kind}}/>)}</>);
