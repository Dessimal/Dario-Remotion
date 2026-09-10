import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { THEME, FONT_DISPLAY, FONT_BODY, SPRINGS, msToFrame, GRAPH_YELLOW, GRAPH_WHITE } from '../theme/tokens';
import { smoothPath, buildScalingCurve } from '../utils/curves';
import transcriptData from '../data/transcript.json';
import { SceneBackground } from '../components/SceneBackground';
import { ChalkDefs, CHALK_DASH } from '../components/ChalkDefs';
const theme = THEME.monopoly; // cyan accent — the "big idea" scene

// Segments 62–75 of transcript.json — the scaling laws discovery.
const SCALING_IDS = [
  'segment_62', 'segment_63', 'segment_64', 'segment_65', 'segment_66', 'segment_67',
  'segment_68', 'segment_69', 'segment_70', 'segment_71', 'segment_72', 'segment_73',
  'segment_74', 'segment_75',
];

type Segment = { id: string; startMs: number; endMs: number; text: string };

const GRAPH_W = 1200;
const GRAPH_H = 560;
const CURVE_POINTS = 8;

const ScalingGraph: React.FC<{ sceneDurationFrames: number }> = ({ sceneDurationFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // One shared spring — axes and curve all reveal together, at the same
  // pace, across the full scene duration.
  const progress = spring({ frame, fps, config: SPRINGS.flow, durationInFrames: sceneDurationFrames });

  const points = buildScalingCurve(CURVE_POINTS, GRAPH_W, GRAPH_H);
  const path = smoothPath(points);

  const leadIndex = Math.min(points.length - 1, progress * (points.length - 1));
  const leadFloor = Math.floor(leadIndex);
  const leadFrac = leadIndex - leadFloor;
  const a = points[leadFloor];
  const b = points[Math.min(leadFloor + 1, points.length - 1)];
  const lead = { x: a.x + (b.x - a.x) * leadFrac, y: a.y + (b.y - a.y) * leadFrac };

  return (
    <svg width={GRAPH_W} height={GRAPH_H + 80} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="scalingArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={GRAPH_YELLOW} stopOpacity="0.4" />
          <stop offset="100%" stopColor={GRAPH_YELLOW} stopOpacity="0" />
        </linearGradient>
      </defs>
      <ChalkDefs />

      {/* X-axis — reveals left to right, in sync with the curve */}
      <line
        x1={0} y1={GRAPH_H} x2={GRAPH_W} y2={GRAPH_H}
        stroke="rgba(255,255,255,0.5)" strokeWidth={3}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - progress}
      />
      {/* Y-axis — reveals bottom to top, same pace */}
      <line
        x1={0} y1={GRAPH_H} x2={0} y2={0}
        stroke="rgba(255,255,255,0.5)" strokeWidth={3}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - progress}
      />

      <path d={`${path} L ${GRAPH_W} ${GRAPH_H} L 0 ${GRAPH_H} Z`} fill="url(#scalingArea)" opacity={progress} />

      {/* Data curve — same shared progress, genuinely draws rather than fading in */}
      <path
        d={path}
        fill="none"
        stroke={GRAPH_YELLOW}
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - progress}
        style={{ filter: `url(#chalkTexture) drop-shadow(0 0 14px ${GRAPH_YELLOW}aa)` }}
      />
      <circle
        cx={lead.x} cy={lead.y} r={11}
        fill={GRAPH_WHITE}
        style={{ filter: `drop-shadow(0 0 16px ${GRAPH_YELLOW})`, opacity: progress > 0.02 ? 1 : 0 }}
      />

      <text x={GRAPH_W / 2} y={GRAPH_H + 50} textAnchor="middle" fill="#F5F3FF" fontFamily={FONT_BODY} fontSize={24} fontWeight={600}>
        Compute · Data · Parameters
      </text>
      <text
        x={-GRAPH_H / 2} y={-36} textAnchor="middle" fill="#F5F3FF" fontFamily={FONT_BODY} fontSize={24} fontWeight={600}
        transform="rotate(-90)"
      >
        Performance
      </text>
    </svg>
  );
};

const TitleReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: SPRINGS.silk });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const y = interpolate(enter, [0, 1], [16, 0]);

  return (
    <div style={{
      position: 'absolute', top: 64, left: '50%', transform: `translateX(-50%) translateY(${y}px)`,
      opacity, textAlign: 'center',
    }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 52, color: '#FFFFFF', letterSpacing: 1 }}>
        Scaling Laws
      </div>
    </div>
  );
};

const CaptionLine: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: SPRINGS.silk });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const y = interpolate(enter, [0, 1], [12, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 56 }}>
      <div style={{
        opacity, transform: `translateY(${y}px)`,
        fontFamily: FONT_BODY, fontWeight: 600, fontSize: 26, color: '#F5F3FF',
        textAlign: 'center', maxWidth: 1000, textShadow: '0 4px 20px rgba(0,0,0,0.7)',
      }}>
        {text}
      </div>
    </AbsoluteFill>
  );
};

export const Scene10_ScalingLaws: React.FC = () => {
  const { segments } = transcriptData as { segments: Segment[] };
  const scalingSegments = segments.filter((s) => SCALING_IDS.includes(s.id));
  const sceneStart = scalingSegments[0].startMs;
  const sceneEnd = scalingSegments[scalingSegments.length - 1].endMs;
  const sceneDurationFrames = msToFrame(sceneEnd - sceneStart);

  // "Scaling laws" title appears once the term is actually said — segment_70.
  const titleTrigger = scalingSegments.find((s) => s.id === 'segment_70')!;
  const titleFrame = msToFrame(titleTrigger.startMs - sceneStart);

  return (
    <AbsoluteFill>
      <Audio src={staticFile('audio/dariovoiceover.mp3')} startFrom={msToFrame(sceneStart)} />

      <SceneBackground />

      <Sequence from={titleFrame} layout="none">
        <TitleReveal />
      </Sequence>

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ScalingGraph sceneDurationFrames={sceneDurationFrames} />
      </AbsoluteFill>

      {scalingSegments.map((seg) => {
        const from = msToFrame(seg.startMs - sceneStart);
        const duration = msToFrame(seg.endMs - seg.startMs);
        return (
          <Sequence key={seg.id} from={from} durationInFrames={duration} layout="none">
            <CaptionLine text={seg.text} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
