import React from 'react';
import { AbsoluteFill, Audio, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { SceneBackground } from '../components/SceneBackground';
import { ChalkDefs } from '../components/ChalkDefs';
import { THEME, FONT_DISPLAY, FONT_BODY, SPRINGS, msToFrame, GRAPH_YELLOW, GRAPH_WHITE } from '../theme/tokens';
import transcriptData from '../data/transcript.json';

const theme = THEME.monopoly;

const PHILOSOPHY_IDS = ['segment_75', 'segment_76', 'segment_77', 'segment_78', 'segment_79', 'segment_80'];

type Segment = { id: string; startMs: number; endMs: number; text: string };

const CENTER = { x: 600, y: 520 };
const CENTER_W = 260;
const CENTER_H = 120;

const NODES = [
  { id: 'gpt2', label: 'GPT-2', pos: { x: 260, y: 190 }, color: GRAPH_YELLOW, mentionOffsetMs: 4800 },
  { id: 'gpt3', label: 'GPT-3', pos: { x: 600, y: 130 }, color: GRAPH_YELLOW, mentionOffsetMs: 5350 },
  { id: 'claude', label: 'CLAUDE', pos: { x: 940, y: 190 }, color: GRAPH_WHITE, mentionOffsetMs: 7140 },
];
const NODE_W = 220;
const NODE_H = 100;

const DashedLine: React.FC<{
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
  progress: number;
}> = ({ from, to, color, progress }) => {
  const dist = Math.hypot(to.x - from.x, to.y - from.y);
  const angle = (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;
  const clipId = `clip-${from.x}-${to.x}-${to.y}`;

  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <rect
            x={from.x} y={from.y - 50}
            width={Math.max(dist * progress, 0)} height={100}
            transform={`rotate(${angle} ${from.x} ${from.y})`}
          />
        </clipPath>
        <marker id={`arrow-${clipId}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>
      <line
        x1={from.x} y1={from.y} x2={to.x} y2={to.y}
        stroke={color}
        strokeWidth={7}
        strokeDasharray="22 16"
        clipPath={`url(#${clipId})`}
        markerEnd={progress > 0.97 ? `url(#arrow-${clipId})` : undefined}
        style={{ filter: `url(#chalkTexture) drop-shadow(0 0 12px ${color}aa)` }}
      />
    </>
  );
};

const CenterNode: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: SPRINGS.rostrum });
  const scale = interpolate(pop, [0, 1], [0.5, 1]);
  const opacity = interpolate(pop, [0, 1], [0, 1]);

  return (
    <g style={{ opacity }} transform={`translate(${CENTER.x} ${CENTER.y}) scale(${scale}) translate(${-CENTER.x} ${-CENTER.y})`}>
      <rect
        x={CENTER.x - CENTER_W / 2} y={CENTER.y - CENTER_H / 2}
        width={CENTER_W} height={CENTER_H} rx={20}
        fill={`${GRAPH_YELLOW}1a`}
        stroke={GRAPH_YELLOW} strokeWidth={4}
        style={{ filter: `drop-shadow(0 0 30px ${GRAPH_YELLOW}88)` }}
      />
      <text
        x={CENTER.x} y={CENTER.y - 6} textAnchor="middle"
        fill="#FFFFFF" fontFamily={FONT_DISPLAY} fontWeight={900} fontSize={30}
        style={{ textTransform: 'uppercase' }}
      >
        SCALING
      </text>
      <text
        x={CENTER.x} y={CENTER.y + 30} textAnchor="middle"
        fill="#FFFFFF" fontFamily={FONT_DISPLAY} fontWeight={900} fontSize={30}
        style={{ textTransform: 'uppercase' }}
      >
        LAWS
      </text>
    </g>
  );
};

const ModelNode: React.FC<{ label: string; pos: { x: number; y: number }; color: string; opacity: number; scale: number }> = ({
  label, pos, color, opacity, scale,
}) => (
  <g style={{ opacity }} transform={`translate(${pos.x} ${pos.y}) scale(${scale}) translate(${-pos.x} ${-pos.y})`}>
    <rect
      x={pos.x - NODE_W / 2} y={pos.y - NODE_H / 2}
      width={NODE_W} height={NODE_H} rx={18}
      fill="rgba(0,0,0,0.3)"
      stroke={color} strokeWidth={4}
      style={{ filter: `drop-shadow(0 0 24px ${color}88)` }}
    />
    <text
      x={pos.x} y={pos.y + 11} textAnchor="middle"
      fill="#FFFFFF" fontFamily={FONT_DISPLAY} fontWeight={900} fontSize={34}
      style={{ textTransform: 'uppercase' }}
    >
      {label}
    </text>
  </g>
);

const NodeGraph: React.FC<{ nodeFrames: { id: string; frame: number }[] }> = ({ nodeFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <svg width={1200} height={700} style={{ overflow: 'visible' }}>
      <ChalkDefs />
      <CenterNode />

      {NODES.map((node) => {
        const triggerFrame = nodeFrames.find((n) => n.id === node.id)!.frame;
        const local = frame - triggerFrame;
        if (local < 0) return null;

        const lineProgress = spring({ frame: local, fps, config: SPRINGS.flow, durationInFrames: 18 });
        const nodePop = spring({ frame: Math.max(local - 14, 0), fps, config: SPRINGS.silk });
        const nodeScale = interpolate(nodePop, [0, 1], [0.6, 1]);
        const nodeOpacity = interpolate(nodePop, [0, 1], [0, 1]);

        return (
          <React.Fragment key={node.id}>
            <DashedLine from={CENTER} to={node.pos} color={node.color} progress={lineProgress} />
            <ModelNode label={node.label} pos={node.pos} color={node.color} opacity={nodeOpacity} scale={nodeScale} />
          </React.Fragment>
        );
      })}
    </svg>
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
        textAlign: 'center', maxWidth: 1000, textShadow: '0 4px 20px rgba(0,0,0,0.8)',
      }}>
        {text}
      </div>
    </AbsoluteFill>
  );
};

export const Scene11_ScalingPhilosophy: React.FC = () => {
  const { segments } = transcriptData as { segments: Segment[] };
  const philosophySegments = segments.filter((s) => PHILOSOPHY_IDS.includes(s.id));
  const sceneStart = philosophySegments[0].startMs;

  // Approximate mention timing within segment_77 — replace with real
  // word-level timestamps once Whisper output is available.
  const mentionBase = philosophySegments.find((s) => s.id === 'segment_77')!.startMs;
  const nodeFrames = NODES.map((n) => ({
    id: n.id,
    frame: msToFrame(mentionBase + n.mentionOffsetMs - sceneStart),
  }));

  return (
    <AbsoluteFill>
      <Audio src={staticFile('audio/dariovoiceover.mp3')} startFrom={msToFrame(sceneStart)} />
      <SceneBackground />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 20 }}>
        <NodeGraph nodeFrames={nodeFrames} />
      </AbsoluteFill>

      {philosophySegments.map((seg) => {
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
