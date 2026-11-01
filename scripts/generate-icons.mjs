// Builds the PWA icons from Cyril's seal (CLAUDE.md §6): ink tile, seal centred, drawing untouched.
// Usage: npm run icons  (outputs are committed in public/icons/)
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';

const INK = '#1B1512';
const seal = readFileSync(new URL('../assets/brand/logo-seal.svg', import.meta.url), 'utf8');
const sealInner = seal.slice(seal.indexOf('>') + 1, seal.lastIndexOf('</svg>'));

/** @param {{ radius: number, sealSize: number }} shape  radius and seal size in a 100-unit tile */
function tileSvg({ radius, sealSize }) {
  const offset = (100 - sealSize) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="${radius}" fill="${INK}"/>
  <svg x="${offset}" y="${offset}" width="${sealSize}" height="${sealSize}" viewBox="0 0 100 100">${sealInner}</svg>
</svg>`;
}

const variants = [
  // Rounded ink tile, rx 22/100, as specified in CLAUDE.md.
  { file: 'icon-192.png', size: 192, radius: 22, sealSize: 78 },
  { file: 'icon-512.png', size: 512, radius: 22, sealSize: 78 },
  // Square tiles: the OS applies its own rounded mask, so transparent corners would show as black on iOS.
  { file: 'apple-touch-icon.png', size: 180, radius: 0, sealSize: 78 },
  // Maskable: seal kept inside the 80 % safe zone.
  { file: 'icon-maskable-512.png', size: 512, radius: 0, sealSize: 64 },
];

const outDir = new URL('../public/icons/', import.meta.url);
mkdirSync(outDir, { recursive: true });

for (const v of variants) {
  const png = new Resvg(tileSvg(v), { fitTo: { mode: 'width', value: v.size } }).render().asPng();
  writeFileSync(new URL(v.file, outDir), png);
  console.log(`${v.file} ${v.size}×${v.size}`);
}
