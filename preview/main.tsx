import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Player } from '@remotion/player';
import { Scene01_Intro } from '../src/scenes/Scene01_Intro';
import { Scene02_Stakes } from '../src/scenes/Scene02_Stakes';
import { Scene03_Bumper } from '../src/scenes/Scene03_Bumper';


const SCENES = {
  Scene01Intro: { component: Scene01_Intro, durationInFrames: 534 },
  Scene02Stakes: { component: Scene02_Stakes, durationInFrames: 750 },
  Scene03Bumper: { component: Scene03_Bumper, durationInFrames: 450 }, 
  // add each new scene here as we build it
} as const;

function App() {
  const [key, setKey] = useState<keyof typeof SCENES>('Scene01Intro');
  const scene = SCENES[key];

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <select value={key} onChange={(e) => setKey(e.target.value as keyof typeof SCENES)}>
        {Object.keys(SCENES).map((k) => <option key={k} value={k}>{k}</option>)}
      </select>
      <div style={{ marginTop: 16 }}>
        <Player
          component={scene.component}
          durationInFrames={scene.durationInFrames}
          fps={30}
          compositionWidth={1920}
          compositionHeight={1080}
          controls
          style={{ width: '100%', maxWidth: 960 }}
        />
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
