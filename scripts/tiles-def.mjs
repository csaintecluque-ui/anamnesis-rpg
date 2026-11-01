// Isometric tile definitions, shared by generate-tiles.mjs and build-maps.mjs. Placeholder drawings (phase 1)
// are replaced one by one by generated art (phase 2).
// Each frame is 64×96: the ground diamond sits in the bottom 32 px, tall objects rise above it.
// Order = frame index = Tiled tile id (gid − 1).
// `art`: generated image that replaces the placeholder drawing (scripts/process-art.mjs, docs/ASSETS.md).
// `big`: large decor covering a block of cells, drawn from public/decor/<name>.png (width × height).
// `cover`: Défense bonus for a combatant sheltering behind this obstacle (docs/gdd/combat.md).
export const W = 64;
export const H = 96;
export const COLUMNS = 8;
const INK = '#1B1512';
const COPPER = '#C9804F';
const PARCHMENT = '#EAD9B8';

const diamond = (fill, stroke = 'rgba(0,0,0,0.18)') =>
  `<path d="M32 64 L64 80 L32 96 L0 80 Z" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
const figure = (body, skin) =>
  shadow(12, 5) +
  `<path d="M22 82 Q20 60 32 56 Q44 60 42 82 Z" fill="${body}" stroke="${PARCHMENT}" stroke-width="2"/>` +
  `<circle cx="32" cy="48" r="9" fill="${skin}" stroke="${PARCHMENT}" stroke-width="2"/>`;
const shadow = (rx = 18, ry = 7) => `<ellipse cx="32" cy="82" rx="${rx}" ry="${ry}" fill="rgba(0,0,0,0.35)"/>`;

export const TILES = [
  {
    name: 'herbe',
    art: { src: 'pilote/herbe-texture-v2.png', kind: 'ground' },
    svg: diamond('#3e4a2c') + '<path d="M18 80 l3 -4 M40 84 l2 -4 M30 76 l2 -3" stroke="#56653d" stroke-width="1.5"/>',
  },
  {
    name: 'herbe-sombre',
    art: { src: 'lot1/herbe-sombre.png', kind: 'ground' },
    svg: diamond('#334023') + '<path d="M24 82 l2 -4 M42 78 l2 -4" stroke="#465733" stroke-width="1.5"/>',
  },
  {
    name: 'chemin',
    art: { src: 'lot1/chemin.png', kind: 'ground' },
    svg: diamond('#6b5338') + '<circle cx="26" cy="80" r="1.5" fill="#85694a"/><circle cx="40" cy="84" r="1.2" fill="#85694a"/>',
  },
  {
    name: 'planches',
    art: { src: 'jalon2/planches-marche.png', kind: 'ground' },
    svg: diamond('#5a4030') + '<path d="M16 72 L48 88 M8 76 L40 92 M24 68 L56 84" stroke="#3b2a20" stroke-width="1.5"/>',
  },
  {
    name: 'eau',
    art: { src: 'lot1/eau.png', kind: 'ground' },
    blocking: true,
    svg: diamond('#2c4a55') + '<path d="M18 80 q6 -3 12 0 M34 86 q6 -3 12 0 M28 72 q5 -2 10 0" stroke="#5b8a96" stroke-width="1.5" fill="none"/>',
  },
  {
    name: 'pont',
    art: { src: 'lot1/pont.png', kind: 'ground', seam: 'vertical' },
    svg:
      diamond('#2c4a55') +
      `<path d="M14 73 L50 91 L58 87 L22 69 Z" fill="#6b4a32" stroke="${INK}" stroke-width="1"/>` +
      '<path d="M22 77 L30 73 M32 82 L40 78 M42 87 L50 83" stroke="#3b2a20" stroke-width="1.2"/>',
  },
  {
    name: 'fleurs',
    art: { src: 'lot1/fleurs.png', kind: 'ground' },
    svg:
      diamond('#3e4a2c') +
      `<circle cx="22" cy="80" r="2" fill="${PARCHMENT}"/><circle cx="36" cy="76" r="2" fill="${COPPER}"/>` +
      `<circle cx="42" cy="86" r="2" fill="${PARCHMENT}"/><circle cx="30" cy="88" r="1.6" fill="#d9a3c4"/>`,
  },
  {
    name: 'arbre',
    art: { src: 'pilote/arbre-v2.png', kind: 'standing', maxHeight: 86, foot: 86, fixShadow: true },
    blocking: true,
    cover: 4,
    svg:
      diamond('#334023') +
      shadow(20, 8) +
      `<rect x="28" y="56" width="8" height="26" fill="#4a3524"/>` +
      '<circle cx="32" cy="40" r="20" fill="#2f3f22"/><circle cx="24" cy="46" r="13" fill="#3f5530"/>' +
      '<circle cx="40" cy="34" r="12" fill="#3f5530"/><circle cx="34" cy="26" r="9" fill="#4d6b3a"/>',
  },
  {
    name: 'tronc-titan',
    art: { src: 'jalon2/tronc-titan.png', kind: 'standing', maxHeight: 92, foot: 92, shadow: { rx: 26, ry: 9 } },
    // Drawn once over its 2 × 2 block of cells (src/engine/tiledMap.ts, isBigAnchor).
    big: { width: 128, height: 192, art: { maxHeight: 190, foot: 188, shadow: { rx: 56, ry: 20 } } },
    blocking: true,
    cover: 4,
    svg:
      diamond('#334023') +
      `<path d="M10 84 Q14 70 18 66 L18 0 L46 0 L46 66 Q50 70 54 84 Q44 78 40 86 Q32 76 24 86 Q20 78 10 84 Z" fill="#4a3524" stroke="${INK}" stroke-width="1"/>` +
      '<path d="M26 10 L26 60 M36 4 L36 64" stroke="#3a2a1c" stroke-width="2"/>' +
      `<circle cx="31" cy="38" r="2.5" fill="${COPPER}" opacity="0.7"/>`,
  },
  {
    name: 'maison-pilotis',
    art: { src: 'lot2/maison-pilotis.png', kind: 'standing', maxHeight: 92, foot: 88, shadow: { rx: 22, ry: 8 }, matte: true },
    blocking: true,
    cover: 4,
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
    art: { src: 'lot2/etal.png', kind: 'standing', maxWidth: 62, maxHeight: 70, foot: 92, shadow: { rx: 26, ry: 9 } },
    blocking: true,
    cover: 2,
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
    art: { src: 'lot2/caisses.png', kind: 'standing', maxWidth: 50, maxHeight: 56, foot: 90, shadow: { rx: 22, ry: 8 } },
    blocking: true,
    cover: 2,
    svg:
      diamond('#5a4030') +
      shadow(18, 6) +
      `<rect x="14" y="62" width="20" height="18" fill="#7a5a3c" stroke="${INK}"/>` +
      `<rect x="30" y="56" width="20" height="24" fill="#6b4a32" stroke="${INK}"/>` +
      `<path d="M14 62 L34 80 M30 56 L50 80" stroke="${INK}" stroke-width="1" opacity="0.6"/>`,
  },
  {
    name: 'lanterne',
    art: { src: 'lot2/lanterne.png', kind: 'standing', maxWidth: 30, maxHeight: 88, foot: 84, shadow: { rx: 8, ry: 3 } },
    blocking: true,
    svg:
      diamond('#3e4a2c') +
      `<rect x="30" y="34" width="4" height="48" fill="#4a3524"/>` +
      `<circle cx="32" cy="30" r="12" fill="${PARCHMENT}" opacity="0.18"/>` +
      `<path d="M32 18 L38 30 L32 42 L26 30 Z" fill="${PARCHMENT}" stroke="${COPPER}" stroke-width="1.5"/>`,
  },
  {
    name: 'rocher',
    art: { src: 'lot2/rocher.png', kind: 'standing', maxWidth: 52, maxHeight: 48, foot: 88, shadow: { rx: 22, ry: 8 } },
    blocking: true,
    cover: 2,
    svg:
      diamond('#3e4a2c') +
      `<path d="M14 82 Q12 66 24 62 Q32 52 42 60 Q54 64 50 82 Z" fill="#6a6058" stroke="${INK}" stroke-width="1"/>` +
      '<path d="M26 66 Q32 62 38 66" stroke="#8a7f74" stroke-width="2" fill="none"/>',
  },
  {
    name: 'panneau',
    art: { src: 'lot2/panneau.png', kind: 'standing', maxWidth: 46, maxHeight: 70, foot: 84, shadow: { rx: 10, ry: 4 } },
    blocking: true,
    svg:
      diamond('#6b5338') +
      `<rect x="30" y="44" width="4" height="38" fill="#4a3524"/>` +
      `<path d="M14 40 L46 40 L54 48 L46 56 L14 56 Z" fill="${COPPER}" stroke="${INK}" stroke-width="1"/>` +
      `<path d="M20 48 L42 48" stroke="${INK}" stroke-width="2"/>`,
  },
  {
    name: 'heros',
    art: { src: 'pilote/heros.png', kind: 'standing', maxWidth: 44, maxHeight: 54, foot: 84, shadow: { rx: 10, ry: 4 } },
    sprite: true,
    svg:
      shadow(12, 5) +
      `<path d="M22 82 Q20 60 32 56 Q44 60 42 82 Z" fill="${PARCHMENT}" stroke="${COPPER}" stroke-width="2"/>` +
      `<circle cx="32" cy="48" r="9" fill="${PARCHMENT}" stroke="${COPPER}" stroke-width="2"/>`,
  },
  {
    name: 'pnj',
    sprite: true,
    svg: figure(COPPER, '#d9b28e'),
  },
  // --- La Gare Engloutie (docs/univers/lieux/gare-engloutie.md, à valider) --
  {
    name: 'rail',
    art: { src: 'lot1/rail.png', kind: 'ground', seam: 'vertical' },
    svg:
      diamond('#4a4038') +
      `<path d="M12 74 L52 74 M10 80 L50 80" stroke="${COPPER}" stroke-width="1.5" opacity="0.85"/>` +
      '<path d="M16 70 L20 78 M26 72 L30 80 M36 74 L40 82 M46 76 L50 84" stroke="#6b4a32" stroke-width="2"/>',
  },
  {
    name: 'quai',
    art: { src: 'lot1/quai.png', kind: 'ground' },
    svg: diamond('#8a8276') + '<path d="M16 78 L30 70 M34 86 L46 76 M20 86 L26 82" stroke="#5f5a50" stroke-width="1.3" fill="none"/>',
  },
  {
    name: 'wagon',
    art: { src: 'lot2/wagon.png', kind: 'standing', maxHeight: 60, foot: 92, shadow: { rx: 28, ry: 10 }, matte: true },
    blocking: true,
    cover: 4,
    svg:
      diamond('#4a4038') +
      shadow(22, 8) +
      `<rect x="10" y="40" width="44" height="30" rx="2" fill="#6b4a32" stroke="${INK}" stroke-width="1"/>` +
      '<rect x="16" y="46" width="10" height="10" fill="#2c4a55" opacity="0.7"/>' +
      '<rect x="38" y="46" width="10" height="10" fill="#2c4a55" opacity="0.5"/>' +
      '<circle cx="20" cy="70" r="5" fill="#1B1512"/><circle cx="44" cy="70" r="5" fill="#1B1512"/>' +
      '<path d="M10 40 L54 40" stroke="#8a5a3a" stroke-width="2"/>',
  },
  {
    name: 'foreuse',
    art: { src: 'lot2/foreuse.png', kind: 'standing', maxWidth: 56, maxHeight: 92, foot: 90, shadow: { rx: 20, ry: 7 } },
    blocking: true,
    cover: 4,
    svg:
      diamond('#4a4038') +
      shadow(18, 7) +
      '<rect x="28" y="20" width="8" height="52" fill="#6a6058" stroke="#1B1512" stroke-width="1"/>' +
      '<path d="M20 30 L28 40 M44 30 L36 40" stroke="#6a6058" stroke-width="3"/>' +
      `<path d="M26 72 L32 84 L38 72 Z" fill="${COPPER}" stroke="${INK}" stroke-width="1"/>`,
  },
  {
    name: 'faille',
    art: { src: 'lot2/faille.png', kind: 'ground', seam: 'none' },
    blocking: true,
    svg:
      diamond('#2a2018') +
      `<path d="M18 76 L28 68 L24 82 L36 72 L32 86 L46 74" stroke="${COPPER}" stroke-width="2" fill="none"/>` +
      `<circle cx="26" cy="78" r="1.5" fill="${COPPER}" opacity="0.8"/><circle cx="38" cy="80" r="1.5" fill="${COPPER}" opacity="0.6"/>`,
  },
  {
    name: 'tente',
    art: { src: 'lot2/tente.png', kind: 'standing', maxWidth: 62, maxHeight: 64, foot: 92, shadow: { rx: 26, ry: 9 } },
    blocking: true,
    cover: 2,
    svg:
      diamond('#5a4030') +
      shadow(16, 6) +
      '<path d="M14 82 L32 48 L50 82 Z" fill="#7a5a3c" stroke="#1B1512" stroke-width="1"/>' +
      '<path d="M32 48 L32 82" stroke="#1B1512" stroke-width="1" opacity="0.6"/>' +
      '<path d="M22 82 L28 70 L36 70 L42 82 Z" fill="#1B1512" opacity="0.5"/>',
  },
  {
    name: 'golem',
    art: { src: 'lot3/golem.png', kind: 'standing', maxWidth: 56, maxHeight: 66, foot: 86, shadow: { rx: 18, ry: 6 } },
    blocking: true,
    svg:
      diamond('#334023') +
      shadow(18, 7) +
      '<rect x="20" y="36" width="24" height="30" rx="3" fill="#6a6058" stroke="#1B1512" stroke-width="1.5"/>' +
      '<rect x="24" y="20" width="16" height="18" rx="3" fill="#7a736a" stroke="#1B1512" stroke-width="1.5"/>' +
      '<circle cx="29" cy="28" r="1.8" fill="#3a3530"/><circle cx="35" cy="28" r="1.8" fill="#3a3530"/>' +
      '<path d="M18 50 L20 66 M46 50 L44 66" stroke="#6a6058" stroke-width="5" stroke-linecap="round"/>',
  },
  {
    name: 'echo',
    art: { src: 'lot2/echo.png', kind: 'standing', maxWidth: 48, maxHeight: 58, foot: 86, opacity: 0.7 },
    svg:
      diamond('#2c3a42') +
      `<ellipse cx="32" cy="80" rx="20" ry="8" fill="${PARCHMENT}" opacity="0.12"/>` +
      `<path d="M22 82 Q20 62 30 56 Q40 62 38 82 Z" fill="${PARCHMENT}" opacity="0.35"/>` +
      `<circle cx="30" cy="52" r="7" fill="${PARCHMENT}" opacity="0.35"/>` +
      `<path d="M42 84 Q40 68 46 62 Q52 68 50 84 Z" fill="${PARCHMENT}" opacity="0.2"/>`,
  },
  // --- Personnages nommés (phase 2, lot 3), ajoutés en fin de planche pour garder les numéros des autres tuiles.
  // Un PNJ de carte prend la tuile de son nom, un ennemi la tuile de son champ `tile` (src/data/enemies.json).
  {
    name: 'ilyane',
    sprite: true,
    art: { src: 'lot3/ilyane.png', kind: 'standing', maxWidth: 44, maxHeight: 54, foot: 84, shadow: { rx: 10, ry: 4 } },
    svg: figure('#4d6b3a', '#d9b28e'),
  },
  {
    name: 'tobias',
    sprite: true,
    art: { src: 'lot3/tobias.png', kind: 'standing', maxWidth: 44, maxHeight: 54, foot: 84, shadow: { rx: 10, ry: 4 } },
    svg: figure(COPPER, '#d9b28e'),
  },
  {
    name: 'ingrid',
    sprite: true,
    art: { src: 'lot3/ingrid.png', kind: 'standing', maxWidth: 44, maxHeight: 54, foot: 84, shadow: { rx: 10, ry: 4 } },
    svg: figure('#6a6058', '#d9b28e'),
  },
  {
    name: 'rodeur-epine',
    sprite: true,
    art: { src: 'lot3/rodeur-epine.png', kind: 'standing', maxWidth: 44, maxHeight: 36, foot: 86, shadow: { rx: 15, ry: 5 } },
    svg: shadow(16, 5) + '<path d="M14 82 L18 66 Q32 56 48 64 L52 82 Z" fill="#5a6b3a" stroke="#1B1512" stroke-width="1.5"/>',
  },
  // --- Jalon 2 : variantes d'herbe et petits décors contre la répétition (docs/gdd/jalon-2.md).
  {
    name: 'herbe-2',
    art: { src: 'jalon2/herbe-2.png', kind: 'ground' },
    svg: diamond('#41502e'),
  },
  {
    name: 'herbe-3',
    art: { src: 'jalon2/herbe-3.png', kind: 'ground' },
    svg: diamond('#45512f'),
  },
  {
    name: 'buisson',
    blocking: true,
    cover: 2,
    art: { src: 'jalon2/buisson.png', kind: 'standing', maxWidth: 40, maxHeight: 34, foot: 86, shadow: { rx: 16, ry: 5 } },
    svg: shadow(14, 5) + '<circle cx="32" cy="72" r="13" fill="#3f5530" stroke="#1B1512" stroke-width="1"/>',
  },
  {
    name: 'fougeres',
    art: { src: 'jalon2/fougeres.png', kind: 'standing', maxWidth: 40, maxHeight: 26, foot: 86 },
    svg: '<path d="M22 84 Q26 70 30 84 M30 84 Q34 66 38 84 M36 84 Q40 72 44 84" stroke="#4d6b3a" stroke-width="3" fill="none"/>',
  },
  {
    name: 'souche',
    blocking: true,
    cover: 2,
    art: { src: 'jalon2/souche.png', kind: 'standing', maxWidth: 34, maxHeight: 28, foot: 86, shadow: { rx: 14, ry: 5 } },
    svg: shadow(12, 4) + '<rect x="24" y="66" width="16" height="16" rx="3" fill="#6b4a32" stroke="#1B1512" stroke-width="1"/>',
  },
  {
    name: 'champignons',
    art: { src: 'jalon2/champignons.png', kind: 'standing', maxWidth: 26, maxHeight: 22, foot: 86 },
    svg: `<circle cx="30" cy="80" r="4" fill="${COPPER}"/><circle cx="36" cy="82" r="3" fill="${COPPER}"/>`,
  },
];
