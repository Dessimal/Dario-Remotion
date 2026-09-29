import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import path from 'path';

const INPUT_DIR = 'public/assets/raw';
const OUTPUT_DIR = 'public/assets/keyed';

// How much greener a pixel is than its own red/blue channels.
// Below DIFF_LOW -> fully opaque (subject). Above DIFF_HIGH -> fully
// transparent (background). Between the two -> soft feathered edge.
const DIFF_LOW = 8;
const DIFF_HIGH = 45;
const SPILL_STRENGTH = 0.5; // 0 = no spill suppression, 1 = fully neutralize green tint on edges

async function keyImage(filePath, outPath) {
  const image = sharp(filePath).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const diff = g - Math.max(r, b);

    let alpha = 255;
    if (diff > DIFF_HIGH) {
      alpha = 0;
    } else if (diff > DIFF_LOW) {
      alpha = 255 * (1 - (diff - DIFF_LOW) / (DIFF_HIGH - DIFF_LOW));
    }
    data[i + 3] = Math.round(alpha);

    // Spill suppression: pull green down toward neutral on any pixel
    // that's greener than it should be, proportional to how green it is.
    if (diff > 0) {
      const spillFactor = Math.min(diff / DIFF_HIGH, 1) * SPILL_STRENGTH;
      data[i + 1] = g - diff * spillFactor;
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
