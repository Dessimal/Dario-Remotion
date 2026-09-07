import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const TextHighlighter: React.FC<{
  width: number;
  height: number;
  color?: string;
  durationInFrames?: number;
}> = ({ width, height, color = '#facc15', durationInFrames = 20 }) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const strokeDashoffset = width * (1 - progress);

  return (
    <svg
      width={width}
      height={height}
      style={{
        position: 'absolute',
        mixBlendMode: 'multiply',
        opacity: 0.85,
      }}
    >
      <line
        x1="0"
        y1={height / 2}
        x2={width}
        y2={height / 2}
        stroke={color}
        strokeWidth={height}
        strokeDasharray={width}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </svg>
  );
};