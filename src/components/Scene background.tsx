import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

export const SceneBackground: React.FC = () => (
  <Img
    src={staticFile('backgrounds/background.jpeg')}
    style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }}
  />
);
