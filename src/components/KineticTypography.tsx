import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import React from 'react';

interface KineticTypographyProps {
  sentence: string;
  startFrame: number;
  highlightWords?: string[];
  highlightColor?: string;
}

export const KineticTypography: React.FC<KineticTypographyProps> = ({
  sentence,
  startFrame,
  highlightWords = [],
  highlightColor = '#CFB53B', // Default Gold
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = sentence.split(' ');

  return (
    <AbsoluteFill style={{
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      padding: '40px',
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '1200px',
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '72px',
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: '-1px',
        lineHeight: '1.2',
        textAlign: 'center',
        color: '#FFFFFF',
      }}>
        {words.map((word, index) => {
          // Stagger the pop-in frame for each word
          const wordStagger = index * 4; 
          const activeFrame = frame - startFrame - wordStagger;

          // Compute low mass / high stiffness spring for energetic pop-in
          const scaleSpring = spring({
            frame: activeFrame,
            fps,
            config: {
              mass: 0.1,
              stiffness: 220,
              damping: 11,
            },
          });

          // Interpolate scale from 0 to 1.1, settling back to 1.0 (slight overshoot)
          const scale = interpolate(scaleSpring, [0, 1], [0, 1]);
          const opacity = interpolate(scaleSpring, [0, 0.5], [0, 1], {
            extrapolateRight: 'clamp',
          });

          // Check if word should be highlighted
          const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_~()]/g, "").toUpperCase();
          const isHighlighted = highlightWords.map(w => w.toUpperCase()).includes(cleanWord);

          return (
            <span
              key={index}
              style={{
                display: 'inline-block',
                margin: '10px 15px',
                transform: `scale(${scale})`,
                opacity: opacity,
                color: isHighlighted ? highlightColor : '#FFFFFF',
                textShadow: '0px 10px 20px rgba(0,0,0,0.5)',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
