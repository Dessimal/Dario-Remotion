// Smooths a set of points into one continuous bezier path (Catmull-Rom).
export const smoothPath = (points: { x: number; y: number }[]) => {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
};

// Deterministic diminishing-returns curve — steep early rise, smooth taper.
// No randomness: the narration says "smooth, predictable curves," so the
// shape itself should look mathematically clean, not organic/noisy.
export const buildScalingCurve = (count: number, width: number, height: number) => {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const climb = Math.pow(t, 0.55); // classic scaling-law taper
    pts.push({ x: t * width, y: height - climb * height });
  }
  return pts;
};
