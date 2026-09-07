# Specification & AI Coding Assistant Instructions for Remotion React Business Documentaries (v2)

This document defines the styling, pacing, visual architecture, storytelling psychology, and Remotion React implementation specifications for programmatic generation of high-retention "business documentary" and journalistic videos (emulating channels like *Vox*, *MagnatesMedia*, *James Jani*, and *Jake Tran*). It serves as a direct configuration and blueprint manual for an AI coding assistant.

---

## 1. STORYTELLING PSYCHOLOGY & EDITING ARCHITECTURE

To emulate the viral business documentary style, the video generation system must execute on specific psychological frameworks described in the source materials:

1. **The Protagonist Shift ("You" Framing)**:
   - Treat the viewer as the active protagonist in the narrative rather than a passive observer [24, 38]. Scripts and on-screen cues should center on immediate direct-address ("Imagine you are...") to induce emotional personalization and drive up Average View Duration (AVD) [24, 25].
2. **"Open Loops" (Curiosity Gaps)**:
   - Every sequence must plant a cognitive "itch"—an unanswered question, a shocking metric, or a betrayal arc—at the beginning and defer the resolution to a specific timestamp later in the video to secure high watch-time [25, 35].
3. **Famejacking & Mass Appeal**:
   - The opening hook should visually leverage highly recognizable, authoritative faces (celebrities, tech moguls, historical tycoons) to drive up CTR and baseline familiarity, even when discussing complex, dry topics like corporate taxation, antitrust legislation, or algorithms [18, 46].
4. **Narrative Sequencing**:
   - **Prologue/Hook (0:00 - 0:30)**: Instantly establish a high-stakes, cinematic conflict (outrage, bankruptcy, or rags-to-riches) without preambles [35, 163].
   - **The Problem (The Antagonist Rise)**: Frame the corporate entity or antagonist as an unchecked force (e.g., "The Octopus" model of monopolies) [187, 338].
   - **The Resolution**: Deliver highly structured, strategic solutions/pivots [35, 54].
5. **The Journalistic Investigation Grid (Vox-Style)**:
   - Move beyond simple storytelling into structural journalism. Use visual grids, spatial maps, and primary sources (document scans, newspaper archives) in an analytical frame [60, 205].
   - Visually divide the screen into geometric sections (e.g., left-aligned editorial text, right-aligned moving footage or evidence scans) to establish a distinct "investigative board" feel.

---

## 2. ART DIRECTION, COLOR PALETTES & PACING SPECS

The visual style must be dynamic, changing with the topic to prevent viewer fatigue. It uses a hybrid mix of 2D images with parallax scenes, transformed historical/movie clips (for fair use compliance), and rich typography [21, 143].

### Color Palettes (Theme Configurations)

*   **Theme 1: Gritty Outrage / Black Markets (e.g., *Silk Road*, *The Dark Truth*)**
    *   Primary Background: `#0B0B0C` (Deep Onyx)
    *   Accent Red: `#D32F2F` (Crimson)
    *   Accent Highlight: `#00E676` (Neon Green / Matrix Green for data)
    *   Text: `#FFFFFF` (Stark White) / `#B0BEC5` (Slate Grey)
*   **Theme 2: Monopolistic Empires / Luxury Tycoons (e.g., *Louis Vuitton*, *Standard Oil*)**
    *   Primary Background: `#0A0E17` (Imperial Navy)
    *   Accent Highlight: `#CFB53B` (Classic Warm Gold)
    *   Secondary: `#FFFFFF` (Pure Silver)
    *   Text: `#F5F5F7` (Alabaster White)
*   **Theme 3: Scrappy Underdog / Vintage Rags-to-Riches (e.g., *IKEA*, *Sam Walton*)**
    *   Primary Background: `#1C1917` (Warm Charcoal)
    *   Accent Highlight: `#EAB308` (Amber Yellow)
    *   Accent Neutral: `#D6D3D1` (Stone Paper)
*   **Theme 4: Journalistic Investigation / Vox-Style (e.g., Maps, Documents, Case Studies)**
    *   Primary Background: `#F4F1EA` (Chalky Cream / Warm Paper)
    *   Secondary Background: `#EBE7DD` (Thick Parchment)
    *   Primary Text/Ink: `#111111` (Deep Charcoal Black)
    *   Vox Signature Yellow Highlight: `#FFDD00` (Saturated Marker Yellow)
    *   Infographic Accent: `#2B6CB0` (Muted Steel Blue)
    *   Tension Crimson: `#C53030` (Warning Red)

### Pacing Mechanics
*   **Frame Rate**: Standardized at **30 FPS**.
*   **Visual State Updates**: A visual cut, camera transition, scale-pop, or parallax drift must occur every **2 to 4 seconds** to preserve sensory stimulation and fight cognitive habituation [23, 34].
*   **Audio Sync**: Key kinetic transitions, pops, and title sequences must align with low-frequency drum hits or high-frequency digital glitched sound effects [38].

---

## 3. MOTION PHYSICS & MATHEMATICAL PARAMETERS

All motion must feel natural, physical, and premium. **Strictly avoid linear interpolations (lerps)** for dynamic elements. Use Remotion's `spring` engine with the following exact mathematical settings:

### Velocity Configurations (Remotion Spring Options)

1.  **Fast Pop-In / Kinetic Typography Pop** (Low Mass, High Stiffness):
    *   *Purpose*: Used for word-by-word text appearances, graphical UI pop-ups, and icon pop-ins.
    *   *Mathematical Setup*:
        ```typescript
        const popSpring = spring({
          frame,
          fps: 30,
          config: {
            mass: 0.1,       // Extremely low inertia for instantaneous reaction
            stiffness: 200,  // High restorative force for fast movement
            damping: 10,     // Low dampening to allow minor, energetic overshoot
            overshootClamping: false,
          }
        });
        ```

2.  **Smooth Camera Drift / Cinematic Scale Zoom** (High Mass, Moderate Stiffness):
    *   *Purpose*: Slow, elegant, continuous panning, parallax depth shifts, and organic camera zooms.
    *   *Mathematical Setup*:
        ```typescript
        const driftSpring = spring({
          frame,
          fps: 30,
          config: {
            mass: 1.5,       // High inertia to create heavy, luxurious momentum
            stiffness: 20,   // Low stiffness for gradual, slow acceleration
            damping: 25,     // High damping to eliminate bouncy oscillations
            overshootClamping: true,
          }
        });
        ```

3.  **Visual Transition / Clean Slide** (Balanced Mass, Medium Dampening):
    *   *Purpose*: Directional screen wipes, split-screen slides, and menu reveals.
    *   *Mathematical Setup*:
        ```typescript
        const slideSpring = spring({
          frame,
          fps: 30,
          config: {
            mass: 0.6,
            stiffness: 110,
            damping: 15,
            overshootClamping: false,
          }
        });
        ```

4.  **Vox-Style Rostrum Camera 3D Drift** (High Mass, Slow Acceleration):
    *   *Purpose*: Simulating physical camera movements over historical documents and tilted paper maps on a rostrum table.
    *   *Mathematical Setup*:
        ```typescript
        const rostrumSpring = spring({
          frame,
          fps: 30,
          config: {
            mass: 2.2,       // Extremely heavy camera table weight
            stiffness: 12,   // Muted, gradual pickup
            damping: 32,     // High dampening for zero bounce
            overshootClamping: true,
          }
        });
        ```

5.  **Marker Highlight / Pen Draw Glide** (Balanced Inertia):
    *   *Purpose*: Animating marker sweeps under text or drawing connecting SVG paths on maps.
    *   *Mathematical Setup*:
        ```typescript
        const markerSpring = spring({
          frame,
          fps: 30,
          config: {
            mass: 0.5,
            stiffness: 150,
            damping: 18,
            overshootClamping: true,
          }
        });
        ```

---

## 4. REMOTION REACT COMPONENT BLUEPRINTS

The following code blocks are production-ready Remotion component blueprints. Copy and import these into your Remotion structure for pixel-perfect scene composition.

### 4.1 Kinetic Word-by-Word Typography Component
This component inputs a full sentence, splits it into words, and populates them sequentially using a low-mass, high-stiffness spring engine to create an energetic, highly engaging caption style.

```tsx
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

          // Check if word should be highlighted (e.g., terms like "MONOPOLY", "SCAM", "BILLIONS")
          const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toUpperCase();
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
```

### 4.2 Smooth Parallax Camera Scene
This component takes an asset (e.g., a 2D vintage portrait or a historical photo), isolates the foreground/background (with separate layers passed as props), and applies a luxurious, high-mass camera scale drift and panning effect [13, 143].

```tsx
import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import React from 'react';

interface ParallaxSceneProps {
  backgroundImageUrl: string;
  foregroundImageUrl: string;
  durationInFrames: number;
}

export const ParallaxScene: React.FC<ParallaxSceneProps> = ({
  backgroundImageUrl,
  foregroundImageUrl,
  durationInFrames,
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
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        transform: `scale(${bgScale}) translate(${bgX}px, 0px)`,
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.65) contrast(1.15)', // Cinematic tone adjustments
      }} />

      {/* Dark Vignette Overlay to frame subject */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 5,
        background: 'radial-gradient(circle, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 100%)',
      }} />

      {/* Foreground Layer (e.g. Transparent PNG cutout of Sam Walton, Rockefeller, or a modern logo) */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 10,
        transform: `scale(${fgScale}) translate(${fgX}px, 20px)`,
        backgroundImage: `url(${foregroundImageUrl})`,
        backgroundSize: 'contain',
        backgroundPosition: 'bottom center',
        backgroundRepeat: 'no-repeat',
        filter: 'drop-shadow(0px 30px 40px rgba(0,0,0,0.8))',
      }} />
    </AbsoluteFill>
  );
};
```

### 4.3 Looping tactile Paper Texture Overlay Component
Applies a vintage, organic stop-motion paper texture loop with random translations and rotations to emulate the stop-motion "gate weave" and tactile feel seen in *Vox* and *Johnny Harris* content.

```tsx
import { useCurrentFrame, AbsoluteFill } from 'remotion';
import React from 'react';

export const PaperTextureOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Re-seed random translations and rotations every 2 frames to achieve a organic 15fps flicker
  const step = Math.floor(frame / 2);
  const randomX = (step * 17) % 12 - 6; // Range [-6, 6]
  const randomY = (step * 23) % 12 - 6; // Range [-6, 6]
  const randomRotation = (step * 90) % 360;

  return (
    <AbsoluteFill style={{
      pointerEvents: 'none',
      mixBlendMode: 'multiply',
      opacity: 0.14,
      zIndex: 99,
      transform: `translate(${randomX}px, ${randomY}px) rotate(${randomRotation}deg)`,
      // High-resolution procedural SVG noise that represents micro-fibers and dust
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }} />
  );
};
```

### 4.4 Journalistic Word-Highlighting Component (Vox-Style)
This component animates a textured yellow highlighter marker stroke drawing behind specified index ranges of text dynamically using customized spring options to draw focused emphasis to critical terms.

```tsx
import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import React from 'react';

interface VoxTextHighlighterProps {
  text: string;
  highlightIndices: number[];
  startFrame?: number;
  highlightColor?: string; // Vox Yellow: 'rgba(255, 221, 0, 0.45)'
}

export const VoxTextHighlighter: React.FC<VoxTextHighlighterProps> = ({
  text,
  highlightIndices,
  startFrame = 0,
  highlightColor = 'rgba(255, 221, 0, 0.55)',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');

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
        maxWidth: '1000px',
        fontFamily: '"PT Serif", Georgia, serif',
        fontSize: '56px',
        fontWeight: 700,
        lineHeight: '1.4',
        color: '#111111',
        textAlign: 'center',
      }}>
        {words.map((word, index) => {
          const isHighlighted = highlightIndices.includes(index);
          const wordStagger = index * 3; // Word-by-word reveal stagger
          const activeFrame = frame - startFrame - wordStagger;

          // Crisp, marker glide draw speed
          const markerProgress = spring({
            frame: activeFrame,
            fps,
            config: {
              mass: 0.5,
              stiffness: 150,
              damping: 18,
            },
          });

          // Draw width from left-to-right
          const highlightWidth = interpolate(markerProgress, [0, 1], [0, 100], {
            extrapolateRight: 'clamp',
          });

          return (
            <span
              key={index}
              style={{
                position: 'relative',
                display: 'inline-block',
                margin: '5px 12px',
                padding: '0 4px',
                zIndex: 1,
              }}
            >
              {/* Highlighter Ink Background Layer */}
              {isHighlighted && (
                <span style={{
                  position: 'absolute',
                  left: 0,
                  bottom: '6px',
                  height: '42%',
                  width: `${highlightWidth}%`,
                  backgroundColor: highlightColor,
                  zIndex: -1,
                  transform: 'skewX(-8deg)',
                  transformOrigin: 'left center',
                }} />
              )}
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
```

### 4.5 3D Rostrum Camera Document Projection Scene
Isolates vintage contracts, newspapers, or evidence sheets, projecting them into 3D perspective space with elegant slow zooms and rotations that mimic classic physical camera movement.

```tsx
import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import React from 'react';

interface VoxRostrumCameraProps {
  documentUrl: string;
  gridOverlay?: boolean;
}

export const VoxRostrumCamera: React.FC<VoxRostrumCameraProps> = ({
  documentUrl,
  gridOverlay = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Heavy, slow-moving camera slide spring
  const cameraProgress = spring({
    frame,
    fps,
    config: {
      mass: 2.2,
      stiffness: 12,
      damping: 32,
    },
  });

  // Tilt and Pan rotation transitions (3D projection mechanics)
  const rotateX = interpolate(cameraProgress, [0, 1], [18, 11]);
  const rotateY = interpolate(cameraProgress, [0, 1], [-14, -6]);
  const scale = interpolate(cameraProgress, [0, 1], [1.02, 1.15]);
  const translateX = interpolate(cameraProgress, [0, 1], [-30, 20]);
  const translateY = interpolate(cameraProgress, [0, 1], [30, -10]);

  return (
    <AbsoluteFill style={{
      backgroundColor: '#EBE7DD', // Thick parchment canvas
      overflow: 'hidden',
    }}>
      {/* Editorial Dot Grid Overlay */}
      {gridOverlay && (
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.08,
          backgroundImage: 'radial-gradient(#111111 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }} />
      )}

      {/* Decorative Technical Coordinates HUD */}
      <div style={{
        position: 'absolute',
        top: '40px',
        left: '40px',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '13px',
        color: '#111111',
        opacity: 0.35,
        letterSpacing: '1px',
      }}>
        SYSTEM: ROSTRUM_CAM_ACTIVE_30FPS // SEC: 04 // LAT: 45.10_RECON
      </div>

      {/* 3D Projected Document Node */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale}) translate(${translateX}px, ${translateY}px)`,
      }}>
        <div style={{
          width: '640px',
          height: '840px',
          backgroundColor: '#FFFFFF',
          boxShadow: '0px 45px 90px rgba(0,0,0,0.22)',
          border: '1px solid rgba(0,0,0,0.06)',
          padding: '40px',
          backgroundImage: `url(${documentUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
      </div>

      {/* Edge Vignette */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle, rgba(0,0,0,0) 50%, rgba(17,17,17,0.25) 100%)',
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};
```

### 4.6 Animated SVG Dotted Map Routing Scene
Draws clean, dotted connecting routes between coordinates over historical maps, complete with animated radar markers representing locations like *Standard Oil* nodes or *Sackler* distribution hubs [175, 501].

```tsx
import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import React from 'react';

interface VoxDottedRouteMapProps {
  mapBackgroundUrl: string;
  startCoords: { x: number; y: number };
  endCoords: { x: number; y: number };
}

export const VoxDottedRouteMap: React.FC<VoxDottedRouteMapProps> = ({
  mapBackgroundUrl,
  startCoords,
  endCoords,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Draw path stroke anim spring
  const routeProgress = spring({
    frame,
    fps,
    config: {
      mass: 1.0,
      stiffness: 85,
      damping: 22,
    },
  });

  // Dynamic quadratic bezier curves for map route arcs
  const dx = endCoords.x - startCoords.x;
  const dy = endCoords.y - startCoords.y;
  const controlX = startCoords.x + dx / 2;
  const controlY = startCoords.y + dy / 2 - 120; // Arc elevation

  const pathDefinition = `M ${startCoords.x} ${startCoords.y} Q ${controlX} ${controlY} ${endCoords.x} ${endCoords.y}`;

  // Dashoffset interpolation
  const pathLength = 1000;
  const drawOffset = interpolate(routeProgress, [0, 1], [pathLength, 0]);

  // Background map camera scale
  const zoomProgress = spring({
    frame,
    fps,
    config: {
      mass: 2.8,
      stiffness: 8,
      damping: 28,
    },
  });
  const mapScale = interpolate(zoomProgress, [0, 1], [1.0, 1.06]);

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#EBE7DD' }}>
      {/* Map Backdrop */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundImage: `url(${mapBackgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: `scale(${mapScale})`,
        filter: 'sepia(0.24) contrast(1.12) brightness(0.88)',
      }} />

      {/* SVG Canvas */}
      <svg style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 10,
      }} viewBox="0 0 1920 1080">
        {/* Route Line */}
        <path
          d={pathDefinition}
          fill="none"
          stroke="#FFDD00" // Vox Marker Yellow
          strokeWidth="7"
          strokeDasharray="14,14"
          strokeDashoffset={drawOffset}
          strokeLinecap="round"
        />

        {/* Start Hub Node */}
        <circle
          cx={startCoords.x}
          cy={startCoords.y}
          r="14"
          fill="#111111"
          stroke="#FFFFFF"
          strokeWidth="4"
        />

        {/* End Hub Radar Ring */}
        {routeProgress > 0.92 && (
          <circle
            cx={endCoords.x}
            cy={endCoords.y}
            r={interpolate(frame % 30, [0, 29], [14, 45])}
            fill="none"
            stroke="#FFDD00"
            strokeWidth={interpolate(frame % 30, [0, 29], [4, 0])}
            style={{ opacity: interpolate(frame % 30, [0, 29], [1, 0]) }}
          />
        )}

        {/* End Hub Target Node */}
        <circle
          cx={endCoords.x}
          cy={endCoords.y}
          r="14"
          fill="#FFDD00"
          stroke="#111111"
          strokeWidth="4"
        />
      </svg>
    </AbsoluteFill>
  );
};
```

### 4.7 Integrated Vox-Style timeline Orchestration
Combines maps, document panning, typography highlights, and loops tactile paper textures over a synchronized sequences chain.

```tsx
import { Series, AbsoluteFill } from 'remotion';
import React from 'react';
import { VoxRostrumCamera } from './VoxRostrumCamera';
import { VoxTextHighlighter } from './VoxTextHighlighter';
import { VoxDottedRouteMap } from './VoxDottedRouteMap';
import { PaperTextureOverlay } from './PaperTextureOverlay';

export const VoxTimelineSequencing: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#F4F1EA' }}>
      {/* Looping tactile paper texture overlaying all visual sequences */}
      <PaperTextureOverlay />

      <Series>
        {/* Sequence 1: The Historical Evidence (Rostrum Document) */}
        <Series.Sequence durationInFrames={120}> {/* 4 Seconds */}
          <VoxRostrumCamera 
            documentUrl="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae" // Vintage Gazette Scan
          />
          <VoxTextHighlighter 
            text="They built a cartel that controlled ninety percent of the industry."
            highlightIndices={[4, 5, 7, 8]} // Highlight: "cartel", "controlled", "ninety", "percent"
            startFrame={15}
          />
        </Series.Sequence>

        {/* Sequence 2: The Supply Chain expansion (Map Route) */}
        <Series.Sequence durationInFrames={150}> {/* 5 Seconds */}
          <VoxDottedRouteMap 
            mapBackgroundUrl="https://images.unsplash.com/photo-1524661135-423995f22d0b" // Muted Vintage Topography Map
            startCoords={{ x: 450, y: 700 }} // Cleveland Refinery Node
            endCoords={{ x: 1350, y: 350 }}  // New York Export Terminal
          />
          <VoxTextHighlighter 
            text="Tapping into a global shipping network with secret rebates."
            highlightIndices={[4, 5, 7, 8]} // Highlight: "global", "shipping", "secret", "rebates"
            startFrame={10}
            highlightColor="rgba(197, 48, 48, 0.45)" // Crimson Marker for warning notes
          />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
```

---

## 5. QUALITY GATES & VALIDATION RULES FOR GENERATION

AI assistants translating scripts or data into these components must adhere to the following strict validation checks:

*   **Audio Peak Warning**: Remotion composition audio layers must match subtitle arrays. Never let typography appear behind or ahead of its audio waveform by more than **1 frame** (offset accuracy $\le \\pm 33.3\text{ms}$).
*   **Asset Aspect Ratio Padding**: All foreground cutouts (`foregroundImageUrl`) must have a dropping margin bottom to anchor them securely without hovering raw edges over transparent regions.
*   **Vignette Contrast**: Never present a dynamic image layer without a radial vignette overlay of at least `rgba(0,0,0,0.85)` in the outer perimeter to prevent web-UI or visual compression banding.
*   **Text Shadow Grounding**: Text layer nodes must always implement a text shadow configuration `textShadow: '0px 10px 20px rgba(0,0,0,0.6)'` to guarantee stark readability regardless of variable color channels in background images.
*   **Text Highlighting Color Contrast**: Saturated bright highlights like `#FFDD00` (Vox Yellow) must utilize black or charcoal text `#111111` to preserve AAA color contrast requirements. Never layer highlighter marks under stark white text nodes.
*   **Flicker Cycle modulo Integrity**: Looping texture coordinates must avoid static frames by using prime modulo coefficients (e.g. `17` and `23` offsets) to generate high-variety stop-motion noise.
