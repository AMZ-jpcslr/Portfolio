import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {projects} from '../../dist/projects.js';
import {ProductFilm} from './ProductFilm';

const Root = () => <>{projects.map(project => <Composition
  key={project.kind} id={`Film-${project.kind}`} component={ProductFilm}
  width={1240} height={900} fps={30} durationInFrames={720}
  defaultProps={{kind:project.kind}}
/>)}</>;
registerRoot(Root);
