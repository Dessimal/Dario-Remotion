import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import React from 'react';

export const FloatingCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring animation for card entrance
  const entrance = spring({
    frame,
    fps,
    config: { mass: 0.5, stiffness: 100, damping: 10 },
  });

  const scale = interpolate(entrance, [0, 1], [0.9, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const rotate = interpolate(entrance, [0, 1], [2, -2]);

  return (
    <AbsoluteFill style={{
      justifyContent: 'center',
      alignItems: 'center',
      padding: '100px',
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '800px',
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        opacity,
        boxShadow: '0px 20px 40px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        {children}
      </div>
    </AbsoluteFill>
  );
};
