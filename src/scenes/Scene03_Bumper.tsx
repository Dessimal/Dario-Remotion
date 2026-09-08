import React from 'react';
import { AbsoluteFill, Img, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
//import { AuroraBackground } from '../components/AuroraBackground';
import { THEME, FONT_DISPLAY, FONT_BODY, SPRINGS, msToFrame } from '../theme/tokens';
import transcriptData from '../data/transcript.json';

const theme = THEME.underdog; // warm amber accent — sets this bumper apart from Scenes 1–2

// Segments 10–12 of transcript.json — the subscribe bumper.
const BUMPER_IDS = ['segment_10', 'segment_11', 'segment_12'];

type Segment = { id: string; startMs: number; endMs: number; text: string };

const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: SPRINGS.rostrum });
  const scale = interpolate(enter, [0, 1], [0.7, 1]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  return (
    <div style={{
      transform: `scale(${scale})`,
      opacity,
      marginBottom: 40,
      filter: `drop-shadow(0 0 40px ${theme.accentColor}66)`,
    }}>
      <Img src={staticFile('branding/logo.png')} style={{ height: 120 }} />
    </div>
  );
};

const ShowTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: SPRINGS.flow });
  const y = interpolate(enter, [0, 1], [20, 0]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  return (
    <div style={{ transform: `translateY(${y}px)`, opacity, textAlign: 'center' }}>
      <div style={{
        fontFamily: FONT_DISPLAY,
        fontWeight: 800,
        fontSize: 56,
        color: theme.textColor,
        letterSpacing: 1,
      }}>
        The Black Box Report
      </div>
      <div style={{
        fontFamily: FONT_BODY,
        fontWeight: 500,
        fontSize: 22,
        color: theme.accentColor,
        marginTop: 12,
      }}>
        Mergers. Collapses. High-stakes bets.
      </div>
    </div>
  );
};

const SubscribeButton: React.FC<{ delayFrames: number }> = ({ delayFrames }) => {
  const frame = useCurrentFrame() - delayFrames;
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: SPRINGS.silk });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const scale = interpolate(enter, [0, 1], [0.85, 1]);

  const pulse = 1 + Math.sin(Math.max(frame, 0) / 10) * 0.03;

  return (
    <div style={{
      marginTop: 44,
      opacity,
      transform: `scale(${scale * pulse})`,
      display: 'inline-flex',
      alignItems: 'center',
      padding: '18px 44px',
      borderRadius: 999,
      background: '#FF0000',
      color: '#FFFFFF',
      fontFamily: FONT_DISPLAY,
      fontWeight: 800,
      fontSize: 26,
      boxShadow: '0 20px 60px rgba(255,0,0,0.4)',
    }}>
      Subscribe
    </div>
  );
};

export const Scene03_Bumper: React.FC = () => {
  const { segments } = transcriptData as { segments: Segment[] };
  const bumperSegments = segments.filter((s) => BUMPER_IDS.includes(s.id));
  const sceneStart = bumperSegments[0].startMs;

  // "Subscribe" button appears once the VO actually says the word — segment_11.
  const subscribeTrigger = bumperSegments.find((s) => s.id === 'segment_11')!;
  const subscribeFrame = msToFrame(subscribeTrigger.startMs - sceneStart);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: '#000000' }} />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <LogoReveal />
        <ShowTitle />
        <Sequence from={subscribeFrame} layout="none">
          <SubscribeButton delayFrames={0} />
        </Sequence>
      </AbsoluteFill>

      <AbsoluteFill style={{
        background: 'radial-gradient(circle, rgba(20,11,46,0) 40%, rgba(20,11,46,0.6) 100%)',
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};
