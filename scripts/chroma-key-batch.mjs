import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import path from 'path';

const INPUT_DIR = 'public/assets/raw';
const OUTPUT_DIR = 'public/assets/keyed';
const THRESHOLD = 90;
const FEATHER = 40;

async function keyImage(filePath, outPath) {
  const image = sharp(filePath).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Sample key color from a corner pixel, same approach as the live component
  const sampleIdx = (5 * width + 5) * channels;
  const keyR = data[sampleIdx];
  const keyG = data[sampleIdx + 1];
  const keyB = data[sampleIdx + 2];

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const dist = Math.sqrt((r - keyR) ** 2 + (g - keyG) ** 2 + (b - keyB) ** 2);
    if (dist < THRESHOLD) {
      data[i + 3] = 0;
    } else if (dist < THRESHOLD + FEATHER) {
      data[i + 3] = ((dist - THRESHOLD) / FEATHER) * 255;
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
