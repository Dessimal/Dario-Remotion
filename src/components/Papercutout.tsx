import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const PaperCutout: React.FC<{
  imageSrc: string;
  rotation?: number;
}> = ({ imageSrc, rotation = -3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const revealSpring = spring({
    frame,
    fps,
    config: { mass: 0.2, stiffness: 180, damping: 12 },
  });

  const scale = interpolate(revealSpring, [0, 1], [0.8, 1]);
  const translateY = interpolate(revealSpring, [0, 1], [80, 0]);

  return (
    <div
      style={{
        transform: `scale(${scale}) translateY(${translateY}px) rotate(${rotation}deg)`,
        filter: 'drop-shadow(0px 15px 25px rgba(0, 0, 0, 0.6))',
        position: 'relative',
        display: 'inline-block',
      }}
    >
      <div
        style={{
          padding: '12px',
          backgroundColor: '#f4ecd8',
          borderRadius: '2px',
        }}
      >
        <img
          src={imageSrc}
          alt="Document Cutout"
          style={{
            maxWidth: '800px',
            display: 'block',
            filter: 'contrast(1.1) sepia(0.2)',
          }}
        />
      </div>
    </div>
  );
};