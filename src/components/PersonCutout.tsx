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
  const y = interpolate(enter, [0, 1], [40, 0]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        position: 'relative',
        transform: `translateY(${y}px)`,
        opacity,
        width: 620,
        borderRadius: 32,
        overflow: 'hidden',
        // Soft-fades the hard rectangular edges into the aurora background —
        // stands in for a real cutout until this photo is background-removed.
        WebkitMaskImage: 'radial-gradient(ellipse 82% 88% at center, black 55%, transparent 100%)',
        maskImage: 'radial-gradient(ellipse 82% 88% at center, black 55%, transparent 100%)',
      }}>
        <Img
          src={staticFile(imageSrc)}
          style={{ width: '100%', display: 'block', filter: 'grayscale(0.6) contrast(1.1)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: accentColor, mixBlendMode: 'color', opacity: 0.45 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(11,6,32,0.85) 100%)' }} />
      </div>

      <div style={{ marginTop: -8, opacity, textAlign: 'center', fontFamily: FONT_DISPLAY }}>
        <div style={{ fontSize: 30, fontWeight: 800, color: '#FFFFFF' }}>{nameLabel}</div>
        <div style={{ fontSize: 18, fontWeight: 500, color: accentColor, marginTop: 4 }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};
