import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const AnimatedMapRoute: React.FC = () => {
  const frame = useCurrentFrame();
  const pathLength = 600;

  const drawProgress = interpolate(frame, [0, 45], [pathLength, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ position: 'relative', width: '1000px', height: '600px' }}>
      <img
        src="/assets/map_dark_mode.png"
        alt="Map"
        style={{ width: '100%', height: '100%', opacity: 0.6 }}
      />
      <svg
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <path
          d="M 150 400 Q 350 150 750 250"
          fill="none"
          stroke="#ef4444"
          strokeWidth="6"
          strokeDasharray={pathLength}
          strokeDashoffset={drawProgress}
          strokeLinecap="round"
        />
        <circle cx="150" cy="400" r="10" fill="#ef4444" />
      </svg>
    </div>
  );
};
