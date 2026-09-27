import React, { useEffect, useRef, useState } from 'react';
import { continueRender, delayRender, staticFile } from 'remotion';

export const ChromaKeyImage: React.FC<{
  src: string;
  style?: React.CSSProperties;
  threshold?: number; // how close to the key color counts as "background"
  feather?: number;   // soft edge width, avoids a hard jagged cutout
}> = ({ src, style, threshold = 90, feather = 40 }) => {
  const [keyedSrc, setKeyedSrc] = useState<string | null>(null);
  const handleRef = useRef<number | null>(null);

  useEffect(() => {
    handleRef.current = delayRender('Chroma-keying image');
    const img = new Image();
    img.src = staticFile(src);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Sample the key color from a corner pixel rather than hardcoding
      // pure green — more robust to whatever exact shade the source uses.
      const sampleIdx = (5 * canvas.width + 5) * 4;
      const keyR = data[sampleIdx];
      const keyG = data[sampleIdx + 1];
      const keyB = data[sampleIdx + 2];

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const dist = Math.sqrt((r - keyR) ** 2 + (g - keyG) ** 2 + (b - keyB) ** 2);

        if (dist < threshold) {
          data[i + 3] = 0; // fully transparent
        } else if (dist < threshold + feather) {
          // Soft-edge feather so the cutout isn't a jagged hard line
          data[i + 3] = ((dist - threshold) / feather) * 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setKeyedSrc(canvas.toDataURL('image/png'));
      if (handleRef.current !== null) continueRender(handleRef.current);
    };
  }, [src, threshold, feather]);

  if (!keyedSrc) return null;
  return <img src={keyedSrc} style={style} />;
};
