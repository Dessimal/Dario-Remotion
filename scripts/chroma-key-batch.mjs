import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import path from 'path';

const INPUT_DIR = 'public/assets/raw';
const OUTPUT_DIR = 'public/assets/keyed';
const THRESHOLD = 85;
const FEATHER = 35;
const SPILL_STRENGTH = 0.6; // 0 = no spill suppression, 1 = fully desaturate green on edges
const ERODE_PASSES = 2;     // how many 1px erosion passes — higher = more fringe removed, but can eat fine hair detail



async function keyImage(filePath, outPath) {
  const image = sharp(filePath).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const sampleIdx = (5 * width + 5) * channels;
  const keyR = data[sampleIdx];
  const keyG = data[sampleIdx + 1];
  const keyB = data[sampleIdx + 2];

  // Pass 1: alpha + spill suppression
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const dist = Math.sqrt((r - keyR) ** 2 + (g - keyG) ** 2 + (b - keyB) ** 2);

    if (dist < THRESHOLD) {
      data[i + 3] = 0;
    } else if (dist < THRESHOLD + FEATHER) {
      data[i + 3] = ((dist - THRESHOLD) / FEATHER) * 255;
    }

    // Spill suppression: if green is notably higher than red/blue,
    // pull it down toward the average — kills the green edge tint
    // without discarding the pixel entirely.
    const maxRB = Math.max(r, b);
    if (g > maxRB) {
      const excess = g - maxRB;
      data[i + 1] = g - excess * SPILL_STRENGTH;
    }
  }

  // Pass 2: erode the alpha mask inward by ERODE_PASSES pixels —
  // discards the thin ring of worst-contaminated edge pixels entirely,
  // same effect as CapCut's "clean up edge".
  for (let pass = 0; pass < ERODE_PASSES; pass++) {
    const alphaCopy = new Uint8ClampedArray(data.length / channels);
    for (let p = 0; p < alphaCopy.length; p++) alphaCopy[p] = data[p * channels + 3];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        if (alphaCopy[idx] === 0) continue;

        // If any neighbor is fully transparent, this edge pixel shrinks too
        const neighbors = [
          x > 0  ? alphaCopy[idx - 1] : 255,
          x < width - 1 ? alphaCopy[idx + 1] : 255,
          y > 0  ? alphaCopy[idx - width] : 255,
          y < height - 1 ? alphaCopy[idx + width] : 255,
        ];
        if (neighbors.some((n) => n === 0)) {
          data[idx * channels + 3] = 0;
        }
      }
    }
  }

  await sharp(data, { raw: { width, height, channels } }).png().toFile(outPath);
}



async function run() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const files = (await readdir(INPUT_DIR)).filter((f) => /\.(jpe?g|png)$/i.test(f));

  for (const file of files) {
    const outName = file.replace(/\.(jpe?g|png)$/i, '.png');
    console.log(`Keying ${file} → ${outName}`);
    await keyImage(path.join(INPUT_DIR, file), path.join(OUTPUT_DIR, outName));
  }
  console.log(`Done. ${files.length} images processed.`);
}

run();
