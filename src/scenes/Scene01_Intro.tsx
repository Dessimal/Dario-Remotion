import React from 'react';
import { AbsoluteFill, Img, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { AuroraBackground } from '../components/AuroraBackground';
import { THEME, FONT_DISPLAY, SPRINGS, msToFrame } from '../theme/tokens';
import transcriptData from '../data/transcript.json';

const theme = THEME.monopoly;

// Segments 1–4 of transcript.json — the cold-open hook.
const HOOK_IDS = ['segment_1', 'segment_2', 'segment_3', 'segment_4'];

type Segment = { id: string; startMs: number; endMs: number; text: string };

const KineticLine: React.FC<{ text: string; punch?: boolean }> = ({ text, punch }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: SPRINGS.flow });
  const y = interpolate(enter, [0, 1], [30, 0]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  // The one deliberate "hit" moment — used only on the "slammed shut" line.
  const impact = punch ? spring({ frame, fps, config: SPRINGS.punch }) : 0;
  const punchScale = punch ? interpolate(impact, [0, 1], [1.15, 1]) : 1;
  const flash = punch ? interpolate(impact, [0, 0.3, 1], [0.9, 0.5, 0]) : 0;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 140px' }}>
      {punch && (
        <AbsoluteFill style={{
          background: `radial-gradient(circle, ${theme.accentColor}55, transparent 70%)`,
          opacity: flash,
        }} />
      )}
      <div style={{
        transform: `translateY(${y}px) scale(${punchScale})`,
        opacity,
        fontFamily: FONT_DISPLAY,
        fontWeight: 800,
        fontSize: '64px',
        lineHeight: 1.3,
        color: theme.textColor,
        textAlign: 'center',
        textShadow: `0 0 40px ${theme.accentColor}66`,
      }}>
        {text}
      </div>
    </AbsoluteFill>
  );
};

export const Scene01_Intro: React.FC = () => {
  const { segments } = transcriptData as { segments: Segment[] };
  const hookSegments = segments.filter((s) => HOOK_IDS.includes(s.id));
  const sceneStart = hookSegments[0].startMs;
  const sceneEnd = hookSegments[hookSegments.length - 1].endMs;
  const sceneDuration = msToFrame(sceneEnd - sceneStart);

  return (
    <AbsoluteFill>
      <AuroraBackground from={theme.bgFrom} to={theme.bgTo} />

      {/* Corner watermark, fades in quietly */}
      <Sequence from={0}>
        <WatermarkLogo />
      </Sequence>

      {hookSegments.map((seg) => {
        const from = msToFrame(seg.startMs - sceneStart);
        const duration = msToFrame(seg.endMs - seg.startMs);
        const isImpactLine = seg.id === 'segment_4'; // "slammed shut in its face"
        return (
          <Sequence key={seg.id} from={from} durationInFrames={duration}>
            <KineticLine text={seg.text} punch={isImpactLine} />
          </Sequence>
        );
      })}

      <AbsoluteFill style={{
        background: 'radial-gradient(circle, rgba(11,6,32,0) 40%, rgba(11,6,32,0.6) 100%)',
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};

const WatermarkLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: SPRINGS.flow });
  const opacity = interpolate(enter, [0, 1], [0, 0.85]);

  return (
    <div style={{ position: 'absolute', bottom: 48, right: 48, opacity }}>
      <Img src={staticFile('branding/logo.png')} style={{ height: 56 }} />
    </div>
  );
};
