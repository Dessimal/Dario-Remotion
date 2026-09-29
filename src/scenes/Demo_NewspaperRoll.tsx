import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, Easing, interpolate, useCurrentFrame } from 'remotion';
import { ChromaKeyImage } from '../components/ChromaKeyImage';
import { SceneBackground } from '../components/SceneBackground';

// Timeline (30fps): enter 0–25, hold 25–115 (3s), exit 115–140.
const ENTER_END = 25;
const HOLD_END = ENTER_END + 90;
const EXIT_END = HOLD_END + 25;

export const Demo_NewspaperRoll: React.FC = () => {
  const frame = useCurrentFrame();

  let x = 0;
  let y = 0;
  let rotate = 0;

  if (frame < ENTER_END) {
    // Bottom-left, off-screen → center, cubic-out (fast start, gentle settle)
    const t = interpolate(frame, [0, ENTER_END], [0, 1], { easing: Easing.out(Easing.cubic) });
    x = interpolate(t, [0, 1], [-1400, 0]);
    y = interpolate(t, [0, 1], [700, 0]);
    rotate = interpolate(t, [0, 1], [-18, 0]);
  } else if (frame < HOLD_END) {
    // Holds dead center for 3 seconds
    x = 0;
    y = 0;
    rotate = 0;
  } else {
    // Center → bottom-right, off-screen, cubic-in (gentle start, fast exit)
    const t = interpolate(frame, [HOLD_END, EXIT_END], [0, 1], {
      easing: Easing.in(Easing.cubic),
      extrapolateRight: 'clamp',
    });
    x = interpolate(t, [0, 1], [0, 1400]);
    y = interpolate(t, [0, 1], [0, 700]);
    rotate = interpolate(t, [0, 1], [0, 18]);
  }

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      {/* SFX Elements */}
      <Audio src={staticFile('audio/sfx/whoosh-in.mp3')} startFrom={0} volume={2.5} />
      <Sequence from={HOLD_END}>
        <Audio src={staticFile('audio/sfx/whoosh-out.mp3')} volume={2.5} />
      </Sequence>

      <SceneBackground />
      <div style={{ transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)` }}>
        <ChromaKeyImage
          src="assets/Baidu_opens_Silicon_Valley_lab_20260915042249.jpeg"
          style={{ width: 620, filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.5))' }}
        />
      </div>
    </AbsoluteFill>
  );
};
  
