// Turns the generated images (assets/raw/, local only) into 64×96 game frames in assets/tiles/ (committed).
// Usage: npm run art  then  npm run tiles. A tile whose raw image is missing keeps its last processed frame.
// Method and history: docs/ASSETS.md.
import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { H, TILES, W } from './tiles-def.mjs';

const RAW = new URL('../assets/raw/', import.meta.url);
const OUT = new URL('../assets/tiles/', import.meta.url);
const INK = [27, 21, 18];
const SUPERSAMPLE = 8;

async function readRgba(url) {
  const { data, info } = await sharp(fileURLToPath(url)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

const smoothstep = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

// Blends the texture with a copy shifted by half its size, whose edges wrap seamlessly: the centre keeps the
// original, the borders take the shifted copy. 'vertical' only shifts along y, for tracks and bridges that must
// stay centred across the tile.
function makeTileable(img, seam) {
  const { data, width: n } = img;
  const out = Buffer.alloc(data.length);
  const border = (t) => smoothstep(Math.min(t, n - 1 - t) / (n / 4));
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const w = seam === 'vertical' ? border(y) : border(x) * border(y);
      const sx = seam === 'vertical' ? x : (x + n / 2) % n;
      const sy = (y + n / 2) % n;
      const i = (y * n + x) * 4;
      const j = (sy * n + sx) * 4;
      for (let c = 0; c < 4; c++) out[i + c] = Math.round(data[i + c] * w + data[j + c] * (1 - w));
    }
  }
  return { data: out, width: n, height: n };
}

// Square top-down texture → 64×32 isometric diamond. The texture's top-left corner lands on the left vertex,
// so a feature running top to bottom in the texture runs along the map's columns (down-right on screen).
function projectDiamond(tex) {
  const { data, width: n } = tex;
  const S = SUPERSAMPLE;
  const out = Buffer.alloc(W * 32 * 4);
  const margin = 1 / W; // half a pixel of overlap on each side, so neighbouring tiles leave no gap
  const sample = (tx, ty, c) => {
    const fx = (((tx * n - 0.5) % n) + n) % n;
    const fy = (((ty * n - 0.5) % n) + n) % n;
    const x0 = Math.floor(fx), y0 = Math.floor(fy);
    const x1 = (x0 + 1) % n, y1 = (y0 + 1) % n;
    const ax = fx - x0, ay = fy - y0;
    const at = (x, y) => data[(y * n + x) * 4 + c];
    return (at(x0, y0) * (1 - ax) + at(x1, y0) * ax) * (1 - ay) + (at(x0, y1) * (1 - ax) + at(x1, y1) * ax) * ay;
  };
  for (let py = 0; py < 32; py++) {
    for (let px = 0; px < W; px++) {
      const acc = [0, 0, 0];
      let covered = 0;
      for (let sy = 0; sy < S; sy++) {
        for (let sx = 0; sx < S; sx++) {
          const u = (px + (sx + 0.5) / S) / W;
          const v = (py + (sy + 0.5) / S) / 32;
          const tx = u - (v - 0.5);
          const ty = u + (v - 0.5);
          if (Math.abs(tx - 0.5) > 0.5 + margin || Math.abs(ty - 0.5) > 0.5 + margin) continue;
          covered++;
          for (let c = 0; c < 3; c++) acc[c] += sample(tx, ty, c);
        }
      }
      const i = (py * W + px) * 4;
      if (!covered) continue;
      for (let c = 0; c < 3; c++) out[i + c] = Math.round(acc[c] / covered);
      out[i + 3] = Math.round((255 * covered) / (S * S));
    }
  }
  return out;
}

async function groundFrame(src, seam) {
  const diamond = projectDiamond(makeTileable(await readRgba(src), seam));
  return sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: diamond, raw: { width: W, height: 32, channels: 4 }, left: 0, top: H - 32 }])
    .png();
}

// The model paints contact shadows light grey (a pale halo on grass): repaint the grey pixels of the bottom
// fifth as translucent ink. Brown roots and coloured feet are saturated and stay.
function inkShadow(img) {
  const { data, width, height } = img;
  let top = height;
  let bottom = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 16) {
        top = Math.min(top, y);
        bottom = y;
      }
    }
  }
  const band = top + Math.floor((bottom - top) * 0.8);
  for (let y = band; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const [r, g, b, a] = data.subarray(i, i + 4);
      if (a > 0 && Math.max(r, g, b) - Math.min(r, g, b) < 40) {
        data.set(INK, i);
        data[i + 3] = Math.min(a, 120);
      }
    }
  }
  return img;
}

// Trims to the visible pixels, fits into maxWidth × maxHeight and stands the result on y = foot, centred.
async function standingFrame(src, { maxWidth = W, maxHeight, foot, shadow = false, fixShadow = false }) {
  let img = await readRgba(src);
  if (fixShadow) img = inkShadow(img);
  const raw = { width: img.width, height: img.height, channels: 4 };
  const trimmed = await sharp(img.data, { raw }).trim({ threshold: 16 }).png().toBuffer();
  const fitted = await sharp(trimmed)
    .resize({ width: maxWidth, height: maxHeight, fit: 'inside', kernel: 'lanczos3' })
    .png()
    .toBuffer({ resolveWithObject: true });
  const layers = [];
  if (shadow) {
    const ellipse = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><ellipse cx="32" cy="${foot - 2}" rx="12" ry="5" fill="rgb(${INK})" fill-opacity="0.35"/></svg>`;
    layers.push({ input: Buffer.from(ellipse), left: 0, top: 0 });
  }
  const { width, height } = fitted.info;
  layers.push({ input: fitted.data, left: Math.round((W - width) / 2), top: foot - height });
  return sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(layers)
    .png();
}

mkdirSync(OUT, { recursive: true });
for (const tile of TILES.filter((t) => t.art)) {
  const { src, kind } = tile.art;
  const srcUrl = new URL(src, RAW);
  if (!existsSync(srcUrl)) {
    console.warn(`${tile.name} : image brute absente (${src}), frame inchangée`);
    continue;
  }
  const frame = kind === 'ground' ? await groundFrame(srcUrl, tile.art.seam ?? 'both') : await standingFrame(srcUrl, tile.art);
  await frame.toFile(fileURLToPath(new URL(`${tile.name}.png`, OUT)));
  console.log(`${tile.name} ← ${src}`);
}
