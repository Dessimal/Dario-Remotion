import React from 'react';

// Shared SVG filter — roughens stroke edges into a hand-drawn chalk wobble.
// Render this once per <svg>, then apply filter="url(#chalkTexture)" to any stroke.
export const ChalkDefs: React.FC = () => (
  <defs>
    <filter id="chalkTexture" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={7} result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale={3.5} xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </defs>
);

// Broken/uneven dash pattern — mimics chalk skipping across a rough board,
// as opposed to a smooth continuous line.
export const CHALK_DASH = '10 3 6 4 14 2';
