// Placeholder isometric tile definitions (phase 1 visuals), shared by generate-tiles.mjs and build-maps.mjs.
// Each frame is 64×96: the ground diamond sits in the bottom 32 px, tall objects rise above it.
// Order = frame index = Tiled tile id (gid − 1).
export const W = 64;
export const H = 96;
export const COLUMNS = 8;
const INK = '#1B1512';
const COPPER = '#C9804F';
const PARCHMENT = '#EAD9B8';

const diamond = (fill, stroke = 'rgba(0,0,0,0.18)') =>
  `<path d="M32 64 L64 80 L32 96 L0 80 Z" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
const shadow = (rx = 18, ry = 7) => `<ellipse cx="32" cy="82" rx="${rx}" ry="${ry}" fill="rgba(0,0,0,0.35)"/>`;

export const TILES = [
  { name: 'herbe', svg: diamond('#3e4a2c') + '<path d="M18 80 l3 -4 M40 84 l2 -4 M30 76 l2 -3" stroke="#56653d" stroke-width="1.5"/>' },
  { name: 'herbe-sombre', svg: diamond('#334023') + '<path d="M24 82 l2 -4 M42 78 l2 -4" stroke="#465733" stroke-width="1.5"/>' },
  { name: 'chemin', svg: diamond('#6b5338') + '<circle cx="26" cy="80" r="1.5" fill="#85694a"/><circle cx="40" cy="84" r="1.2" fill="#85694a"/>' },
  {
    name: 'planches',
    svg: diamond('#5a4030') + '<path d="M16 72 L48 88 M8 76 L40 92 M24 68 L56 84" stroke="#3b2a20" stroke-width="1.5"/>',
  },
  {
    name: 'eau',
    blocking: true,
    svg: diamond('#2c4a55') + '<path d="M18 80 q6 -3 12 0 M34 86 q6 -3 12 0 M28 72 q5 -2 10 0" stroke="#5b8a96" stroke-width="1.5" fill="none"/>',
  },
  {
    name: 'pont',
    svg:
      diamond('#2c4a55') +
      `<path d="M14 73 L50 91 L58 87 L22 69 Z" fill="#6b4a32" stroke="${INK}" stroke-width="1"/>` +
      '<path d="M22 77 L30 73 M32 82 L40 78 M42 87 L50 83" stroke="#3b2a20" stroke-width="1.2"/>',
  },
  {
    name: 'fleurs',
    svg:
      diamond('#3e4a2c') +
      `<circle cx="22" cy="80" r="2" fill="${PARCHMENT}"/><circle cx="36" cy="76" r="2" fill="${COPPER}"/>` +
      `<circle cx="42" cy="86" r="2" fill="${PARCHMENT}"/><circle cx="30" cy="88" r="1.6" fill="#d9a3c4"/>`,
  },
  {
    name: 'arbre',
    blocking: true,
    svg:
      diamond('#334023') +
      shadow(20, 8) +
      `<rect x="28" y="56" width="8" height="26" fill="#4a3524"/>` +
      '<circle cx="32" cy="40" r="20" fill="#2f3f22"/><circle cx="24" cy="46" r="13" fill="#3f5530"/>' +
      '<circle cx="40" cy="34" r="12" fill="#3f5530"/><circle cx="34" cy="26" r="9" fill="#4d6b3a"/>',
  },
  {
    name: 'tronc-titan',
    blocking: true,
    svg:
      diamond('#334023') +
      `<path d="M10 84 Q14 70 18 66 L18 0 L46 0 L46 66 Q50 70 54 84 Q44 78 40 86 Q32 76 24 86 Q20 78 10 84 Z" fill="#4a3524" stroke="${INK}" stroke-width="1"/>` +
      '<path d="M26 10 L26 60 M36 4 L36 64" stroke="#3a2a1c" stroke-width="2"/>' +
      `<circle cx="31" cy="38" r="2.5" fill="${COPPER}" opacity="0.7"/>`,
  },
  {
    name: 'maison-pilotis',
    blocking: true,
    svg:
      diamond('#3e4a2c') +
      shadow(22, 8) +
      `<path d="M18 62 L18 84 M46 62 L46 84 M32 66 L32 90" stroke="#4a3524" stroke-width="3"/>` +
      `<ellipse cx="32" cy="52" rx="24" ry="14" fill="#7a5a3c" stroke="${INK}" stroke-width="1"/>` +
      `<path d="M6 46 Q32 6 58 46 Q32 38 6 46 Z" fill="#4d6b3a" stroke="${INK}" stroke-width="1"/>` +
      `<rect x="28" y="50" width="8" height="12" rx="3" fill="${COPPER}"/>`,
  },
  {
    name: 'etal',
    blocking: true,
    svg:
      diamond('#5a4030') +
      `<path d="M14 82 L14 56 M50 82 L50 56" stroke="#4a3524" stroke-width="3"/>` +
      `<path d="M10 72 L54 72 L50 80 L14 80 Z" fill="#7a5a3c" stroke="${INK}" stroke-width="1"/>` +
      `<path d="M8 54 L56 54 L52 46 L12 46 Z" fill="${COPPER}" stroke="${INK}" stroke-width="1"/>` +
      `<path d="M20 46 L18 54 M32 46 L32 54 M44 46 L46 54" stroke="${PARCHMENT}" stroke-width="2"/>` +
      `<circle cx="24" cy="70" r="3" fill="#b5653a"/><circle cx="36" cy="70" r="3" fill="#8fa35a"/>`,
  },
  {
    name: 'caisses',
    blocking: true,
    svg:
      diamond('#5a4030') +
      shadow(18, 6) +
      `<rect x="14" y="62" width="20" height="18" fill="#7a5a3c" stroke="${INK}"/>` +
      `<rect x="30" y="56" width="20" height="24" fill="#6b4a32" stroke="${INK}"/>` +
      `<path d="M14 62 L34 80 M30 56 L50 80" stroke="${INK}" stroke-width="1" opacity="0.6"/>`,
  },
  {
    name: 'lanterne',
    blocking: true,
    svg:
      diamond('#3e4a2c') +
      `<rect x="30" y="34" width="4" height="48" fill="#4a3524"/>` +
      `<circle cx="32" cy="30" r="12" fill="${PARCHMENT}" opacity="0.18"/>` +
      `<path d="M32 18 L38 30 L32 42 L26 30 Z" fill="${PARCHMENT}" stroke="${COPPER}" stroke-width="1.5"/>`,
  },
  {
    name: 'rocher',
    blocking: true,
    svg:
      diamond('#3e4a2c') +
      `<path d="M14 82 Q12 66 24 62 Q32 52 42 60 Q54 64 50 82 Z" fill="#6a6058" stroke="${INK}" stroke-width="1"/>` +
      '<path d="M26 66 Q32 62 38 66" stroke="#8a7f74" stroke-width="2" fill="none"/>',
  },
  {
    name: 'panneau',
    blocking: true,
    svg:
      diamond('#6b5338') +
      `<rect x="30" y="44" width="4" height="38" fill="#4a3524"/>` +
      `<path d="M14 40 L46 40 L54 48 L46 56 L14 56 Z" fill="${COPPER}" stroke="${INK}" stroke-width="1"/>` +
      `<path d="M20 48 L42 48" stroke="${INK}" stroke-width="2"/>`,
  },
  {
    name: 'heros',
    sprite: true,
    svg:
      shadow(12, 5) +
      `<path d="M22 82 Q20 60 32 56 Q44 60 42 82 Z" fill="${PARCHMENT}" stroke="${COPPER}" stroke-width="2"/>` +
      `<circle cx="32" cy="48" r="9" fill="${PARCHMENT}" stroke="${COPPER}" stroke-width="2"/>`,
  },
  {
    name: 'pnj',
    sprite: true,
    svg:
      shadow(12, 5) +
      `<path d="M22 82 Q20 60 32 56 Q44 60 42 82 Z" fill="${COPPER}" stroke="${PARCHMENT}" stroke-width="2"/>` +
      `<circle cx="32" cy="48" r="9" fill="#d9b28e" stroke="${PARCHMENT}" stroke-width="2"/>`,
  },
];
