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
    // Water on each cell; the bridge itself is one picture over its block, under the walkers (big, ground layer).
    art: { src: 'lot1/eau.png', kind: 'ground' },
    // Whole, footings included (2026-11-04): placed on the map by src/engine/bigGround.ts.
    big: { width: 176, height: 120, art: { src: 'jalon2/pont-a.png', kind: 'standing', maxWidth: 172, maxHeight: 118, foot: 120 } },
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
  // --- Jalon 2, contenu : intérieurs, nouveaux PNJ, objets de quête (docs/univers/lieux/gardebois.md).
  {
    name: 'parquet',
    art: { src: 'contenu/parquet.png', kind: 'ground' },
    svg: diamond('#9a7048'),
  },
  {
    name: 'seuil',
    art: { src: 'contenu/seuil.png', kind: 'ground', seam: 'none' },
    svg: diamond('#b09a5a'),
  },
  {
    name: 'mur',
    blocking: true,
    art: { src: 'contenu/mur-texture.png', kind: 'wall', height: 60 },
    svg: '<path d="M32 4 L64 20 L64 80 L32 96 L0 80 L0 20 Z" fill="#8a6a4a" stroke="#1B1512" stroke-width="1"/>',
  },
  {
    name: 'lit',
    blocking: true,
    cover: 2,
    art: { src: 'contenu/lit.png', kind: 'standing', maxWidth: 60, maxHeight: 44, foot: 90, shadow: { rx: 24, ry: 8 } },
    svg: shadow(14, 5) + '<rect x="18" y="56" width="28" height="26" rx="3" fill="#6b8a4a" stroke="#1B1512" stroke-width="1"/>',
  },
  {
    name: 'table',
    blocking: true,
    cover: 2,
    art: { src: 'contenu/table.png', kind: 'standing', maxWidth: 56, maxHeight: 44, foot: 88, shadow: { rx: 22, ry: 8 } },
    svg: shadow(14, 5) + '<rect x="18" y="56" width="28" height="26" rx="3" fill="#8a6a4a" stroke="#1B1512" stroke-width="1"/>',
  },
  {
    name: 'etagere',
    blocking: true,
    cover: 2,
    art: { src: 'contenu/etagere.png', kind: 'standing', maxWidth: 40, maxHeight: 80, foot: 86, shadow: { rx: 16, ry: 5 } },
    svg: shadow(14, 5) + '<rect x="18" y="56" width="28" height="26" rx="3" fill="#6b4a32" stroke="#1B1512" stroke-width="1"/>',
  },
  {
    name: 'cheminee',
    blocking: true,
    cover: 2,
    art: { src: 'contenu/cheminee.png', kind: 'standing', maxWidth: 48, maxHeight: 76, foot: 86, shadow: { rx: 18, ry: 6 } },
    svg: shadow(14, 5) + '<rect x="18" y="56" width="28" height="26" rx="3" fill="#7a736a" stroke="#1B1512" stroke-width="1"/>',
  },
  {
    name: 'comptoir',
    blocking: true,
    cover: 2,
    art: { src: 'contenu/comptoir.png', kind: 'standing', maxWidth: 60, maxHeight: 44, foot: 90, shadow: { rx: 24, ry: 8 } },
    svg: shadow(14, 5) + '<rect x="18" y="56" width="28" height="26" rx="3" fill="#6b4a32" stroke="#1B1512" stroke-width="1"/>',
  },
  {
    name: 'tonneaux',
    blocking: true,
    cover: 2,
    art: { src: 'contenu/tonneaux.png', kind: 'standing', maxWidth: 52, maxHeight: 44, foot: 88, shadow: { rx: 20, ry: 7 } },
    svg: shadow(14, 5) + '<rect x="18" y="56" width="28" height="26" rx="3" fill="#8a5a3a" stroke="#1B1512" stroke-width="1"/>',
  },
  {
    name: 'cristal-veille',
    blocking: true,
    cover: 2,
    art: { src: 'contenu/cristal-veille.png', kind: 'standing', maxWidth: 34, maxHeight: 60, foot: 84, shadow: { rx: 12, ry: 4 } },
    svg: shadow(14, 5) + '<rect x="18" y="56" width="28" height="26" rx="3" fill="#5bc8d6" stroke="#1B1512" stroke-width="1"/>',
  },
  {
    name: 'sauge',
    art: { src: 'contenu/sauge.png', kind: 'standing', maxWidth: 34, maxHeight: 28, foot: 86 },
    svg: `<circle cx="32" cy="80" r="6" fill="#9ab8a0"/>`,
  },
  {
    name: 'echo-berceuse',
    art: { src: 'contenu/echo-berceuse.png', kind: 'standing', maxWidth: 48, maxHeight: 50, foot: 86, opacity: 0.75 },
    svg: `<ellipse cx="32" cy="72" rx="12" ry="14" fill="${PARCHMENT}" opacity="0.35"/>`,
  },
  {
    name: 'sylvan',
    sprite: true,
    art: { src: 'contenu/sylvan.png', kind: 'standing', maxWidth: 44, maxHeight: 54, foot: 84, shadow: { rx: 10, ry: 4 } },
    svg: figure('#5a6b3a', '#d9b28e'),
  },
  {
    name: 'maelis',
    sprite: true,
    art: { src: 'contenu/maelis.png', kind: 'standing', maxWidth: 44, maxHeight: 54, foot: 84, shadow: { rx: 10, ry: 4 } },
    svg: figure('#5a6b3a', '#d9b28e'),
  },
  {
    name: 'liane',
    sprite: true,
    art: { src: 'contenu/liane.png', kind: 'standing', maxWidth: 44, maxHeight: 54, foot: 84, shadow: { rx: 10, ry: 4 } },
    svg: figure('#5a6b3a', '#d9b28e'),
  },
  {
    name: 'brann',
    sprite: true,
    art: { src: 'contenu/brann.png', kind: 'standing', maxWidth: 44, maxHeight: 54, foot: 84, shadow: { rx: 10, ry: 4 } },
    svg: figure('#5a6b3a', '#d9b28e'),
  },
  {
    name: 'nell',
    sprite: true,
    art: { src: 'contenu/nell.png', kind: 'standing', maxWidth: 44, maxHeight: 40, foot: 84, shadow: { rx: 10, ry: 4 } },
    svg: figure('#5a6b3a', '#d9b28e'),
  },
];

// --- Canopéa, la cité des cimes (docs/univers/lieux/villes.md) : visuels provisoires, dessinés par code. -----
// Rien ne touche le sol : sous les plates-formes et les passerelles, une mer de feuillage (bloquante).
const leafSea =
  diamond('#1f2e1a', 'rgba(0,0,0,0.25)') +
  '<circle cx="20" cy="78" r="6" fill="#2b4022"/><circle cx="40" cy="84" r="7" fill="#26391f"/>' +
  '<circle cx="34" cy="72" r="5" fill="#33502a"/><circle cx="16" cy="86" r="3" fill="#3d5c31" opacity="0.8"/>' +
  '<circle cx="46" cy="76" r="3" fill="#3d5c31" opacity="0.7"/>';
/**
 * A person, simple but readable: body colour, skin, hair, arms; `small` for a child, `old` for grey hair and a
 * stoop; `extra` adds an accessory drawn on top (basket, hat, staff…), in the same 64 × 96 frame.
 */
const person = ({ body, skin = '#d9b28e', hair = '#4a3524', small = false, accent = PARCHMENT, extra = '' }) => {
  const s = small ? 0.8 : 1;
  const t = (y) => 82 - (82 - y) * s;
  const x = (dx) => 32 + dx * s;
  return (
    shadow(11, 4) +
    `<path d="M${x(-4)} ${t(70)} L${x(-12)} ${t(78)} M${x(4)} ${t(70)} L${x(12)} ${t(78)}" stroke="${body}" stroke-width="${4 * s}" stroke-linecap="round"/>` +
    `<path d="M${x(-10)} 82 Q${x(-12)} ${t(60)} 32 ${t(56)} Q${x(12)} ${t(60)} ${x(10)} 82 Z" fill="${body}" stroke="${INK}" stroke-width="1.5"/>` +
    `<path d="M${x(-12)} ${t(78)} l0 0" stroke="${skin}" stroke-width="${5 * s}" stroke-linecap="round"/>` +
    `<path d="M${x(12)} ${t(78)} l0 0" stroke="${skin}" stroke-width="${5 * s}" stroke-linecap="round"/>` +
    `<path d="M${x(-8)} ${t(66)} L${x(8)} ${t(66)}" stroke="${accent}" stroke-width="2" opacity="0.8"/>` +
    `<circle cx="32" cy="${t(48)}" r="${8 * s}" fill="${skin}" stroke="${INK}" stroke-width="1.5"/>` +
    `<path d="M${x(-8)} ${t(47)} Q32 ${t(36)} ${x(8)} ${t(47)} Q32 ${t(42)} ${x(-8)} ${t(47)} Z" fill="${hair}"/>` +
    extra
  );
};
const npcTile = (name, look) => ({ name, sprite: true, svg: person(look) });
/** Painted art for a provisional person (scripts/process-art.mjs), used once its raw image is there. */
const withArt = (src, maxHeight, tile) => ({
  ...tile,
  art: { src, kind: 'standing', maxWidth: 44, maxHeight, foot: 84, shadow: { rx: 10, ry: 4 } },
});
const pod = (shell, leaf, door = COPPER) =>
  diamond('#a88456') +
  shadow(22, 8) +
  `<path d="M14 84 Q8 44 32 22 Q56 44 50 84 Z" fill="${shell}" stroke="${INK}" stroke-width="1.2"/>` +
  `<path d="M20 50 Q32 40 44 50 M18 66 Q32 58 46 66" stroke="${INK}" stroke-width="1" opacity="0.35" fill="none"/>` +
  `<path d="M10 34 Q32 4 54 34 Q32 24 10 34 Z" fill="${leaf}" stroke="${INK}" stroke-width="1"/>` +
  `<ellipse cx="32" cy="74" rx="7" ry="9" fill="${door}" stroke="${INK}" stroke-width="1"/>`;

TILES.push(
  { name: 'feuillage', blocking: true, svg: leafSea },
  {
    name: 'plateforme',
    svg:
      diamond('#a88456') +
      '<path d="M8 80 Q32 70 56 80 M14 86 Q32 78 50 86 M20 74 Q32 68 44 74" stroke="#7d5f3b" stroke-width="1.3" fill="none"/>',
  },
  {
    // Le long des colonnes (vers le bas à droite à l'écran).
    name: 'passerelle-c',
    svg:
      leafSea +
      '<path d="M8 76 L40 92 L56 84 L24 68 Z" fill="#b38f5e" stroke="#4a3524" stroke-width="1"/>' +
      '<path d="M16 72 L48 88 M14 78 L22 74 M24 83 L32 79 M34 88 L42 84" stroke="#6b4a32" stroke-width="1.2"/>' +
      '<path d="M6 74 L38 90 M26 66 L58 82" stroke="#d9c49a" stroke-width="1" opacity="0.7"/>',
  },
  {
    // Le long des rangées (vers le bas à gauche à l'écran).
    name: 'passerelle-r',
    svg:
      leafSea +
      '<path d="M56 76 L24 92 L8 84 L40 68 Z" fill="#b38f5e" stroke="#4a3524" stroke-width="1"/>' +
      '<path d="M48 72 L16 88 M50 78 L42 74 M40 83 L32 79 M30 88 L22 84" stroke="#6b4a32" stroke-width="1.2"/>' +
      '<path d="M58 74 L26 90 M38 66 L6 82" stroke="#d9c49a" stroke-width="1" opacity="0.7"/>',
  },
  { name: 'maison-cosse', blocking: true, cover: 4, svg: pod('#8a6a42', '#4d6b3a') },
  { name: 'salle-conseil', blocking: true, cover: 4, svg: pod('#9a7a4a', '#5f8a45', '#e2c27a') + `<circle cx="32" cy="16" r="5" fill="#9fe0a0" opacity="0.8"/>` },
  { name: 'grenier', blocking: true, cover: 4, svg: pod('#7a5a3c', '#46603a', '#6a6058') + `<circle cx="38" cy="74" r="2" fill="${COPPER}"/>` },
  {
    name: 'nacelle',
    blocking: true,
    cover: 2,
    svg:
      diamond('#a88456') +
      '<path d="M18 4 L22 56 M46 4 L42 56 M32 0 L32 52" stroke="#6b4a32" stroke-width="2"/>' +
      `<path d="M14 56 L50 56 L46 82 L18 82 Z" fill="#8a6a42" stroke="${INK}" stroke-width="1.2"/>` +
      '<path d="M16 64 L48 64 M17 72 L47 72 M24 56 L22 82 M32 56 L32 82 M40 56 L42 82" stroke="#5a4030" stroke-width="1"/>',
  },
  {
    name: 'arbre-souvenir',
    blocking: true,
    cover: 4,
    svg:
      diamond('#a88456') +
      shadow(16, 6) +
      `<path d="M26 84 Q28 60 27 40 L37 40 Q36 60 38 84 Z" fill="#6b4a32" stroke="${INK}" stroke-width="1"/>` +
      '<path d="M30 52 L34 52 M29 62 L35 62 M30 72 L34 72" stroke="#9fe0a0" stroke-width="1.5" opacity="0.9"/>' +
      '<circle cx="32" cy="26" r="16" fill="#3f5530"/><circle cx="22" cy="32" r="10" fill="#4d6b3a"/>' +
      '<circle cx="42" cy="30" r="10" fill="#4d6b3a"/><circle cx="32" cy="16" r="8" fill="#5f8a45"/>' +
      '<circle cx="26" cy="22" r="1.6" fill="#d8f5c8"/><circle cx="40" cy="20" r="1.6" fill="#d8f5c8"/><circle cx="34" cy="34" r="1.4" fill="#d8f5c8"/>',
  },
  {
    name: 'lanterne-verte',
    blocking: true,
    svg:
      diamond('#a88456') +
      `<rect x="30" y="34" width="4" height="48" fill="#4a3524"/>` +
      '<circle cx="32" cy="30" r="13" fill="#9fe0a0" opacity="0.18"/>' +
      `<path d="M32 18 L38 30 L32 42 L26 30 Z" fill="#c8f0c0" stroke="#4d6b3a" stroke-width="1.5"/>`,
  },
  {
    name: 'hamac',
    blocking: true,
    cover: 2,
    svg:
      shadow(20, 6) +
      '<path d="M12 50 L12 82 M52 50 L52 82" stroke="#6b4a32" stroke-width="3"/>' +
      '<path d="M12 56 Q32 78 52 56" stroke="#4d6b3a" stroke-width="7" fill="none"/>',
  },
  {
    name: 'etabli',
    blocking: true,
    cover: 2,
    svg:
      shadow(22, 7) +
      `<path d="M10 66 L54 66 L50 72 L14 72 Z" fill="#8a6a42" stroke="${INK}"/>` +
      '<path d="M16 72 L16 84 M48 72 L48 84" stroke="#5a4030" stroke-width="3"/>' +
      '<path d="M18 64 Q22 48 28 64" stroke="#c9a46a" stroke-width="3" fill="none"/><rect x="34" y="52" width="3" height="13" fill="#c9a46a"/>' +
      '<rect x="41" y="56" width="2.5" height="9" fill="#c9a46a"/>',
  },
  {
    name: 'sacs-graines',
    blocking: true,
    cover: 2,
    svg:
      shadow(20, 7) +
      `<path d="M14 82 Q12 62 22 60 Q30 62 30 82 Z" fill="#c9b07a" stroke="${INK}"/>` +
      `<path d="M30 82 Q28 56 40 54 Q50 58 48 82 Z" fill="#b89c64" stroke="${INK}"/>` +
      `<circle cx="39" cy="68" r="3" fill="${COPPER}"/><circle cx="22" cy="72" r="2.5" fill="${COPPER}"/>`,
  },
  // PNJ de Canopéa (docs/univers/lieux/villes.md, validé par Cyril le 2026-11-01).
  npcTile('veline', { body: '#5f8a45', hair: '#2a2018', accent: '#d9c49a' }),
  npcTile('malo', { body: '#c9804f', hair: '#8a4a24', small: true }),
  npcTile('lisandre', { body: '#8a6a9a', hair: '#e2c27a' }),
  npcTile('sevane', { body: '#4d7a5a', hair: '#5a3020', skin: '#b98a64' }),
  npcTile('elouan', { body: '#6b4a32', hair: '#1f1612', accent: '#c9a46a' }),
  npcTile('ailis', { body: '#7a8a6a', hair: '#e8e2d4' }),
  npcTile('mirelle', { body: '#3f5530', hair: '#b0b0a8', accent: COPPER }),
  npcTile('huissier', { body: '#5a6b3a', hair: '#3a2a1c', accent: '#e2c27a' }),
  // --- Rencontres aléatoires (docs/gdd/carte-du-monde.md) ---------------------------------------------
  npcTile('colporteuse', { body: '#b5653a', hair: '#3a2a1c', skin: '#c49a74' }),
  npcTile('voyageur-egare', { body: '#6a6058', hair: '#7a5a3c' }),
  {
    name: 'ours-mousse',
    sprite: true,
    svg:
      shadow(20, 6) +
      `<path d="M10 82 Q8 56 26 50 Q40 44 52 56 Q58 68 54 82 Z" fill="#4d6b3a" stroke="${INK}" stroke-width="1.5"/>` +
      '<circle cx="48" cy="52" r="9" fill="#5f8a45" stroke="#1B1512" stroke-width="1.5"/>' +
      '<circle cx="51" cy="50" r="1.6" fill="#1B1512"/><circle cx="43" cy="44" r="3" fill="#5f8a45" stroke="#1B1512"/>' +
      '<path d="M16 60 Q24 54 32 60 M22 70 Q30 64 38 70" stroke="#7fa860" stroke-width="2" fill="none"/>',
  },
  {
    name: 'loup-rouille',
    sprite: true,
    svg:
      shadow(16, 5) +
      `<path d="M12 82 L16 66 Q30 58 44 62 L52 54 L56 62 L50 68 L48 82 Z" fill="#9a5a34" stroke="${INK}" stroke-width="1.5"/>` +
      '<path d="M20 66 L24 72 M30 63 L33 70 M38 63 L40 70" stroke="#6a3a20" stroke-width="2"/>' +
      '<circle cx="51" cy="60" r="1.4" fill="#f0d070"/>',
  },
  {
    name: 'cerf-luciole',
    svg:
      shadow(16, 5) +
      '<path d="M16 82 L18 64 Q30 58 42 62 L44 82 M22 82 L24 66 M38 82 L38 66" stroke="#8a6a42" stroke-width="3" fill="none"/>' +
      '<path d="M16 64 Q28 56 44 60 Q46 50 42 46 L46 46 Q50 52 46 62 Z" fill="#a88456" stroke="#1B1512" stroke-width="1"/>' +
      '<path d="M44 46 L40 34 M44 46 L50 34 M41 38 L36 32 M48 38 L54 32" stroke="#e8f8a0" stroke-width="2"/>' +
      '<circle cx="40" cy="34" r="2.5" fill="#f0ffb0"/><circle cx="50" cy="34" r="2.5" fill="#f0ffb0"/>' +
      '<circle cx="36" cy="31" r="2" fill="#f0ffb0"/><circle cx="54" cy="31" r="2" fill="#f0ffb0"/>',
  },
  {
    name: 'ruine',
    blocking: true,
    cover: 4,
    svg:
      diamond('#5a564e') +
      shadow(20, 7) +
      `<path d="M10 84 L10 46 L22 40 L24 54 L34 50 L36 62 L54 60 L54 84 Z" fill="#8a8276" stroke="${INK}" stroke-width="1.2"/>` +
      '<path d="M14 60 L24 58 M14 72 L50 70 M30 78 L30 66" stroke="#5f5a50" stroke-width="1.2"/>' +
      '<path d="M12 50 Q18 46 22 52" stroke="#4d6b3a" stroke-width="3" fill="none"/>',
  },
  {
    name: 'charrette',
    blocking: true,
    cover: 2,
    svg:
      diamond('#6b5338') +
      shadow(22, 7) +
      `<path d="M12 70 L50 62 L54 72 L16 80 Z" fill="#8a6a42" stroke="${INK}"/>` +
      '<path d="M14 66 L50 58" stroke="#5a4030" stroke-width="2"/>' +
      '<circle cx="22" cy="80" r="7" fill="none" stroke="#3a2a1c" stroke-width="3"/>' +
      '<path d="M44 74 L52 86" stroke="#3a2a1c" stroke-width="3"/>',
  },
  {
    name: 'carriole',
    blocking: true,
    cover: 2,
    svg:
      diamond('#6b5338') +
      shadow(22, 7) +
      `<path d="M12 74 L12 50 Q32 34 52 50 L52 74 Z" fill="#c9804f" stroke="${INK}"/>` +
      '<path d="M12 58 L52 58" stroke="#ead9b8" stroke-width="3"/>' +
      '<circle cx="20" cy="78" r="6" fill="none" stroke="#3a2a1c" stroke-width="3"/><circle cx="44" cy="78" r="6" fill="none" stroke="#3a2a1c" stroke-width="3"/>',
  },
  // --- Passants et habitants « de remplissage » (docs/gdd/figurants.md) : une ou deux répliques, sans quête. ---
  npcTile('fleuriste', {
    body: '#b0679a',
    hair: '#3a2a1c',
    extra: '<path d="M38 74 Q46 70 50 76 L46 82 L38 80 Z" fill="#8a6a42" stroke="#1B1512"/><circle cx="42" cy="71" r="2.5" fill="#f0e0ff"/><circle cx="47" cy="72" r="2.5" fill="#ffd27a"/>',
  }),
  npcTile('porteur', {
    body: '#7a6a4a',
    hair: '#2a2018',
    extra: '<rect x="22" y="30" width="20" height="12" rx="3" fill="#a88456" stroke="#1B1512"/><circle cx="28" cy="32" r="2" fill="#b0365a"/><circle cx="34" cy="31" r="2" fill="#6a3aa0"/>',
  }),
  npcTile('enfant-a', { body: '#4d8ab0', hair: '#c9a46a', small: true }),
  npcTile('vieillard', {
    body: '#6a6058',
    hair: '#e8e2d4',
    extra: '<path d="M46 60 L50 84" stroke="#6b4a32" stroke-width="3" stroke-linecap="round"/>',
  }),
  npcTile('tisseuse', {
    body: '#5f8a45',
    hair: '#8a4a24',
    extra: '<path d="M14 68 Q22 62 30 70 L28 80 Q20 74 14 78 Z" fill="#7fa860" stroke="#1B1512" opacity="0.9"/>',
  }),
  npcTile('messager', {
    body: '#3f6a8a',
    hair: '#1f1612',
    extra: '<rect x="38" y="66" width="10" height="7" fill="#ead9b8" stroke="#1B1512"/><path d="M38 66 L43 70 L48 66" stroke="#C9804F" fill="none"/>',
  }),
  npcTile('pelerine', {
    body: '#8a8276',
    hair: '#5a3020',
    extra: '<path d="M22 46 Q32 30 42 46 L42 56 Q32 50 22 56 Z" fill="#8a8276" stroke="#1B1512" opacity="0.95"/>',
  }),
  npcTile('jardinier', {
    body: '#6b5338',
    hair: '#7a7068',
    extra: '<path d="M20 40 L44 40 L38 34 L26 34 Z" fill="#c9a46a" stroke="#1B1512"/>',
  }),
  withArt('figurants/commis-ferros.png', 54, npcTile('colporteur-ferros', {
    body: '#8a5a3a',
    hair: '#2a2018',
    accent: '#C9804F',
    extra: '<rect x="14" y="56" width="12" height="18" rx="2" fill="#6b4a32" stroke="#1B1512"/><path d="M14 62 L26 62" stroke="#C9804F"/>',
  })),
  withArt('figurants/lavandiere.png', 54, npcTile('lavandiere', {
    body: '#7a8aa0',
    hair: '#4a3524',
    extra: '<ellipse cx="46" cy="76" rx="9" ry="5" fill="#a88456" stroke="#1B1512"/><path d="M40 74 Q46 70 52 74" stroke="#ead9b8" stroke-width="2" fill="none"/>',
  })),
  withArt('figurants/garcon-curieux.png', 40, npcTile('enfant-b', { body: '#c9804f', hair: '#2a2018', small: true, skin: '#b98a64' })),
  withArt('figurants/joueur-pipeau.png', 54, npcTile('joueur-pipeau', {
    body: '#5a4a6a',
    hair: '#d8d0c0',
    extra: '<path d="M30 54 L44 58" stroke="#c9a46a" stroke-width="3" stroke-linecap="round"/>',
  })),
  withArt('figurants/client.png', 54, npcTile('client', { body: '#6a7a5a', hair: '#5a3020', skin: '#c49a74' })),
  npcTile('voyageuse', {
    body: '#9a6a4a',
    hair: '#1f1612',
    extra: '<path d="M18 56 L18 76 L28 76 L28 58 Z" fill="#6b5338" stroke="#1B1512"/>',
  }),
  // --- Le Sol des Racines, sous Canopéa (quête « Les lettres de Malo », docs/univers/quetes.md) ---------------
  {
    name: 'sacoche',
    blocking: true,
    svg:
      shadow(14, 5) +
      `<path d="M20 82 L18 66 Q32 60 46 66 L44 82 Z" fill="#7a4a2a" stroke="${INK}" stroke-width="1.2"/>` +
      '<path d="M18 66 Q32 72 46 66" stroke="#5a3020" stroke-width="2" fill="#8a5a34"/>' +
      `<rect x="29" y="68" width="6" height="5" fill="${COPPER}" stroke="${INK}" stroke-width="0.8"/>` +
      '<path d="M22 66 Q32 46 42 66" stroke="#5a3020" stroke-width="2" fill="none"/>' +
      `<path d="M38 62 L46 56 L48 60 L40 66 Z" fill="${PARCHMENT}" stroke="${INK}" stroke-width="0.6"/>`,
  },
  {
    name: 'lettres',
    blocking: true,
    svg:
      `<path d="M14 80 L26 74 L34 78 L22 84 Z" fill="${PARCHMENT}" stroke="${INK}" stroke-width="0.8"/>` +
      `<path d="M30 86 L42 80 L50 84 L38 90 Z" fill="#f2e6cc" stroke="${INK}" stroke-width="0.8"/>` +
      `<path d="M36 74 L46 70 L52 73 L42 77 Z" fill="${PARCHMENT}" stroke="${INK}" stroke-width="0.8"/>` +
      `<circle cx="24" cy="79" r="1.5" fill="${COPPER}"/><circle cx="40" cy="85" r="1.5" fill="${COPPER}"/>`,
  },
  {
    name: 'trou-fouille',
    blocking: true,
    cover: 2,
    svg:
      diamond('#3a2a1c') +
      '<path d="M14 80 L32 71 L50 80 L32 89 Z" fill="#1f1612"/>' +
      '<path d="M14 80 L14 76 M50 80 L50 76 M32 71 L32 67 M32 89 L32 85" stroke="#b38f5e" stroke-width="2.5"/>' +
      '<path d="M14 76 L32 67 L50 76" stroke="#b38f5e" stroke-width="2" fill="none"/>' +
      `<path d="M24 82 L40 76" stroke="${COPPER}" stroke-width="2" opacity="0.8"/>` +
      '<path d="M52 70 L58 52 M55 60 L60 62" stroke="#6a6058" stroke-width="2.5"/>',
  },
);

// --- Canopéa, quêtes du chapitre 2 (docs/univers/quetes.md) ---------------------------------------------------
TILES.push(
  {
    // « Le chant d'Anselme » : le jeune arbre au pied duquel repose Anselme (Rite du Retour), ruban vert, branches tombées.
    name: 'arbre-retour',
    blocking: true,
    cover: 3,
    svg:
      diamond('#334023') +
      shadow(16, 6) +
      `<path d="M29 84 Q30 64 30 46 L35 46 Q35 64 36 84 Z" fill="#6b4a32" stroke="${INK}" stroke-width="1"/>` +
      '<path d="M28 62 Q32 66 37 62" stroke="#5fae5a" stroke-width="3" fill="none"/><path d="M36 63 L40 72 M35 64 L37 73" stroke="#5fae5a" stroke-width="2"/>' +
      '<circle cx="32" cy="34" r="13" fill="#4d6b3a"/><circle cx="24" cy="40" r="8" fill="#5f8a45"/><circle cx="41" cy="39" r="8" fill="#5f8a45"/>' +
      '<circle cx="33" cy="24" r="7" fill="#76a352"/>' +
      '<path d="M10 86 L24 80 M44 90 L58 84 M14 90 L20 92" stroke="#8a6a46" stroke-width="2.5" stroke-linecap="round"/>' +
      '<path d="M16 84 L13 81 M50 87 L52 83" stroke="#8a6a46" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    // « L'audience » : gradins de l'amphithéâtre du Conseil, taillé dans un Arbre-Titan mort [NOTION].
    name: 'gradin',
    blocking: true,
    cover: 2,
    svg:
      diamond('#8a6a46') +
      `<path d="M1 72 L32 87 L32 95 L1 80 Z" fill="#6b4a32" stroke="${INK}" stroke-width="1"/>` +
      `<path d="M32 87 L63 72 L63 80 L32 95 Z" fill="#5a3e2a" stroke="${INK}" stroke-width="1"/>` +
      `<path d="M1 72 L32 57 L63 72 L32 87 Z" fill="#a88456" stroke="${INK}" stroke-width="1"/>` +
      '<path d="M10 72 Q32 62 54 72 M16 76 Q32 68 48 76" stroke="#7d5f3b" stroke-width="1.2" fill="none"/>',
  },
  npcTile('kael-marchevent', { body: '#2e4a2c', hair: '#3a2a1c', accent: COPPER, extra: '<path d="M24 58 Q32 54 40 58" stroke="#c9804f" stroke-width="2.5" fill="none"/><circle cx="32" cy="57" r="2" fill="#5fae5a"/>' }),
  npcTile('lyra', { body: '#5f8a45', hair: '#e8d8a8', skin: '#e0c4a8', accent: '#e2c27a', extra: '<path d="M24 40 Q20 58 22 70 M40 40 Q44 58 42 70" stroke="#e8d8a8" stroke-width="3" fill="none"/><path d="M23 52 l-3 2 M41 56 l3 2" stroke="#5fae5a" stroke-width="2"/>' }),
  npcTile('thalorin', { body: '#4d6b3a', hair: '#7fae5a', skin: '#9aa47a', accent: '#c8f0c0', extra: '<circle cx="25" cy="38" r="5" fill="#5f8a45"/><circle cx="39" cy="38" r="5" fill="#5f8a45"/><circle cx="32" cy="33" r="5" fill="#76a352"/>' }),
  npcTile('garrik', { body: '#5a5048', hair: '#2a2018', skin: '#c49a74', accent: '#9a8a7a', extra: '<path d="M42 40 L44 76" stroke="#6b4a32" stroke-width="3" stroke-linecap="round"/><path d="M36 42 Q44 34 52 42" stroke="#8a8a90" stroke-width="3" fill="none"/>' }),
  npcTile('elvan', { body: '#7a6a3a', hair: '#5a3020', accent: '#d9c49a', extra: '<circle cx="38" cy="66" r="3" fill="#a88456" stroke="#1B1512" stroke-width="0.8"/>' }),
  {
    // « Les graines qui manquent » : les ballots d'Elvan ; l'un d'eux luit, à qui sait regarder.
    name: 'ballots',
    blocking: true,
    cover: 2,
    svg:
      diamond('#a88456') +
      shadow(18, 6) +
      `<path d="M12 82 Q10 66 22 64 Q34 66 32 82 Z" fill="#c9b48a" stroke="${INK}" stroke-width="1"/>` +
      `<path d="M30 84 Q28 62 42 60 Q56 62 52 84 Z" fill="#b8a07a" stroke="${INK}" stroke-width="1"/>` +
      '<path d="M14 72 L30 72 M32 70 L52 70" stroke="#5fae5a" stroke-width="2"/>' +
      '<circle cx="44" cy="76" r="2" fill="#e8f5a0" opacity="0.8"/>',
  },
  npcTile('druide', { body: '#2e5a32', hair: '#2e5a32', skin: '#c49a74', accent: '#9fe0a0', extra: '<path d="M23 46 Q32 30 41 46" fill="#2e5a32" stroke="#1B1512" stroke-width="1"/><path d="M44 44 L46 82" stroke="#6b4a32" stroke-width="2.5"/>' }),
  npcTile('conseillere', { body: '#6a7a3a', hair: '#3a2a1c', accent: '#e2c27a', extra: '<path d="M24 40 Q32 34 40 40" stroke="#e2c27a" stroke-width="2" fill="none"/>' }),
  // --- Ironheart, capitale de Ferros (chapitre 3, docs/univers/lieux/ironheart.md) : visuels provisoires. ------
  { name: 'paves', svg: diamond('#5a5048') + '<path d="M10 80 L22 74 M22 86 L34 80 M34 74 L46 68 M30 90 L44 83 M42 80 L54 74" stroke="#433b35" stroke-width="1.4"/>' },
  {
    name: 'paves-cendre',
    svg: diamond('#77706a') + '<circle cx="22" cy="80" r="2" fill="#5f5953"/><circle cx="38" cy="84" r="2.5" fill="#5f5953"/><circle cx="34" cy="74" r="1.5" fill="#8f8882"/>',
  },
  { name: 'dalles', svg: diamond('#6e655c') + '<path d="M16 72 L48 88 M48 72 L16 88" stroke="#544b43" stroke-width="1.2"/>' },
  {
    name: 'maison-brique',
    blocking: true,
    cover: 4,
    svg:
      diamond('#5a5048') +
      shadow(24, 8) +
      `<path d="M8 84 L8 34 L32 22 L56 34 L56 84 L32 96 Z" fill="#7a3f2a" stroke="${INK}" stroke-width="1.2"/>` +
      '<path d="M8 46 L32 58 L56 46 M8 58 L32 70 L56 58 M8 70 L32 82 L56 70" stroke="#5a2c1c" stroke-width="1" fill="none"/>' +
      `<path d="M4 36 L32 18 L60 36 L32 26 Z" fill="#3a3a44" stroke="${INK}" stroke-width="1"/>` +
      `<path d="M26 92 L26 74 Q32 68 38 74 L38 89 Z" fill="${COPPER}" stroke="${INK}" stroke-width="1"/>` +
      '<rect x="12" y="50" width="7" height="8" fill="#e8b860" opacity="0.85"/><rect x="45" y="50" width="7" height="8" fill="#e8b860" opacity="0.85"/>',
  },
  {
    name: 'forge',
    blocking: true,
    cover: 4,
    svg:
      diamond('#5a5048') +
      shadow(24, 8) +
      `<path d="M6 84 L6 44 L32 32 L58 44 L58 84 L32 96 Z" fill="#4a4048" stroke="${INK}" stroke-width="1.2"/>` +
      `<rect x="40" y="6" width="9" height="36" fill="#3a3238" stroke="${INK}"/>` +
      '<circle cx="45" cy="4" r="5" fill="#8f8882" opacity="0.6"/><circle cx="50" cy="-2" r="4" fill="#8f8882" opacity="0.4"/>' +
      `<path d="M20 90 L20 70 L44 70 L44 84 Z" fill="#f08a2c" stroke="${INK}"/>` +
      '<path d="M24 86 Q32 74 40 82" stroke="#ffd060" stroke-width="3" fill="none"/>',
  },
  {
    name: 'archives',
    blocking: true,
    cover: 4,
    svg:
      diamond('#6e655c') +
      shadow(26, 8) +
      `<path d="M4 84 L4 40 L32 26 L60 40 L60 84 L32 96 Z" fill="#9a9488" stroke="${INK}" stroke-width="1.2"/>` +
      `<path d="M0 40 L32 14 L64 40 L32 30 Z" fill="#c8c0b0" stroke="${INK}" stroke-width="1"/>` +
      '<path d="M12 46 L12 82 M22 50 L22 88 M42 50 L42 88 M52 46 L52 82" stroke="#e6e0d2" stroke-width="3"/>' +
      `<path d="M27 94 L27 72 L37 72 L37 89 Z" fill="#3a3238" stroke="${INK}"/>` +
      `<path d="M18 36 L46 36" stroke="${COPPER}" stroke-width="2"/>`,
  },
  {
    name: 'reverbere',
    blocking: true,
    svg:
      diamond('#5a5048') +
      `<rect x="30" y="30" width="4" height="52" fill="#2e2a30"/>` +
      '<circle cx="32" cy="26" r="13" fill="#ff7a5a" opacity="0.18"/>' +
      `<path d="M26 18 L38 18 L36 32 L28 32 Z" fill="#ff8a6a" stroke="#2e2a30" stroke-width="2"/>`,
  },
  {
    name: 'monte-charge',
    blocking: true,
    cover: 2,
    svg:
      diamond('#5a5048') +
      '<path d="M14 0 L14 84 M50 0 L50 84" stroke="#3a3238" stroke-width="3"/>' +
      `<path d="M14 50 L50 50 L50 82 L14 82 Z" fill="#6a5a4a" stroke="${INK}" stroke-width="1.2"/>` +
      '<path d="M20 50 L20 82 M26 50 L26 82 M32 50 L32 82 M38 50 L38 82 M44 50 L44 82" stroke="#3a3238" stroke-width="1.5"/>' +
      `<circle cx="32" cy="8" r="7" fill="none" stroke="${COPPER}" stroke-width="2"/>`,
  },
  {
    name: 'puits',
    blocking: true,
    cover: 2,
    svg:
      diamond('#5a5048') +
      shadow(16, 6) +
      `<ellipse cx="32" cy="76" rx="16" ry="8" fill="#4a4048" stroke="${INK}"/>` +
      '<ellipse cx="32" cy="74" rx="11" ry="5" fill="#2c4a55"/>' +
      `<path d="M44 74 L44 44 L36 40" stroke="${COPPER}" stroke-width="3" fill="none"/>` +
      '<circle cx="36" cy="40" r="3" fill="#C9804F"/>',
  },
  {
    name: 'tente-cendres',
    blocking: true,
    cover: 2,
    svg:
      diamond('#77706a') +
      shadow(22, 7) +
      `<path d="M8 82 L18 50 L46 50 L56 82 Z" fill="#8a8276" stroke="${INK}" stroke-width="1"/>` +
      `<path d="M6 52 L32 36 L58 52 Z" fill="#6a6058" stroke="${INK}" stroke-width="1"/>` +
      '<path d="M20 82 L22 62 M44 82 L42 62" stroke="#4a4048" stroke-width="2"/>' +
      '<circle cx="28" cy="70" r="3" fill="#e8e2d4"/><path d="M34 72 L42 66" stroke="#e8e2d4" stroke-width="2.5"/>',
  },
  {
    name: 'tuyaux',
    blocking: true,
    svg:
      diamond('#5a5048') +
      `<path d="M10 84 L10 50 Q10 40 22 40 L54 40" stroke="#8a5a34" stroke-width="7" fill="none"/>` +
      `<path d="M10 84 L10 50 Q10 40 22 40 L54 40" stroke="${COPPER}" stroke-width="3" fill="none"/>` +
      '<circle cx="30" cy="40" r="5" fill="#6a4a2a"/>',
  },
  {
    name: 'butoir',
    blocking: true,
    svg: diamond('#4a4038') + `<rect x="20" y="62" width="24" height="16" fill="#7a3f2a" stroke="${INK}"/>` + '<path d="M20 66 L44 66" stroke="#e8b860" stroke-width="3"/>',
  },
  npcTile('ferrome', {
    body: '#6a6a74',
    skin: '#8a8a94',
    hair: '#4a4a54',
    accent: COPPER,
    extra: '<circle cx="29" cy="47" r="1.6" fill="#7fe0ff"/><circle cx="35" cy="47" r="1.6" fill="#7fe0ff"/><rect x="22" y="60" width="20" height="4" fill="#4a4a54"/>',
  }),
  npcTile('kaelis', { body: '#3a3238', hair: '#b0b0a8', skin: '#c49a74', accent: '#e8e2d4', extra: '<path d="M40 72 L48 66 M42 74 L50 70" stroke="#e8e2d4" stroke-width="2"/>' }),
  npcTile('veilleuse', { body: '#4a5a6a', hair: '#2a2018', accent: COPPER, extra: '<rect x="40" y="60" width="7" height="10" fill="#ffd060" stroke="#1B1512"/>' }),
  npcTile('noam', { body: '#2e3a4a', hair: '#1f1612', accent: '#c8c0b0', extra: '<circle cx="28" cy="48" r="3" fill="none" stroke="#C9804F"/><circle cx="36" cy="48" r="3" fill="none" stroke="#C9804F"/>' }),
  npcTile('hedda', { body: '#7a4a2a', hair: '#c9a46a', accent: '#C9804F' }),
  npcTile('rika', { body: '#5a4a3a', hair: '#8a4a24', accent: '#e8b860' }),
  npcTile('garde-ferros', { body: '#3a3a44', hair: '#2a2018', accent: COPPER, extra: '<path d="M22 42 L42 42 L40 36 L24 36 Z" fill="#3a3a44" stroke="#1B1512"/>' }),
  npcTile('aubergiste-bielle', { body: '#6a4a3a', hair: '#4a3524', accent: '#e8e2d4' }),
  {
    name: 'mur-brique',
    blocking: true,
    svg:
      '<path d="M32 4 L64 20 L64 80 L32 96 L0 80 L0 20 Z" fill="#7a3f2a" stroke="#1B1512" stroke-width="1"/>' +
      '<path d="M0 34 L32 50 L64 34 M0 48 L32 64 L64 48 M0 62 L32 78 L64 62" stroke="#5a2c1c" stroke-width="1" fill="none"/>' +
      '<path d="M32 4 L64 20 L32 36 L0 20 Z" fill="#3a3238"/>',
  },
  {
    name: 'renfoncement',
    blocking: true,
    svg:
      diamond('#3a3238') +
      `<path d="M10 84 L10 40 L32 30 L54 40 L54 84 L32 96 Z" fill="#2e2a30" stroke="${INK}" stroke-width="1"/>` +
      '<path d="M22 90 L22 58 Q32 50 42 58 L42 85 Z" fill="#0e0b0a"/>' +
      '<circle cx="32" cy="72" r="2" fill="#ffb060" opacity="0.6"/>',
  },
  npcTile('ouvrier', { body: '#7a7a74', hair: '#3a2a1c', accent: '#b08a50' }),
  npcTile('veilleur-rouille', { body: '#4a3a3a', hair: '#8a8a8a', accent: '#c05a3a', extra: '<path d="M42 60 L50 52" stroke="#c9a46a" stroke-width="2"/><circle cx="50" cy="51" r="3" fill="none" stroke="#c9a46a" stroke-width="1.5"/>' }),
  npcTile('archiviste-guichet', { body: '#5a6a7a', hair: '#2a2018', accent: '#7fb0ff' }),
  // « Le Rail des Cendres » : le triage, la Cendrière et la machine sans homme.
  { name: 'sol-cendre', svg: diamond('#4e4945') + '<circle cx="20" cy="78" r="2.5" fill="#3a3633"/><circle cx="40" cy="86" r="2" fill="#625c57"/><circle cx="36" cy="72" r="1.5" fill="#3a3633"/>' },
  {
    name: 'tas-cendres',
    blocking: true,
    cover: 4,
    svg:
      diamond('#4e4945') +
      shadow(24, 8) +
      `<path d="M4 84 Q14 44 32 38 Q50 44 60 84 Z" fill="#5a5450" stroke="${INK}" stroke-width="1"/>` +
      '<path d="M18 70 Q30 56 44 66" stroke="#3e3936" stroke-width="2" fill="none"/>' +
      '<circle cx="40" cy="52" r="2" fill="#ff7a40" opacity="0.7"/>',
  },
  {
    name: 'poste-aiguillage',
    blocking: true,
    cover: 4,
    svg:
      diamond('#5a5048') +
      shadow(22, 8) +
      `<rect x="14" y="42" width="36" height="40" fill="#6b4a32" stroke="${INK}" stroke-width="1"/>` +
      `<path d="M10 44 L32 28 L54 44 Z" fill="#3a3238" stroke="${INK}" stroke-width="1"/>` +
      '<rect x="19" y="48" width="26" height="10" fill="#ffd27a" opacity="0.75"/>' +
      '<path d="M19 53 L45 53 M32 48 L32 58" stroke="#3a2a1c" stroke-width="1.5"/>' +
      `<rect x="27" y="66" width="10" height="16" fill="#2e2a30"/>`,
  },
  {
    name: 'levier',
    blocking: true,
    svg:
      diamond('#4a4038') +
      `<rect x="22" y="72" width="20" height="8" fill="#3a3238" stroke="${INK}"/>` +
      '<path d="M32 74 L42 46" stroke="#8a8a94" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="42" cy="45" r="4" fill="#c05a3a" stroke="#1B1512"/>',
  },
  {
    name: 'brasero',
    blocking: true,
    svg:
      diamond('#5a5048') +
      '<circle cx="32" cy="58" r="16" fill="#ff8a40" opacity="0.2"/>' +
      `<path d="M20 64 L44 64 L40 80 L24 80 Z" fill="#3a3238" stroke="${INK}"/>` +
      '<path d="M24 64 Q28 50 32 58 Q36 46 40 64 Z" fill="#ff9a40"/>' +
      '<path d="M28 64 Q32 54 36 64 Z" fill="#ffe08a"/>',
  },
  {
    name: 'pilote',
    blocking: true,
    cover: 4,
    svg:
      diamond('#4a4038') +
      shadow(24, 8) +
      `<rect x="10" y="50" width="44" height="26" rx="6" fill="#5a5a64" stroke="${INK}" stroke-width="1"/>` +
      `<path d="M14 50 L22 36 L42 36 L50 50 Z" fill="#6a6a74" stroke="${INK}" stroke-width="1"/>` +
      '<circle cx="24" cy="60" r="4" fill="#7fe0ff"/><circle cx="40" cy="60" r="4" fill="#7fe0ff"/>' +
      '<circle cx="24" cy="60" r="8" fill="#7fe0ff" opacity="0.2"/><circle cx="40" cy="60" r="8" fill="#7fe0ff" opacity="0.2"/>' +
      `<circle cx="18" cy="78" r="5" fill="#2e2a30" stroke="${INK}"/><circle cx="46" cy="78" r="5" fill="#2e2a30" stroke="${INK}"/>` +
      '<rect x="26" y="68" width="12" height="4" fill="#C9804F"/>',
  },
  npcTile('varka', { body: '#2e4a6a', hair: '#5a3a24', accent: '#e8b860', extra: '<rect x="22" y="58" width="20" height="3" fill="#1e3048"/>' }),
  npcTile('joss', { body: '#3a4a5a', hair: '#c9a46a', accent: '#ffd060', extra: '<rect x="42" y="60" width="7" height="10" fill="#ffd060" stroke="#1B1512"/>' }),
  npcTile('ostrik', { body: '#b8b4aa', hair: '#2a2018', accent: '#3a3238', extra: '<rect x="40" y="56" width="10" height="13" fill="#e8e2d4" stroke="#1B1512"/>' }),
  npcTile('sorn', { body: '#4e4945', hair: '#1f1612', accent: '#ff7a40', extra: '<path d="M20 78 L44 78 L46 88 L18 88 Z" fill="#4e4945" stroke="#1B1512"/>' }),
  npcTile('pilleur-cendres', { body: '#5a5450', hair: '#2a2018', accent: '#ff7a40', extra: '<path d="M24 46 L40 46 L40 52 L24 52 Z" fill="#3a3633"/>' }),
  npcTile('cheminot', { body: '#2e4a6a', hair: '#3a2a1c', accent: '#C9804F' }),
  // Leurs propres traits pour quatre PNJ d'Ironheart qui prenaient la silhouette générique (passe de qualité).
  npcTile('boulon', {
    body: '#6a6a74',
    skin: '#8a8a94',
    hair: '#4a4a54',
    accent: COPPER,
    extra: '<circle cx="29" cy="47" r="1.6" fill="#7fe0ff"/><circle cx="35" cy="47" r="1.6" fill="#7fe0ff"/><rect x="40" y="62" width="12" height="10" rx="1" fill="#6b4a32" stroke="#1B1512"/>',
  }),
  npcTile('patrouilleur', { body: '#2e2a30', hair: '#2e2a30', accent: '#c03a2a', extra: '<path d="M22 42 L42 42 L40 36 L24 36 Z" fill="#2e2a30" stroke="#1B1512"/><rect x="24" y="44" width="16" height="4" fill="#ff5a3a"/>' }),
  npcTile('patrouilleuse-haute', { body: '#2e2a30', hair: '#5a3a24', accent: '#c03a2a', extra: '<path d="M22 42 L42 42 L40 36 L24 36 Z" fill="#2e2a30" stroke="#1B1512"/><rect x="24" y="44" width="16" height="4" fill="#ff5a3a"/>' }),
  npcTile('dorna', { body: '#6a4a3a', hair: '#8a6a4a', accent: '#e8e2d4', extra: '<rect x="24" y="62" width="16" height="16" fill="#e8e2d4" opacity="0.85"/>' }),
  // « Les Échos sous la Forge » : la forge froide, la galerie du Peuple des Cendres Noires, les Échos.
  {
    name: 'forge-eteinte',
    blocking: true,
    cover: 4,
    svg:
      diamond('#5a5048') +
      shadow(24, 8) +
      `<path d="M6 84 L6 44 L32 32 L58 44 L58 84 L32 96 Z" fill="#3e363c" stroke="${INK}" stroke-width="1.2"/>` +
      `<rect x="40" y="6" width="9" height="36" fill="#2e2a30" stroke="${INK}"/>` +
      `<path d="M20 90 L20 70 L44 70 L44 84 Z" fill="#1e1a1c" stroke="${INK}"/>` +
      '<path d="M24 86 Q32 78 40 82" stroke="#c03a2a" stroke-width="2" fill="none" opacity="0.7"/>' +
      '<rect x="26" y="78" width="12" height="2" fill="#6a6a74"/>',
  },
  {
    name: 'enclume',
    blocking: true,
    svg:
      diamond('#4e4945') +
      shadow(18, 6) +
      `<path d="M14 62 L50 62 L56 56 L46 56 L44 52 L20 52 L18 56 L8 56 Z" fill="#3a3a44" stroke="${INK}"/>` +
      `<path d="M26 62 L38 62 L40 80 L24 80 Z" fill="#2e2e36" stroke="${INK}"/>` +
      '<path d="M24 55 l3 -2 M30 55 l3 -2 M36 55 l3 -2" stroke="#7fe0ff" stroke-width="1.5" opacity="0.8"/>',
  },
  {
    name: 'echo-forge',
    blocking: true,
    svg:
      `<ellipse cx="32" cy="84" rx="14" ry="5" fill="#7fb0ff" opacity="0.2"/>` +
      '<path d="M22 84 Q20 60 26 50 Q32 40 38 50 Q44 60 42 84 Z" fill="#a8d0ff" opacity="0.45" stroke="#e8c070" stroke-width="1.5"/>' +
      '<circle cx="32" cy="40" r="8" fill="#a8d0ff" opacity="0.5" stroke="#e8c070" stroke-width="1.5"/>',
  },
  npcTile('echo-furieux', { body: '#7fb0ff', hair: '#5a7ab0', skin: '#a8d0ff', accent: '#ffd060', extra: '<path d="M18 50 L12 44 M46 50 L52 44 M20 70 L12 74 M44 70 L52 74" stroke="#a8d0ff" stroke-width="2"/>' }),
  npcTile('hesk', { body: '#2a2624', hair: '#1a1614', skin: '#7a6a5a', accent: '#ff9a40', extra: '<circle cx="44" cy="58" r="4" fill="#ffd060" stroke="#1B1512"/>' }),
  npcTile('vieux-forgeron', { body: '#5a4a3a', hair: '#c8c0b0', accent: '#C9804F' }),
  // Voyager autrement : la convoyeuse de la Compagnie des Lisières, le chef de caravane.
  npcTile('convoyeuse', { body: '#6b4a32', hair: '#3a2a1c', accent: '#e8b860', extra: '<path d="M18 52 L46 60" stroke="#3a2a1c" stroke-width="3"/>' }),
  npcTile('chef-caravane', { body: '#5a6b3a', hair: '#8a6a4a', accent: '#e8b860', extra: '<path d="M22 40 L42 40 L38 34 L26 34 Z" fill="#6b4a32" stroke="#1B1512"/>' }),
  // La magie (docs/gdd/magie.md) : le druide Vanel et son cristal de Vie, Tiven le jeune Nacellier, la tailleuse de
  // cristaux du Marché des Cendres et son cristal de forge.
  npcTile('vanel', { body: '#3a6a3a', hair: '#c8c0a8', skin: '#c49a74', accent: '#9fe0a0', extra: '<path d="M23 46 Q32 32 41 46" fill="#3a6a3a" stroke="#1B1512" stroke-width="1"/><path d="M27 56 L32 62 L37 56" stroke="#e2c27a" stroke-width="1.2" fill="none"/><path d="M32 62 L35 66 L32 71 L29 66 Z" fill="#5fe08a" stroke="#1B1512" stroke-width="0.8"/>' }),
  npcTile('tiven', { body: '#6b5a3a', hair: '#8a5a30', skin: '#e0c4a8', accent: '#5fae5a', extra: '<path d="M18 50 L46 62" stroke="#a88456" stroke-width="2.5"/><circle cx="16" cy="70" r="3" fill="#e07a6a"/><circle cx="48" cy="70" r="3" fill="#e07a6a"/>' }),
  npcTile('tailleuse', { body: '#3a302c', hair: '#1a1614', skin: '#b08a6a', accent: '#c03a2a', extra: '<path d="M40 60 L44 54 L48 60 L44 68 Z" fill="#c03a2a" stroke="#1B1512" stroke-width="0.8"/><path d="M42 58 L46 62" stroke="#1B1512" stroke-width="1"/>' }),
  // Jalon 3 (docs/gdd/jalon-3.md) : de nouveaux ennemis du canon (« Faune & flore par continent ») et des pilleurs.
  {
    name: 'griffe-sylve',
    sprite: true,
    svg:
      shadow(16, 5) +
      `<path d="M10 80 Q14 66 26 64 Q38 60 46 64 L52 56 L56 64 L50 70 L50 80 L44 80 L42 72 L22 72 L18 80 Z" fill="#3e6a34" stroke="${INK}" stroke-width="1.5"/>` +
      '<path d="M18 68 Q22 62 26 68 M30 64 Q34 58 38 64" stroke="#7fae5a" stroke-width="2" fill="none"/>' +
      '<path d="M10 74 Q4 70 6 62" stroke="#3e6a34" stroke-width="3" fill="none"/>' +
      '<circle cx="51" cy="61" r="1.4" fill="#f0e070"/>',
  },
  {
    name: 'guepe-rouille',
    sprite: true,
    svg:
      shadow(14, 4) +
      [[24, 56], [38, 50], [32, 66]]
        .map(
          ([x, y]) =>
            `<ellipse cx="${x}" cy="${y}" rx="7" ry="4" fill="#b8642a" stroke="${INK}" stroke-width="1"/>` +
            `<path d="M${x - 3} ${y - 4} L${x - 6} ${y - 10} M${x + 2} ${y - 4} L${x + 5} ${y - 10}" stroke="#d8e0f0" stroke-width="2" opacity="0.8"/>` +
            `<path d="M${x - 2} ${y - 3} L${x - 2} ${y + 3} M${x + 2} ${y - 3} L${x + 2} ${y + 3}" stroke="#3a2010" stroke-width="1.5"/>`,
        )
        .join(''),
  },
  {
    name: 'gecko-soudeur',
    sprite: true,
    svg:
      shadow(16, 4) +
      `<path d="M10 80 Q20 70 32 72 Q44 70 52 64 L56 68 L50 74 Q42 80 32 80 Z" fill="#6a6a74" stroke="${INK}" stroke-width="1.5"/>` +
      '<path d="M18 80 L14 84 M28 80 L26 85 M38 79 L40 84" stroke="#4a4a54" stroke-width="2"/>' +
      '<circle cx="52" cy="66" r="1.5" fill="#ffd060"/>' +
      '<path d="M57 64 L62 60 M57 66 L63 66 M57 68 L61 72" stroke="#ffb040" stroke-width="1.5"/>',
  },
  npcTile('arbaletrier-cendres', { body: '#4a4440', hair: '#2a2018', accent: '#ff7a40', extra: '<path d="M40 52 L54 44 M44 44 L52 54" stroke="#6b4a32" stroke-width="2.5"/>' }),
  npcTile('rebouteuse-cendres', { body: '#5a4a44', hair: '#7a6a5a', accent: '#9fe0a0', extra: '<rect x="38" y="60" width="9" height="8" fill="#a88456" stroke="#1B1512" stroke-width="0.8"/>' }),
  // La passe sombre (docs/gdd/passe-sombre.md) : « Le registre du Puits Trois ».
  // Kerta, fondeuse en gris, avant-bras brûlés, un seau de fer.
  npcTile('kerta', { body: '#6e6e68', hair: '#4a3a2c', skin: '#c99a7a', accent: '#a0522d', extra: '<path d="M44 66 L52 66 L50 76 L46 76 Z" fill="#5a5a60" stroke="#1B1512" stroke-width="0.8"/><path d="M45 66 Q48 60 51 66" fill="none" stroke="#1B1512" stroke-width="1"/>' }),
  // Tam, riveteur maigre, le masque de feutre au cou.
  npcTile('tam', { body: '#7a7a74', hair: '#2a2018', accent: '#3a3a3a', extra: '<rect x="26" y="52" width="12" height="5" rx="2" fill="#e8e2d4" stroke="#1B1512" stroke-width="0.8"/>' }),
  // Le technicien Dask, Classe Technique : gris clair, chiffres bleus au poignet.
  npcTile('dask', { body: '#b8b4aa', hair: '#1f1612', accent: '#2e5a9a', extra: '<rect x="44" y="62" width="5" height="3" fill="#2e5a9a"/><rect x="38" y="56" width="10" height="13" fill="#e8e2d4" stroke="#1B1512" stroke-width="0.8"/>' }),
);

// Sept-Portes, la cité de Kael, au centre du monde (chapitre 4, docs/univers/lieux/sept-portes.md) : provisoire.
TILES.push(
  // Une des Sept Portes, portails permanents vers chaque continent [NOTION, Géographie] : une arche de pierre et sa
  // lumière, de la couleur du pays.
  {
    name: 'porte-nexus',
    blocking: true,
    cover: 4,
    svg:
      diamond('#8a8070') +
      shadow(24, 8) +
      `<path d="M8 86 L8 40 Q32 6 56 40 L56 86 L46 90 L46 44 Q32 22 18 44 L18 90 Z" fill="#b8ae9c" stroke="${INK}" stroke-width="1.2"/>` +
      '<path d="M18 90 L18 44 Q32 22 46 44 L46 90 Q32 96 18 90 Z" fill="#8fd0c0" opacity="0.55"/>' +
      '<path d="M24 84 Q32 50 40 84" stroke="#e8fff4" stroke-width="2" fill="none" opacity="0.7"/>' +
      `<circle cx="32" cy="22" r="3" fill="${COPPER}"/>`,
  },
  // La mosaïque de la place des Portes : sept rayons qui partent du centre.
  {
    name: 'mosaique',
    svg:
      diamond('#cbbf9f') +
      '<path d="M32 66 L32 94 M18 73 L46 87 M46 73 L18 87" stroke="#a8956a" stroke-width="2"/>' +
      `<circle cx="32" cy="80" r="3" fill="${COPPER}"/>`,
  },
  // Le mémorial des trois cents (Bataille du Nexus, 1861) : une stèle couverte de noms.
  {
    name: 'stele',
    blocking: true,
    cover: 2,
    svg:
      diamond('#9a9080') +
      shadow(14, 5) +
      `<path d="M20 86 L20 36 Q32 26 44 36 L44 86 Z" fill="#d8d0bc" stroke="${INK}" stroke-width="1.2"/>` +
      '<path d="M25 44 L39 44 M25 50 L39 50 M25 56 L39 56 M25 62 L39 62 M25 68 L39 68 M25 74 L39 74" stroke="#7a705e" stroke-width="1.5"/>',
  },
  // Le lutrin du Registre des Mains : un grand livre ouvert.
  {
    name: 'lutrin',
    blocking: true,
    svg:
      shadow(12, 4) +
      '<rect x="29" y="58" width="6" height="26" fill="#5a3e2a"/>' +
      `<path d="M14 58 L32 50 L50 58 L32 66 Z" fill="#efe6cf" stroke="${INK}" stroke-width="1"/>` +
      '<path d="M32 50 L32 66 M19 57 L28 53 M36 53 L45 57" stroke="#8a7a5a" stroke-width="1"/>',
  },
  // Un dôme de pierre claire (le Conseil Œcuménique des Sept).
  {
    name: 'dome',
    blocking: true,
    cover: 4,
    svg:
      diamond('#8a8070') +
      shadow(26, 8) +
      `<path d="M6 84 L6 54 L58 54 L58 84 L32 96 Z" fill="#c8bfae" stroke="${INK}" stroke-width="1.2"/>` +
      `<path d="M6 54 Q32 6 58 54 Z" fill="#d9d2c2" stroke="${INK}" stroke-width="1.2"/>` +
      `<path d="M27 94 L27 72 L37 72 L37 90 Z" fill="#3a3238" stroke="${INK}"/>` +
      `<path d="M12 60 L52 60" stroke="${COPPER}" stroke-width="2"/>`,
  },
);

// Les habitants de Sept-Portes (provisoires) : la ville de tous les peuples.
TILES.push(
  // Ambroise Encrelune, Conservateur : robe d'encre, doigts tachés, un registre sous le bras.
  npcTile('ambroise', { body: '#2e2a3a', hair: '#d8d4cc', accent: '#c9a24a', extra: '<rect x="38" y="58" width="12" height="9" fill="#efe6cf" stroke="#1B1512" stroke-width="0.8"/>' }),
  // Hesper Mille-Récits, doyenne des Gardiens : cape couleur parchemin, une lanterne.
  npcTile('hesper', { body: '#a8956a', hair: '#e8e4dc', skin: '#c9a07e', accent: '#C9804F', extra: '<circle cx="48" cy="64" r="4" fill="#ffd27a" stroke="#1B1512" stroke-width="0.8"/>' }),
  // Josse Sept-Routes, aubergiste : tablier, foulard de toutes les couleurs.
  npcTile('josse', { body: '#7a5a3c', hair: '#3a2a1c', accent: '#d8504a', extra: '<path d="M24 54 L40 54 L36 60 L28 60 Z" fill="#3a8ab0"/>' }),
  // Lior Rose-des-Vents, cartographe : un rouleau, une boussole au cou.
  npcTile('lior', { body: '#4a6a7a', hair: '#8a5a2c', accent: '#e8d8a0', extra: '<rect x="42" y="56" width="4" height="16" rx="2" fill="#efe6cf" stroke="#1B1512" stroke-width="0.8"/>' }),
  // Arlo et Mina, jumeaux de neuf ans : mère de Marisol, père de Glacialis.
  npcTile('arlo', { small: true, body: '#3a7aa0', hair: '#e8e0c8', accent: '#e8f4ff' }),
  npcTile('mina', { small: true, body: '#5a9ab8', hair: '#e8e0c8', accent: '#3a7aa0' }),
  // La greffière du Conseil Œcuménique : gris perle, plume d'argent.
  npcTile('greffiere', { body: '#8a8a94', hair: '#2a2420', accent: '#d8d8e0', extra: '<path d="M44 52 L50 44" stroke="#d8d8e0" stroke-width="2"/>' }),
  // Le portier de nuit de la Bibliothèque : lanterne sourde, clés.
  npcTile('portier-nuit', { body: '#1f2430', hair: '#4a4a4a', accent: '#ffd27a', extra: '<circle cx="47" cy="66" r="3" fill="#ffd27a" opacity="0.8"/>' }),
  // Edda Varn, la dame en gris : manteau gris de Ferros, gants.
  npcTile('edda', { body: '#6a6a70', hair: '#1a1614', skin: '#d9b8a0', accent: '#3a3a40' }),
  // La marchande des nations : étoffes de six pays.
  npcTile('marchande-nations', { body: '#9a5a7a', hair: '#2a1a14', skin: '#a87a5a', accent: '#e8c84a' }),
  // Passants : un Éprouveur (brassard blanc), une voyageuse de Zephyria, un marin de Marisol, une nomade des Sables,
  // un Glacien.
  npcTile('eprouveur', { body: '#e8e4dc', hair: '#3a2a1c', accent: '#1B1512', extra: '<rect x="20" y="58" width="8" height="5" fill="#ffffff" stroke="#1B1512" stroke-width="0.6"/>' }),
  npcTile('voyageuse-zephyria', { body: '#b8d0e8', hair: '#e8d8a0', accent: '#ffffff', extra: '<path d="M18 50 Q14 40 22 44" stroke="#ffffff" stroke-width="2" fill="none"/>' }),
  npcTile('marin-marisol', { body: '#2a4a7a', hair: '#1a1410', skin: '#8a5a3c', accent: '#e8e0c8' }),
  npcTile('nomade-sables', { body: '#c8a060', hair: '#2a1a10', skin: '#8a5a3c', accent: '#a0402a', extra: '<path d="M22 46 Q32 36 42 46" stroke="#c8a060" stroke-width="5" fill="none"/>' }),
  npcTile('glacien', { body: '#d0e0ec', hair: '#f0f4f8', skin: '#e8d8d0', accent: '#5a8ab0' }),
);

// Ce qui brille sous le pont de Gardebois (étude du 2026-11-03, H4) : des reflets sur l'eau, rien de plus ; la boîte
// du passeur est au fond. Ajoutée en dernier, pour ne décaler aucune tuile.
TILES.push({
  name: 'reflet',
  svg:
    '<ellipse cx="32" cy="80" rx="10" ry="4" fill="#9fd4dc" opacity="0.45"/>' +
    '<path d="M30 72 L32 66 L34 72 L40 74 L34 76 L32 82 L30 76 L24 74 Z" fill="#fff6d8" opacity="0.95"/>' +
    '<path d="M41 79 L42 76 L43 79 L46 80 L43 81 L42 84 L41 81 L38 80 Z" fill="#ffe7a8" opacity="0.9"/>' +
    '<circle cx="23" cy="82" r="1.4" fill="#ffffff" opacity="0.9"/>',
});

// L'échelle de corde des Jeunes-Pousses, au bord du marché de Canopéa, et ses rubans (étude du 2026-11-03, H4).
TILES.push({
  name: 'rubans',
  svg:
    '<path d="M24 70 L22 96 M40 70 L42 96" stroke="#8a6a3c" stroke-width="2" fill="none"/>' +
    '<path d="M23 76 L41 76 M23 84 L41 84 M22 92 L42 92" stroke="#a07a48" stroke-width="2"/>' +
    '<path d="M24 76 l-5 8 M40 76 l5 9 M23 84 l-6 7 M41 84 l4 8" stroke-width="2.5" fill="none" stroke="#c9804f"/>' +
    '<path d="M26 76 l-2 9" stroke="#d8504a" stroke-width="2.5"/><path d="M38 84 l3 9" stroke="#e8d8a0" stroke-width="2.5"/>' +
    '<path d="M28 92 l-3 4" stroke="#7fbf6a" stroke-width="2.5"/>',
});

// Un Ferrôme rangé au rebut sous des tôles, aux Forges-Basses ; sa main dépasse (étude du 2026-11-03, H4).
TILES.push({
  name: 'ferraille',
  svg:
    '<path d="M10 84 L26 70 L46 74 L56 86 L34 92 Z" fill="#5a5552" stroke="#1B1512" stroke-width="1"/>' +
    '<path d="M18 80 L36 72 L50 78 L30 86 Z" fill="#7a736c" stroke="#1B1512" stroke-width="0.8"/>' +
    '<path d="M14 86 L30 80" stroke="#3a3533" stroke-width="3"/><circle cx="44" cy="84" r="3" fill="#9a4a2c"/>' +
    '<path d="M36 72 L38 62 M40 72 L42 60 M44 73 L46 62 M47 75 L51 66" stroke="#a8a29a" stroke-width="2.5" stroke-linecap="round"/>' +
    '<path d="M34 76 Q40 70 48 76" stroke="#a8a29a" stroke-width="4" fill="none"/>',
});

// Les nouveaux passants (Cyril, 2026-11-04 : « plus de PNJ, comme dans Fallout ») : silhouettes provisoires,
// ajoutées en dernier pour ne décaler aucune tuile (docs/gdd/figurants.md).
TILES.push(
  npcTile('caravaniere', { body: '#6a5a3a', hair: '#2a1a10', accent: '#c9804f', extra: '<rect x="38" y="60" width="10" height="12" rx="2" fill="#8a6a3c" stroke="#1B1512" stroke-width="0.8"/>' }),
  npcTile('cueilleuse', { body: '#5a6a3a', hair: '#7a4a2a', accent: '#d8e0a0', extra: '<circle cx="44" cy="70" r="5" fill="#a07a48" stroke="#1B1512" stroke-width="0.8"/><circle cx="44" cy="67" r="2" fill="#bfe8d8"/>' }),
  npcTile('garde-vert', { body: '#2f5a32', hair: '#3a2a1c', accent: '#c9a24a', extra: '<path d="M46 40 L46 80" stroke="#8a6a3c" stroke-width="2.5"/>' }),
  npcTile('vieille', { body: '#6a5a6a', hair: '#e0dcd4', skin: '#d0a888', accent: '#a89aa8', small: true }),
  npcTile('geometre', { body: '#5a5a62', hair: '#2a2420', accent: '#d8504a', extra: '<path d="M18 50 L18 82" stroke="#e8d8a0" stroke-width="2"/><path d="M18 50 l4 3" stroke="#d8504a" stroke-width="2"/>' }),
  npcTile('nacelliere', { body: '#3a5a4a', hair: '#8a5a2c', accent: '#c9a24a', extra: '<path d="M20 58 Q32 70 44 58" stroke="#a07a48" stroke-width="3" fill="none"/>' }),
  npcTile('marchand-the', { body: '#5a7a3a', hair: '#e8d8b0', accent: '#EAD9B8', extra: '<ellipse cx="44" cy="68" rx="5" ry="3" fill="#7fbf6a" stroke="#1B1512" stroke-width="0.8"/>' }),
  npcTile('scribe', { body: '#4a6a4a', hair: '#1a1410', accent: '#EAD9B8', extra: '<rect x="38" y="58" width="11" height="8" fill="#efe6cf" stroke="#1B1512" stroke-width="0.8"/>' }),
  npcTile('citoyen-arbre', { body: '#2a6a52', hair: '#c8b07a', skin: '#e0c0a0', accent: '#e8d070', extra: '<path d="M22 56 L42 56" stroke="#e8d070" stroke-width="2.5"/>' }),
  npcTile('graveur', { body: '#6a5038', hair: '#bdb6aa', accent: '#C9804F', extra: '<path d="M44 62 L50 54" stroke="#9a9a9a" stroke-width="2"/>' }),
  npcTile('veuve', { body: '#2a2a32', hair: '#5a4a3a', accent: '#6a6a7a', extra: '<path d="M22 44 Q32 34 42 44 L44 60 L20 60 Z" fill="#2a2a32" opacity="0.8"/>' }),
  npcTile('vendeur-livres', { body: '#4a3a2a', hair: '#6a6a6a', accent: '#a07a48', extra: '<rect x="38" y="60" width="10" height="13" fill="#7a3a2a" stroke="#1B1512" stroke-width="0.8"/>' }),
  npcTile('mecano', { body: '#4a4a52', hair: '#2a1a14', accent: '#d8a040', extra: '<circle cx="44" cy="66" r="4" fill="none" stroke="#9a9a9a" stroke-width="2"/>' }),
  npcTile('horlogere', { body: '#5a4a6a', hair: '#3a2a1c', accent: '#e8d070', extra: '<circle cx="40" cy="64" r="3.5" fill="#e8d070" stroke="#1B1512" stroke-width="0.8"/>' }),
  npcTile('employe', { body: '#b8b8b4', hair: '#3a3a3a', accent: '#6a6a6a', extra: '<rect x="38" y="60" width="9" height="11" fill="#efe6cf" stroke="#1B1512" stroke-width="0.8"/>' }),
  npcTile('pelerin', { body: '#8a7a5a', hair: '#5a3a2a', skin: '#b88a6a', accent: '#efe6cf', extra: '<path d="M46 38 L46 82" stroke="#6a4a2a" stroke-width="2.5"/>' }),
  npcTile('changeur', { body: '#6a3a5a', hair: '#1a1410', skin: '#a87a5a', accent: '#e8c84a', extra: '<circle cx="42" cy="68" r="3" fill="#e8c84a"/><circle cx="46" cy="66" r="2.5" fill="#c9804f"/>' }),
  npcTile('fruitiere', { body: '#8a5a3a', hair: '#2a1a10', skin: '#8a5a3c', accent: '#e8d8a0', extra: '<ellipse cx="44" cy="70" rx="7" ry="4" fill="#a07a48" stroke="#1B1512" stroke-width="0.8"/><circle cx="42" cy="67" r="2" fill="#d8b040"/><circle cx="46" cy="67" r="2" fill="#7fbf6a"/>' }),
  npcTile('guide', { body: '#3a6a8a', hair: '#e8d8a0', accent: '#e8e0c8', extra: '<path d="M44 52 L50 40 L54 44 Z" fill="#d8504a"/>' }),
  npcTile('chroniqueur', { body: '#1f1b2a', hair: '#bdb6aa', accent: '#5a4a8a', extra: '<path d="M44 58 L48 50" stroke="#efe6cf" stroke-width="1.5"/>' }),
  npcTile('etudiante', { body: '#4a3a5a', hair: '#8a4a2a', accent: '#d8c8e8', extra: '<rect x="38" y="62" width="9" height="7" fill="#7a5a3a" stroke="#1B1512" stroke-width="0.8"/>' }),
);

// Aetherhaven, la cité flottante (chapitre 5, docs/univers/lieux/aetherhaven.md) : provisoire. Canon [NOTION] : des
// îles portées par les cristaux azur, des ponts suspendus, du bois, du cristal et du tissu, bleu ciel, blanc argent,
// or pâle ; dessous, une mer de nuages. Ajoutées en dernier, pour ne décaler aucune tuile.
const cloudSea =
  diamond('#d9e3ea', 'rgba(60,80,100,0.12)') +
  '<circle cx="20" cy="80" r="7" fill="#eef3f6"/><circle cx="38" cy="84" r="8" fill="#e6edf2"/>' +
  '<circle cx="31" cy="74" r="6" fill="#f6f9fb"/><circle cx="48" cy="79" r="4" fill="#c9d6e0" opacity="0.8"/>' +
  '<circle cx="14" cy="86" r="3" fill="#c9d6e0" opacity="0.7"/>';
const ropes = (a, b) => `<path d="${a}" stroke="#7a6a52" stroke-width="1.2" fill="none"/><path d="${b}" stroke="#7a6a52" stroke-width="1.2" fill="none"/>`;
const skyHouse = (wall, sail, stripe) =>
  diamond('#c4c8b0') +
  shadow(22, 8) +
  `<path d="M10 84 L10 50 L54 50 L54 84 L32 94 Z" fill="${wall}" stroke="${INK}" stroke-width="1.2"/>` +
  `<path d="M6 52 L32 12 L58 52 Z" fill="${sail}" stroke="${INK}" stroke-width="1.2"/>` +
  `<path d="M19 36 L45 36" stroke="${stripe}" stroke-width="3"/>` +
  `<path d="M32 12 L32 4 L40 7 L32 10" fill="${stripe}" stroke="${INK}" stroke-width="0.8"/>` +
  `<path d="M27 92 L27 70 Q32 64 37 70 L37 90 Z" fill="${COPPER}" stroke="${INK}" stroke-width="1"/>` +
  '<path d="M14 60 L22 60 L22 68 L14 68 Z M42 60 L50 60 L50 68 L42 68 Z" fill="#bfe6ff" stroke="#1B1512" stroke-width="0.8"/>';
TILES.push(
  { name: 'nuages', blocking: true, svg: cloudSea },
  {
    name: 'ilot',
    svg:
      diamond('#c4c8b0') +
      '<path d="M14 80 Q22 76 30 80 M36 86 Q42 83 48 86 M30 72 Q36 69 42 72" stroke="#a3a88e" stroke-width="1.3" fill="none"/>' +
      '<circle cx="22" cy="86" r="1.4" fill="#e2cf8a"/>',
  },
  {
    // Le long des colonnes (vers le bas à droite à l'écran), deux cordes de garde.
    name: 'pont-ciel-c',
    svg:
      cloudSea +
      '<path d="M8 76 L40 92 L56 84 L24 68 Z" fill="#d2b88a" stroke="#5a4634" stroke-width="1"/>' +
      '<path d="M14 78 L22 74 M24 83 L32 79 M34 88 L42 84" stroke="#8a6a48" stroke-width="1.2"/>' +
      ropes('M6 70 Q22 80 38 86', 'M26 62 Q42 72 58 78'),
  },
  {
    name: 'pont-ciel-r',
    svg:
      cloudSea +
      '<path d="M56 76 L24 92 L8 84 L40 68 Z" fill="#d2b88a" stroke="#5a4634" stroke-width="1"/>' +
      '<path d="M50 78 L42 74 M40 83 L32 79 M30 88 L22 84" stroke="#8a6a48" stroke-width="1.2"/>' +
      ropes('M58 70 Q42 80 26 86', 'M38 62 Q22 72 6 78'),
  },
  { name: 'dalles-azur', svg: diamond('#c9d2d8') + '<path d="M16 72 L48 88 M48 72 L16 88" stroke="#a8b4bc" stroke-width="1.2"/><circle cx="32" cy="80" r="1.6" fill="#e2cf8a"/>' },
  {
    // Un mât d'amarrage : on y attache les dirigeables.
    name: 'mat-amarrage',
    blocking: true,
    svg:
      diamond('#c4c8b0') +
      shadow(10, 4) +
      '<rect x="29" y="14" width="6" height="70" fill="#8a6a48" stroke="#1B1512" stroke-width="0.8"/>' +
      '<path d="M20 22 L44 22" stroke="#5a4634" stroke-width="3"/>' +
      `<circle cx="32" cy="12" r="4" fill="${COPPER}" stroke="${INK}" stroke-width="0.8"/>` +
      '<path d="M44 22 Q54 40 50 60" stroke="#7a6a52" stroke-width="1.2" fill="none"/>',
  },
  {
    // Un dirigeable amarré : la nacelle sur le quai, l'enveloppe au-dessus.
    name: 'dirigeable',
    blocking: true,
    cover: 4,
    svg:
      diamond('#c4c8b0') +
      shadow(22, 7) +
      '<ellipse cx="32" cy="24" rx="30" ry="15" fill="#e8eef2" stroke="#1B1512" stroke-width="1.2"/>' +
      '<path d="M4 24 Q32 14 60 24 M8 30 Q32 22 56 30" stroke="#9fb4c4" stroke-width="1.2" fill="none"/>' +
      '<path d="M2 18 L-2 10 L8 16 Z M2 30 L-2 38 L8 32 Z" fill="#6ab4e0" stroke="#1B1512" stroke-width="0.8"/>' +
      '<path d="M18 38 L20 62 M46 38 L44 62 M32 39 L32 62" stroke="#7a6a52" stroke-width="1.2"/>' +
      `<path d="M14 62 L50 62 L46 80 L18 80 Z" fill="#c8a878" stroke="${INK}" stroke-width="1.2"/>` +
      '<path d="M20 66 L26 66 L26 72 L20 72 Z M30 66 L36 66 L36 72 L30 72 Z M40 66 L46 66 L46 72 L40 72 Z" fill="#bfe6ff"/>' +
      '<path d="M34 46 L38 52 L34 58 L30 52 Z" fill="#6ab4e0" stroke="#1B1512" stroke-width="0.8"/>',
  },
  { name: 'maison-voile', blocking: true, cover: 4, svg: skyHouse('#e8dcc4', '#f4f7f9', '#6ab4e0') },
  {
    // La maison-moulin Plume-Vive : une tour de bois et quatre ailes de toile.
    name: 'moulin',
    blocking: true,
    cover: 4,
    svg:
      diamond('#c4c8b0') +
      shadow(18, 7) +
      `<path d="M18 86 L22 34 L42 34 L46 86 Z" fill="#c8a878" stroke="${INK}" stroke-width="1.2"/>` +
      `<path d="M18 36 L32 22 L46 36 Z" fill="#a07a48" stroke="${INK}" stroke-width="1"/>` +
      '<path d="M32 30 L8 10 L12 6 Z M32 30 L56 10 L52 6 Z M32 30 L10 52 L6 48 Z M32 30 L54 52 L58 48 Z" fill="#f4f7f9" stroke="#1B1512" stroke-width="0.8"/>' +
      `<circle cx="32" cy="30" r="3" fill="${COPPER}"/>` +
      `<path d="M27 86 L27 70 Q32 64 37 70 L37 86 Z" fill="${COPPER}" stroke="${INK}" stroke-width="1"/>`,
  },
  {
    // La Tour des Vents [NOTION] : une spirale de cristal bleu (ici, son pied et sa pointe).
    name: 'tour-vents',
    blocking: true,
    cover: 4,
    svg:
      diamond('#c9d2d8') +
      shadow(20, 7) +
      '<path d="M16 88 L24 4 L40 4 L48 88 Z" fill="#6ab4e0" stroke="#1B1512" stroke-width="1.2" opacity="0.92"/>' +
      '<path d="M18 80 Q32 70 46 76 M20 62 Q32 52 44 58 M22 44 Q32 34 42 40 M23 26 Q32 18 41 22" stroke="#e8f6ff" stroke-width="2" fill="none"/>' +
      '<path d="M24 4 L32 -6 L40 4 Z" fill="#bfe6ff" stroke="#1B1512" stroke-width="1"/>' +
      `<path d="M27 88 L27 72 Q32 66 37 72 L37 88 Z" fill="#e2cf8a" stroke="${INK}" stroke-width="1"/>`,
  },
  {
    // Le Temple du Grand Courant : un dôme ouvert, des rubans dans le vent.
    name: 'temple-vent',
    blocking: true,
    cover: 4,
    svg:
      diamond('#c9d2d8') +
      shadow(24, 8) +
      `<path d="M8 84 L8 52 L56 52 L56 84 L32 94 Z" fill="#eef2f4" stroke="${INK}" stroke-width="1.2"/>` +
      `<path d="M8 52 Q32 10 56 52 Z" fill="#dfe8ee" stroke="${INK}" stroke-width="1.2"/>` +
      '<path d="M16 84 L16 60 Q20 56 24 60 L24 86 M40 86 L40 60 Q44 56 48 60 L48 84" stroke="#9fb4c4" stroke-width="1.5" fill="#bfe6ff"/>' +
      '<path d="M32 18 Q44 10 52 16 M32 22 Q42 20 48 26" stroke="#6ab4e0" stroke-width="2" fill="none"/>' +
      `<path d="M27 92 L27 70 L37 70 L37 90 Z" fill="${COPPER}" stroke="${INK}" stroke-width="1"/>`,
  },
  {
    // Un cristal azur sur un poteau : il flotte un peu, et chante par vent fort [NOTION].
    name: 'cristal-azur',
    blocking: true,
    svg:
      diamond('#c4c8b0') +
      '<rect x="30" y="44" width="4" height="40" fill="#8a6a48"/>' +
      '<circle cx="32" cy="28" r="14" fill="#6ab4e0" opacity="0.2"/>' +
      '<path d="M32 14 L38 28 L32 40 L26 28 Z" fill="#9fd4f0" stroke="#2a5a7a" stroke-width="1.5"/>',
  },
  {
    name: 'jardin-suspendu',
    blocking: true,
    cover: 2,
    svg:
      diamond('#c4c8b0') +
      shadow(16, 5) +
      '<path d="M14 64 L50 64 L46 82 L18 82 Z" fill="#a07a48" stroke="#1B1512" stroke-width="1"/>' +
      '<circle cx="22" cy="58" r="7" fill="#7fae5a"/><circle cx="34" cy="54" r="8" fill="#8fbe6a"/><circle cx="44" cy="60" r="6" fill="#6f9e4a"/>' +
      '<path d="M18 82 Q16 90 20 94 M30 82 Q30 90 28 94 M44 82 Q46 88 44 92" stroke="#6f9e4a" stroke-width="2" fill="none"/>' +
      '<circle cx="30" cy="52" r="1.6" fill="#e2cf8a"/><circle cx="40" cy="58" r="1.6" fill="#f4f7f9"/>',
  },
  {
    // Le garde-fou au bord d'une île : on s'y accoude pour regarder les nuages, on n'y passe pas.
    name: 'garde-fou',
    blocking: true,
    svg:
      diamond('#c4c8b0') +
      '<path d="M10 78 L10 60 M32 90 L32 72 M54 78 L54 60" stroke="#8a6a48" stroke-width="3"/>' +
      '<path d="M8 62 L32 74 L56 62" stroke="#a07a48" stroke-width="3" fill="none"/>',
  },
  {
    // Une voile accrochée au garde-fou du Lâcher : un tissu couvert d'écriture.
    name: 'voile-accrochee',
    svg:
      '<path d="M10 78 L10 60 M32 90 L32 72 M54 78 L54 60" stroke="#8a6a48" stroke-width="3"/>' +
      '<path d="M8 62 L32 74 L56 62" stroke="#a07a48" stroke-width="3" fill="none"/>' +
      '<path d="M36 70 Q46 58 58 54 Q54 66 60 74 Q48 74 38 82 Z" fill="#f4efe2" stroke="#1B1512" stroke-width="0.8"/>' +
      '<path d="M42 70 L54 62 M43 74 L55 67 M45 77 L54 72" stroke="#5a5048" stroke-width="0.9"/>',
  },
  {
    // Une voile qui passe dans le vent : on l'attrape d'un clic.
    name: 'voile',
    svg:
      '<ellipse cx="32" cy="86" rx="9" ry="3" fill="rgba(0,0,0,0.18)"/>' +
      '<path d="M18 52 Q30 42 46 46 Q42 58 50 66 Q34 64 22 70 Q26 60 18 52 Z" fill="#f8f4ea" stroke="#1B1512" stroke-width="0.9"/>' +
      '<path d="M24 54 L40 50 M25 58 L42 55 M26 62 L42 60" stroke="#5a5048" stroke-width="0.9"/>' +
      '<path d="M46 46 Q54 40 58 44 M22 70 Q14 76 10 72" stroke="#6ab4e0" stroke-width="1.2" fill="none"/>',
  },
  {
    // Le filet d'un attrapeur de voiles, sur sa perche.
    name: 'filet',
    blocking: true,
    svg:
      diamond('#c4c8b0') +
      '<path d="M30 86 L34 20" stroke="#8a6a48" stroke-width="3"/>' +
      '<path d="M34 20 Q50 22 52 40 Q44 50 34 44 Z" fill="none" stroke="#5a4634" stroke-width="1.2"/>' +
      '<path d="M38 24 L40 46 M44 26 L46 46 M34 32 L52 34 M35 38 L50 42" stroke="#5a4634" stroke-width="0.8"/>',
  },
  {
    // La caisse de Zephyria, ouverte : un rouleau de tissu en sort, couvert des mêmes noms.
    name: 'caisse-ouverte',
    blocking: true,
    cover: 2,
    svg:
      diamond('#4e4945') +
      shadow(20, 7) +
      '<path d="M12 66 L32 56 L52 66 L52 84 L32 94 L12 84 Z" fill="#5a4a3a" stroke="#1B1512" stroke-width="1.2"/>' +
      '<path d="M12 66 L32 76 L52 66 M32 76 L32 94" stroke="#1B1512" stroke-width="1"/>' +
      '<path d="M16 64 L30 50 L36 52 L24 66" fill="#3a3028" stroke="#1B1512" stroke-width="0.8"/>' +
      '<path d="M36 72 Q48 70 54 60 Q58 50 52 44 Q46 52 40 54 Q42 64 36 72 Z" fill="#f4efe2" stroke="#1B1512" stroke-width="0.8"/>' +
      '<path d="M44 56 L52 50 M42 62 L52 56" stroke="#5a5048" stroke-width="0.9"/>' +
      '<rect x="20" y="78" width="6" height="4" fill="#8a8a94" stroke="#1B1512" stroke-width="0.6"/>',
  },
  {
    // Une machine volante légère : un cadre de bois, une toile, deux cristaux.
    name: 'machine-volante',
    blocking: true,
    cover: 2,
    svg:
      diamond('#c4c8b0') +
      shadow(22, 6) +
      '<path d="M6 46 L32 30 L58 46 L32 54 Z" fill="#f4f7f9" stroke="#1B1512" stroke-width="1"/>' +
      '<path d="M32 30 L32 54 M18 38 L46 50" stroke="#8a6a48" stroke-width="1.5"/>' +
      '<path d="M20 56 L44 56 L40 76 L24 76 Z" fill="#c8a878" stroke="#1B1512" stroke-width="1"/>' +
      '<path d="M22 54 L26 46 M42 54 L38 46 M24 76 L22 84 M40 76 L42 84" stroke="#8a6a48" stroke-width="1.5"/>' +
      '<path d="M14 58 L18 64 L14 70 L10 64 Z M50 58 L54 64 L50 70 L46 64 Z" fill="#9fd4f0" stroke="#2a5a7a" stroke-width="1"/>',
  },
  {
    // La vigie du Quai : une petite tour de guet, une corde à oiseaux.
    name: 'vigie',
    blocking: true,
    cover: 4,
    svg:
      diamond('#c4c8b0') +
      shadow(14, 5) +
      '<path d="M20 86 L24 30 M44 86 L40 30 M22 60 L42 60 M23 44 L41 44" stroke="#8a6a48" stroke-width="3"/>' +
      `<path d="M16 30 L48 30 L44 18 L20 18 Z" fill="#c8a878" stroke="${INK}" stroke-width="1"/>` +
      '<path d="M14 18 L32 4 L50 18 Z" fill="#f4f7f9" stroke="#1B1512" stroke-width="1"/>' +
      '<path d="M48 24 Q56 26 58 34" stroke="#7a6a52" stroke-width="1" fill="none"/><path d="M56 34 l4 -2 l-1 4 Z" fill="#3a4a5a"/>',
  },
  {
    // L'arche du Quai : deux poteaux, une traverse, des rubans de vent.
    name: 'arche-vent',
    blocking: true,
    svg:
      diamond('#c4c8b0') +
      shadow(24, 6) +
      '<path d="M10 86 L10 26 M54 86 L54 26" stroke="#8a6a48" stroke-width="5"/>' +
      `<path d="M4 26 Q32 10 60 26 L60 32 Q32 16 4 32 Z" fill="#c8a878" stroke="${INK}" stroke-width="1"/>` +
      '<path d="M18 26 Q16 40 22 48 M32 20 Q30 36 36 44 M46 26 Q44 40 50 46" stroke="#6ab4e0" stroke-width="2.5" fill="none"/>' +
      '<path d="M24 24 Q22 34 26 40 M40 22 Q38 32 42 38" stroke="#f4f7f9" stroke-width="2" fill="none"/>',
  },
  {
    // Une échelle de corde qui pend des nuages, au pays d'en bas : on remonte par là.
    name: 'echelle-corde',
    blocking: true,
    svg:
      diamond('#4e4945') +
      '<path d="M24 -4 L24 86 M40 -4 L40 86" stroke="#8a6a48" stroke-width="2"/>' +
      '<path d="M24 10 L40 10 M24 24 L40 24 M24 38 L40 38 M24 52 L40 52 M24 66 L40 66 M24 80 L40 80" stroke="#a07a48" stroke-width="2.5"/>' +
      '<ellipse cx="32" cy="2" rx="22" ry="6" fill="#d9e3ea" opacity="0.9"/>',
  },
);

// Les habitants d'Aetherhaven (provisoires). Canon [NOTION, Zephyria — Races & peuples] : les Aériens ont la peau pâle,
// bleu ciel ou crème, des cheveux qui flottent ; les Sylphes sont faits de vent et de lumière ; les Chasseurs d'Orage
// luisent un peu de turquoise ; les humains portent des vêtements légers.
const floatingHair = (color) => `<path d="M24 40 Q18 30 22 24 M32 37 Q32 26 36 22 M40 40 Q46 30 44 24" stroke="${color}" stroke-width="2" fill="none"/>`;
TILES.push(
  // Ossiane Vire-Nuée, capitaine, Aérienne : veste de pilote bleu nuit, galons d'or pâle, lunettes de vent.
  npcTile('ossiane', { body: '#2a3a5a', hair: '#e8eef2', skin: '#d8e4ec', accent: '#e2cf8a', extra: floatingHair('#e8eef2') + '<path d="M25 46 L39 46" stroke="#6ab4e0" stroke-width="3"/>' }),
  // Siffrin Plume-Vive, douze ans, guetteur : une hirondelle sur l'épaule.
  npcTile('siffrin', { small: true, body: '#6ab4e0', hair: '#c8a060', skin: '#e8d8c8', accent: '#f4f7f9', extra: '<path d="M40 50 l8 -4 l-2 5 l5 1 l-7 2 Z" fill="#3a4a5a"/>' }),
  // Zélie Chantebrise, aéroprêtresse du Grand Courant : robe blanche, rubans bleus.
  npcTile('zelie', { body: '#eef2f4', hair: '#e2cf8a', skin: '#e8dcd0', accent: '#6ab4e0', extra: '<path d="M20 60 Q14 70 18 80 M44 60 Q50 70 46 80" stroke="#6ab4e0" stroke-width="2" fill="none"/>' }),
  // Vessin Clairvol, voilier, humain : tablier de toile, une aiguille, du fil.
  npcTile('vessin', { body: '#8a7a5a', hair: '#5a3a24', accent: '#f4f7f9', extra: '<rect x="24" y="62" width="16" height="16" fill="#e8dcc4" stroke="#1B1512" stroke-width="0.8"/>' }),
  // Assel Nuée-Douce, aubergiste : châle crème, une théière.
  npcTile('assel', { body: '#d8c8a8', hair: '#8a8a94', skin: '#d8e4ec', accent: '#6ab4e0', extra: '<ellipse cx="45" cy="68" rx="5" ry="4" fill="#9fb4c4" stroke="#1B1512" stroke-width="0.8"/>' }),
  // Shass, une Sylphe : du vent et de la lumière, à demi là.
  { name: 'shass', sprite: true, svg: '<g opacity="0.72">' + person({ body: '#bfe6ff', hair: '#f4f7f9', skin: '#e8f6ff', accent: '#ffffff' }) + '</g><circle cx="32" cy="58" r="22" fill="#bfe6ff" opacity="0.18"/>' },
  // Ysolde Cent-Plis, greffière du Registre des Voiles : des tissus pliés sous le bras.
  npcTile('ysolde', { body: '#5a6a7a', hair: '#e8eef2', skin: '#d8e4ec', accent: '#e2cf8a', extra: floatingHair('#e8eef2') + '<rect x="38" y="58" width="11" height="9" fill="#f4efe2" stroke="#1B1512" stroke-width="0.8"/>' }),
  // Ravel Sans-Fil, des Ailes Noires : cuir noir, un seul cristal au cou.
  npcTile('ravel', { body: '#1f1f26', hair: '#2a2420', skin: '#d8dcd0', accent: '#6ab4e0', extra: '<path d="M32 58 L35 63 L32 68 L29 63 Z" fill="#9fd4f0" stroke="#1B1512" stroke-width="0.6"/>' }),
  // Évrard Tiédevent, aéromancien venu de Cumulus : manteau gris perle, carnet de mesures.
  npcTile('evrard', { body: '#8a94a0', hair: '#c8c8c8', skin: '#d8e4ec', accent: '#2a5a7a', extra: '<rect x="38" y="60" width="9" height="11" fill="#efe6cf" stroke="#1B1512" stroke-width="0.8"/>' }),
  // Céleste Fend-l'Air, dix-sept ans, apprentie des Ailes Noires : cuir noir, écharpe bleue au vent.
  npcTile('celeste', { body: '#2a2a32', hair: '#e8d8b0', skin: '#e8dcd0', accent: '#6ab4e0', extra: '<path d="M26 52 Q16 50 10 56" stroke="#6ab4e0" stroke-width="3" fill="none"/>' }),
  // Odile, sa mère : laine crème, mains jointes.
  npcTile('odile', { body: '#d8c8a8', hair: '#a8a29a', skin: '#e8dcd0', accent: '#8a7a5a' }),
  // Holger Brandt, archiviste de Ferros en fuite : manteau d'encre râpé, une sacoche serrée.
  npcTile('holger', { body: '#3a3238', hair: '#5a4a3a', accent: '#8a6a48', extra: '<rect x="38" y="62" width="10" height="10" fill="#5a3e2a" stroke="#1B1512" stroke-width="0.8"/>' }),
  // Bastien Basse-Corniche, descendant d'une vigie : vieux, une longue-vue.
  npcTile('bastien', { body: '#5a6a5a', hair: '#e0dcd4', skin: '#d8c8b8', accent: '#e2cf8a', extra: '<path d="M44 50 L54 44" stroke="#c9804f" stroke-width="3"/>' }),
  // Un Gardien du Ciel, Chasseur d'Orage : brassard turquoise, une lueur sur la peau.
  npcTile('gardien-ciel', { body: '#2a4a5a', hair: '#1a2a32', skin: '#b8dcd8', accent: '#3ae0d0', extra: '<circle cx="32" cy="48" r="11" fill="#3ae0d0" opacity="0.12"/>' }),
);

// Les bêtes et les gens d'armes d'en bas (chapitre 5). Canon [NOTION, Zephyria — Races & peuples] : les Mantes-ailes,
// « insectes prédateurs gigantesques, ailes tranchantes ». Les Ailes Noires à gages : cuir noir, un seul cristal.
TILES.push(
  {
    name: 'mante-ailes',
    sprite: true,
    svg:
      shadow(18, 5) +
      '<path d="M22 84 L26 64 M42 84 L38 64 M28 84 L30 66 M36 84 L34 66" stroke="#5a6a3a" stroke-width="2"/>' +
      '<ellipse cx="32" cy="60" rx="8" ry="12" fill="#7a8a4a" stroke="#1B1512" stroke-width="1"/>' +
      '<path d="M32 50 L12 26 L22 52 Z M32 50 L52 26 L42 52 Z" fill="#c8d0d8" stroke="#1B1512" stroke-width="1" opacity="0.9"/>' +
      '<path d="M14 28 L22 50 M50 28 L42 50" stroke="#ffffff" stroke-width="1.2" opacity="0.8"/>' +
      '<path d="M28 42 Q22 34 18 40 M36 42 Q42 34 46 40" stroke="#5a6a3a" stroke-width="2.5" fill="none"/>' +
      '<path d="M26 36 L32 30 L38 36 L32 44 Z" fill="#8a9a5a" stroke="#1B1512" stroke-width="1"/>' +
      '<circle cx="29" cy="35" r="1.6" fill="#d8504a"/><circle cx="35" cy="35" r="1.6" fill="#d8504a"/>',
  },
  npcTile('aile-noire', { body: '#1f1f26', hair: '#3a2a1c', skin: '#c8b8a8', accent: '#6ab4e0', extra: '<path d="M22 50 L42 50" stroke="#2a2a32" stroke-width="5"/><path d="M46 56 L52 76" stroke="#a8a29a" stroke-width="2.5"/>' }),
);

// La dame en gris, en bas, à la Halte des Cendres (chapitre 5) : la même, la cendre en plus sur le manteau.
TILES.push(npcTile('edda-halte', { body: '#6a6a70', hair: '#1a1614', skin: '#d9b8a0', accent: '#3a3a40', extra: '<path d="M22 70 L26 76 M38 66 L42 72 M30 78 L34 82" stroke="#9a948e" stroke-width="2"/>' }));

// Le bord d'où l'on saute vers un autre îlot (Athlétisme) : deux traits de vent et une flèche, à la craie.
TILES.push({
  name: 'saut',
  svg:
    '<path d="M18 84 Q32 76 46 84" stroke="#f4f7f9" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/>' +
    '<path d="M24 76 L40 70 M36 66 L42 70 L36 74" stroke="#6ab4e0" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
    '<path d="M20 70 Q26 66 30 68 M38 60 Q44 58 48 62" stroke="#f4f7f9" stroke-width="1.5" fill="none" opacity="0.8"/>',
});
