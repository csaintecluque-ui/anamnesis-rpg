// Builds the Tiled (JSON, isometric) maps from readable layout code.
// The output files in src/data/maps/ are the game data and can be opened and edited in Tiled.
// Usage: npm run maps
import { writeFileSync } from 'node:fs';
import { COLUMNS, H, TILES, W } from './tiles-def.mjs';

const TILE_W = 64;
const TILE_H = 32;

const gid = (name) => {
  const index = TILES.findIndex((t) => t.name === name);
  if (index < 0) throw new Error(`Unknown tile ${name}`);
  return index + 1;
};

/** Deterministic RNG so the map does not change between builds. */
function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

class MapBuilder {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.ground = new Array(width * height).fill(gid('herbe'));
    this.obstacles = new Array(width * height).fill(0);
    this.objects = [];
  }
  inside(col, row) {
    return col >= 0 && row >= 0 && col < this.width && row < this.height;
  }
  setGround(col, row, name) {
    if (this.inside(col, row)) this.ground[row * this.width + col] = gid(name);
  }
  setObstacle(col, row, name) {
    if (this.inside(col, row)) this.obstacles[row * this.width + col] = name ? gid(name) : 0;
  }
  groundAt(col, row) {
    return this.ground[row * this.width + col];
  }
  obstacleAt(col, row) {
    return this.obstacles[row * this.width + col];
  }
  line(from, to, name) {
    const [c0, r0] = from;
    const [c1, r1] = to;
    const steps = Math.max(Math.abs(c1 - c0), Math.abs(r1 - r0));
    for (let i = 0; i <= steps; i++) {
      const col = Math.round(c0 + ((c1 - c0) * i) / steps);
      const row = Math.round(r0 + ((r1 - r0) * i) / steps);
      this.setGround(col, row, name);
      this.setObstacle(col, row, null);
    }
  }
  rect(c0, r0, c1, r1, name) {
    for (let row = r0; row <= r1; row++) for (let col = c0; col <= c1; col++) this.setGround(col, row, name);
  }
  object(name, type, col, row, properties = {}) {
    this.objects.push({ name, type, col, row, properties });
  }
  toTiled() {
    let nextId = 1;
    const tileLayer = (name, data) => ({
      id: nextId++,
      name,
      type: 'tilelayer',
      visible: true,
      opacity: 1,
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      data,
    });
    const layers = [tileLayer('sol', this.ground), tileLayer('obstacles', this.obstacles)];
    let objectId = 1;
    layers.push({
      id: nextId++,
      name: 'objets',
      type: 'objectgroup',
      draworder: 'topdown',
      visible: true,
      opacity: 1,
      x: 0,
      y: 0,
      objects: this.objects.map((o) => ({
        id: objectId++,
        name: o.name,
        type: o.type,
        // Tiled stores isometric object positions in tile-height units along each axis.
        x: (o.col + 0.5) * TILE_H,
        y: (o.row + 0.5) * TILE_H,
        width: 0,
        height: 0,
        point: true,
        rotation: 0,
        visible: true,
        properties: Object.entries(o.properties).map(([name, value]) => ({ name, type: 'string', value })),
      })),
    });
    const rows = Math.ceil(TILES.length / COLUMNS);
    return {
      type: 'map',
      version: '1.10',
      tiledversion: '1.11.2',
      orientation: 'isometric',
      renderorder: 'right-down',
      infinite: false,
      compressionlevel: -1,
      width: this.width,
      height: this.height,
      tilewidth: TILE_W,
      tileheight: TILE_H,
      nextlayerid: nextId,
      nextobjectid: objectId,
      layers,
      tilesets: [
        {
          firstgid: 1,
          name: 'tiles',
          // Relative to src/data/maps/, so Tiled can display the sheet.
          image: '../../../public/tiles/tiles.png',
          imagewidth: COLUMNS * W,
          imageheight: rows * H,
          tilewidth: W,
          tileheight: H,
          columns: COLUMNS,
          tilecount: TILES.length,
          margin: 0,
          spacing: 0,
          tiles: TILES.map((t, id) => ({
            id,
            properties: [
              { name: 'nom', type: 'string', value: t.name },
              { name: 'bloquant', type: 'bool', value: !!t.blocking },
              { name: 'couverture', type: 'int', value: t.cover ?? 0 },
              { name: 'grand', type: 'bool', value: !!t.big },
            ],
          })),
        },
      ],
    };
  }
}

/**
 * Variety on a plain grass cell, from a roll in [0, 1): grass variants, darker grass, flowers, small decor
 * (ferns and mushrooms can be walked through, bushes and stumps block). Fighting repetition (docs/gdd/jalon-2.md).
 */
function groundVariety(m, col, row, roll, { flowers }) {
  const table = [
    [0.08, () => m.setGround(col, row, 'herbe-sombre')],
    [flowers ? 0.05 : 0, () => m.setGround(col, row, 'fleurs')],
    [0.22, () => m.setGround(col, row, 'herbe-2')],
    [0.22, () => m.setGround(col, row, 'herbe-3')],
    [0.04, () => m.setObstacle(col, row, 'fougeres')],
    [0.02, () => m.setObstacle(col, row, 'champignons')],
    [0.025, () => m.setObstacle(col, row, 'buisson')],
    [0.015, () => m.setObstacle(col, row, 'souche')],
  ];
  let edge = 0;
  for (const [share, apply] of table) {
    edge += share;
    if (roll < edge) return apply();
  }
}

// --- Gardebois, Marché des Lisières (docs/univers/lieux/gardebois.md, validé)
function gardebois() {
  const m = new MapBuilder(28, 24);
  const rng = mulberry32(3000);

  // Forest border, with an opening at the entrance (west) and the exit to the Gare (east).
  for (let col = 0; col < m.width; col++) {
    m.setObstacle(col, 0, 'arbre');
    m.setObstacle(col, m.height - 1, 'arbre');
  }
  for (let row = 0; row < m.height; row++) {
    m.setObstacle(0, row, 'arbre');
    m.setObstacle(m.width - 1, row, 'arbre');
  }

  // Market square (planks) and its stalls.
  m.rect(11, 6, 18, 13, 'planches');
  for (const [c, r] of [[12, 7], [13, 7], [16, 7], [17, 7], [12, 12]]) m.setObstacle(c, r, 'etal');
  for (const [c, r] of [[18, 12], [17, 13], [18, 6]]) m.setObstacle(c, r, 'caisses');

  // Brook from north to south, crossed by a bridge on the main road.
  m.rect(20, 1, 21, 22, 'eau');

  // Main road: entrance (west) → down past the market → bridge → exit (east).
  m.line([0, 4], [9, 4], 'chemin');
  m.line([9, 4], [9, 18], 'chemin');
  m.line([9, 18], [27, 18], 'chemin');
  m.setGround(20, 18, 'pont');
  m.setGround(21, 18, 'pont');
  m.line([9, 9], [10, 9], 'chemin');
  m.line([10, 14], [14, 14], 'chemin');
  // Lane east of the brook, up to the houses.
  m.line([23, 18], [23, 6], 'chemin');
  // Lane to the lantern circle.
  m.line([6, 15], [8, 15], 'chemin');

  // Base of an Arbre-Titan: the upper city lives in the canopy, out of view.
  for (const [c, r] of [[3, 7], [4, 7], [3, 8], [4, 8]]) m.setObstacle(c, r, 'tronc-titan');

  // Houses on stilts (ground construction is only allowed outside sacred zones).
  for (const [c, r] of [[2, 11], [6, 10], [5, 2], [14, 3], [17, 3], [25, 5], [25, 10], [24, 14], [25, 21], [13, 21]]) {
    m.setObstacle(c, r, 'maison-pilotis');
  }

  // Lantern circle (Ilyane), plus lanterns along the road. None stands straight in front of her on screen (same
  // col − row, larger col + row): its post would hide her.
  for (const [c, r] of [[4, 14], [6, 14], [4, 16], [6, 17], [8, 6], [10, 11], [8, 17], [22, 7]]) {
    m.setObstacle(c, r, 'lanterne');
  }

  for (const [c, r] of [[15, 16], [3, 20], [25, 2], [11, 2]]) m.setObstacle(c, r, 'rocher');
  m.setObstacle(26, 17, 'panneau');
  m.setObstacle(1, 3, 'panneau');

  // Scattered trees and ground variety on plain grass only.
  const free = (c, r) => m.groundAt(c, r) === gid('herbe') && m.obstacleAt(c, r) === 0;
  // NPC spots, the entrance and the lantern circle stay free of random trees.
  // Jalon 2 (docs/univers/lieux/gardebois.md): houses one can enter, Liane, the herbs, the lost crate and its
  // guards, the Écho of the lullaby. Their cells and the cells in front of them stay clear of random trees.
  for (const [house, c, r, arrival] of [
    ['maison-ilyane', 2, 11, [3, 12]],
    ['auberge-racine', 6, 10, [7, 11]],
    ['maison-lunelierre', 24, 14, [24, 15]],
    ['reserve-cendrefer', 14, 3, [14, 4]],
  ]) {
    m.object(`porte-${house}`, 'porte', c, r, { cible: house, arrivee: 'entree', libelle: LOCATION_NAMES[house] });
    m.object(`devant-${house}`, 'arrivee', arrival[0], arrival[1]);
  }
  m.setObstacle(9, 22, 'sauge');
  m.object('sauge-1', 'objet', 9, 22, { disparaitSi: 'sauge-1-cueillie' });
  m.setObstacle(17, 21, 'sauge');
  m.object('sauge-2', 'objet', 17, 21, { disparaitSi: 'sauge-2-cueillie' });
  m.object('rocher-sauge', 'objet', 3, 20);
  m.setObstacle(24, 21, 'caisses');
  m.object('caisse-egaree', 'coffre', 24, 21, { disparaitSi: 'caisse-recuperee' });
  const rodeurs = { ennemi: 'rodeur-epine', disparaitSi: 'rodeurs-caisse-partis,rodeurs-caisse-vaincus', texte: 'Un Rôdeur-Épine monte la garde près de la caisse.' };
  m.object('rodeur-caisse-1', 'ennemi', 23, 22, rodeurs);
  m.object('rodeur-caisse-2', 'ennemi', 25, 22, rodeurs);
  m.setObstacle(5, 7, 'echo-berceuse');
  m.object('echo-berceuse', 'echo', 5, 7, { disparaitSi: 'berceuse-recueillie' });
  const keepClear = new Set([
    ...['5,15', '5,14', '5,16', '4,15', '1,4', '27,18', '14,8'],
    ...['3,12', '7,11', '24,15', '14,4', '19,12', '20,13', '10,22', '18,21', '23,22', '25,22', '24,22', '23,21', '25,21', '24,20', '6,8', '5,8', '6,7'],
  ]);
  for (let row = 1; row < m.height - 1; row++) {
    for (let col = 1; col < m.width - 1; col++) {
      if (!free(col, row) || keepClear.has(`${col},${row}`)) continue;
      const roll = rng();
      if (roll < 0.1) m.setObstacle(col, row, 'arbre');
      else groundVariety(m, col, row, (roll - 0.1) / 0.9, { flowers: true });
    }
  }

  m.object('entree', 'arrivee', 1, 4);
  m.object('vers-gare', 'sortie', 27, 18, { cible: 'gare-engloutie', arrivee: 'entree-gare', libelle: 'Vers la Gare Engloutie' });
  m.object('ilyane', 'pnj', 5, 15);
  m.object('tobias', 'pnj', 14, 8);
  m.object('liane', 'pnj', 19, 12);
  m.object('panneau-gare', 'panneau', 26, 17, { texte: 'Vers les Lisières Cultivées et la Gare Engloutie.' });
  m.object('panneau-entree', 'panneau', 1, 3, { texte: 'Gardebois — Marché des Lisières.' });
  return m.toTiled();
}

// --- La Gare Engloutie (docs/univers/lieux/gare-engloutie.md, à valider) ----
function gareEngloutie() {
  const m = new MapBuilder(24, 18);
  const rng = mulberry32(4100);

  // Forest border, with a single opening west, back towards Gardebois.
  for (let col = 0; col < m.width; col++) {
    m.setObstacle(col, 0, 'arbre');
    m.setObstacle(col, m.height - 1, 'arbre');
  }
  for (let row = 0; row < m.height; row++) {
    m.setObstacle(0, row, 'arbre');
    m.setObstacle(m.width - 1, row, 'arbre');
  }

  // The platform and the rail the dig crew followed in, with the derailed wagon astride it.
  m.rect(9, 7, 20, 11, 'quai');
  m.line([9, 9], [20, 9], 'rail');
  m.line([0, 9], [9, 9], 'chemin');

  m.setObstacle(14, 9, 'wagon');
  m.setObstacle(15, 9, 'wagon');
  // Beside the wagon, not behind it (it would hide the Écho).
  m.setObstacle(12, 8, 'echo');

  // Brisefer's dig, at the Faille.
  m.setObstacle(19, 8, 'foreuse');
  m.setObstacle(20, 9, 'faille');
  m.setObstacle(18, 11, 'tente');
  m.setObstacle(17, 11, 'caisses');

  m.setObstacle(2, 8, 'panneau');
  m.setObstacle(21, 13, 'golem');

  // Scattered trees and undergrowth on open ground only.
  const free = (c, r) => m.groundAt(c, r) === gid('herbe') && m.obstacleAt(c, r) === 0;
  for (let row = 1; row < m.height - 1; row++) {
    for (let col = 1; col < m.width - 1; col++) {
      if (!free(col, row)) continue;
      const roll = rng();
      if (roll < 0.14) m.setObstacle(col, row, 'arbre');
      else groundVariety(m, col, row, (roll - 0.14) / 0.86, { flowers: false });
    }
  }

  m.object('entree-gare', 'sortie', 0, 9, { cible: 'gardebois', arrivee: 'vers-gare', libelle: 'Vers Gardebois' });
  m.object('ingrid', 'pnj', 18, 10);
  m.object('echo-dernier-train', 'echo', 12, 8);
  m.object('golem-gare', 'golem', 21, 13);
  m.object('caisse-prospection', 'coffre', 17, 11);
  m.object('foreuse', 'foreuse', 19, 8);
  m.object('panneau-gare', 'panneau', 2, 8, {
    texte: 'Gare engloutie — la forêt a repris ce que les hommes avaient laissé.',
  });
  return m.toTiled();
}

// --- Intérieurs de Gardebois (jalon 2, docs/univers/lieux/gardebois.md) -------------------------------
// A room of w × h floor cells; walls on its two back sides (row 0, column 0), open in front like a cut-away; the
// doormat in the middle of the front edge leads back outside, in front of the house's door.
const LOCATION_NAMES = {
  'maison-ilyane': 'Maison d’Ilyane',
  'auberge-racine': 'Auberge de la Racine',
  'maison-lunelierre': 'Maison Lunelierre',
  'reserve-cendrefer': 'Réserve de l’étal Cendrefer',
};

function interior(id, { w = 7, h = 6, furniture = [], objects = [] }) {
  const m = new MapBuilder(w + 1, h + 1);
  m.ground.fill(0);
  for (let row = 0; row <= h; row++) {
    for (let col = 0; col <= w; col++) {
      if (row === 0 || col === 0) {
        m.setGround(col, row, 'parquet');
        m.setObstacle(col, row, 'mur');
      } else m.setGround(col, row, 'parquet');
    }
  }
  const door = Math.ceil(w / 2);
  m.setGround(door, h, 'seuil');
  for (const [c, r, name] of furniture) m.setObstacle(c, r, name);
  m.object('sortie', 'sortie', door, h, { cible: 'gardebois', arrivee: `devant-${id}`, libelle: 'Sortir' });
  m.object('entree', 'arrivee', door, h - 1);
  for (const [name, type, c, r, props] of objects) m.object(name, type, c, r, props ?? {});
  return m.toTiled();
}

const INTERIORS = {
  'maison-ilyane': interior('maison-ilyane', {
    furniture: [[2, 1, 'etagere'], [3, 1, 'etagere'], [6, 1, 'cheminee'], [4, 3, 'cristal-veille'], [1, 5, 'lit'], [6, 4, 'table']],
    objects: [['carnets-ilyane', 'objet', 2, 1], ['cristal-veille', 'objet', 4, 3]],
  }),
  'auberge-racine': interior('auberge-racine', {
    furniture: [[1, 1, 'tonneaux'], [1, 2, 'tonneaux'], [6, 1, 'cheminee'], [3, 3, 'comptoir'], [4, 3, 'comptoir'], [2, 5, 'table'], [6, 4, 'table']],
    objects: [['sylvan', 'pnj', 4, 2]],
  }),
  'maison-lunelierre': interior('maison-lunelierre', {
    furniture: [[1, 4, 'lit'], [3, 1, 'cheminee'], [6, 1, 'etagere'], [5, 4, 'table']],
    objects: [['maelis', 'pnj', 4, 2], ['nell', 'pnj', 2, 4]],
  }),
  'reserve-cendrefer': interior('reserve-cendrefer', {
    furniture: [[1, 1, 'caisses'], [2, 1, 'caisses'], [1, 2, 'caisses'], [6, 1, 'tonneaux'], [6, 2, 'tonneaux'], [4, 1, 'etagere']],
    objects: [['brann', 'pnj', 4, 3]],
  }),
};

const out = new URL('../src/data/maps/', import.meta.url);
writeFileSync(new URL('gardebois.json', out), JSON.stringify(gardebois(), null, 1) + '\n');
console.log('gardebois.json');
writeFileSync(new URL('gare-engloutie.json', out), JSON.stringify(gareEngloutie(), null, 1) + '\n');
console.log('gare-engloutie.json');
for (const [id, map] of Object.entries(INTERIORS)) {
  writeFileSync(new URL(`${id}.json`, out), JSON.stringify(map, null, 1) + '\n');
  console.log(`${id}.json`);
}
