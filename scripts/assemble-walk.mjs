// Assembles a walk cycle into a sprite sheet for the game: 8 rows (directions s, se, e, ne, n, nw, w, sw) of
// 64 × 96 frames, the character 54 px tall with feet at y = 84, as the other characters (scripts/tiles-def.mjs).
// Usage: npm run walk -- <2d|3d> <source folder under assets/raw/> <output name>
//   2d: s.png, se.png, e.png, ne.png, n.png, each a row of frames drawn by the image model; nw, w, sw are mirrors.
//   3d: <direction>-<i>.png rendered by scripts/render-sprites.mjs (fixed camera: one scale, one ground line).
// Output: public/sprites/<name>.png. Method and comparison: docs/gdd/animation.md.
import { mkdirSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const W = 64;
const H = 96;
const HEIGHT = 54;
const FOOT = 84;
const DIRECTIONS = ['s', 'se', 'e', 'ne', 'n', 'nw', 'w', 'sw'];
const MIRRORS = { nw: 'ne', w: 'e', sw: 'se' };
const INK = [27, 21, 18];

const [mode, srcDir, name] = process.argv.slice(2);
if (!['2d', '3d'].includes(mode) || !srcDir || !name) {
  console.error('Usage : node scripts/assemble-walk.mjs <2d|3d> <dossier sous assets/raw/> <nom de sortie>');
  process.exit(1);
}
const SRC = new URL(`../assets/raw/${srcDir.replace(/\/?$/, '/')}`, import.meta.url);
const path = (file) => fileURLToPath(new URL(file, SRC));

async function rgba(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

const visible = (img, x, y) => img.data[(y * img.width + x) * 4 + 3] > 24;

/** Bounding box of the visible pixels inside [x0, x1). */
function bbox(img, x0 = 0, x1 = img.width) {
  let top = img.height, bottom = -1, left = x1, right = -1;
  for (let y = 0; y < img.height; y++) {
    for (let x = x0; x < x1; x++) {
      if (!visible(img, x, y)) continue;
      top = Math.min(top, y);
      bottom = y;
      left = Math.min(left, x);
      right = Math.max(right, x);
    }
  }
  return { left, top, right, bottom };
}

/**
 * Frames of a generated sheet (FRAMES_2D evenly spaced figures, which may touch): the visible span is cut near
 * each expected boundary, at the column with the fewest visible pixels.
 */
const FRAMES_2D = 6;
function splitRow(img) {
  const counts = [];
  for (let x = 0; x < img.width; x++) {
    let n = 0;
    for (let y = 0; y < img.height; y++) if (visible(img, x, y)) n++;
    counts.push(n);
  }
  const first = counts.findIndex((n) => n > 0);
  const last = counts.findLastIndex((n) => n > 0);
  const cell = (last - first + 1) / FRAMES_2D;
  const cuts = [first];
  for (let i = 1; i < FRAMES_2D; i++) {
    const expected = Math.round(first + i * cell);
    let best = expected;
    for (let x = Math.round(expected - cell / 3); x <= expected + cell / 3; x++) if (counts[x] < counts[best]) best = x;
    cuts.push(best);
  }
  cuts.push(last + 1);
  return cuts.slice(0, -1).map((a, i) => bbox(img, a, cuts[i + 1]));
}

/** Horizontal centre of the upper half of a frame (head and torso), steadier than the swinging legs. */
function bodyCentre(img, box) {
  let sum = 0, count = 0;
  const half = box.top + Math.floor((box.bottom - box.top) / 2);
  for (let y = box.top; y <= half; y++) {
    for (let x = box.left; x <= box.right; x++) {
      if (visible(img, x, y)) {
        sum += x;
        count++;
      }
    }
  }
  return count ? sum / count : (box.left + box.right) / 2;
}

/** One 64 × 96 frame: the source region scaled by `scale`, its anchor point placed on (32, FOOT). */
async function frame(img, region, scale, anchor) {
  const crop = await sharp(img.data, { raw: { width: img.width, height: img.height, channels: 4 } })
    .extract({ left: region.left, top: region.top, width: region.right - region.left + 1, height: region.bottom - region.top + 1 })
    .png()
    .toBuffer();
  const width = Math.max(1, Math.round((region.right - region.left + 1) * scale));
  const height = Math.max(1, Math.round((region.bottom - region.top + 1) * scale));
  const scaled = await sharp(crop).resize(width, height, { kernel: 'lanczos3' }).png().toBuffer();
  let left = Math.round(W / 2 - (anchor.x - region.left) * scale);
  let top = Math.round(FOOT - (anchor.y - region.top) * scale);
  // Keep inside the frame (sharp refuses overlays that stick out).
  const piece = await sharp(scaled)
    .extract({
      left: Math.max(0, -left),
      top: Math.max(0, -top),
      width: Math.min(width, W - Math.max(0, left)) - Math.max(0, -left),
      height: Math.min(height, H - Math.max(0, top)) - Math.max(0, -top),
    })
    .png()
    .toBuffer();
  left = Math.max(0, left);
  top = Math.max(0, top);
  const shadow = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><ellipse cx="32" cy="${FOOT - 2}" rx="10" ry="4" fill="rgb(${INK})" fill-opacity="0.35"/></svg>`,
  );
  return sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: shadow }, { input: piece, left, top }])
    .png()
    .toBuffer();
}

/** Frames per direction (PNG buffers), before mirroring. */
async function framesFrom2d() {
  const rows = {};
  for (const dir of ['s', 'se', 'e', 'ne', 'n']) {
    const img = await rgba(path(`${dir}.png`));
    const boxes = splitRow(img);
    const tallest = Math.max(...boxes.map((b) => b.bottom - b.top + 1));
    const scale = HEIGHT / tallest;
    rows[dir] = await Promise.all(boxes.map((b) => frame(img, b, scale, { x: bodyCentre(img, b), y: b.bottom })));
    console.log(`${dir} : ${boxes.length} images`);
  }
  return rows;
}

async function framesFrom3d() {
  // Geometry of tools/sprite-render/render.js: 256 × 384 render, 1.5 units tall, ground at 0.8 units from the top,
  // a 1-unit-tall model seen 30° from above is cos(30°) units high on screen.
  // The rig may move the body below its rest height: the lowest foot of all frames sets the ground line, the
  // tallest frame the scale (the camera never moves, so one scale and one ground line keep every frame aligned).
  const files = readdirSync(SRC);
  const images = {};
  let lowest = 0;
  let highest = Infinity;
  for (const dir of DIRECTIONS) {
    const count = files.filter((f) => f.startsWith(`${dir}-`)).length;
    images[dir] = [];
    for (let i = 0; i < count; i++) {
      const img = await rgba(path(`${dir}-${i}.png`));
      const box = bbox(img);
      lowest = Math.max(lowest, box.bottom);
      highest = Math.min(highest, box.top);
      images[dir].push(img);
    }
  }
  const scale = HEIGHT / (lowest - highest + 1);
  const rows = {};
  for (const dir of DIRECTIONS) {
    rows[dir] = await Promise.all(
      images[dir].map((img) => frame(img, { left: 0, top: 0, right: img.width - 1, bottom: img.height - 1 }, scale, { x: img.width / 2, y: lowest })),
    );
    console.log(`${dir} : ${rows[dir].length} images`);
  }
  return rows;
}

const rows = mode === '2d' ? await framesFrom2d() : await framesFrom3d();
for (const [dir, source] of Object.entries(MIRRORS)) {
  rows[dir] ??= await Promise.all(rows[source].map((f) => sharp(f).flop().png().toBuffer()));
}
const columns = Math.max(...DIRECTIONS.map((d) => rows[d].length));
const layers = DIRECTIONS.flatMap((dir, r) => rows[dir].map((input, c) => ({ input, left: c * W, top: r * H })));
const outDir = new URL('../public/sprites/', import.meta.url);
mkdirSync(outDir, { recursive: true });
await sharp({ create: { width: columns * W, height: DIRECTIONS.length * H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite(layers)
  .png({ compressionLevel: 9 })
  .toFile(fileURLToPath(new URL(`${name}.png`, outDir)));
console.log(`public/sprites/${name}.png : ${DIRECTIONS.length} directions × ${columns} images`);
