import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {AbsoluteFill, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {films} from '../../dist/films.js';
import {projects} from '../../dist/projects.js';
import {renderDemoScene} from '../../dist/demos.js';
import fontGroups from './fonts.json';
import '../../dist/demos.css';
import '../../dist/films.css';
import './film.css';

const clamp = {extrapolateLeft:'clamp', extrapolateRight:'clamp'} as const;
const colors = {paper:'#f3f2ee', ink:'#1d2b32', accent:'#bb3c20', muted:'#566269', line:'#c8cdc9'};
const fontCss = `@font-face{font-family:FilmMincho;src:url('${staticFile('assets/fonts/shippori-film.woff2')}');font-weight:600;font-display:block;}` + fontGroups.map(f =>
  `@font-face{font-family:PortfolioSans;src:url('${staticFile(f.file)}');font-weight:400 700;font-display:block;unicode-range:${f.ranges};}`
).join('');

// The existing actors retain the verified operation sequence. Remotion owns their clock.
const Actors = ({kind, frame}:{kind:string; frame:number}) => {
  const ref = useRef<HTMLDivElement>(null);
  const controlled = useRef<Animation[] | null>(null);
  const markup = useMemo(() => renderDemoScene(projects.find(p => p.kind === kind)), [kind]);
  const html = useMemo(() => ({__html:markup}),[markup]);
  useLayoutEffect(() => {
    const handle = delayRender('Synchronize reconstruction actors');
    if (!controlled.current) {
      const originals = ref.current?.getAnimations({subtree:true}) || [];
      const tracks = originals.map(animation => {
        const effect = animation.effect as KeyframeEffect;
        return {target:effect.target as HTMLElement, frames:effect.getKeyframes(), timing:effect.getTiming()};
      });
      for (const animation of originals) animation.cancel();
      for (const track of tracks) track.target.style.setProperty('animation','none','important');
      controlled.current = tracks.map(track => {
        const animation = new Animation(new KeyframeEffect(track.target,track.frames,{...track.timing,fill:'both'}),document.timeline);
        animation.pause(); return animation;
      });
    }
    const animations = controlled.current;
    Promise.all(animations.map(animation => animation.ready)).then(() => {
      animations.forEach(animation => { animation.currentTime = frame / 30 * 1000; });
    }).finally(() => continueRender(handle));
  },[frame,html]);
  return <div className="remotion-actor" ref={ref} dangerouslySetInnerHTML={html}/>;
};

const Intro = ({film, number}:{film:any; number:string}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config:{damping:22, stiffness:110}});
  const opacity = interpolate(frame,[47,65],[1,0],clamp);
  return <AbsoluteFill style={{background:colors.paper, padding:78, opacity, justifyContent:'center'}}>
    <div style={{fontSize:20, letterSpacing:2, color:colors.muted, marginBottom:35}}>{number} / 07 · {film.title}</div>
    {film.hook.map((text:string,index:number) => <div key={text} style={{overflow:'hidden'}}><div style={{fontFamily:'FilmMincho, serif', fontWeight:600, fontSize:88, lineHeight:1.7, letterSpacing:-3, color:index ? colors.accent : colors.ink, transform:`translateY(${(1-enter)*65 + index*(1-enter)*20}px)`, opacity:enter}}>{text}</div></div>)}
    <div style={{width:90, height:3, background:colors.accent, marginTop:32, transform:`scaleX(${enter})`, transformOrigin:'left'}}/>
    <div style={{fontSize:17, color:colors.muted, letterSpacing:2, marginTop:26}}>A PERSONAL APPROACH TO REAL PROBLEMS.</div>
  </AbsoluteFill>;
};

const Outro = ({film, number}:{film:any; number:string}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame,[0,14,62,79],[0,1,1,0],clamp);
  const rise = interpolate(frame,[0,18],[20,0],clamp);
  return <AbsoluteFill style={{background:colors.paper, padding:78, opacity, justifyContent:'center'}}>
    <div style={{fontSize:19, letterSpacing:2, color:colors.accent, marginBottom:35}}>PEOPLE & PRACTICE / {number}</div>
    <div style={{fontSize:47, lineHeight:1.7, fontWeight:500, transform:`translateY(${rise}px)`}}>{film.result}</div>
    <div style={{fontSize:29, lineHeight:1.8, color:colors.muted, marginTop:20}}>{film.value}</div>
    <div style={{height:1, background:colors.line, margin:'52px 0 30px'}}/>
    <div style={{display:'flex', justifyContent:'space-between', fontSize:20}}><span>{film.title}</span><span style={{color:colors.muted}}>北岡 英磨 / AMZ</span></div>
  </AbsoluteFill>;
};

export const ProductFilm = ({kind}:{kind:string}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const project = projects.find(p => p.kind === kind);
  const film = {...films[kind], ...(kind==='moral' ? {result:'個人研究・試作段階'} : {})};
  const [fontHandle] = useState(() => delayRender('Load local portfolio fonts'));
  useEffect(() => { document.fonts.ready.then(() => continueRender(fontHandle)); },[fontHandle]);
  const enter = spring({frame:frame-40, fps, config:{damping:25, stiffness:85}});
  const chapter = Math.min(2, Math.floor(frame / 240));
  const chapterFrame = frame - chapter*240;
  const chapterOpacity = interpolate(chapterFrame,[0,13,218,239],[0,1,1,0],clamp);
  const progress = frame/719;
  return <AbsoluteFill style={{fontFamily:'PortfolioSans, sans-serif', background:colors.paper, color:colors.ink}}>
    <style>{fontCss}</style>
    <div style={{position:'absolute', top:36, left:62, right:62, display:'flex', justifyContent:'space-between', fontSize:17, letterSpacing:1.5, color:colors.muted}}><span>{project.number} / 07 · {film.label}</span><span>UI RECONSTRUCTION</span></div>
    <div style={{position:'absolute', top:76, left:62, right:62, fontSize:36, fontWeight:500, lineHeight:1.4, letterSpacing:-1}}>{film.title}</div>
    <div style={{position:'absolute', top:142, left:62, width:1116, height:630, overflow:'hidden', border:`1px solid ${colors.line}`, opacity:enter, transform:`translateY(${(1-enter)*35}px)`}}>
      <div style={{transform:'scale(1.8)', transformOrigin:'top left', width:620, height:350}}><Actors kind={kind} frame={frame}/></div>
    </div>
    <div style={{position:'absolute', left:62, right:62, top:797, opacity:chapterOpacity}}><div style={{fontSize:18, color:colors.accent, letterSpacing:1.5}}>0{chapter+1} / {film.chapters[chapter][0]}</div><div style={{fontSize:29, lineHeight:1.6, marginTop:9}}>{film.chapters[chapter][1]}</div></div>
    <Sequence from={0} durationInFrames={66}><Intro film={film} number={project.number}/></Sequence>
    <Sequence from={640} durationInFrames={80}><Outro film={film} number={project.number}/></Sequence>
    <div style={{position:'absolute', bottom:0, left:0, height:3, width:`${progress*100}%`, background:colors.accent}}/>
  </AbsoluteFill>;
};
