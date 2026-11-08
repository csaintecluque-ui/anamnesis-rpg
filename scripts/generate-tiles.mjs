// Packs the tiles into one sheet. Usage: npm run tiles  (output committed in public/tiles/tiles.png)
// A tile with a processed frame in assets/tiles/ (npm run art) uses it; the others keep their placeholder drawing.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { COLUMNS, H, TILES, W } from './tiles-def.mjs';

const ART = new URL('../assets/tiles/', import.meta.url);
const artFile = (t) => fileURLToPath(new URL(`${t.name}.png`, ART));
const hasArt = (t) => t.art && existsSync(artFile(t));

const rows = Math.ceil(TILES.length / COLUMNS);
const position = (i) => ({ left: (i % COLUMNS) * W, top: Math.floor(i / COLUMNS) * H });
const frames = TILES.map((t, i) => {
  if (hasArt(t)) return '';
  const { left, top } = position(i);
  return `<g transform="translate(${left} ${top})">${t.svg}</g>`;
}).join('');
const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="${COLUMNS * W}" height="${rows * H}">${frames}</svg>`;
const placeholders = new Resvg(sheet, { fitTo: { mode: 'original' } }).render().asPng();

const art = TILES.map((t, i) => (hasArt(t) ? { input: artFile(t), ...position(i) } : null)).filter(Boolean);
const png = await sharp(placeholders).composite(art).png({ compressionLevel: 9 }).toBuffer();

const outDir = new URL('../public/tiles/', import.meta.url);
mkdirSync(outDir, { recursive: true });
writeFileSync(new URL('tiles.png', outDir), png);
console.log(`tiles.png ${COLUMNS * W}×${rows * H}, ${TILES.length} tuiles dont ${art.length} peintes`);

// The mean colour of each frame, for the place's small map (src/ui/miniMap.ts): a ground tile by its diamond (the
// bottom 32 px), anything standing by its visible pixels. Written as hex, frame by frame, in src/data/tile-colors.json.
const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const hex = (n) => Math.round(n).toString(16).padStart(2, '0');
const colors = TILES.map((t, i) => {
  const { left, top } = position(i);
  const ground = t.art?.kind === 'ground' || (!t.art && !t.blocking && !t.sprite);
  let r = 0, g = 0, b = 0, n = 0;
  for (let y = ground ? 64 : 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const k = ((top + y) * info.width + left + x) * 4;
      const a = data[k + 3];
      if (a < 200) continue;
      r += data[k]; g += data[k + 1]; b += data[k + 2]; n++;
    }
  }
  return n ? `#${hex(r / n)}${hex(g / n)}${hex(b / n)}` : null;
});
writeFileSync(new URL('../src/data/tile-colors.json', import.meta.url), `${JSON.stringify(colors)}\n`);
