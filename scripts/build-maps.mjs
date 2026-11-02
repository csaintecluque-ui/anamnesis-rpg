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
  // Carte du monde (docs/gdd/carte-du-monde.md) : la route de l'ouest quitte Gardebois.
  m.object('vers-monde', 'sortie', 0, 4, { cible: CARTE_DU_MONDE, libelle: 'Quitter Gardebois' });
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

/** Target of an exit or a door that opens the world map instead of another place (docs/gdd/carte-du-monde.md). */
const CARTE_DU_MONDE = 'carte-du-monde';

// --- Intérieurs de Gardebois (jalon 2, docs/univers/lieux/gardebois.md) -------------------------------
// A room of w × h floor cells; walls on its two back sides (row 0, column 0), open in front like a cut-away; the
// doormat in the middle of the front edge leads back outside, in front of the house's door.
const LOCATION_NAMES = {
  'maison-ilyane': 'Maison d’Ilyane',
  'auberge-racine': 'Auberge de la Racine',
  'maison-lunelierre': 'Maison Lunelierre',
  'reserve-cendrefer': 'Réserve de l’étal Cendrefer',
};

function interior(id, { w = 7, h = 6, outside = 'gardebois', furniture = [], objects = [] }) {
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
  m.object('sortie', 'sortie', door, h, { cible: outside, arrivee: `devant-${id}`, libelle: 'Sortir' });
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

// --- Canopéa, la cité des cimes (docs/univers/lieux/villes.md, validé ; visuels provisoires) ------------------
// Rien ne touche le sol : des plates-formes rondes autour des Arbres-Titans, reliées par des passerelles, au-dessus
// d'une mer de feuillage infranchissable. On passe d'un quartier à l'autre en nacelle ou par une longue passerelle.

/** A city in the canopy: leaves everywhere below, nothing walkable until platforms and bridges are laid. */
function canopy(width, height) {
  const m = new MapBuilder(width, height);
  m.ground.fill(gid('feuillage'));
  return m;
}

/** A round platform of radius r around (cc, cr). */
function platform(m, cc, cr, r) {
  for (let row = cr - r; row <= cr + r; row++) {
    for (let col = cc - r; col <= cc + r; col++) {
      if ((col - cc) ** 2 + (row - cr) ** 2 <= r * r + r - 1) m.setGround(col, row, 'plateforme');
    }
  }
}

/** A straight bridge along a row (planks drawn along the columns) or along a column. */
function bridge(m, [c0, r0], [c1, r1]) {
  if (r0 === r1) for (let col = Math.min(c0, c1); col <= Math.max(c0, c1); col++) m.setGround(col, r0, 'passerelle-c');
  else for (let row = Math.min(r0, r1); row <= Math.max(r0, r1); row++) m.setGround(c0, row, 'passerelle-r');
}

function titan(m, col, row) {
  for (const [c, r] of [[col, row], [col + 1, row], [col, row + 1], [col + 1, row + 1]]) m.setObstacle(c, r, 'tronc-titan');
}

/** A house one can enter: its tile, a door on it and the arrival cell in front of it. */
function house(m, id, tile, [col, row], [fc, fr], extra = {}) {
  m.setObstacle(col, row, tile);
  m.object(`porte-${id}`, 'porte', col, row, { cible: id, arrivee: 'entree', libelle: LOCATION_NAMES[id], ...extra });
  m.object(`devant-${id}`, 'arrivee', fc, fr);
}

// Quartier 1 : la Grande Nacelle (arrivée depuis la forêt, marché suspendu).
function canopeeNacelle() {
  const m = canopy(26, 22);
  platform(m, 4, 14, 3); // le débarcadère de la Grande Nacelle
  bridge(m, [8, 14], [9, 14]);
  platform(m, 15, 12, 5); // le marché suspendu
  bridge(m, [21, 12], [25, 12]); // la longue passerelle vers le Bosquet des Échos
  titan(m, 15, 11);

  m.setObstacle(1, 14, 'nacelle');
  m.object('grande-nacelle', 'porte', 1, 14, { cible: CARTE_DU_MONDE, libelle: 'Redescendre en forêt' });
  m.setObstacle(15, 8, 'nacelle');
  m.object('nacelle-ramures', 'porte', 15, 8, { cible: 'canopee-ramures', arrivee: 'nacelle-arrivee', libelle: 'Nacelle vers les Hautes Ramures' });
  m.object('devant-nacelle-ramures', 'arrivee', 16, 9);
  house(m, 'canopee-auberge', 'maison-cosse', [19, 9], [19, 10]);
  house(m, 'canopee-comptoir', 'maison-cosse', [12, 16], [13, 16]);
  for (const [c, r] of [[12, 10], [18, 14], [17, 16]]) m.setObstacle(c, r, 'etal');
  for (const [c, r] of [[10, 12], [20, 11], [14, 17], [6, 12]]) m.setObstacle(c, r, 'lanterne-verte');
  m.setObstacle(6, 16, 'panneau');

  m.object('entree', 'arrivee', 3, 14);
  m.object('depuis-aieux', 'arrivee', 24, 12);
  m.object('vers-aieux', 'sortie', 25, 12, { cible: 'canopee-aieux', arrivee: 'depuis-marche', libelle: 'Passerelle vers le Bosquet des Échos' });
  m.object('veline', 'pnj', 4, 12);
  m.object('malo', 'pnj', 13, 9);
  m.object('panneau-canopee', 'panneau', 6, 16, { texte: 'Canopéa — la Grande Nacelle. Ici, rien ne touche le sol.' });
  return m.toTiled();
}

// Quartier 2 : les Hautes Ramures (Conseil, demeures, ateliers, grenier).
function canopeeRamures() {
  const m = canopy(26, 20);
  platform(m, 10, 10, 6);
  bridge(m, [17, 8], [18, 8]);
  platform(m, 21, 8, 2); // la plate-forme du grenier
  titan(m, 10, 9);

  m.setObstacle(4, 10, 'nacelle');
  m.object('nacelle-marche', 'porte', 4, 10, { cible: 'canopee-nacelle', arrivee: 'devant-nacelle-ramures', libelle: 'Nacelle vers le marché' });
  m.object('nacelle-arrivee', 'arrivee', 5, 10);
  house(m, 'canopee-conseil', 'salle-conseil', [10, 5], [11, 6]);
  house(m, 'canopee-feuillevent', 'maison-cosse', [6, 14], [7, 14]);
  house(m, 'canopee-atelier', 'maison-cosse', [15, 13], [15, 14]);
  // Lieu fermé à clé (docs/gdd/villes.md) : on crochète la serrure avant d'entrer.
  house(m, 'canopee-grenier', 'grenier', [22, 8], [21, 9], { verrou: 'grenier-deverrouille', dialogue: 'porte-grenier' });
  for (const [c, r] of [[7, 7], [14, 7], [13, 16], [5, 12]]) m.setObstacle(c, r, 'lanterne-verte');
  m.setObstacle(6, 8, 'panneau');
  m.object('panneau-ramures', 'panneau', 6, 8, { texte: 'Les Hautes Ramures — ici siège le Conseil des Racines Profondes.' });
  return m.toTiled();
}

// Quartier 3 : le Bosquet des Échos, où l'on grave et où l'on parle à ses morts [NOTION] (relais des Gardiens).
function canopeeAieux() {
  const m = canopy(24, 20);
  bridge(m, [0, 10], [5, 10]);
  platform(m, 12, 10, 6);
  titan(m, 12, 9); // le grand arbre du sanctuaire de la Sève Éternelle
  for (const [c, r] of [[8, 6], [12, 5], [16, 6], [17, 10], [16, 14], [14, 16], [8, 14]]) m.setObstacle(c, r, 'arbre-souvenir');
  m.object('arbre-ancien', 'objet', 16, 6);
  m.object('arbre-anselme', 'objet', 8, 14);
  house(m, 'canopee-relais', 'maison-cosse', [10, 13], [11, 14]);
  for (const [c, r] of [[10, 8], [15, 8], [14, 12]]) m.setObstacle(c, r, 'lanterne-verte');
  m.setObstacle(7, 11, 'panneau');
  m.object('panneau-aieux', 'panneau', 7, 11, { texte: 'Le Bosquet des Échos. Ici, on grave, et l’on parle à ses morts : parle bas.' });
  m.object('vers-marche', 'sortie', 0, 10, { cible: 'canopee-nacelle', arrivee: 'depuis-aieux', libelle: 'Passerelle vers le marché' });
  m.object('depuis-marche', 'arrivee', 1, 10);
  return m.toTiled();
}

Object.assign(LOCATION_NAMES, {
  'canopee-auberge': 'Auberge du Nid',
  'canopee-comptoir': 'Comptoir de la Sève',
  'canopee-conseil': 'Antichambre du Conseil des Racines Profondes',
  'canopee-feuillevent': 'Maison Feuillevent',
  'canopee-atelier': 'Atelier Chante-Bois',
  'canopee-grenier': 'Grenier des semences',
  'canopee-relais': 'Relais des Gardiens de Mémoire',
});

// Pas de feu dans une ville de bois : des cristaux chauffent les pièces (cristal-veille).
Object.assign(INTERIORS, {
  'canopee-auberge': interior('canopee-auberge', {
    outside: 'canopee-nacelle',
    furniture: [[1, 2, 'hamac'], [1, 4, 'hamac'], [6, 1, 'cristal-veille'], [3, 3, 'comptoir'], [4, 3, 'comptoir'], [6, 4, 'table']],
    objects: [['lisandre', 'pnj', 4, 2]],
  }),
  'canopee-comptoir': interior('canopee-comptoir', {
    outside: 'canopee-nacelle',
    furniture: [[2, 1, 'etagere'], [3, 1, 'etagere'], [5, 1, 'etagere'], [3, 3, 'comptoir'], [4, 3, 'comptoir'], [1, 4, 'sacs-graines'], [6, 4, 'table']],
    objects: [['sevane', 'pnj', 4, 2]],
  }),
  'canopee-conseil': interior('canopee-conseil', {
    w: 9,
    h: 7,
    outside: 'canopee-ramures',
    furniture: [[3, 3, 'table'], [4, 3, 'table'], [5, 3, 'table'], [6, 3, 'table'], [1, 1, 'cristal-veille'], [8, 1, 'cristal-veille'], [4, 1, 'etagere']],
    objects: [['huissier', 'pnj', 3, 5]],
  }),
  'canopee-feuillevent': interior('canopee-feuillevent', {
    outside: 'canopee-ramures',
    furniture: [[1, 2, 'hamac'], [5, 4, 'table'], [6, 1, 'etagere'], [3, 1, 'cristal-veille']],
    objects: [['ailis', 'pnj', 3, 3]],
  }),
  'canopee-atelier': interior('canopee-atelier', {
    outside: 'canopee-ramures',
    furniture: [[2, 1, 'etabli'], [3, 1, 'etabli'], [6, 1, 'etagere'], [5, 4, 'table']],
    objects: [['elouan', 'pnj', 3, 3]],
  }),
  'canopee-grenier': interior('canopee-grenier', {
    outside: 'canopee-ramures',
    furniture: [[1, 1, 'sacs-graines'], [2, 1, 'sacs-graines'], [1, 2, 'sacs-graines'], [5, 1, 'sacs-graines'], [6, 1, 'sacs-graines'], [6, 2, 'caisses']],
    objects: [['graines-conseil', 'objet', 2, 1]],
  }),
  'canopee-relais': interior('canopee-relais', {
    outside: 'canopee-aieux',
    furniture: [[2, 1, 'etagere'], [3, 1, 'etagere'], [5, 1, 'etagere'], [6, 1, 'cristal-veille'], [1, 4, 'hamac'], [5, 4, 'table']],
    objects: [['mirelle', 'pnj', 3, 3]],
  }),
});

// --- Le Sol des Racines, sous Canopéa (docs/univers/quetes.md, « Les lettres de Malo ») ----------------------
// La forêt sacrée au pied des Arbres-Titans : aucun bâtiment ne touche le sol [NOTION]. On n'y descend qu'avec la
// nacelle des Nacelliers. Une voie de l'Ancien Monde y affleure sous les racines, là où quelqu'un a fouillé.
function solRacines() {
  const m = new MapBuilder(26, 22);
  const rng = mulberry32(6100);
  m.ground.fill(gid('herbe-sombre'));
  for (let col = 0; col < m.width; col++) {
    m.setObstacle(col, 0, 'arbre');
    m.setObstacle(col, m.height - 1, 'arbre');
  }
  for (let row = 0; row < m.height; row++) {
    m.setObstacle(0, row, 'arbre');
    m.setObstacle(m.width - 1, row, 'arbre');
  }
  // Les pieds des Arbres-Titans, qui portent la ville loin au-dessus.
  for (const [c, r] of [[6, 4], [15, 3], [5, 17], [19, 16], [22, 13]]) titan(m, c, r);
  // La vieille voie, à demi enfouie, et la fouille.
  m.line([9, 13], [18, 13], 'rail');
  m.setObstacle(13, 14, 'trou-fouille');
  m.setObstacle(14, 15, 'caisses');

  m.setObstacle(3, 10, 'nacelle');
  m.object('nacelle-remontee', 'porte', 3, 10, { cible: 'canopee-nacelle', arrivee: 'entree', libelle: 'Remonter par la nacelle' });
  m.object('descente', 'arrivee', 4, 11);
  m.setObstacle(9, 10, 'lettres');
  m.object('lettres-eparpillees', 'objet', 9, 10);
  m.object('traces-fouille', 'objet', 13, 14);
  // « Le chant d'Anselme » : l'arbre au pied duquel repose Anselme, au sud, loin de la tanière.
  m.setObstacle(11, 18, 'arbre-retour');
  m.object('arbre-retour-anselme', 'objet', 11, 18);
  // La tanière : la sacoche sous la patte d'un Ours-Mousse endormi (src/data/encounters.json).
  m.setObstacle(21, 6, 'sacoche');
  m.object('sacoche-lettres', 'coffre', 21, 6, { disparaitSi: 'sacoche-retrouvee' });
  m.object('ours-sol', 'ennemi', 20, 7, {
    ennemi: 'ours-mousse',
    disparaitSi: 'ours-sol-vaincu,ours-sol-eloigne',
    texte: 'Un Ours-Mousse dort, roulé dans la mousse. Mieux vaut ne pas le réveiller sans plan.',
  });

  const keepClear = new Set(
    [[11, 18], [10, 18], [12, 18], [11, 17], [10, 17], [12, 17], [11, 19], [4, 11], [3, 11], [5, 11], [4, 12], [5, 12], [6, 13], [5, 13], [3, 12], [20, 7], [9, 11], [10, 11], [10, 10], [8, 11], [12, 13], [12, 14], [13, 15], [19, 7], [20, 6], [20, 8], [21, 7], [22, 7], [21, 5], [19, 6], [19, 8]].map(
      ([c, r]) => `${c},${r}`,
    ),
  );
  for (let row = 1; row < m.height - 1; row++) {
    for (let col = 1; col < m.width - 1; col++) {
      if (m.groundAt(col, row) !== gid('herbe-sombre') || m.obstacleAt(col, row) !== 0 || keepClear.has(`${col},${row}`)) continue;
      const roll = rng();
      if (roll < 0.07) m.setObstacle(col, row, 'arbre');
      else if (roll < 0.13) m.setObstacle(col, row, 'fougeres');
      else if (roll < 0.16) m.setObstacle(col, row, 'champignons');
      else if (roll < 0.18) m.setObstacle(col, row, 'souche');
      else if (roll < 0.4) m.setGround(col, row, 'herbe');
    }
  }
  return m.toTiled();
}

// --- Lieux de rencontre aléatoire (docs/gdd/carte-du-monde.md) ---------------------------------------------
// Petites cartes où l'on tombe en voyage, comme les rencontres de la carte du monde des CRPG de référence. Leur
// contenu (ennemis, PNJ, objets) vient de src/data/rencontres.json et se pose sur les points d'apparition.
// Ennemis à quelques pas de l'entrée : le combat se joue sur un morceau de 11 × 9 cases (docs/gdd/combat.md).
const SPAWNS = {
  'apparition-1': [9, 6],
  'apparition-2': [10, 9],
  'apparition-3': [8, 11],
  'pnj-1': [11, 7],
  'objet-1': [12, 9],
  'decor-1': [12, 6],
};

function encounterMap(seed, { ground, treeShare, layout }) {
  const m = new MapBuilder(20, 16);
  const rng = mulberry32(seed);
  for (let col = 0; col < m.width; col++) {
    m.setObstacle(col, 0, 'arbre');
    m.setObstacle(col, m.height - 1, 'arbre');
  }
  for (let row = 0; row < m.height; row++) {
    m.setObstacle(0, row, 'arbre');
    m.setObstacle(m.width - 1, row, 'arbre');
  }
  m.line([0, 8], [19, 8], ground);
  layout(m, rng);
  const keepClear = new Set([[3, 8], [0, 8], [19, 8], ...Object.values(SPAWNS)].flatMap(([c, r]) =>
    [-1, 0, 1].flatMap((dc) => [-1, 0, 1].map((dr) => `${c + dc},${r + dr}`)),
  ));
  for (let row = 1; row < m.height - 1; row++) {
    for (let col = 1; col < m.width - 1; col++) {
      if (m.groundAt(col, row) !== gid('herbe') || m.obstacleAt(col, row) !== 0 || keepClear.has(`${col},${row}`)) continue;
      const roll = rng();
      if (roll < treeShare) m.setObstacle(col, row, 'arbre');
      else groundVariety(m, col, row, (roll - treeShare) / (1 - treeShare), { flowers: true });
    }
  }
  m.object('entree', 'arrivee', 3, 8);
  m.object('sortie-ouest', 'sortie', 0, 8, { cible: CARTE_DU_MONDE, libelle: 'Reprendre la route' });
  m.object('sortie-est', 'sortie', 19, 8, { cible: CARTE_DU_MONDE, libelle: 'Reprendre la route' });
  for (const [name, [c, r]] of Object.entries(SPAWNS)) m.object(name, 'apparition', c, r);
  return m.toTiled();
}

const ENCOUNTER_MAPS = {
  'rencontre-clairiere': encounterMap(5100, {
    ground: 'herbe-2',
    treeShare: 0.16,
    layout: (m) => {
      for (const [c, r] of [[6, 4], [16, 12], [7, 12]]) m.setObstacle(c, r, 'rocher');
    },
  }),
  'rencontre-route': encounterMap(5200, {
    ground: 'chemin',
    treeShare: 0.1,
    layout: (m) => {
      m.line([0, 9], [19, 9], 'chemin');
      m.setObstacle(7, 11, 'charrette');
      for (const [c, r] of [[15, 4], [5, 5], [16, 12]]) m.setObstacle(c, r, 'rocher');
    },
  }),
  'rencontre-ruines': encounterMap(5300, {
    ground: 'chemin',
    treeShare: 0.08,
    layout: (m) => {
      m.rect(6, 3, 16, 5, 'quai');
      m.rect(5, 11, 15, 13, 'quai');
      m.line([4, 4], [17, 4], 'rail');
      for (const [c, r] of [[6, 3], [9, 3], [16, 4], [6, 12], [10, 13], [15, 11], [17, 6]]) m.setObstacle(c, r, 'ruine');
    },
  }),
};

const out = new URL('../src/data/maps/', import.meta.url);
writeFileSync(new URL('gardebois.json', out), JSON.stringify(gardebois(), null, 1) + '\n');
console.log('gardebois.json');
writeFileSync(new URL('gare-engloutie.json', out), JSON.stringify(gareEngloutie(), null, 1) + '\n');
console.log('gare-engloutie.json');
for (const [id, map] of Object.entries({
  'canopee-nacelle': canopeeNacelle(),
  'canopee-ramures': canopeeRamures(),
  'canopee-aieux': canopeeAieux(),
  'sol-racines': solRacines(),
  ...ENCOUNTER_MAPS,
})) {
  writeFileSync(new URL(`${id}.json`, out), JSON.stringify(map, null, 1) + '\n');
  console.log(`${id}.json`);
}
for (const [id, map] of Object.entries(INTERIORS)) {
  writeFileSync(new URL(`${id}.json`, out), JSON.stringify(map, null, 1) + '\n');
  console.log(`${id}.json`);
}
