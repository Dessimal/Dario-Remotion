import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Img } from 'remotion';
import React from 'react';

interface ParallaxSceneProps {
  backgroundImageUrl: string;
  foregroundImageUrl: string;
}

export const ParallaxScene: React.FC<ParallaxSceneProps> = ({
  backgroundImageUrl,
  foregroundImageUrl,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // High-mass smooth spring setup
  const smoothProgress = spring({
    frame,
    fps,
    config: {
      mass: 1.5,        // Feels heavy and intentional
      stiffness: 15,    // Slow, gradual transition
      damping: 22,      // Avoid oscillating camera shakes
    },
  });

  // Calculate deep camera zooms:
  // Background zooms in slowly (e.g., 1.0 to 1.08)
  const bgScale = interpolate(smoothProgress, [0, 1], [1.0, 1.08]);
  const bgX = interpolate(smoothProgress, [0, 1], [0, -30]); // Panning drift
  
  // Foreground zooms in slightly faster (e.g., 1.1 to 1.25) to create depth separation
  const fgScale = interpolate(smoothProgress, [0, 1], [1.1, 1.25]);
  const fgX = interpolate(smoothProgress, [0, 1], [0, 15]); // Counter-panning drift

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#0B0B0C' }}>
      {/* Background Layer */}
      <AbsoluteFill style={{
        transform: `scale(${bgScale}) translate(${bgX}px, 0px)`,
        filter: 'brightness(0.65) contrast(1.15)', // Cinematic tone adjustments
      }}>
        <Img src={backgroundImageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* Dark Vignette Overlay to frame subject */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 5,
        background: 'radial-gradient(circle, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 100%)',
      }} />

      {/* Foreground Layer */}
      <AbsoluteFill style={{
        zIndex: 10,
        transform: `scale(${fgScale}) translate(${fgX}px, 20px)`,
      }}>
        <Img src={foregroundImageUrl} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
