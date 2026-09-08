import React from 'react';
import { AbsoluteFill, Audio, Sequence, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { AuroraBackground } from '../components/AuroraBackground';
import { PersonCutout } from '../components/PersonCutout';
import { THEME, FONT_DISPLAY, FONT_BODY, SPRINGS, msToFrame } from '../theme/tokens';
import transcriptData from '../data/transcript.json';

const theme = THEME.monopoly;

// Segments 5–9 of transcript.json — "his career, his reputation, his sister's future"
const STAKES_IDS = ['segment_5', 'segment_6', 'segment_7', 'segment_8', 'segment_9'];

const STAKE_CHIPS = [
  { label: 'His career', triggerId: 'segment_8' },
  { label: 'His reputation', triggerId: 'segment_8' },
  { label: "His sister's future", triggerId: 'segment_9' },
];

type Segment = { id: string; startMs: number; endMs: number; text: string };

const GlassChip: React.FC<{ label: string; delayFrames: number; index: number }> = ({ label, delayFrames, index }) => {
  const frame = useCurrentFrame() - delayFrames;
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: SPRINGS.silk });
  const x = interpolate(enter, [0, 1], [-30, 0]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  return (
    <div style={{
      transform: `translateX(${x}px)`,
      opacity,
      display: 'inline-flex',
      alignItems: 'center',
      padding: '14px 28px',
      borderRadius: '999px',
      background: 'rgba(255,255,255,0.06)',
      border: `1px solid ${theme.accentColor}55`,
      backdropFilter: 'blur(18px)',
      boxShadow: `0 20px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)`,
      fontFamily: FONT_BODY,
      fontSize: 26,
      fontWeight: 600,
      color: theme.textColor,
      marginBottom: 16,
    }}>
      {label}
    </div>
  );
};

const KineticLine: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: SPRINGS.flow });
  const y = interpolate(enter, [0, 1], [24, 0]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 140 }}>
      <div style={{
        transform: `translateY(${y}px)`,
        opacity,
        fontFamily: FONT_DISPLAY,
        fontWeight: 700,
        fontSize: 44,
        lineHeight: 1.35,
        color: theme.textColor,
        textAlign: 'center',
        maxWidth: 1100,
      }}>
        {text}
      </div>
    </AbsoluteFill>
  );
};

export const Scene02_Stakes: React.FC = () => {
  const { segments } = transcriptData as { segments: Segment[] };
  const stakesSegments = segments.filter((s) => STAKES_IDS.includes(s.id));
  const sceneStart = stakesSegments[0].startMs;
  const sceneEnd = stakesSegments[stakesSegments.length - 1].endMs;

  const chipTriggerFrame = (triggerId: string) => {
    const seg = stakesSegments.find((s) => s.id === triggerId)!;
    return msToFrame(seg.startMs - sceneStart);
  };

  return (
    <AbsoluteFill>
      <Audio src={staticFile('audio/dariovoiceover.mp3')} startFrom={msToFrame(sceneStart)} />
      <AuroraBackground from={theme.bgFrom} to={theme.bgTo} />

      {/* Dario cutout, anchored bottom-right so text/chips have room on the left */}
     <PersonCutout
  imageSrc="scenes/scene-02/dario-cutout.png"
  nameLabel="Dario Amodei"
  title="Physicist"
  accentColor={theme.accentColor}
/>

      {/* Voiceover lines, sequenced */}
      {stakesSegments.map((seg) => {
        const from = msToFrame(seg.startMs - sceneStart);
        const duration = msToFrame(seg.endMs - seg.startMs);
        return (
          <Sequence key={seg.id} from={from} durationInFrames={duration}>
            <KineticLine text={seg.text} />
          </Sequence>
        );
      })}

      {/* Stakes chips, stack up on the left as each is named */}
      <div style={{
  position: 'absolute',
  left: '50%',
  bottom: 220,
  transform: 'translateX(-50%)',
  display: 'flex',
  flexDirection: 'row',
  gap: 16,
}}>
  {STAKE_CHIPS.map((chip, i) => (
    <Sequence key={chip.label} from={chipTriggerFrame(chip.triggerId)} layout="none">
      <GlassChip label={chip.label} delayFrames={0} index={i} />
    </Sequence>
  ))}
</div>

      <AbsoluteFill style={{
        background: 'radial-gradient(circle, rgba(11,6,32,0) 40%, rgba(11,6,32,0.6) 100%)',
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};
