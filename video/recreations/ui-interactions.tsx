import React from 'react';
import {AbsoluteFill,Composition,registerRoot,useCurrentFrame,useVideoConfig} from 'remotion';
import {interactionScenes,renderInteractionSvg} from '../../site/music/interaction-scenes.js';
function Interaction({kind}:{kind:string}){
 const frame=useCurrentFrame(),{durationInFrames}=useVideoConfig();
 return <AbsoluteFill style={{background:'#f4efe3'}}><div style={{width:'100%',height:'100%'}} dangerouslySetInnerHTML={{__html:renderInteractionSvg(kind,frame/(durationInFrames-1))}}/></AbsoluteFill>;
}
registerRoot(()=> <>{Object.entries(interactionScenes).map(([kind,meta]:[string,any])=><Composition key={kind} id={'UI-'+kind} component={Interaction} width={meta.width} height={meta.height} fps={24} durationInFrames={meta.duration*24} defaultProps={{kind}}/>)}</>);
