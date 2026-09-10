import React from 'react';
import { AbsoluteFill, Audio, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { AuroraBackground } from '../components/AuroraBackground';
import { THEME, FONT_DISPLAY, FONT_BODY, SPRINGS, msToFrame, GRAPH_YELLOW, GRAPH_WHITE } from '../theme/tokens';
import { quadPoint } from '../utils/curves';
import transcriptData from '../data/transcript.json';
import { ChalkDefs, CHALK_DASH } from '../components/ChalkDefs';

const theme = THEME.monopoly;

// Segments 75–80 — "it sounds like a footnote... but there's a catch nobody's reckoned with yet."
const PHILOSOPHY_IDS = ['segment_75', 'segment_76', 'segment_77', 'segment_78', 'segment_79', 'segment_80'];

type Segment = { id: string; startMs: number; endMs: number; text: string };

const CENTER = { x: 600, y: 460 };
const NODES = [
  { id: 'gpt2', label: 'GPT-2', pos: { x: 260, y: 200 }, appearFrame: 0 },
  { id: 'gpt3', label: 'GPT-3', pos: { x: 600, y: 120 }, appearFrame: 12 },
  { id: 'claude', label: 'Claude', pos: { x: 940, y: 200 }, appearFrame: 24 },
];

const ctrlFor = (p: { x: number; y: number }) => ({
  x: (CENTER.x + p.x) / 2,
  y: (CENTER.y + p.y) / 2 - 70,
});

const NodeGraph: React.FC<{ linesFrom: number; warnFrom: number }> = ({ linesFrom, warnFrom }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const centerPop = spring({ frame, fps, config: SPRINGS.rostrum });
  const centerScale = interpolate(centerPop, [0, 1], [0.6, 1]);
  const centerOpacity = interpolate(centerPop, [0, 1], [0, 1]);

  const warnLocal = frame - warnFrom;
  const warnPulse = warnLocal >= 0 ? (Math.sin(warnLocal / 6) + 1) / 2 : 0;

  return (
    <svg width={1200} height={700} style={{ overflow: 'visible' }}>
     <ChalkDefs />
      {/* Central "Scaling Laws" node */}
      <circle
  cx={CENTER.x} cy={CENTER.y} r={70 * centerScale}
  fill={`${GRAPH_YELLOW}22`}
  stroke={GRAPH_YELLOW}
  strokeWidth={3}
  style={{ opacity: centerOpacity, filter: `drop-shadow(0 0 30px ${GRAPH_YELLOW}88)` }}
/>
      <text
        x={CENTER.x} y={CENTER.y + 8} textAnchor="middle"
        fill="#FFFFFF" fontFamily={FONT_DISPLAY} fontWeight={800} fontSize={26}
        style={{ opacity: centerOpacity }}
      >
        Scaling Laws
      </text>

      {NODES.map((node) => {
        const local = frame - (linesFrom + node.appearFrame);
        const draw = spring({ frame: Math.max(local, 0), fps, config: SPRINGS.flow });
        const ctrl = ctrlFor(node.pos);
        const isClaude = node.id === 'claude';
        const isWarnActive = isClaude && warnLocal >= 0;

        const lineColor = isWarnActive
  ? `rgba(255,${Math.round(120 - warnPulse * 80)},${Math.round(120 - warnPulse * 80)},1)`
  : GRAPH_YELLOW;
      
        // Approx curve length for a clean dash-draw
        const approxLen = Math.hypot(node.pos.x - CENTER.x, node.pos.y - CENTER.y) * 1.25;
        const dashOffset = interpolate(draw, [0, 1], [approxLen, 0]);

        // Traveling pulse loops continuously once the line has drawn in
        const loopT = local > 0 ? ((local * 0.012) % 1) : 0;
        const pulsePos = quadPoint(CENTER, ctrl, node.pos, loopT);

        const nodePop = spring({ frame: Math.max(local, 0), fps, config: SPRINGS.silk });
        const nodeScale = interpolate(nodePop, [0, 1], [0.5, 1]);
        const nodeOpacity = interpolate(nodePop, [0, 1], [0, 1]);

        return (
          <React.Fragment key={node.id}>
            <path
  d={`M ${CENTER.x} ${CENTER.y} Q ${ctrl.x} ${ctrl.y} ${node.pos.x} ${node.pos.y}`}
  fill="none"
  stroke={lineColor}
  strokeWidth={isClaude ? 5 : 3}
  strokeLinecap="round"
  strokeDasharray={CHALK_DASH}
  opacity={draw}
  style={{ filter: `url(#chalkTexture) drop-shadow(0 0 ${isWarnActive ? 16 : 8}px ${lineColor})` }}
/>
            {draw > 0.98 && (
              <circle
  cx={pulsePos.x} cy={pulsePos.y} r={6}
  fill={GRAPH_WHITE}
  style={{ filter: `drop-shadow(0 0 10px ${lineColor})`, opacity: nodeOpacity }}
/>
            )}
            <circle
  cx={node.pos.x} cy={node.pos.y} r={46 * nodeScale}
  fill={`${GRAPH_YELLOW}18`}
  stroke={isWarnActive ? lineColor : GRAPH_YELLOW}
  strokeWidth={2.5}
  style={{ opacity: nodeOpacity, filter: `drop-shadow(0 0 18px ${GRAPH_YELLOW}55)` }}
/>
            <text
              x={node.pos.x} y={node.pos.y + 7} textAnchor="middle"
              fill="#FFFFFF" fontFamily={FONT_DISPLAY} fontWeight={700} fontSize={20}
              style={{ opacity: nodeOpacity }}
            >
              {node.label}
            </text>
          </React.Fragment>
        );
      })}

      {/* Warning glyph near center once "the catch" lands */}
      {warnLocal >= 0 && (
        <text
          x={CENTER.x} y={CENTER.y - 100} textAnchor="middle"
          fontSize={34}
          style={{ opacity: interpolate(warnPulse, [0, 1], [0.5, 1]) }}
        >
          ⚠
        </text>
      )}
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
        textAlign: 'center', maxWidth: 1000, textShadow: '0 4px 20px rgba(0,0,0,0.7)',
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

  // Lines start drawing once segment_76 begins ("that single observation...").
  const linesTrigger = philosophySegments.find((s) => s.id === 'segment_76')!;
  const linesFrom = msToFrame(linesTrigger.startMs - sceneStart);

  // "The catch" warning kicks in at segment_80.
  const warnTrigger = philosophySegments.find((s) => s.id === 'segment_80')!;
  const warnFrom = msToFrame(warnTrigger.startMs - sceneStart);

  return (
    <AbsoluteFill>
      <Audio src={staticFile('audio/dariovoiceover.mp3')} startFrom={msToFrame(sceneStart)} />
      <AuroraBackground from={theme.bgFrom} to={theme.bgTo} />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
        <NodeGraph linesFrom={linesFrom} warnFrom={warnFrom} />
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
