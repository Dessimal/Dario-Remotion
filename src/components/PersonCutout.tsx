import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import React from 'react';

interface PersonCutoutProps {
  imageSrc: string;
  nameLabel: string;
  title: string;
  rotation?: number;
  accentColor: string;
}

export const PersonCutout: React.FC<PersonCutoutProps> = ({
  imageSrc,
  nameLabel,
  title,
  rotation = 0,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // High-mass smooth entry spring
  const entrySpring = spring({
    frame,
    fps,
    config: { mass: 1.2, stiffness: 45, damping: 20 },
  });

  const scale = interpolate(entrySpring, [0, 1], [0.92, 1]);
  const opacity = interpolate(entrySpring, [0, 0.4], [0, 1]);

  // Glow pulse animation
  const glowPulse = interpolate(Math.sin(frame / 10), [-1, 1], [15, 35]);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          position: 'relative',
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          opacity,
        }}
      >
        {/* Background Glow Aura */}
        <div style={{
          position: 'absolute',
          inset: '-20px',
          background: accentColor,
          filter: `blur(${glowPulse}px)`,
          opacity: 0.15,
          borderRadius: '20px',
        }} />

        <img
          src={imageSrc}
          alt={nameLabel}
          style={{
            height: '650px',
            borderRadius: '4px',
            border: '12px solid white',
            boxShadow: '0px 40px 80px rgba(0,0,0,0.6)',
            zIndex: 2,
            position: 'relative',
          }}
        />
        
        {/* Cinematic Accent Outline */}
        <svg style={{ position: 'absolute', top: -15, left: -15, width: 'calc(100% + 30px)', height: 'calc(100% + 30px)', pointerEvents: 'none', zIndex: 1 }}>
          <rect
            x="0" y="0" width="100%" height="100%"
            fill="none"
            stroke={accentColor}
            strokeWidth="4"
            style={{ filter: `drop-shadow(0 0 10px ${accentColor})` }}
          />
        </svg>

        {/* Investigative Lower Third */}
        <div style={{
          position: 'absolute', 
          bottom: '40px', 
          left: '-60px',
          backgroundColor: '#111111', 
          color: '#fff', 
          padding: '25px 40px',
          zIndex: 10,
          boxShadow: '20px 20px 40px rgba(0,0,0,0.4)',
          borderLeft: `8px solid ${accentColor}`,
          minWidth: '400px',
        }}>
          <div style={{ 
            fontSize: '40px', 
            fontWeight: 900, 
            fontFamily: 'Montserrat, sans-serif', 
            textTransform: 'uppercase',
            letterSpacing: '-1px'
          }}>
            {nameLabel}
          </div>
          <div style={{ 
            fontSize: '18px', 
            color: accentColor, 
            textTransform: 'uppercase', 
            fontFamily: '"JetBrains Mono", monospace',
            marginTop: '5px',
            letterSpacing: '2px',
            opacity: 0.8
          }}>
            {title}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
