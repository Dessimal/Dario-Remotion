import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export const AuroraBackground: React.FC<{ from: string; to: string }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;

  const blob = (phase: number) => ({
    x: 50 + Math.sin(t * 0.15 + phase) * 30,
    y: 50 + Math.cos(t * 0.12 + phase * 1.3) * 26,
  });
  const b1 = blob(0);
  const b2 = blob(2.1);
  const b3 = blob(4.4);

  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${from} 0%, ${to} 100%)` }}>
      <AbsoluteFill style={{
        background: `radial-gradient(circle at ${b1.x}% ${b1.y}%, rgba(34,211,238,0.32), transparent 42%),
                     radial-gradient(circle at ${b2.x}% ${b2.y}%, rgba(232,121,249,0.28), transparent 38%),
                     radial-gradient(circle at ${b3.x}% ${b3.y}%, rgba(168,85,247,0.30), transparent 34%)`,
        filter: 'blur(2px)',
      }} />
      <AbsoluteFill style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
        opacity: 0.5,
      }} />
    </AbsoluteFill>
  );
};
