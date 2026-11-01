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
