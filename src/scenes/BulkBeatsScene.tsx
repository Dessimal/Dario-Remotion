import transcriptData from '../data/transcript.json';
import { msToFrame } from '../theme/tokens';

type Segment = { id: string; startMs: number; endMs: number };

export const BulkBeatsScene: React.FC = () => {
  const { segments } = transcriptData as { segments: Segment[] };
  let cursor = 0;

  return (
    <AbsoluteFill>
      <SceneBackground />
      {BEATS.map((beat) => {
        const seg = segments.find((s) => s.id === beat.segmentId)!;
        const holdFrames = msToFrame(seg.endMs - seg.startMs);
        const duration = 50 + holdFrames; // 50 = enter+exit frames from BeatCard
        const from = cursor;
        cursor += duration;
        return (
          <Sequence key={beat.id} from={from} durationInFrames={duration}>
            <BeatCard image={beat.image} direction={beat.direction} holdFrames={holdFrames} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
