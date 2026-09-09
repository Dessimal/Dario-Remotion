import React from 'react';
import { AbsoluteFill, Audio, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { AuroraBackground } from '../components/AuroraBackground';
import { GlassPanel } from '../components/GlassPanel';
import { THEME, FONT_DISPLAY, FONT_BODY, SPRINGS, msToFrame } from '../theme/tokens';
import transcriptData from '../data/transcript.json';

const theme = THEME.vox; // paper/map beats use the vox variant, per our established convention

// Segments 13–17 — establishing San Francisco, 1983
const PIN_IDS = ['segment_13', 'segment_14', 'segment_15', 'segment_16', 'segment_17'];
// Segments 18–22 — family background
const CARD_IDS = ['segment_18', 'segment_19', 'segment_20', 'segment_21', 'segment_22'];
const ORIGIN_IDS = [...PIN_IDS, ...CARD_IDS];

type Segment = { id: string; startMs: number; endMs: number; text: string };

const FAMILY_FACTS = [
  'Born in 1983, San Francisco.',
  'Father: an Italian-American leather craftsman.',
  'Mother: a Jewish-American librarian project manager.',
  'His name: Dario Amodei.',
];

const LocationPing: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: SPRINGS.rostrum });
  const scale = interpolate(enter, [0, 1], [0.5, 1]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const pulse = frame % 50;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ transform: `scale(${scale})`, opacity }}>
        <svg width={220} height={220} style={{ overflow: 'visible' }}>
          <circle
            cx={110} cy={110}
            r={interpolate(pulse, [0, 49], [10, 90])}
            fill="none"
            stroke={accentColor}
            strokeWidth={interpolate(pulse, [0, 49], [4, 0])}
            opacity={interpolate(pulse, [0, 49], [0.8, 0])}
          />
          <circle
            cx={110} cy={110} r={14}
            fill={accentColor} stroke="#FFFFFF" strokeWidth={3}
            style={{ filter: `drop-shadow(0 0 20px ${accentColor})` }}
          />
        </svg>
      </div>
      <div style={{ marginTop: 24, opacity, textAlign: 'center', fontFamily: FONT_DISPLAY }}>
        <div style={{ fontSize: 44, fontWeight: 800, color: '#FFFFFF' }}>San Francisco</div>
        <div style={{ fontSize: 22, fontWeight: 500, color: accentColor, marginTop: 8 }}>1983</div>
      </div>
    </AbsoluteFill>
  );
};

const FactsCard: React.FC<{ accentColor: string; textColor: string }> = ({ accentColor, textColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = spring({ frame, fps, config: SPRINGS.flow });
  const y = interpolate(reveal, [0, 1], [30, 0]);
  const opacity = interpolate(reveal, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ opacity, transform: `translateY(${y}px)`, width: 720 }}>
        <GlassPanel style={{ padding: '56px' }}>
          {FAMILY_FACTS.map((fact, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: i < FAMILY_FACTS.length - 1 ? 24 : 0,
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: accentColor, marginTop: 10, marginRight: 16, flexShrink: 0,
              }} />
              <div style={{ fontFamily: FONT_BODY, fontSize: 28, lineHeight: 1.5, color: textColor }}>
                {fact}
              </div>
            </div>
          ))}
        </GlassPanel>
      </div>
    </AbsoluteFill>
  );
};

const CaptionLine: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: SPRINGS.silk });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const y = interpolate(enter, [0, 1], [12, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 64 }}>
      <div style={{
        opacity,
        transform: `translateY(${y}px)`,
        fontFamily: FONT_BODY,
        fontWeight: 600,
        fontSize: 26,
        color: '#F5F3FF',
        textAlign: 'center',
        maxWidth: 900,
        textShadow: '0 4px 20px rgba(0,0,0,0.6)',
      }}>
        {text}
      </div>
    </AbsoluteFill>
  );
};

export const Scene04_Origins: React.FC = () => {
  const { segments } = transcriptData as { segments: Segment[] };
  const originSegments = segments.filter((s) => ORIGIN_IDS.includes(s.id));
  const pinSegments = segments.filter((s) => PIN_IDS.includes(s.id));
  const cardSegments = segments.filter((s) => CARD_IDS.includes(s.id));

  const sceneStart = originSegments[0].startMs;
  const pinDuration = msToFrame(pinSegments[pinSegments.length - 1].endMs - sceneStart);
  const cardFrom = pinDuration;
  const cardDuration = msToFrame(cardSegments[cardSegments.length - 1].endMs - sceneStart) - cardFrom;

  return (
    <AbsoluteFill>
      <Audio src={staticFile('audio/dariovoiceover.mp3')} startFrom={msToFrame(sceneStart)} />
      <AuroraBackground from={theme.bgFrom} to={theme.bgTo} />

      {/* Beat 1 — location ping */}
      <Sequence from={0} durationInFrames={pinDuration}>
        <LocationPing accentColor={theme.accentColor} />
      </Sequence>

      {/* Beat 2 — family facts card */}
      <Sequence from={cardFrom} durationInFrames={cardDuration}>
        <FactsCard accentColor={theme.accentColor} textColor={theme.textColor} />
      </Sequence>

      {/* Captions, synced line-by-line under whichever beat is showing */}
      {originSegments.map((seg) => {
        const from = msToFrame(seg.startMs - sceneStart);
        const duration = msToFrame(seg.endMs - seg.startMs);
        return (
          <Sequence key={seg.id} from={from} durationInFrames={duration} layout="none">
            <CaptionLine text={seg.text} />
          </Sequence>
        );
      })}

      <AbsoluteFill style={{
        background: 'radial-gradient(circle, rgba(15,10,41,0) 40%, rgba(15,10,41,0.6) 100%)',
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};
