import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { SPRINGS } from '../theme/tokens';

const CARD_SIZE = 320;
const BORDER_W = 3;
const RADIUS = 56;

export const Demo_GlassHomeIcon: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance
  const cardPop = spring({ frame, fps, config: SPRINGS.rostrum });
  const cardScale = interpolate(cardPop, [0, 1], [0.6, 1]);
  const cardOpacity = interpolate(cardPop, [0, 1], [0, 1]);

  // Icon entrance, staggered slightly after the card
  const iconPop = spring({ frame: Math.max(frame - 10, 0), fps, config: SPRINGS.silk });
  const iconScale = interpolate(iconPop, [0, 1], [0.7, 1]);
  const iconOpacity = interpolate(iconPop, [0, 1], [0, 1]);

  // Slow border-gradient angle drift — makes the glass edge feel alive
  const borderAngle = 135 + Math.sin(frame / 50) * 20;

  // Looping diagonal light sweep across the glass surface
  const loopLen = 90;
  const loopT = (frame % loopLen) / loopLen;
  const sweepX = interpolate(loopT, [0, 1], [-160, 160]);
  const sweepOpacity = Math.max(0, Math.sin(loopT * Math.PI)) * 0.35;

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle at 30% 20%, #241a3d 0%, #140b24 45%, #0a0612 100%)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ position: 'relative', width: CARD_SIZE, height: CARD_SIZE, transform: `scale(${cardScale})`, opacity: cardOpacity }}>
        {/* Drop shadow */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: RADIUS,
          background: '#000000', opacity: 0.5, filter: 'blur(34px)',
          transform: 'translate(16px, 22px)',
        }} />

        {/* Gradient border ring */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: RADIUS,
          padding: BORDER_W,
          background: `linear-gradient(${borderAngle}deg, #4C6FFF 0%, #A768FF 50%, #FF6FD8 100%)`,
        }}>
          {/* Glass fill */}
          <div style={{
            width: '100%', height: '100%', borderRadius: RADIUS - BORDER_W,
            background: 'linear-gradient(160deg, #180F2C 0%, #1F1436 55%, #2A1848 100%)',
            backdropFilter: 'blur(2px)',
            position: 'relative', overflow: 'hidden',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
          }}>
            {/* Top light catch */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '55%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%)',
              pointerEvents: 'none',
            }} />

            {/* Sweeping highlight */}
            <div style={{
              position: 'absolute', top: '-30%', left: '50%', width: '60%', height: '160%',
              background: 'linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.6) 50%, transparent 65%)',
              transform: `translateX(${sweepX}px) rotate(18deg)`,
              opacity: sweepOpacity,
              mixBlendMode: 'screen',
              pointerEvents: 'none',
            }} />

            {/* House icon */}
            <svg
              width={148} height={148} viewBox="0 0 100 100"
              style={{ transform: `scale(${iconScale})`, opacity: iconOpacity, filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.35))' }}
            >
              <defs>
                <linearGradient id="houseGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#C9C7D6" />
                </linearGradient>
                <mask id="doorMask">
                  <rect x="0" y="0" width="100" height="100" fill="white" />
                  <rect x="42" y="68" width="16" height="24" rx="2" fill="black" />
                </mask>
              </defs>
              <g mask="url(#doorMask)" fill="url(#houseGrad)">
                <rect x="64" y="18" width="10" height="18" />
                <polygon points="12,52 50,18 88,52 78,52 50,30 22,52" />
                <rect x="26" y="50" width="48" height="38" rx="4" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
