import React from 'react';
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { FONT_DISPLAY, SPRINGS } from '../theme/tokens';

export const PersonCutout: React.FC<{
  imageSrc: string;
  nameLabel: string;
  title: string;
  accentColor: string;
}> = ({ imageSrc, nameLabel, title, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: SPRINGS.rostrum });
  const y = interpolate(enter, [0, 1], [60, 0]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
      <div style={{
        position: 'relative',
        transform: `translateY(${y}px)`,
        opacity,
        width: 760,
      }}>
        {/* Baked grayscale halftone, tinted live via multiply so it tracks theme.accentColor */}
        <Img
          src={staticFile(imageSrc)}
          style={{
            width: '100%',
            display: 'block',
            filter: 'grayscale(1) contrast(1.3)',
            mixBlendMode: 'luminosity',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: accentColor,
          mixBlendMode: 'multiply',
          opacity: 0.85,
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, transparent 55%, rgba(11,6,32,0.9) 100%)',
        }} />

        {/* Name plate */}
        <div style={{
          position: 'absolute',
          bottom: 32,
          left: 32,
          fontFamily: FONT_DISPLAY,
        }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#FFFFFF' }}>{nameLabel}</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: accentColor, marginTop: 4 }}>{title}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
