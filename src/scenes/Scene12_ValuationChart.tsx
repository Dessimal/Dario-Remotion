import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { SceneBackground } from '../components/SceneBackground';
import { ChalkDefs } from '../components/ChalkDefs';
import { FONT_DISPLAY, SPRINGS } from '../theme/tokens';

const COMPANIES = [
  { name: 'Netflix', value: 346, color: '#E50914' },
  { name: 'Bank of America', value: 382, color: '#E31837' },
  { name: 'Caterpillar', value: 417, color: '#FFCD11' },
  { name: 'Intel', value: 498, color: '#00A3E0' },
  { name: 'Johnson & Johnson', value: 560, color: '#D0312D' },
  { name: 'Visa', value: 615, color: '#1A1F71' },
  { name: 'Exxon Mobil', value: 621, color: '#D5001C' },
  { name: 'JPMorgan Chase', value: 837, color: '#E8E8E8' },
  { name: 'OpenAI', value: 852, color: '#10A37F' },
  { name: 'Anthropic', value: 965, color: '#D97757' },
];

const CHART_W = 1400;
const CHART_H = 640;
const BAR_GAP = 14;
const BAR_W = (CHART_W - BAR_GAP * (COMPANIES.length - 1)) / COMPANIES.length;
const MAX_VALUE = 965;
const STAGGER = 6;
const BAR_RISE_FRAMES = 20;

const TitleBlock: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: SPRINGS.silk });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const y = interpolate(enter, [0, 1], [16, 0]);

  return (
    <div style={{ opacity, transform: `translateY(${y}px)`, textAlign: 'center', marginBottom: 24 }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 46, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 1 }}>
        Anthropic Is Now
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 52, color: '#FFD400', textTransform: 'uppercase', letterSpacing: 1 }}>
        More Valuable Than
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: 18, color: 'rgba(255,255,255,0.6)', marginTop: 8, letterSpacing: 2 }}>
        VALUATIONS ACCORDING TO THE LATEST FUNDING ROUNDS
      </div>
    </div>
  );
};

const Bar: React.FC<{ name: string; value: number; color: string; x: number; isLast: boolean }> = ({
  name, value, color, x, isLast,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const index = COMPANIES.findIndex((c) => c.name === name);
  const localFrame = frame - index * STAGGER;

  const rise = spring({ frame: Math.max(localFrame, 0), fps, config: SPRINGS.silk, durationInFrames: BAR_RISE_FRAMES });
  const targetHeight = (value / MAX_VALUE) * CHART_H;
  const height = targetHeight * rise;

  // Anthropic gets a settle-in glow pulse once it's finished rising.
  const settledFrame = frame - (index * STAGGER + BAR_RISE_FRAMES);
  const pulse = isLast && settledFrame > 0 ? (Math.sin(settledFrame / 8) + 1) / 2 : 0;

  return (
    <div style={{ position: 'absolute', left: x, bottom: 0, width: BAR_W, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        style={{
          opacity: rise > 0.05 ? 1 : 0,
          fontFamily: FONT_DISPLAY,
          fontWeight: 800,
          fontSize: 20,
          color: '#FFFFFF',
          marginBottom: 8,
          transform: `translateY(${-height}px)`,
          position: 'absolute',
          bottom: 0,
          whiteSpace: 'nowrap',
        }}
      >
        ${value}B
      </div>
      <div
        style={{
          width: '100%',
          height,
          background: color,
          borderRadius: '10px 10px 0 0',
          boxShadow: isLast ? `0 0 ${30 + pulse * 30}px ${color}` : `0 8px 24px rgba(0,0,0,0.5)`,
          border: isLast ? `3px solid rgba(255,255,255,${0.4 + pulse * 0.4})` : 'none',
        }}
      />
      <div style={{
        marginTop: 12,
        fontFamily: FONT_DISPLAY,
        fontWeight: 700,
        fontSize: 15,
        color: isLast ? '#FFD400' : 'rgba(255,255,255,0.75)',
        textAlign: 'center',
        lineHeight: 1.3,
      }}>
        {name}
      </div>
    </div>
  );
};

export const Scene12_ValuationChart: React.FC = () => (
  <AbsoluteFill>
    <SceneBackground />
    <ChalkDefs />

    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div>
        <TitleBlock />
        <div style={{ position: 'relative', width: CHART_W, height: CHART_H + 80 }}>
          {COMPANIES.map((c, i) => (
            <Bar key={c.name} name={c.name} value={c.value} color={c.color} x={i * (BAR_W + BAR_GAP)} isLast={i === COMPANIES.length - 1} />
          ))}
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: CHART_W, height: 3, background: 'rgba(255,255,255,0.4)' }} />
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
