// Packs the placeholder tiles into one sheet. Usage: npm run tiles  (output committed in public/tiles/placeholder.png)
import { mkdirSync, writeFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
import { COLUMNS, H, TILES, W } from './tiles-def.mjs';

const rows = Math.ceil(TILES.length / COLUMNS);
const frames = TILES.map((t, i) => {
  const x = (i % COLUMNS) * W;
  const y = Math.floor(i / COLUMNS) * H;
  return `<g transform="translate(${x} ${y})">${t.svg}</g>`;
}).join('');
const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="${COLUMNS * W}" height="${rows * H}">${frames}</svg>`;

const outDir = new URL('../public/tiles/', import.meta.url);
mkdirSync(outDir, { recursive: true });
const png = new Resvg(sheet, { fitTo: { mode: 'original' } }).render().asPng();
writeFileSync(new URL('placeholder.png', outDir), png);
console.log(`placeholder.png ${COLUMNS * W}×${rows * H}, ${TILES.length} tuiles`);
