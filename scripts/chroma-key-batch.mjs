import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import path from 'path';

const INPUT_DIR = 'public/assets/raw';
const OUTPUT_DIR = 'public/assets/keyed';


    const HUE_CENTER = 120;      // green, in degrees (0–360)
const HUE_RANGE = 45;        // how wide a hue window counts as "green"
const MIN_SATURATION = 0.18; // below this, treat as neutral/gray — protects skin, hair, halftone dots from false-matching
const SPILL_STRENGTH = 0.5;

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = 60 * (((g - b) / delta) % 6);
    else if (max === g) h = 60 * ((b - r) / delta + 2);
    else h = 60 * ((r - g) / delta + 4);
  }
  if (h < 0) h += 360;
  const s = max === 0 ? 0 : delta / max;
  const v = max;
  return [h, s, v];
}

async function keyImage(filePath, outPath) {
  const image = sharp(filePath).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const [h, s] = rgbToHsv(r, g, b);

    const hueDist = Math.min(Math.abs(h - HUE_CENTER), 360 - Math.abs(h - HUE_CENTER));

    // "Greenness" score: only counts if hue is near green AND it's
    // actually saturated (not gray/white/skin — those have low saturation
    // regardless of hue, so this protects the subject even where halftone
    // dots create noisy, low-saturation texture on clothing/skin).
    let greenness = 0;
    if (s > MIN_SATURATION && hueDist < HUE_RANGE) {
      greenness = (1 - hueDist / HUE_RANGE) * Math.min(s / MIN_SATURATION, 1);
    }

    data[i + 3] = Math.round((1 - greenness) * 255);

    // Spill suppression, proportional to greenness rather than a hard cutoff
    if (greenness > 0) {
      const maxRB = Math.max(r, b);
      if (g > maxRB) {
        data[i + 1] = g - (g - maxRB) * SPILL_STRENGTH * greenness;
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
