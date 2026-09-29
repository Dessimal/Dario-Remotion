import transcriptWords from '../data/transcript_words.json';

type Word = { id: string; startMs: number; endMs: number; text: string };

export const BulkBeatsScene: React.FC = () => {
  const { words } = transcriptWords as { words: Word[] };
  let cursor = 0;

  return (
    <AbsoluteFill>
      <SceneBackground />
      {BEATS.map((beat) => {
        const startWord = words.find((w) => w.id === beat.startWordId)!;
        const endWord = words.find((w) => w.id === beat.endWordId)!;
        const holdFrames = msToFrame(endWord.endMs - startWord.startMs);
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
