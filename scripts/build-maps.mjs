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
  // Ce qui brille sous le pont (étude du 2026-11-03, H4) : la boîte du passeur, au fond du ruisseau.
  m.object('reflet-pont', 'objet', 21, 19, { tuile: 'reflet', disparaitSi: 'boite-odon-prise' });
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

  m.object('entree', 'arrivee', 3, 4);
  // Carte du monde (docs/gdd/carte-du-monde.md) : la route de l'ouest quitte Gardebois.
  m.object('vers-monde', 'sortie', 0, 4, { cible: CARTE_DU_MONDE, libelle: 'Quitter Gardebois' });
  m.object('vers-gare', 'sortie', 27, 18, { cible: 'gare-engloutie', arrivee: 'entree-gare', libelle: 'Vers la Gare Engloutie' });
  m.object('ilyane', 'pnj', 5, 15);
  m.object('tobias', 'pnj', 14, 8);
  // La convoyeuse de la Compagnie des Lisières : la caravane vers Canopéa et Ironheart. Les cases devant elle sont
  // dégagées après coup (sans changer le tirage de la forêt, qui placerait autrement tous les arbres ailleurs).
  m.object('convoyeuse', 'pnj', 10, 3);
  for (const [c, r] of [[11, 4], [12, 5], [11, 5], [12, 4], [10, 4], [11, 3]]) m.setObstacle(c, r, null);
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

  // « Ce que Liane veut oublier » (docs/gdd/jalon-3.md, étape 2) : un vieux Champignon-Mémoire près du chantier, placé
  // après le tirage des arbres pour ne pas le changer.
  m.setObstacle(16, 13, null);
  m.object('champignon-ancien', 'objet', 16, 13, { tuile: 'champignons', apparaitSi: 'oubli-choix-oublier', disparaitSi: 'champignon-cueilli' });
  m.object('entree-gare', 'sortie', 0, 9, { cible: 'gardebois', arrivee: 'vers-gare', libelle: 'Vers Gardebois' });
  // The first fight, on the way to the Gare (étude du 2026-11-03, C5): a Rôdeur-Épine bars the path on arrival.
  m.object('rodeur-sentier', 'ennemi', 4, 9, {
    ennemi: 'rodeur-epine',
    embuscade: 'embuscade-gare',
    disparaitSi: 'rodeur-sentier-vaincu',
    texte: 'Un Rôdeur-Épine jaillit des fougères et te barre le sentier de la Gare.',
  });
  m.object('ingrid', 'pnj', 18, 10);
  m.object('echo-dernier-train', 'echo', 12, 8);
  m.object('golem-gare', 'golem', 21, 13);
  m.object('caisse-prospection', 'coffre', 17, 11);
  m.object('foreuse', 'foreuse', 19, 8);
  // La Faille, au pied de la foreuse : dessous, le quai sept (« Ce que cherchait la foreuse », après le chapitre 5).
  m.object('faille-descente', 'objet', 20, 9);
  m.object('panneau-gare', 'panneau', 2, 8, {
    texte: 'Gare Engloutie — la forêt a repris ce que les hommes avaient laissé.',
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

function interior(id, { w = 7, h = 6, outside = 'gardebois', floor = 'parquet', wall = 'mur', furniture = [], objects = [] }) {
  const m = new MapBuilder(w + 1, h + 1);
  m.ground.fill(0);
  for (let row = 0; row <= h; row++) {
    for (let col = 0; col <= w; col++) {
      m.setGround(col, row, floor);
      if (row === 0 || col === 0) m.setObstacle(col, row, wall);
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
  // Voyager autrement : la halte de la ligne de l'Ouest et le chef de caravane, au pied de la Grande Nacelle.
  m.object('chef-caravane', 'pnj', 5, 16);
  m.setObstacle(2, 16, 'panneau');
  m.object('halte-ouest', 'objet', 2, 16);
  m.object('malo', 'pnj', 13, 9);
  // « Un prêt de la Terre » (docs/gdd/magie.md) : Tiven, le jeune Nacellier aux mains brûlées par les cordes.
  m.object('tiven', 'pnj', 2, 12);
  m.object('panneau-canopee', 'panneau', 6, 16, { texte: 'Canopéa — la Grande Nacelle. Ici, rien ne touche le sol.' });
  // L'échelle aux rubans (étude du 2026-11-03, H4) : celle des Jeunes-Pousses, où l'on noue un ruban pour Pim.
  m.object('rubans-echelle', 'objet', 16, 17, { tuile: 'rubans' });
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
  // Le nom de Pim, gravé bas par sa sœur (étude du 2026-11-03, H4) ; avec Mémoire 3, on reçoit son souvenir.
  m.object('nom-pim', 'objet', 16, 14);
  // Un jeune arbre au tronc lisse, où Liane peut graver le nom de son frère (« Ce que Liane veut oublier »).
  m.setObstacle(6, 9, 'arbre-souvenir');
  m.object('arbre-vierge', 'objet', 6, 9);
  // Le druide Vanel, au pied du grand arbre du sanctuaire (« Un prêt de la Terre », docs/gdd/magie.md).
  m.object('vanel', 'pnj', 14, 10);
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
    furniture: [[1, 2, 'hamac'], [1, 4, 'hamac'], [6, 1, 'cristal-veille'], [3, 3, 'comptoir'], [4, 3, 'comptoir'], [6, 4, 'table'], [6, 3, 'ballots']],
    // « Les graines qui manquent » : Elvan Morelle, en pension au fond, avec ses ballots ; dénoncé, il s'en va.
    objects: [['lisandre', 'pnj', 4, 2], ['elvan', 'pnj', 5, 4, { disparaitSi: 'graines-denonce' }]],
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
    objects: [['huissier', 'pnj', 3, 5], ['depuis-amphitheatre', 'arrivee', 4, 4]],
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
  m.object('lettres-eparpillees', 'objet', 9, 10, { disparaitSi: 'lettres-ramassees' });
  m.object('traces-fouille', 'objet', 13, 14);
  // L'ours et la sacoche sont posés plus bas, à l'entrée de la fouille (le chapitre 2 a son obstacle ; étude du
  // 2026-11-03, forme A choisie par Cyril).

  const keepClear = new Set(
    [[4, 11], [3, 11], [5, 11], [4, 12], [5, 12], [6, 13], [5, 13], [3, 12], [20, 7], [9, 11], [10, 11], [10, 10], [8, 11], [12, 13], [12, 14], [13, 15], [19, 7], [20, 6], [20, 8], [21, 7], [22, 7], [21, 5], [19, 6], [19, 8], [21, 6]].map(
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
  // Ajouts des quêtes du chapitre 2, posés après le semis d'arbres pour ne pas le déplacer. On dégage leurs abords.
  const clear = (cells) => {
    for (const [c, r] of cells) if (m.obstacleAt(c, r) && m.obstacleAt(c, r) !== gid('tronc-titan')) m.setObstacle(c, r, null);
  };
  // « Le chant d'Anselme » : l'arbre au pied duquel repose Anselme, au sud, loin de la tanière.
  clear([[10, 17], [11, 17], [12, 17], [10, 18], [12, 18], [10, 19], [11, 19], [12, 19]]);
  m.setObstacle(11, 18, 'arbre-retour');
  m.object('arbre-retour-anselme', 'objet', 11, 18);
  // « L'audience » : un fouilleur des Marches des Cendres, près de son trou, seulement pendant l'enquête du Triumvirat.
  clear([[11, 15], [12, 15], [12, 16], [11, 16], [10, 15], [10, 16], [11, 14], [12, 14]]);
  m.object('garrik', 'pnj', 11, 15, { apparaitSi: 'audience-tenue', disparaitSi: 'fouille-elucidee' });
  // Un obstacle par chapitre (étude du 2026-11-03, forme A choisie par Cyril) : un fourré serré, au pied des Titans,
  // ferme la fouille, avec une seule entrée, à l'ouest (des arbres : un tronc de Titan se dessine sur deux cases sur deux) ; l'Ours-Mousse y dort sur la sacoche de Malo (src/data/encounters.json). La
  // Discrétion le fait rouler sur le flanc, les baies l'éloignent, ou l'on se bat.
  const [left, right, top, bottom] = [8, 18, 11, 17];
  const gate = [left, 14];
  const hedge = (c, r) => m.obstacleAt(c, r) !== gid('tronc-titan') && m.setObstacle(c, r, 'arbre');
  for (let col = left; col <= right; col++) for (const row of [top, bottom]) hedge(col, row);
  for (let row = top + 1; row < bottom; row++) for (const col of [left, right]) if (col !== gate[0] || row !== gate[1]) hedge(col, row);
  clear([gate, [9, 14], [10, 14], [9, 13], [9, 15], [7, 13], [7, 14], [6, 14], [6, 13], [6, 15], [7, 16], [6, 16]]);
  m.setObstacle(7, 15, 'sacoche');
  m.object('sacoche-lettres', 'coffre', 7, 15, { disparaitSi: 'sacoche-retrouvee' });
  m.object('ours-sol', 'ennemi', gate[0], gate[1], {
    ennemi: 'ours-mousse',
    dialogue: 'sacoche-lettres',
    disparaitSi: 'ours-sol-vaincu,ours-sol-eloigne,ours-sol-roule',
    texte: 'Un Ours-Mousse dort en travers de l’entrée de la fouille, une patte sur une sacoche. Mieux vaut ne pas le réveiller sans plan.',
  });
  // Roulé sur le flanc après une main habile : il dort toujours, à côté de l'entrée.
  m.object('ours-sol-dort', 'ennemi', 7, 16, {
    ennemi: 'ours-mousse',
    apparaitSi: 'ours-sol-roule',
    disparaitSi: 'ours-sol-vaincu,ours-sol-eloigne',
    texte: 'L’Ours-Mousse dort toujours, roulé sur le flanc. Laisse-le rêver.',
  });
  return m.toTiled();
}

// --- L'amphithéâtre du Conseil des Racines Profondes (« L'audience », docs/univers/quetes.md) ----------------
// « Immense amphithéâtre circulaire, taillé dans un Arbre-Titan mort » [NOTION] : des gradins en arc autour d'une
// estrade où siège le Triumvirat Vert ; une allée descend de la porte jusqu'à lui.
function amphitheatre() {
  const w = 13;
  const h = 12;
  const m = new MapBuilder(w, h);
  m.ground.fill(gid('parquet'));
  for (let col = 0; col < w; col++) m.setObstacle(col, 0, 'mur');
  for (let row = 0; row < h; row++) m.setObstacle(0, row, 'mur');
  // Les gradins en fer à cheval, face à la porte ; l'estrade du Triumvirat au milieu, face à qui parle.
  const [cc, cr] = [6, 5];
  for (let col = 1; col < w; col++) for (const row of [1, 2]) m.setObstacle(col, row, 'gradin');
  for (let row = 3; row <= 7; row++) for (const col of [1, 2, 10, 11]) m.setObstacle(col, row, 'gradin');
  for (const [c, r] of [[1, 9], [11, 9], [3, 3], [9, 3]]) m.setObstacle(c, r, 'cristal-veille');
  m.setGround(cc, h - 1, 'seuil');
  m.object('sortie', 'sortie', cc, h - 1, { cible: 'canopee-conseil', arrivee: 'depuis-amphitheatre', libelle: 'Sortir' });
  m.object('entree', 'arrivee', cc, h - 2);
  // Face à qui entre, sur une ligne : Lyra à gauche, Thalorin au milieu, Kael Marchevent à droite.
  // Sur la même rangée à l'écran (même col + row), espacés pour que leurs noms ne se chevauchent pas.
  m.object('thalorin', 'pnj', cc - 1, cr);
  m.object('lyra', 'pnj', cc - 3, cr + 2);
  m.object('kael-marchevent', 'pnj', cc + 1, cr - 2);
  return m.toTiled();
}

// --- Ironheart, capitale de Ferros (chapitre 3, docs/univers/lieux/ironheart.md ; visuels provisoires) ------------
// Canon [NOTION, Chroniques Familiales] : Forges-Basses (ateliers, dortoirs, Puits Trois), un funiculaire et un poste de
// contrôle vers les Manufactures-Moyennes (Archives Centrales), le Marché des Cendres caché sous deux fonderies éteintes.

/** A town block: brick walls all around, an opening where `open` says. */
function cityBlock(width, height, ground, wall = 'maison-brique') {
  const m = new MapBuilder(width, height);
  m.ground.fill(gid(ground));
  for (let col = 0; col < width; col++) {
    m.setObstacle(col, 0, wall);
    m.setObstacle(col, height - 1, wall);
  }
  for (let row = 0; row < height; row++) {
    m.setObstacle(0, row, wall);
    m.setObstacle(width - 1, row, wall);
  }
  return m;
}

function ironheartForges() {
  const m = cityBlock(30, 24, 'paves');
  // La gare de l'Ouest (proposition : le canon ne décrit aucune gare d'Ironheart) : quai, rails, un wagon.
  m.rect(1, 8, 7, 13, 'quai');
  m.line([1, 11], [8, 11], 'rail');
  m.setObstacle(2, 11, 'wagon');
  m.object('vers-monde', 'sortie', 0, 12, { cible: CARTE_DU_MONDE, libelle: 'Quitter Ironheart' });
  m.setObstacle(0, 12, null);
  m.object('entree', 'arrivee', 4, 10);
  m.object('boulon', 'pnj', 5, 8);
  // Le guichet de la ligne de l'Ouest (le train pour Canopéa).
  m.setObstacle(6, 9, 'comptoir');
  m.object('guichet-ouest', 'objet', 6, 9);
  // Les Forges-Basses : forges, tuyaux, réverbères à cristal rouge.
  for (const [c, r] of [[17, 3], [8, 3], [27, 6]]) m.setObstacle(c, r, 'forge');
  for (const [c, r] of [[10, 9], [13, 13], [18, 9], [22, 14], [6, 16], [25, 3]]) m.setObstacle(c, r, 'reverbere');
  for (const [c, r] of [[20, 3], [21, 3], [4, 20], [5, 20]]) m.setObstacle(c, r, 'tuyaux');
  for (const [c, r] of [[12, 18], [13, 18], [26, 10]]) m.setObstacle(c, r, 'caisses');
  // Le Puits Trois et son registre des transferts.
  m.setObstacle(11, 6, 'puits');
  m.setObstacle(12, 5, 'panneau');
  m.object('registre-puits', 'panneau', 12, 5, {
    texte: 'Puits Trois — Ouvriers. « Puits Un et Deux : castes supérieures. Tout Ouvrier qui s’y présente sera retenu. » Le registre des transferts : « Équipe Orvel, deux départs pour les Manufactures-Moyennes. »',
  });
  // « Le registre du Puits Trois » (jalon 3, étape 5, docs/gdd/passe-sombre.md) : Kerta dans la file, Tam près du registre.
  m.object('kerta', 'pnj', 9, 6);
  m.object('tam', 'pnj', 13, 6, { disparaitSi: 'tam-monte,tam-arrete' });
  house(m, 'ironheart-pension', 'maison-brique', [9, 16], [10, 17]);
  house(m, 'ironheart-atelier', 'forge', [15, 7], [15, 8]);
  // Un Ferrôme rangé au rebut, contre le mur de l'atelier (étude du 2026-11-03, H4) : « Ferros ne jette rien ».
  m.object('ferrome-rebut', 'objet', 17, 7, { tuile: 'ferraille' });
  house(m, 'ironheart-martelroux', 'maison-brique', [19, 17], [20, 18]);
  // Le renfoncement sans enseigne, entre deux fonderies éteintes : l'entrée du Marché des Cendres.
  m.setObstacle(24, 8, 'forge');
  m.setObstacle(24, 12, 'forge');
  m.setObstacle(24, 10, 'renfoncement');
  m.object('entree-marche', 'porte', 24, 10, {
    cible: 'ironheart-marche',
    arrivee: 'depuis-forges',
    libelle: 'Le renfoncement sans enseigne',
    verrou: 'marche-cendres-connu',
    dialogue: 'renfoncement',
  });
  m.object('devant-renfoncement', 'arrivee', 23, 10);
  // La vieille ligne, qu'on dit maudite, et son dépôt.
  m.line([18, 20], [28, 20], 'rail');
  m.setObstacle(26, 20, 'wagon');
  m.setObstacle(27, 20, 'wagon');
  m.setObstacle(28, 20, 'butoir');
  // Pendant la quête de la clé, la Veilleuse a suivi son convoi jusqu'à l'embranchement de la Cendrière (étude du
  // 2026-11-03, un obstacle par chapitre) : elle revient à son dépôt une fois la clé donnée.
  m.object('veilleuse', 'pnj', 23, 19, { apparaitSi: 'cle-obtenue' });
  m.object('vieille-machine', 'objet', 26, 20);
  // La forge froide qui s'embrase sans feu, la nuit (« Les Échos sous la Forge », quête cachée).
  m.setObstacle(4, 4, 'forge-eteinte');
  m.object('forge-eteinte', 'objet', 4, 4);
  m.object('devant-forge-eteinte', 'arrivee', 5, 5);
  // Le triage des Cendres, à l'est (« Le Rail des Cendres »).
  m.setObstacle(29, 16, null);
  m.object('vers-triage', 'sortie', 29, 16, { cible: 'ironheart-triage', arrivee: 'depuis-forges', libelle: 'Le triage des Cendres' });
  m.object('devant-triage', 'arrivee', 28, 16);
  m.setObstacle(28, 14, 'panneau');
  m.object('panneau-triage-forges', 'panneau', 28, 14, { texte: 'Triage des Cendres — Travailleurs du Rail. Par le portail de l’est.' });
  // La machine sans homme, remisée au dépôt par les cheminots si on leur a laissé l'affaire.
  m.setObstacle(25, 18, 'pilote');
  m.object('pilote-endormi', 'objet', 25, 18, { apparaitSi: 'rail-travailleurs' });
  // Le funiculaire des Manufactures-Moyennes, et le patrouilleur qui le garde.
  m.setObstacle(14, 2, 'monte-charge');
  m.object('funiculaire', 'porte', 14, 2, {
    cible: 'ironheart-manufactures',
    arrivee: 'funiculaire-arrivee',
    libelle: 'Le funiculaire',
    verrou: 'laissez-passer-ironheart',
    dialogue: 'patrouilleur',
  });
  m.object('devant-funiculaire', 'arrivee', 14, 3);
  m.object('patrouilleur', 'pnj', 12, 3);
  m.setObstacle(3, 15, 'panneau');
  m.object('panneau-ironheart', 'panneau', 3, 15, { texte: 'Ironheart — les Forges-Basses. Per Ferrum et Ignem.' });
  return m.toTiled();
}

function ironheartMarche() {
  const m = cityBlock(22, 18, 'dalles', 'mur-brique');
  m.object('vers-forges', 'sortie', 0, 9, { cible: 'ironheart-forges', arrivee: 'devant-renfoncement', libelle: 'Remonter le tunnel' });
  m.setObstacle(0, 9, null);
  m.object('depuis-forges', 'arrivee', 2, 9);
  for (const [c, r] of [[5, 4], [8, 13], [14, 3], [15, 13], [5, 12]]) m.setObstacle(c, r, 'tente-cendres');
  for (const [c, r] of [[9, 5], [10, 5], [17, 9], [17, 10], [11, 12]]) m.setObstacle(c, r, 'etal');
  for (const [c, r] of [[3, 6], [7, 9], [13, 8], [19, 5], [19, 13], [3, 13]]) m.setObstacle(c, r, 'reverbere');
  for (const [c, r] of [[6, 8], [16, 6]]) m.setObstacle(c, r, 'caisses');
  // L'échoppe de Kaelis, et le guichet d'archives au fond de la caverne [NOTION, roman V.1].
  m.setObstacle(12, 5, 'etal');
  m.object('kaelis', 'pnj', 12, 6);
  m.setObstacle(20, 8, 'comptoir');
  m.setObstacle(20, 9, 'comptoir');
  m.object('guichet-cendres', 'objet', 20, 9);
  // La tailleuse de cristaux de forge (docs/gdd/magie.md) : ici, rien ne s'écrit.
  m.object('tailleuse', 'pnj', 16, 9);
  m.setObstacle(19, 2, 'panneau');
  m.object('panneau-marche', 'panneau', 19, 2, { texte: 'Pas d’enseigne, pas de carte. Seulement l’huile des lampes, et ce qui se vend.' });
  return m.toTiled();
}

function ironheartManufactures() {
  const m = cityBlock(26, 20, 'dalles');
  m.setObstacle(2, 10, 'monte-charge');
  m.object('funiculaire-descente', 'porte', 2, 10, { cible: 'ironheart-forges', arrivee: 'devant-funiculaire', libelle: 'Redescendre aux Forges-Basses' });
  m.object('funiculaire-arrivee', 'arrivee', 3, 10);
  // Le tramway à vapeur sur ses rails surélevés (dessinés au sol, provisoirement).
  m.line([1, 15], [24, 15], 'rail');
  house(m, 'ironheart-archives', 'archives', [14, 4], [14, 5]);
  for (const [c, r] of [[6, 6], [11, 9], [18, 9], [8, 13], [20, 12]]) m.setObstacle(c, r, 'reverbere');
  for (const [c, r] of [[6, 3], [9, 3], [19, 3], [5, 17], [10, 17], [16, 17]]) m.setObstacle(c, r, 'maison-brique');
  // Le funiculaire des Manufactures-Hautes : on n'y monte pas.
  m.setObstacle(22, 3, 'monte-charge');
  m.object('funiculaire-hautes', 'porte', 22, 3, {
    cible: 'ironheart-manufactures',
    libelle: 'Le funiculaire des Manufactures-Hautes',
    verrou: 'jamais-ouvert',
    toujoursFermee: 'oui',
    dialogue: 'patrouilleuse-haute',
  });
  m.object('patrouilleuse-haute', 'pnj', 20, 5);
  // Le parrain de Classe Technique (« Le registre du Puits Trois »).
  m.object('dask', 'pnj', 16, 8);
  m.setObstacle(13, 7, 'panneau');
  m.object('panneau-archives', 'panneau', 13, 7, { texte: 'ARCHIVES CENTRALES DE FERROS — MEMORIA FERROX. Comptoir public au rez-de-chaussée.' });
  return m.toTiled();
}

// « Le Rail des Cendres » (proposition, docs/univers/quetes.md) : le triage des Travailleurs du Rail, à l'est des
// Forges-Basses, et la vieille Cendrière où mène l'embranchement.
function ironheartTriage() {
  const m = cityBlock(26, 18, 'paves-cendre', 'mur-brique');
  m.object('vers-forges', 'sortie', 0, 9, { cible: 'ironheart-forges', arrivee: 'devant-triage', libelle: 'Retour aux Forges-Basses' });
  m.setObstacle(0, 9, null);
  m.object('depuis-forges', 'arrivee', 2, 9);
  // Les voies du triage, et l'embranchement qui s'enfonce sous les terrils.
  m.line([1, 4], [24, 4], 'rail');
  m.line([1, 7], [24, 7], 'rail');
  m.line([1, 14], [24, 14], 'rail');
  m.line([12, 7], [12, 11], 'rail');
  m.line([12, 11], [24, 11], 'rail');
  for (const [c, r] of [[5, 4], [6, 4], [17, 7], [18, 7], [8, 14], [9, 14], [20, 14]]) m.setObstacle(c, r, 'wagon');
  m.setObstacle(25, 11, 'renfoncement');
  m.object('tunnel-cendriere', 'porte', 25, 11, {
    cible: 'ironheart-cendriere',
    arrivee: 'depuis-tunnel',
    libelle: 'Le tunnel de l’embranchement',
    verrou: 'cendriere-ouverte',
    dialogue: 'tunnel-cendriere',
  });
  m.object('devant-tunnel', 'arrivee', 24, 12);
  // Le poste d'aiguillage, son levier, et l'aiguilleur de nuit.
  m.setObstacle(17, 9, 'poste-aiguillage');
  m.setObstacle(13, 9, 'levier');
  m.object('aiguillage', 'objet', 13, 9);
  // Renvoyé devant le tribunal (le Bureau), ou réduit au silence (les Marches) : docs/gdd/passe-sombre.md.
  m.object('joss', 'pnj', 16, 10, { disparaitSi: 'rail-bureau,rail-marches' });
  // Les pilleurs des Marches, la nuit de la garde (« Le Rail des Cendres »).
  const pilleurs = { ennemi: 'pilleur-cendres', apparaitSi: 'veille-aiguillage', disparaitSi: 'pilleurs-vaincus,pilleurs-suivis,rail-travailleurs,rail-bureau,rail-marches', texte: 'Un pilleur en manteau de cendre abaisse le levier.' };
  m.object('pilleur-1', 'ennemi', 14, 8, pilleurs);
  m.object('pilleur-2', 'ennemi', 11, 10, pilleurs);
  // Le dépôt des Travailleurs du Rail : Varka au brasero, le registre des départs, le contrôleur du Bureau.
  m.setObstacle(5, 11, 'brasero');
  m.object('varka', 'pnj', 6, 10);
  m.setObstacle(9, 9, 'comptoir');
  m.object('registre-departs', 'objet', 9, 9);
  m.object('ostrik', 'pnj', 4, 6);
  for (const [c, r] of [[10, 5], [20, 9], [22, 16], [4, 16], [8, 2]]) m.setObstacle(c, r, 'reverbere');
  for (const [c, r] of [[22, 2], [23, 2], [2, 16]]) m.setObstacle(c, r, 'caisses');
  m.setObstacle(2, 11, 'panneau');
  m.object('panneau-triage', 'panneau', 2, 11, { texte: 'Triage des Cendres — Travailleurs du Rail. « Le rail est une promesse collective. »' });
  return m.toTiled();
}

// « Les Échos sous la Forge » (quête cachée, docs/univers/quetes.md) : la galerie du Peuple des Cendres Noires, sous la
// forge froide ; trois Échos d'une autre époque, au fond une promesse.
function ironheartGalerie() {
  const m = cityBlock(20, 14, 'sol-cendre', 'tas-cendres');
  m.object('vers-forge', 'sortie', 0, 7, { cible: 'ironheart-forges', arrivee: 'devant-forge-eteinte', libelle: 'Remonter par la trappe' });
  m.setObstacle(0, 7, null);
  m.object('depuis-trappe', 'arrivee', 2, 7);
  m.line([1, 9], [12, 9], 'rail');
  for (const [c, r] of [[6, 9], [7, 9]]) m.setObstacle(c, r, 'wagon');
  for (const [c, r] of [[3, 3], [9, 3], [14, 11], [4, 11]]) m.setObstacle(c, r, 'brasero');
  for (const [c, r] of [[12, 2], [13, 2], [2, 12]]) m.setObstacle(c, r, 'caisses');
  for (const [c, r] of [[7, 4], [10, 11], [17, 2], [17, 12]]) m.setObstacle(c, r, 'tas-cendres');
  m.object('hesk', 'pnj', 5, 5);
  const gone = { disparaitSi: 'echos-dissipes' };
  m.setObstacle(9, 7, 'echo-forge');
  m.object('echo-chanson', 'echo', 9, 7, gone);
  m.setObstacle(12, 5, 'enclume');
  m.object('enclume-marques', 'objet', 12, 5);
  m.setObstacle(16, 7, 'echo-forge');
  m.object('echo-promesse', 'echo', 16, 7, gone);
  const furieux = { ennemi: 'echo-furieux', apparaitSi: 'echos-dechaines', disparaitSi: 'echos-dissipes', texte: 'Un Écho furieux, la voix cassée.' };
  m.object('echo-furieux-1', 'ennemi', 15, 5, furieux);
  m.object('echo-furieux-2', 'ennemi', 15, 9, furieux);
  return m.toTiled();
}

function ironheartCendriere() {
  const m = cityBlock(20, 14, 'sol-cendre', 'tas-cendres');
  m.object('vers-triage', 'sortie', 0, 7, { cible: 'ironheart-triage', arrivee: 'devant-tunnel', libelle: 'Reprendre le tunnel' });
  m.setObstacle(0, 7, null);
  m.object('depuis-tunnel', 'arrivee', 2, 7);
  m.line([1, 7], [16, 7], 'rail');
  m.setObstacle(17, 7, 'butoir');
  for (const [c, r] of [[6, 7], [7, 7]]) m.setObstacle(c, r, 'wagon');
  // La machine sans homme, au bout de la voie ; les pilleurs des Marches vident les wagons.
  m.setObstacle(14, 7, 'pilote');
  m.object('pilote', 'objet', 14, 7, { disparaitSi: 'rail-bureau,rail-travailleurs' });
  m.object('sorn', 'pnj', 11, 10, { disparaitSi: 'rail-bureau,rail-travailleurs' });
  // La Veilleuse, venue écouter son convoi sur l'embranchement, jusqu'à ce qu'elle donne la clé.
  m.object('veilleuse', 'pnj', 12, 5, { disparaitSi: 'cle-obtenue' });
  for (const [c, r] of [[9, 4], [10, 4], [12, 11], [13, 11], [5, 11]]) m.setObstacle(c, r, 'caisses');
  for (const [c, r] of [[4, 4], [15, 4], [8, 10], [16, 10]]) m.setObstacle(c, r, 'reverbere');
  for (const [c, r] of [[4, 9], [17, 3], [3, 3]]) m.setObstacle(c, r, 'tas-cendres');
  // La caisse de Ferros, sous le troisième tas (« Sous la cendre », après le chapitre 5 ; docs/gdd/fil-directeur.md).
  m.object('caisse-ferros', 'objet', 17, 3, { apparaitSi: 'caisse-ferros-cherchee', disparaitSi: 'caisse-ferros-reglee' });
  return m.toTiled();
}

Object.assign(LOCATION_NAMES, {
  'ironheart-pension': 'Pension de la Bielle',
  'ironheart-atelier': 'Atelier Cendrefer',
  'ironheart-martelroux': 'Maison Martelroux',
  'ironheart-archives': 'Archives Centrales de Ferros',
});

const FERROS_ROOM = { floor: 'dalles', wall: 'mur-brique' };
Object.assign(INTERIORS, {
  'ironheart-pension': interior('ironheart-pension', {
    ...FERROS_ROOM,
    outside: 'ironheart-forges',
    furniture: [[1, 1, 'lit'], [1, 3, 'lit'], [3, 3, 'comptoir'], [4, 3, 'comptoir'], [6, 1, 'tonneaux'], [6, 4, 'table']],
    objects: [['dorna', 'pnj', 4, 2]],
  }),
  'ironheart-atelier': interior('ironheart-atelier', {
    ...FERROS_ROOM,
    outside: 'ironheart-forges',
    furniture: [[2, 1, 'etabli'], [3, 1, 'etabli'], [6, 1, 'caisses'], [6, 2, 'caisses'], [1, 4, 'etagere']],
    objects: [['hedda', 'pnj', 4, 2]],
  }),
  'ironheart-martelroux': interior('ironheart-martelroux', {
    ...FERROS_ROOM,
    outside: 'ironheart-forges',
    furniture: [[1, 2, 'lit'], [5, 4, 'table'], [6, 1, 'cheminee'], [3, 1, 'etagere']],
    objects: [['rika', 'pnj', 3, 3]],
  }),
  'ironheart-archives': interior('ironheart-archives', {
    ...FERROS_ROOM,
    w: 9,
    h: 7,
    outside: 'ironheart-manufactures',
    furniture: [[1, 1, 'etagere'], [2, 1, 'etagere'], [3, 1, 'etagere'], [6, 1, 'etagere'], [7, 1, 'etagere'], [8, 1, 'etagere'], [3, 4, 'comptoir'], [4, 4, 'comptoir'], [5, 4, 'comptoir']],
    objects: [['noam', 'pnj', 4, 3]],
  }),
});

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

// --- Sept-Portes, la cité de Kael, au centre du monde (chapitre 4, docs/univers/lieux/sept-portes.md) -------------
// Canon [NOTION, Terminus] : les Sept Portes, portails permanents dans l'enceinte de la ville, un par continent ; la
// Grande Bibliothèque ; les Halles Basses, le Cratère de Sartharion rebâti en marché. Aucun combat possible (l'Anneau).

/** A walled city block whose walls are the houses of every nation, one after the other. */
function nationsBlock(width, height, ground) {
  const m = new MapBuilder(width, height);
  m.ground.fill(gid(ground));
  const walls = ['maison-brique', 'maison-pilotis', 'archives', 'maison-cosse', 'dome'];
  let i = 0;
  for (let col = 0; col < width; col++) {
    m.setObstacle(col, 0, walls[i++ % walls.length]);
    m.setObstacle(col, height - 1, walls[i++ % walls.length]);
  }
  for (let row = 1; row < height - 1; row++) {
    m.setObstacle(0, row, walls[i++ % walls.length]);
    m.setObstacle(width - 1, row, walls[i++ % walls.length]);
  }
  return m;
}

Object.assign(LOCATION_NAMES, {
  'sept-portes-auberge': 'Auberge des Sept Routes',
  'sept-portes-cartographe': 'Échoppe du cartographe',
  'sept-portes-jumeaux': 'Maison des jumeaux',
  'sept-portes-bibliotheque': 'La Grande Bibliothèque',
  'sept-portes-gardiens': 'Maison mère des Gardiens de Mémoire',
  'sept-portes-conseil': 'Salle du Conseil Œcuménique',
});

/** La place des Sept Portes : l'arrivée par la Porte du sud, les six autres arches, le marché des nations. */
function septPortesPlace() {
  const m = nationsBlock(28, 22, 'paves');
  // La mosaïque aux sept rayons, au milieu de la place.
  for (let row = 6; row <= 14; row++) for (let col = 10; col <= 18; col++) if ((col - 14) ** 2 + (row - 10) ** 2 <= 17) m.setGround(col, row, 'mosaique');
  // La Porte du sud, vers Verdantis (canon : Aldara en est venue), dans l'enceinte même, entre deux réverbères :
  // rien ne la cache. On arrive trois pas devant, hors de l'ombre des maisons.
  m.setObstacle(14, 21, 'porte-nexus');
  m.setObstacle(13, 21, 'reverbere');
  m.setObstacle(15, 21, 'reverbere');
  m.object('porte-sud', 'porte', 14, 21, { cible: CARTE_DU_MONDE, libelle: 'La Porte du sud, vers Verdantis' });
  m.object('depuis-porte-sud', 'arrivee', 14, 18);
  m.object('entree', 'arrivee', 14, 18);
  // Les six autres Portes, au nord : fermées sans sauf-conduit du pays d'en face.
  const portes = [
    ['porte-ferros', 4, 'La Porte de Ferros. Le contrôleur feuillette un registre : « Laissez-passer impérial ? Non ? Alors ce sera le rail, deux jours. »'],
    ['porte-zephyria', 8, 'La Porte de Zephyria. Un vent tiède passe sous l’arche. Le contrôleur : « Sauf-conduit de la Confédération, s’il vous plaît. Non ? Pas aujourd’hui. »'],
    ['porte-marisol', 12, 'La Porte de Marisol. Ça sent le sel. « Une lettre de l’Amirauté, et je vous laisse passer. »'],
    ['porte-glacialis', 16, 'La Porte de Glacialis. Du givre sur les dalles, même en été. « Le Dominion ne reçoit que sur invitation. »'],
    ['porte-solarix', 20, 'La Porte de Solarix. Du sable fin roule sous l’arche. « Les Marches viennent à vous, voyageur. Pas l’inverse. »'],
    ['porte-septieme', 24, 'La septième Porte. Le contrôleur ne lève pas les yeux. « Celle-ci, on ne la demande pas. » Tu ne sauras pas où elle mène.'],
  ];
  for (const [name, col, texte] of portes) {
    m.setObstacle(col, 2, 'porte-nexus');
    m.object(name, 'panneau', col, 2, { texte });
  }
  // Le marché des nations.
  for (const [c, r] of [[7, 7], [8, 7], [20, 7], [21, 7], [7, 13], [21, 13]]) m.setObstacle(c, r, 'etal');
  for (const [c, r] of [[5, 6], [23, 6]]) m.setObstacle(c, r, 'tente');
  m.object('marchande-nations', 'pnj', 8, 8);
  for (const [c, r] of [[10, 4], [18, 4], [10, 16], [18, 16], [3, 10], [25, 10]]) m.setObstacle(c, r, 'reverbere');
  house(m, 'sept-portes-auberge', 'maison-brique', [4, 14], [5, 15]);
  house(m, 'sept-portes-cartographe', 'maison-pilotis', [24, 13], [23, 14]);
  house(m, 'sept-portes-jumeaux', 'maison-cosse', [23, 18], [22, 18]);
  // Vers le parvis de la Grande Bibliothèque (ouest) et les Halles Basses (est).
  m.setObstacle(0, 10, null);
  m.object('vers-parvis', 'sortie', 0, 10, { cible: 'sept-portes-parvis', arrivee: 'depuis-place', libelle: 'Le parvis de la Grande Bibliothèque' });
  m.object('depuis-parvis', 'arrivee', 1, 10);
  m.setObstacle(27, 10, null);
  m.object('vers-halles', 'sortie', 27, 10, { cible: 'sept-portes-halles', arrivee: 'depuis-place', libelle: 'Les Halles Basses' });
  // Côté est, les maisons de l'enceinte passent devant : on arrive trois pas plus loin, pour rester visible.
  m.object('depuis-halles', 'arrivee', 24, 10);
  return m.toTiled();
}

/** Le parvis de la Grande Bibliothèque : la Bibliothèque, la maison mère des Gardiens, le Conseil Œcuménique. */
function septPortesParvis() {
  const m = nationsBlock(26, 20, 'dalles');
  // La façade de la Grande Bibliothèque, au nord, et sa porte.
  for (const col of [8, 9, 10, 11, 13, 14, 15, 16]) m.setObstacle(col, 2, 'archives');
  house(m, 'sept-portes-bibliotheque', 'archives', [12, 2], [12, 3]);
  // La Borne Première [NOTION] : les noms des huit receveurs, le seul monument jamais restauré.
  m.setObstacle(12, 9, 'stele');
  m.object('borne-premiere', 'panneau', 12, 9, {
    texte: 'La Borne Première. Huit noms, que personne n’a jamais effacés : ceux qui ont reçu les premiers mots, à la première génération après le Nexus. C’est le seul monument de la ville qu’on ait jamais restauré.',
  });
  house(m, 'sept-portes-gardiens', 'maison-pilotis', [4, 9], [5, 10]);
  house(m, 'sept-portes-conseil', 'dome', [20, 9], [19, 10]);
  for (const [c, r] of [[7, 6], [17, 6], [7, 14], [17, 14]]) m.setObstacle(c, r, 'reverbere');
  for (const [c, r] of [[3, 15], [22, 15], [10, 16], [15, 16]]) m.setObstacle(c, r, 'arbre');
  m.setObstacle(25, 10, null);
  m.object('vers-place', 'sortie', 25, 10, { cible: 'sept-portes', arrivee: 'depuis-parvis', libelle: 'La place des Sept Portes' });
  m.object('depuis-place', 'arrivee', 22, 10);
  return m.toTiled();
}

/** Les Halles Basses : le Cratère de Sartharion rebâti en marché aux fruits, la statue d'Aldara, les Trois Cents. */
function septPortesHalles() {
  const m = nationsBlock(26, 20, 'paves');
  // Le cratère, deux kilomètres dans le canon : ici, un grand creux de dalles, les étals tout autour.
  for (let row = 4; row <= 16; row++) for (let col = 7; col <= 19; col++) if ((col - 13) ** 2 + (row - 10) ** 2 <= 30) m.setGround(col, row, 'dalles');
  for (const [c, r] of [[9, 5], [17, 5], [7, 10], [19, 10], [9, 15], [17, 15]]) m.setObstacle(c, r, 'etal');
  for (const [c, r] of [[10, 5], [16, 15], [8, 13]]) m.setObstacle(c, r, 'tonneaux');
  // La statue d'Aldara, à trois cents pas du bord ; le monument des Trois Cents (le siège de 1861).
  m.setObstacle(3, 4, 'stele');
  m.object('statue-aldara', 'panneau', 3, 4, {
    texte: 'Aldara, debout sur une ligne, haute comme dix maisons. Au socle : « Je ne sais plus si je me souviens, ou si l’on me l’a raconté. »',
  });
  for (const col of [21, 22, 23]) m.setObstacle(col, 4, 'stele');
  m.object('monument-trois-cents', 'panneau', 22, 4, {
    texte: 'Le monument des Trois Cents. Quatre-vingts Éprouveurs et deux cent vingt volontaires, sortis de l’Anneau au quatre-vingt-unième jour du siège, en 1861. Le plus jeune avait dix-sept ans ; c’était un rameur.',
  });
  for (const [c, r] of [[4, 16], [22, 16]]) m.setObstacle(c, r, 'arbre');
  m.setObstacle(0, 10, null);
  m.object('vers-place', 'sortie', 0, 10, { cible: 'sept-portes', arrivee: 'depuis-halles', libelle: 'La place des Sept Portes' });
  m.object('depuis-place', 'arrivee', 1, 10);
  m.object('entree', 'arrivee', 1, 10);
  return m.toTiled();
}

Object.assign(INTERIORS, {
  'sept-portes-bibliotheque': (() => {
    const json = interior('sept-portes-bibliotheque', {
      w: 11,
      h: 9,
      outside: 'sept-portes-parvis',
      floor: 'dalles',
      furniture: [
        [2, 1, 'etagere'], [3, 1, 'etagere'], [4, 1, 'etagere'], [6, 1, 'etagere'], [7, 1, 'etagere'], [10, 1, 'etagere'],
        [1, 3, 'etagere'], [1, 4, 'etagere'], [1, 6, 'etagere'],
        [9, 0, 'renfoncement'],
        [5, 4, 'lutrin'], [8, 5, 'comptoir'], [9, 5, 'comptoir'], [3, 7, 'lutrin'], [10, 7, 'cristal-veille'], [7, 7, 'lutrin'],
      ],
      objects: [
        ['ambroise', 'pnj', 8, 4, { moment: 'jour' }],
        ['portier-nuit', 'pnj', 4, 8, { moment: 'nuit' }],
        ['registre-mains', 'objet', 5, 4],
        ['registre-consultations', 'objet', 3, 7],
        // Une dédicace qu'on corrige chaque nuit, en cachette (étude du 2026-11-03, H4).
        ['livre-dedicace', 'objet', 7, 7],
        ['verre-sacre', 'panneau', 10, 7, { texte: 'Sous verre sacré, les manuscrits de Kael : une écriture serrée, qui ne laisse aucune marge. Une main d’enfant, d’abord, puis celle d’un vieil homme.' }],
        ['porte-fonds-muet', 'porte', 9, 0, { cible: 'sept-portes-fonds-muet', arrivee: 'entree', libelle: 'Le Fonds Muet', verrou: 'fonds-muet-ouvert', dialogue: 'porte-fonds-muet' }],
        ['devant-sept-portes-fonds-muet', 'arrivee', 9, 1],
      ],
    });
    return json;
  })(),
  'sept-portes-fonds-muet': interior('sept-portes-fonds-muet', {
    outside: 'sept-portes-bibliotheque',
    floor: 'dalles',
    furniture: [[1, 1, 'etagere'], [2, 1, 'etagere'], [5, 1, 'etagere'], [6, 1, 'etagere'], [1, 3, 'etagere'], [1, 4, 'etagere'], [4, 3, 'lutrin']],
    objects: [
      ['page-dernier-depart', 'objet', 4, 3],
      // La caisse sans main (« La caisse sans main », après le chapitre 5).
      ['caisse-terminus', 'objet', 6, 3, { tuile: 'caisses', apparaitSi: 'caisse-terminus-cherchee', disparaitSi: 'caisse-terminus-reglee' }],
    ],
  }),
  'sept-portes-gardiens': interior('sept-portes-gardiens', {
    w: 8,
    h: 6,
    outside: 'sept-portes-parvis',
    furniture: [[2, 1, 'etagere'], [3, 1, 'etagere'], [7, 1, 'cheminee'], [5, 3, 'cristal-veille'], [7, 5, 'table']],
    objects: [['hesper', 'pnj', 4, 2]],
  }),
  'sept-portes-auberge': interior('sept-portes-auberge', {
    w: 8,
    h: 6,
    outside: 'sept-portes',
    furniture: [[1, 1, 'tonneaux'], [1, 2, 'tonneaux'], [7, 1, 'cheminee'], [3, 3, 'comptoir'], [4, 3, 'comptoir'], [2, 5, 'table'], [7, 4, 'table']],
    objects: [['josse', 'pnj', 4, 2], ['edda', 'pnj', 6, 4, { apparaitSi: 'registre-lu', disparaitSi: 'edda-partie' }]],
  }),
  'sept-portes-cartographe': interior('sept-portes-cartographe', {
    outside: 'sept-portes',
    furniture: [[2, 1, 'etagere'], [5, 1, 'etagere'], [4, 3, 'table'], [1, 4, 'caisses']],
    objects: [['lior', 'pnj', 3, 2]],
  }),
  'sept-portes-conseil': interior('sept-portes-conseil', {
    w: 8,
    h: 6,
    outside: 'sept-portes-parvis',
    floor: 'dalles',
    furniture: [[2, 1, 'gradin'], [3, 1, 'gradin'], [4, 1, 'gradin'], [5, 1, 'gradin'], [6, 1, 'gradin'], [4, 3, 'table']],
    objects: [['greffiere', 'pnj', 5, 3]],
  }),
  'sept-portes-jumeaux': interior('sept-portes-jumeaux', {
    outside: 'sept-portes',
    furniture: [[1, 1, 'lit'], [2, 1, 'lit'], [6, 1, 'etagere'], [4, 3, 'table']],
    objects: [['arlo', 'pnj', 3, 2], ['mina', 'pnj', 5, 2]],
  }),
});

// --- Aetherhaven, la cité flottante (chapitre 5, docs/univers/lieux/aetherhaven.md ; visuels provisoires) --------
// Canon [NOTION, Zephyria] : des îles portées par les cristaux azur, reliées par des ponts suspendus, à trois mille
// mètres ; dessous, une mer de nuages. Trois quartiers : le Quai des Dirigeables, les Îles-Marchés, la Haute-Île.

/**
 * Les voiles qui passent (docs/univers/lieux/aetherhaven.md) : on les attrape d'un clic ; chacune a son dialogue
 * (src/data/dialogues/voile-*.json). Celles des six noms n'apparaissent que si on les a lâchés au vent, en bas.
 */
function voiles(m, list) {
  for (const [name, c, r, extra] of list) m.object(name, 'objet', c, r, { tuile: 'voile', flotte: 'oui', disparaitSi: `${name}-attrapee`, ...(extra ?? {}) });
}

/** A city above the clouds: clouds everywhere, nothing walkable until islands and bridges are laid. */
function skyCity(width, height) {
  const m = new MapBuilder(width, height);
  m.ground.fill(gid('nuages'));
  return m;
}

/** An island, an ellipse of radii rx × ry around (cc, cr). */
function island(m, cc, cr, rx, ry, tile = 'ilot') {
  for (let row = cr - ry; row <= cr + ry; row++) {
    for (let col = cc - rx; col <= cc + rx; col++) {
      if (((col - cc) / (rx + 0.5)) ** 2 + ((row - cr) / (ry + 0.5)) ** 2 <= 1) m.setGround(col, row, tile);
    }
  }
}

/** A suspended bridge along a row or a column. */
function skyBridge(m, [c0, r0], [c1, r1]) {
  if (r0 === r1) for (let col = Math.min(c0, c1); col <= Math.max(c0, c1); col++) m.setGround(col, r0, 'pont-ciel-c');
  else for (let row = Math.min(r0, r1); row <= Math.max(r0, r1); row++) m.setGround(c0, row, 'pont-ciel-r');
}

Object.assign(LOCATION_NAMES, {
  'aetherhaven-voilerie': 'Voilerie Clairvol',
  'aetherhaven-compagnie': 'Comptoir de la Compagnie Vire-Nuée',
  'aetherhaven-perchoir': 'Le Perchoir des Ailes Noires',
  'aetherhaven-soute': 'La soute d’un dirigeable',
  'aetherhaven-nid': 'Le Nid des Nuées',
  'aetherhaven-moulin': 'Maison-moulin Plume-Vive',
  'aetherhaven-registre': 'Le Registre des Voiles',
  'aetherhaven-tour': 'La Tour des Vents',
  'aetherhaven-temple': 'Le Temple du Grand Courant',
  'aetherhaven-observatoire': 'L’Observatoire des vents',
  'aetherhaven-relais': 'Relais des Gardiens de Mémoire',
});

/** Le Quai des Dirigeables : on arrive là, sous l'arche de la Charte. */
function aetherhavenQuai() {
  const m = skyCity(28, 22);
  island(m, 12, 11, 8, 7);
  m.rect(1, 5, 4, 17, 'planches'); // le quai de bois, où s'amarrent les dirigeables
  island(m, 22, 5, 2, 2); // l'îlot du Perchoir
  skyBridge(m, [18, 6], [19, 6]);
  skyBridge(m, [21, 11], [27, 11]); // vers les Îles-Marchés

  for (const [c, r] of [[2, 6], [2, 11], [2, 17]]) m.setObstacle(c, r, 'mat-amarrage');
  m.setObstacle(2, 8, 'dirigeable');
  m.object('dirigeable-confederation', 'porte', 2, 8, { cible: CARTE_DU_MONDE, libelle: 'Le dirigeable de la Confédération' });
  // ★ La soute d'un dirigeable amarré : celui qui sert la dame en gris.
  house(m, 'aetherhaven-soute', 'dirigeable', [2, 14], [3, 14], { verrou: 'soute-ouverte', dialogue: 'porte-soute' });
  m.setObstacle(6, 9, 'arche-vent');
  m.object('arche-charte', 'panneau', 6, 9, {
    texte: 'Sur l’arche, en lettres d’or pâle : « Rien ne doit entraver le vent. » Charte de la Confédération, article premier.',
  });
  m.object('entree', 'arrivee', 4, 10);
  // La vigie de Siffrin, d'où l'on guette les dirigeables et les oiseaux.
  m.setObstacle(10, 5, 'vigie');
  m.object('siffrin', 'pnj', 11, 6, { moment: 'jour' });
  house(m, 'aetherhaven-voilerie', 'maison-voile', [16, 7], [16, 8]);
  house(m, 'aetherhaven-compagnie', 'maison-voile', [8, 15], [9, 15]);
  house(m, 'aetherhaven-perchoir', 'maison-voile', [22, 4], [22, 5]);
  m.object('gardien-ciel', 'pnj', 7, 11);
  for (const [c, r] of [[5, 7], [5, 15], [14, 13], [18, 10], [11, 17]]) m.setObstacle(c, r, 'cristal-azur');
  for (const [c, r] of [[13, 8], [17, 15]]) m.setObstacle(c, r, 'jardin-suspendu');
  m.setObstacle(15, 16, 'filet');
  m.setObstacle(20, 9, 'panneau');
  m.object('panneau-quai', 'panneau', 20, 9, { texte: 'Aetherhaven — le Quai des Dirigeables. À l’est, par le pont, les Îles-Marchés.' });
  m.object('vers-marches', 'sortie', 27, 11, { cible: 'aetherhaven-marches', arrivee: 'depuis-quai', libelle: 'Le pont des Îles-Marchés' });
  m.object('depuis-marches', 'arrivee', 24, 11);
  voiles(m, [['voile-quai-1', 9, 13], ['voile-quai-2', 15, 10], ['voile-quai-3', 18, 13]]);
  // Les quêtes de la ville : Céleste et sa machine à un cristal ; le commis de Ferros qui attend qu'on lui rende Holger ;
  // la nuit du convoi, la Veuve Grêle et ses pirates sur le quai de bois.
  m.object('celeste', 'pnj', 19, 8, { disparaitSi: 'celeste-tombee' });
  m.object('agent-ferros', 'pnj', 8, 12, { disparaitSi: 'asile-reglee' });
  const raid = { moment: 'nuit', apparaitSi: 'convoi-attendu', disparaitSi: 'raid-regle' };
  m.object('veuve-grele', 'ennemi', 3, 7, { ...raid, ennemi: 'veuve-grele', dialogue: 'veuve-grele', texte: 'La Veuve Grêle.' });
  m.object('pirate-quai-1', 'ennemi', 3, 9, { ...raid, ennemi: 'pirate-air', dialogue: 'veuve-grele', texte: 'Un pirate de l’air.' });
  m.object('pirate-quai-2', 'ennemi', 4, 13, { ...raid, ennemi: 'pirate-air', dialogue: 'veuve-grele', texte: 'Un pirate de l’air.' });
  return m.toTiled();
}

/** Les Îles-Marchés : des îlots et leurs ponts ; le marché, le Nid des Nuées, le Registre des Voiles. */
function aetherhavenMarches() {
  const m = skyCity(30, 24);
  island(m, 4, 12, 3, 3); // l'îlot d'arrivée
  island(m, 14, 12, 5, 4); // le marché
  island(m, 12, 3, 4, 2); // le Nid des Nuées, la maison-moulin
  island(m, 21, 3, 1, 1); // l'îlot du vent, qu'on n'atteint qu'en sautant
  island(m, 13, 21, 4, 2); // le Registre des Voiles
  island(m, 25, 12, 3, 3); // vers la Haute-Île
  skyBridge(m, [0, 12], [0, 12]);
  skyBridge(m, [8, 12], [8, 12]);
  skyBridge(m, [13, 6], [13, 7]);
  skyBridge(m, [13, 17], [13, 18]);
  skyBridge(m, [20, 12], [21, 12]);
  skyBridge(m, [29, 12], [29, 12]);

  m.object('vers-quai', 'sortie', 0, 12, { cible: 'aetherhaven-quai', arrivee: 'depuis-marches', libelle: 'Le Quai des Dirigeables' });
  m.object('depuis-quai', 'arrivee', 2, 12);
  m.object('vers-haute-ile', 'sortie', 29, 12, { cible: 'aetherhaven-haute-ile', arrivee: 'depuis-marches', libelle: 'La Haute-Île' });
  m.object('depuis-haute-ile', 'arrivee', 26, 12);
  // Le marché : la nourriture vient d'en bas, elle est chère.
  for (const [c, r] of [[11, 10], [17, 10], [11, 14], [17, 14]]) m.setObstacle(c, r, 'etal');
  for (const [c, r] of [[14, 9], [14, 15], [5, 10], [24, 14]]) m.setObstacle(c, r, 'cristal-azur');
  for (const [c, r] of [[10, 12], [18, 12]]) m.setObstacle(c, r, 'jardin-suspendu');
  m.setObstacle(16, 15, 'filet');
  house(m, 'aetherhaven-nid', 'maison-voile', [11, 2], [11, 3]);
  house(m, 'aetherhaven-moulin', 'moulin', [14, 2], [14, 3]);
  house(m, 'aetherhaven-registre', 'maison-voile', [12, 21], [13, 21]);
  // Sauter d'îlot en îlot (Athlétisme) : deux cases de nuages entre le Nid et l'îlot du vent.
  m.object('saut-ilot-vent', 'objet', 16, 3, { tuile: 'saut' });
  m.object('ilot-vent-arrivee', 'arrivee', 20, 3);
  m.object('saut-ilot-retour', 'objet', 21, 2, { tuile: 'saut' });
  m.object('ilot-nid-arrivee', 'arrivee', 15, 3);
  m.setObstacle(22, 3, 'machine-volante');
  m.object('carcasse-ilot', 'coffre', 22, 3, { disparaitSi: 'carcasse-fouillee' });
  m.setObstacle(6, 15, 'panneau');
  m.object('panneau-marches', 'panneau', 6, 15, { texte: 'Les Îles-Marchés. Au nord, le Nid des Nuées ; au sud, le Registre des Voiles ; à l’est, la Haute-Île.' });
  m.object('odile', 'pnj', 15, 11);
  m.object('oiselier', 'pnj', 12, 15);
  voiles(m, [['voile-marches-1', 13, 10], ['voile-marches-2', 16, 13], ['voile-marches-3', 2, 14], ['voile-marches-4', 15, 22], ['voile-nom-1', 9, 4, { apparaitSi: 'rouleau-lache' }]]);
  return m.toTiled();
}

/** La Haute-Île : la Tour des Vents, le Temple du Grand Courant, l'Observatoire, le Relais ; au bord, le Lâcher. */
function aetherhavenHauteIle() {
  const m = skyCity(28, 22);
  island(m, 14, 11, 10, 8);
  for (let row = 3; row <= 19; row++) for (let col = 4; col <= 24; col++) if (m.groundAt(col, row) === gid('ilot') && (col - 14) ** 2 / 36 + (row - 9) ** 2 / 16 <= 1) m.setGround(col, row, 'dalles-azur');
  skyBridge(m, [0, 12], [3, 12]);
  m.object('vers-marches', 'sortie', 0, 12, { cible: 'aetherhaven-marches', arrivee: 'depuis-haute-ile', libelle: 'Les Îles-Marchés' });
  m.object('depuis-marches', 'arrivee', 3, 12);
  m.object('entree', 'arrivee', 3, 12);
  house(m, 'aetherhaven-tour', 'tour-vents', [14, 5], [14, 6]);
  house(m, 'aetherhaven-temple', 'temple-vent', [8, 8], [9, 8]);
  house(m, 'aetherhaven-observatoire', 'maison-voile', [20, 8], [20, 9]);
  house(m, 'aetherhaven-relais', 'maison-voile', [8, 15], [9, 15]);
  for (const [c, r] of [[11, 7], [17, 7], [11, 12], [17, 12], [14, 16]]) m.setObstacle(c, r, 'cristal-azur');
  for (const [c, r] of [[6, 11], [19, 15], [12, 18]]) m.setObstacle(c, r, 'jardin-suspendu');
  // Le Lâcher : le bord de l'île, d'où l'on lâche les voiles.
  for (const row of [9, 10, 11, 13, 14]) m.setObstacle(24, row, 'garde-fou');
  m.object('voile-lacher', 'objet', 24, 12, { tuile: 'voile-accrochee' });
  m.object('lacher', 'objet', 24, 10);
  m.setObstacle(21, 13, 'panneau');
  m.object('panneau-lacher', 'panneau', 21, 13, { texte: 'Le Lâcher. Ce qu’on lâche d’ici, le vent le porte à qui voudra le prendre.' });
  // La nuit, celui qui change la voile du garde-fou (le mystère de la ville).
  m.object('bastien', 'pnj', 23, 11, { moment: 'nuit' });
  voiles(m, [['voile-haute-1', 16, 14], ['voile-haute-2', 10, 10], ['voile-haute-3', 20, 12], ['voile-nom-2', 18, 17, { apparaitSi: 'rouleau-lache' }]]);
  return m.toTiled();
}

Object.assign(INTERIORS, {
  'aetherhaven-voilerie': interior('aetherhaven-voilerie', {
    outside: 'aetherhaven-quai',
    furniture: [[2, 1, 'etabli'], [3, 1, 'etabli'], [6, 1, 'etagere'], [1, 4, 'ballots'], [1, 3, 'ballots'], [6, 4, 'machine-volante']],
    objects: [['vessin', 'pnj', 4, 3]],
  }),
  'aetherhaven-compagnie': interior('aetherhaven-compagnie', {
    outside: 'aetherhaven-quai',
    furniture: [[2, 1, 'etagere'], [5, 1, 'etagere'], [3, 3, 'comptoir'], [4, 3, 'comptoir'], [6, 4, 'table'], [1, 4, 'caisses']],
    objects: [['ossiane', 'pnj', 4, 2]],
  }),
  'aetherhaven-perchoir': interior('aetherhaven-perchoir', {
    outside: 'aetherhaven-quai',
    furniture: [[1, 1, 'tonneaux'], [6, 1, 'cristal-veille'], [1, 4, 'hamac'], [4, 3, 'table'], [6, 4, 'table']],
    objects: [['ravel', 'pnj', 3, 2], ['carnet-perchoir', 'objet', 4, 3, { disparaitSi: 'onze-carnet' }]],
  }),
  'aetherhaven-soute': interior('aetherhaven-soute', {
    outside: 'aetherhaven-quai',
    floor: 'planches',
    furniture: [[1, 1, 'caisses'], [2, 1, 'caisses'], [1, 2, 'ballots'], [6, 1, 'tonneaux'], [6, 2, 'tonneaux'], [5, 4, 'caisses'], [2, 4, 'caisses']],
    objects: [['achats-edda', 'coffre', 2, 4, { disparaitSi: 'achats-edda-vus' }]],
  }),
  'aetherhaven-nid': interior('aetherhaven-nid', {
    w: 8,
    h: 6,
    outside: 'aetherhaven-marches',
    furniture: [[1, 2, 'hamac'], [1, 4, 'hamac'], [7, 1, 'cristal-veille'], [3, 3, 'comptoir'], [4, 3, 'comptoir'], [7, 4, 'table'], [5, 5, 'table']],
    objects: [['assel', 'pnj', 4, 2], ['holger', 'pnj', 6, 3, { disparaitSi: 'holger-livre' }]],
  }),
  'aetherhaven-moulin': interior('aetherhaven-moulin', {
    outside: 'aetherhaven-marches',
    furniture: [[1, 1, 'lit'], [6, 1, 'etagere'], [4, 3, 'table'], [1, 4, 'ballots']],
    objects: [['siffrin', 'pnj', 3, 2, { moment: 'nuit' }]],
  }),
  'aetherhaven-registre': interior('aetherhaven-registre', {
    w: 9,
    h: 7,
    outside: 'aetherhaven-marches',
    furniture: [
      [2, 1, 'etagere'], [3, 1, 'etagere'], [4, 1, 'etagere'], [6, 1, 'etagere'], [7, 1, 'etagere'],
      [1, 3, 'etagere'], [1, 4, 'etagere'], [5, 4, 'lutrin'], [7, 4, 'comptoir'], [8, 4, 'comptoir'], [3, 6, 'ballots'],
    ],
    objects: [['ysolde', 'pnj', 7, 3], ['tiroir-voiles', 'objet', 5, 4]],
  }),
  'aetherhaven-tour': interior('aetherhaven-tour', {
    w: 9,
    h: 7,
    outside: 'aetherhaven-haute-ile',
    floor: 'dalles-azur',
    furniture: [[2, 1, 'gradin'], [3, 1, 'gradin'], [4, 1, 'gradin'], [5, 1, 'gradin'], [6, 1, 'gradin'], [7, 1, 'gradin'], [4, 3, 'table'], [5, 3, 'table'], [1, 5, 'cristal-azur'], [8, 5, 'cristal-azur']],
    objects: [['sieges-conseil', 'panneau', 5, 1, { texte: 'Dix-huit sièges, un par cité. Ici, on décide à l’unanimité, ou aux deux tiers ; le plus souvent, on ne décide pas.' }]],
  }),
  'aetherhaven-temple': interior('aetherhaven-temple', {
    w: 8,
    h: 6,
    outside: 'aetherhaven-haute-ile',
    floor: 'dalles-azur',
    furniture: [[2, 1, 'cristal-azur'], [6, 1, 'cristal-azur'], [4, 1, 'stele'], [1, 4, 'jardin-suspendu'], [7, 4, 'jardin-suspendu']],
    objects: [['zelie', 'pnj', 4, 3], ['shass', 'pnj', 6, 2], ['doublure-dome', 'objet', 4, 1]],
  }),
  'aetherhaven-observatoire': interior('aetherhaven-observatoire', {
    outside: 'aetherhaven-haute-ile',
    furniture: [[2, 1, 'etagere'], [5, 1, 'lutrin'], [4, 3, 'table'], [1, 4, 'cristal-azur']],
    objects: [['evrard', 'pnj', 3, 2]],
  }),
  'aetherhaven-relais': interior('aetherhaven-relais', {
    outside: 'aetherhaven-haute-ile',
    furniture: [[2, 1, 'etagere'], [3, 1, 'etagere'], [6, 1, 'cristal-veille'], [1, 4, 'hamac'], [5, 4, 'table']],
    objects: [],
  }),
});

// --- En bas : la Voie du Bas, sous la mer de nuages (chapitre 5, « Les noms qui montent ») -------------------------
// Canon [NOTION, La Septième Voile] : « Il faut commencer par le sol, puisque tout le monde l'oublie. » Après le
// Nexus, la cendre restait suspendue à trois ou quatre cents mètres. Ici : un pays gris, des rails sous la poussière.

/** A grey land under the clouds: ash, heaps of ash, ruins, from a fixed seed. */
function ashLand(width, height, seed, keepClear) {
  const m = new MapBuilder(width, height);
  m.ground.fill(gid('sol-cendre'));
  const rng = mulberry32(seed);
  for (let col = 0; col < width; col++) {
    m.setObstacle(col, 0, 'tas-cendres');
    m.setObstacle(col, height - 1, 'tas-cendres');
  }
  for (let row = 0; row < height; row++) {
    m.setObstacle(0, row, 'tas-cendres');
    m.setObstacle(width - 1, row, 'tas-cendres');
  }
  for (let row = 1; row < height - 1; row++) {
    for (let col = 1; col < width - 1; col++) {
      if (keepClear(col, row)) continue;
      const roll = rng();
      if (roll < 0.05) m.setObstacle(col, row, 'tas-cendres');
      else if (roll < 0.07) m.setObstacle(col, row, 'ruine');
      else if (roll < 0.2) m.setGround(col, row, 'paves-cendre');
    }
  }
  return m;
}

/** Où le dirigeable descend : une échelle de corde qui pend des nuages ; les rails partent vers l'est. */
function basCendres() {
  const rail = 8;
  const m = ashLand(22, 16, 7100, (c, r) => Math.abs(r - rail) <= 1 || (c <= 5 && r >= 5 && r <= 11));
  m.line([4, rail], [21, rail], 'rail');
  m.setObstacle(3, 8, 'echelle-corde');
  m.object('echelle-remontee', 'objet', 3, 8);
  m.object('entree', 'arrivee', 4, 9);
  m.object('depuis-voie', 'arrivee', 19, 9);
  m.setObstacle(21, rail, null);
  m.object('vers-voie', 'sortie', 21, rail, { cible: 'voie-du-bas', arrivee: 'depuis-cendres', libelle: 'Suivre les rails' });
  m.setObstacle(9, 5, 'panneau');
  m.object('borne-bas', 'panneau', 9, 5, { texte: 'Une borne de l’Ancien Monde, mangée par la cendre. On lit encore un chiffre : 7.' });
  return m.toTiled();
}

/** La voie elle-même : une tranchée, des wagons morts ; un Écho ; des Mantes-ailes nichent dans les carcasses. */
function voieDuBas() {
  const rail = 7;
  const m = ashLand(28, 14, 7200, (c, r) => Math.abs(r - rail) <= 1 || (c >= 11 && c <= 15 && r >= 8 && r <= 11));
  m.line([0, rail], [27, rail], 'rail');
  blocks(m, 'wagon', [[9, 5], [10, 5], [17, 9], [18, 9]]);
  m.object('depuis-cendres', 'arrivee', 2, 7);
  m.object('entree', 'arrivee', 2, 7);
  m.setObstacle(0, rail, null);
  m.object('vers-cendres', 'sortie', 0, rail, { cible: 'bas-cendres', arrivee: 'depuis-voie', libelle: 'Revenir vers l’échelle' });
  m.setObstacle(27, rail, null);
  m.object('vers-halte', 'sortie', 27, rail, { cible: 'halte-cendres', arrivee: 'depuis-voie', libelle: 'La Halte des Cendres' });
  m.object('depuis-halte', 'arrivee', 25, 7);
  // L'Écho de la voie (src/data/echos.json) se pose en (13, 9).
  // Deux Mantes-ailes nichent dans les wagons, en travers de la voie : on se bat, on passe, ou l'on attend.
  const mantes = { ennemi: 'mante-ailes', dialogue: 'mantes-voie', disparaitSi: 'mantes-voie-vaincues,mantes-voie-passees' };
  m.object('mante-voie-1', 'ennemi', 19, 7, { ...mantes, texte: 'Deux Mantes-ailes, sur la voie.' });
  m.object('mante-voie-2', 'ennemi', 20, 8, { ...mantes, texte: 'Deux Mantes-ailes, sur la voie.' });
  return m.toTiled();
}

/** La Halte des Cendres, au bout de la voie : un quai, un butoir, la caisse. */
function halteCendres() {
  const m = ashLand(20, 14, 7300, (c, r) => r >= 5 && r <= 10);
  m.rect(4, 3, 16, 5, 'quai');
  m.line([0, 7], [15, 7], 'rail');
  blocks(m, 'butoir', [[16, 7]]);
  blocks(m, 'reverbere', [[5, 3], [15, 3]]);
  m.setObstacle(0, 7, null);
  m.object('vers-voie', 'sortie', 0, 7, { cible: 'voie-du-bas', arrivee: 'depuis-halte', libelle: 'Repartir par la voie' });
  m.object('depuis-voie', 'arrivee', 2, 7);
  m.object('entree', 'arrivee', 2, 7);
  m.setObstacle(11, 4, 'caisse-ouverte');
  m.object('caisse-zephyria', 'objet', 11, 4);
  // La dame en gris est arrivée la première, avec deux Ailes Noires payées pour la descente.
  m.object('edda-halte', 'pnj', 10, 5, { disparaitSi: 'edda-halte-reglee' });
  const escorte = { ennemi: 'aile-noire-lame', disparaitSi: 'escorte-edda-vaincue,edda-halte-reglee', texte: 'Une Aile Noire, payée pour la descente. Elle attend la dame en gris, et te regarde sans hâte.' };
  m.object('aile-gage-1', 'ennemi', 13, 6, escorte);
  m.object('aile-gage-2', 'ennemi', 14, 5, escorte);
  m.setObstacle(7, 4, 'stele');
  m.object('panneau-halte', 'panneau', 7, 4, { texte: 'Sur une plaque, sous la cendre : « Halte — voie 7 — ne pas stationner. »' });
  return m.toTiled();
}

// --- Coralia, la cité du corail (chapitre 6, docs/univers/lieux/coralia.md ; visuels provisoires) ------------------
// Canon [NOTION, Marisol] : corail fossilisé, bois flotté, verre marin ; des canaux, des ponts en arche ; le Palais du
// Grand Amiral, un coquillage nacré. Deux fois par jour, la mer se retire du Grand Port (src/rules/marees.ts).

Object.assign(LOCATION_NAMES, {
  'coralia-entrepot': 'L’Entrepôt des douanes',
  'coralia-chantier': 'Le Chantier naval',
  'coralia-confrerie': 'La maison de la Confrérie des Brisants',
  'coralia-auberge': 'La Conque Rieuse',
  'coralia-coquelune': 'Maison Coquelune',
  'coralia-relais': 'Relais des Gardiens de Mémoire',
  'coralia-plongeurs': 'La maison des Plongeurs de Perles',
  'coralia-palais': 'Le Palais du Grand Amiral',
  'coralia-temple': 'Le Temple des Profondeurs Chuchotantes',
  'coralia-conques': 'La Salle des Conques',
});

/** Le Grand Port, à marée haute ou basse : à marée basse, le sable se découvre, et des rails sortent de la mer. */
function coraliaPort(reflux) {
  const m = new MapBuilder(30, 24);
  m.ground.fill(gid('eau'));
  for (let row = 0; row <= 13; row++) for (let col = 8; col < 30; col++) m.setGround(col, row, 'corail-dalles');
  for (let row = 0; row <= 13; row++) m.setGround(8, row, 'quai');
  for (let col = 8; col < 30; col++) m.setGround(col, 13, 'quai');
  if (reflux) {
    for (let row = 0; row < 24; row++) {
      for (let col = 0; col < 30; col++) {
        const near = (col >= 4 && col <= 7 && row <= 17) || (row >= 14 && row <= 17 && col >= 4);
        if (near && m.groundAt(col, row) === gid('eau')) m.setGround(col, row, 'sable-mouille');
      }
    }
    m.line([12, 14], [12, 23], 'rail-noye');
    m.object('vers-voie-noyee', 'sortie', 12, 23, { cible: 'coralia-voie-noyee', arrivee: 'depuis-port', libelle: 'Suivre les rails sous la mer' });
    // La grotte du Grand Reflux, et le banc d'huîtres perlières, que la marée basse découvre.
    m.setObstacle(4, 17, 'grotte');
    m.object('vers-grotte', 'sortie', 5, 17, { cible: 'coralia-grotte', arrivee: 'depuis-port', libelle: 'La grotte du Grand Reflux' });
    m.object('banc-perles', 'objet', 6, 15, { tuile: 'banc-perles' });
  }
  m.object('depuis-grotte', 'arrivee', 9, 12);
  // Le Cargo Noir, confisqué depuis 2995 ; son second, sur parole, sur le quai. Le jour, une veuve devant l'autel ;
  // la nuit, un vieux marin.
  m.setObstacle(2, 9, 'cargo-noir');
  m.object('gunnar', 'pnj', 9, 9);
  m.object('amande', 'pnj', 13, 7, { moment: 'jour' });
  m.object('basile', 'pnj', 13, 7, { moment: 'nuit' });
  for (const [c, r] of [[14, 15], [18, 15], [24, 15]]) m.setObstacle(c, r, 'bateau');
  m.setObstacle(7, 6, 'bateau');
  m.object('navire-marisol', 'porte', 7, 6, { cible: CARTE_DU_MONDE, libelle: 'Le navire de la Thalassocratie' });
  m.object('entree', 'arrivee', 9, 6);
  m.object('depuis-voie', 'arrivee', 12, 12);
  // L'Entrepôt des douanes, sur le quai du sud ; la capitaine devant ; à marée basse, sa cale sort de l'eau, côté mer.
  house(m, 'coralia-entrepot', 'entrepot', [16, 11], [16, 12], { verrou: 'entrepot-ouvert', dialogue: 'porte-entrepot' });
  m.object('merande', 'pnj', 18, 12);
  if (reflux) m.object('cale-entrepot', 'objet', 16, 14, { tuile: 'saut' });
  house(m, 'coralia-chantier', 'maison-corail', [20, 4], [20, 5]);
  for (const [c, r] of [[22, 7], [23, 8]]) m.setObstacle(c, r, 'chantier');
  house(m, 'coralia-confrerie', 'maison-corail-bleue', [25, 10], [25, 11]);
  for (const [c, r] of [[11, 11], [21, 11]]) m.setObstacle(c, r, 'filet-peche');
  for (const [c, r] of [[10, 3], [18, 9], [26, 4], [14, 9]]) m.setObstacle(c, r, 'lanterne-coquillage');
  m.setObstacle(12, 8, 'autel-corail');
  m.object('autel-port', 'objet', 12, 8);
  m.setObstacle(10, 10, 'panneau');
  m.object('panneau-port', 'panneau', 10, 10, { texte: 'Coralia — le Grand Port. Sur le linteau, en lettres d’or : « La mer donne, la mer reprend, la mer protège. »' });
  m.setObstacle(29, 8, null);
  m.object('vers-canaux', 'sortie', 29, 8, { cible: 'coralia-canaux', arrivee: 'depuis-port', libelle: 'Les Canaux' });
  m.object('depuis-canaux', 'arrivee', 27, 8);
  return m.toTiled();
}

/** Les Canaux : les maisons de corail, les ponts en arche, le marché flottant, la Conque Rieuse. */
function coraliaCanaux() {
  const m = new MapBuilder(28, 22);
  m.ground.fill(gid('corail-dalles'));
  for (let col = 0; col < 28; col++) {
    m.setGround(col, 7, 'eau');
    m.setGround(col, 15, 'eau');
  }
  for (let row = 8; row <= 14; row++) m.setGround(13, row, 'eau');
  for (const col of [6, 20]) m.setGround(col, 7, 'pont-arche-r');
  for (const col of [7, 21]) m.setGround(col, 15, 'pont-arche-r');
  m.setGround(13, 11, 'pont-arche-c');
  for (const [c, r] of [[3, 15], [10, 15], [17, 7], [24, 15]]) m.setObstacle(c, r, 'maison-bateau');
  house(m, 'coralia-auberge', 'maison-corail', [6, 4], [6, 5]);
  house(m, 'coralia-coquelune', 'maison-corail-bleue', [20, 4], [20, 5]);
  house(m, 'coralia-relais', 'maison-corail-bleue', [6, 18], [7, 18]);
  house(m, 'coralia-plongeurs', 'maison-corail', [21, 18], [22, 18]);
  for (const [c, r] of [[16, 9], [18, 9], [16, 13], [18, 13], [9, 9]]) m.setObstacle(c, r, 'etal');
  for (const [c, r] of [[3, 3], [24, 3], [11, 18], [17, 19], [4, 12], [23, 12]]) m.setObstacle(c, r, 'lanterne-coquillage');
  m.setObstacle(0, 11, null);
  m.object('vers-port', 'sortie', 0, 11, { cible: 'coralia-port', arrivee: 'depuis-canaux', libelle: 'Le Grand Port' });
  m.object('depuis-port', 'arrivee', 2, 11);
  m.object('vers-amiraute', 'sortie', 27, 11, { cible: 'coralia-amiraute', arrivee: 'depuis-canaux', libelle: 'L’Amirauté' });
  m.object('depuis-amiraute', 'arrivee', 25, 11);
  m.object('tadeo', 'pnj', 11, 13);
  m.object('doucenet', 'pnj', 19, 11);
  m.setObstacle(10, 12, 'panneau');
  m.object('panneau-canaux', 'panneau', 10, 12, { texte: 'Les Canaux. Au nord, la Conque Rieuse ; au sud, les Plongeurs de Perles ; à l’est, l’Amirauté.' });
  return m.toTiled();
}

/** L'Amirauté : le Palais du Grand Amiral, le Temple des Profondeurs Chuchotantes, la Salle des Conques. */
function coraliaAmiraute() {
  const m = new MapBuilder(26, 22);
  m.ground.fill(gid('corail-dalles'));
  for (let row = 19; row < 22; row++) for (let col = 0; col < 26; col++) m.setGround(col, row, 'eau');
  for (let col = 0; col < 26; col++) m.setGround(col, 18, 'quai');
  house(m, 'coralia-palais', 'palais-nacre', [13, 4], [13, 5]);
  house(m, 'coralia-temple', 'temple-abysse', [6, 10], [7, 10]);
  house(m, 'coralia-conques', 'salle-conques', [19, 10], [19, 11]);
  for (const [c, r] of [[10, 15], [16, 15]]) m.setObstacle(c, r, 'autel-corail');
  for (const [c, r] of [[10, 5], [16, 5], [4, 14], [22, 14], [13, 9]]) m.setObstacle(c, r, 'lanterne-coquillage');
  m.setObstacle(0, 11, null);
  m.object('vers-canaux', 'sortie', 0, 11, { cible: 'coralia-canaux', arrivee: 'depuis-amiraute', libelle: 'Les Canaux' });
  m.object('depuis-canaux', 'arrivee', 2, 11);
  m.object('entree', 'arrivee', 2, 11);
  m.setObstacle(4, 8, 'panneau');
  m.object('panneau-amiraute', 'panneau', 4, 8, { texte: 'L’Amirauté. « Mare Nostrum, Vita Nostra » : notre mer, notre vie.' });
  return m.toTiled();
}

/** À marée basse, la voie qui entre dans la mer : des rails sous le sable mouillé, et une halte noyée. */
function coraliaVoieNoyee() {
  const m = new MapBuilder(22, 14);
  m.ground.fill(gid('sable-mouille'));
  for (let row = 0; row < 14; row++) for (let col = 0; col < 22; col++) if (row >= 12 || col <= 1 || col >= 20) m.setGround(col, row, 'eau');
  m.line([11, 0], [11, 11], 'rail-noye');
  m.rect(6, 8, 10, 10, 'quai');
  m.rect(12, 8, 16, 10, 'quai');
  blocks(m, 'butoir', [[11, 11]]);
  blocks(m, 'ruine', [[7, 8], [15, 8]]);
  blocks(m, 'reverbere', [[9, 10], [14, 10]]);
  m.object('vers-port', 'sortie', 11, 0, { cible: 'coralia-port', arrivee: 'depuis-voie', libelle: 'Remonter vers le Grand Port' });
  m.object('depuis-port', 'arrivee', 11, 1);
  m.object('entree', 'arrivee', 11, 1);
  m.setObstacle(13, 9, 'stele');
  m.object('panneau-halte-noyee', 'panneau', 13, 9, { texte: 'Une plaque, sous les algues : « Halte de la Mer — voie 7 ». Le reste a été poli par les marées.' });
  // L'Écho de la halte noyée (src/data/echos.json) se pose en (8, 9).
  return m.toTiled();
}

/** La grotte du Grand Reflux, à marée basse : des bassins, une bouche de l'Abysse, les Abyssaux et leur novice. */
function coraliaGrotte() {
  const m = new MapBuilder(18, 12);
  m.ground.fill(gid('sable-mouille'));
  for (let col = 0; col < 18; col++) {
    m.setObstacle(col, 0, 'rocher-mouille');
    m.setObstacle(col, 11, 'rocher-mouille');
  }
  for (let row = 0; row < 12; row++) {
    m.setObstacle(0, row, 'rocher-mouille');
    m.setObstacle(17, row, 'rocher-mouille');
  }
  for (const [c, r] of [[5, 3], [6, 3], [5, 8], [11, 2], [12, 2]]) m.setGround(c, r, 'eau');
  for (const [c, r] of [[8, 4], [4, 6], [13, 8]]) m.setObstacle(c, r, 'rocher-mouille');
  m.setObstacle(14, 5, 'faille');
  m.setObstacle(0, 6, null);
  m.object('vers-port', 'sortie', 0, 6, { cible: 'coralia-port', arrivee: 'depuis-grotte', libelle: 'Ressortir avant la marée' });
  m.object('depuis-port', 'arrivee', 1, 6);
  m.object('entree', 'arrivee', 1, 6);
  m.object('lio', 'pnj', 13, 6, { disparaitSi: 'lio-libre' });
  const sect = { ennemi: 'abyssal', dialogue: 'abyssaux-grotte', disparaitSi: 'abyssaux-vaincus,abyssaux-partis,lio-libre', texte: 'Des Abyssaux.' };
  m.object('abyssal-1', 'ennemi', 11, 6, sect);
  m.object('abyssal-2', 'ennemi', 12, 4, sect);
  m.object('abyssal-3', 'ennemi', 12, 8, sect);
  return m.toTiled();
}

const CORAL_ROOM = { floor: 'corail-dalles', wall: 'mur' };
Object.assign(INTERIORS, {
  'coralia-entrepot': interior('coralia-entrepot', {
    ...CORAL_ROOM, w: 8, h: 6, outside: 'coralia-port',
    furniture: [[1, 1, 'caisses'], [2, 1, 'caisses'], [1, 2, 'tonneaux'], [7, 1, 'caisses'], [7, 2, 'tonneaux'], [5, 3, 'caisse-plomb'], [3, 4, 'table']],
    objects: [['caisse-marisol', 'objet', 5, 3, { disparaitSi: 'caisse-marisol-reglee' }]],
  }),
  'coralia-chantier': interior('coralia-chantier', { ...CORAL_ROOM, outside: 'coralia-port', furniture: [[2, 1, 'etabli'], [3, 1, 'etabli'], [6, 1, 'etagere'], [1, 4, 'ballots'], [6, 4, 'tonneaux']], objects: [['aureo', 'pnj', 4, 3]] }),
  'coralia-confrerie': interior('coralia-confrerie', { ...CORAL_ROOM, outside: 'coralia-port', furniture: [[1, 1, 'tonneaux'], [4, 3, 'table'], [5, 3, 'table'], [6, 1, 'etagere'], [1, 4, 'filet-peche']], objects: [['matteo', 'pnj', 3, 2]] }),
  'coralia-auberge': interior('coralia-auberge', {
    ...CORAL_ROOM, w: 8, h: 6, outside: 'coralia-canaux',
    furniture: [[1, 1, 'tonneaux'], [1, 2, 'tonneaux'], [7, 1, 'lanterne-coquillage'], [3, 3, 'comptoir'], [4, 3, 'comptoir'], [2, 5, 'table'], [7, 4, 'table']],
    objects: [['noea', 'pnj', 4, 2]],
  }),
  'coralia-coquelune': interior('coralia-coquelune', { ...CORAL_ROOM, outside: 'coralia-canaux', furniture: [[1, 1, 'lit'], [6, 1, 'etagere'], [4, 3, 'table'], [1, 4, 'filet-peche']], objects: [['aio', 'pnj', 3, 2, { disparaitSi: 'aio-plonge-seul' }], ['iris-coquelune', 'pnj', 2, 2]] }),
  'coralia-relais': interior('coralia-relais', { ...CORAL_ROOM, outside: 'coralia-canaux', furniture: [[2, 1, 'etagere'], [3, 1, 'etagere'], [6, 1, 'lanterne-coquillage'], [5, 4, 'table']], objects: [] }),
  'coralia-plongeurs': interior('coralia-plongeurs', { ...CORAL_ROOM, outside: 'coralia-canaux', furniture: [[1, 1, 'filet-peche'], [6, 1, 'conque'], [4, 3, 'table'], [1, 4, 'tonneaux']], objects: [['ondine', 'pnj', 3, 2]] }),
  'coralia-palais': interior('coralia-palais', {
    ...CORAL_ROOM, w: 9, h: 7, outside: 'coralia-amiraute',
    furniture: [[2, 1, 'gradin'], [3, 1, 'gradin'], [5, 1, 'gradin'], [6, 1, 'gradin'], [4, 3, 'table'], [5, 3, 'table'], [1, 5, 'lanterne-coquillage'], [8, 5, 'lanterne-coquillage']],
    objects: [['marina-azurios', 'pnj', 4, 2]],
  }),
  'coralia-temple': interior('coralia-temple', { ...CORAL_ROOM, w: 8, h: 6, outside: 'coralia-amiraute', furniture: [[4, 1, 'autel-corail'], [2, 1, 'lanterne-coquillage'], [6, 1, 'lanterne-coquillage'], [1, 4, 'conque'], [7, 4, 'conque']], objects: [['euria', 'pnj', 4, 3]] }),
  'coralia-conques': interior('coralia-conques', {
    ...CORAL_ROOM, w: 9, h: 7, outside: 'coralia-amiraute',
    furniture: [[1, 0, 'vitre-mer'], [2, 0, 'vitre-mer'], [3, 0, 'vitre-mer'], [4, 0, 'vitre-mer'], [5, 0, 'vitre-mer'], [6, 0, 'vitre-mer'], [7, 0, 'vitre-mer'], [8, 0, 'vitre-mer'],
      [2, 2, 'conque'], [4, 2, 'conque'], [6, 2, 'conque'], [8, 2, 'conque'], [2, 5, 'conque'], [7, 5, 'conque']],
    objects: [['conque-muette', 'objet', 7, 5], ['oaina', 'pnj', 5, 4], ['edda-coralia', 'pnj', 3, 3, { apparaitSi: 'mer-rend-commencee', disparaitSi: 'caisse-marisol-reglee' }]],
  }),
});

// --- La Marche-Mère, la ville qui marche (chapitre 7, docs/univers/lieux/marche-mere.md ; visuels provisoires) -------
// Canon [NOTION, la Communion] : une Marche n'est pas embarquée ; la foule va à pied et en convois autour des douze
// Léviathans, qui portent les clans-souches et le Cœur Spiral. Le jour, elle avance (le sable défile, src/rules/marche.ts) ;
// le soir, elle dresse le camp.

Object.assign(LOCATION_NAMES, {
  'marche-halte': 'La Halte',
  'marche-mille-pas': 'La Tente des Mille Pas',
  'marche-eau': 'La Tente de l’Eau',
  'marche-guides': 'La tente des guides',
  'marche-relais': 'Relais des Gardiens de Mémoire',
  'marche-ren': 'La tente des Ren',
  'marche-atelier': 'L’Atelier de Varo’Ssin',
  'marche-comptoir': 'Le comptoir des Matriarches de Cristaux',
  'marche-pavillon': 'Le Pavillon de la Reine',
  'marche-temple': 'Le Temple du Désert-Vivant',
  'marche-nid': 'Le Nid des dragonnets',
  'marche-saal-ema': 'La tente de Saal’Ema',
});

/** Le Camp du soir, ou la Marche en route : les mêmes foyers, en tentes le soir, en chariots le jour. */
function marcheCamp(dresse) {
  const m = new MapBuilder(32, 26);
  m.ground.fill(gid('sable'));
  for (let col = 0; col < 32; col++) for (const row of [12, 13]) m.setGround(col, row, 'piste');
  if (!dresse) for (let row = 0; row < 26; row++) for (const col of [15, 16]) m.setGround(col, row, 'piste');
  const homes = [
    ['marche-halte', 'tente-ocre', 'chariot-ocre', [8, 8]],
    ['marche-mille-pas', 'tente-mille-pas', 'chariot', [16, 6]],
    ['marche-eau', 'tente-eau', 'chariot-eau', [24, 8]],
    ['marche-guides', 'tente-beige', 'chariot', [8, 17]],
    ['marche-relais', 'tente-beige', 'chariot', [19, 19]],
    ['marche-ren', 'tente-rouge', 'chariot-ocre', [25, 17]],
  ];
  for (const [id, tente, chariot, [c, r]] of homes) house(m, id, dresse ? tente : chariot, [c, r], [c, r + 1]);
  // La caravane des verriers, qui va à Sept-Portes et en revient (la carte du monde).
  m.setObstacle(1, 11, 'four-verre');
  m.object('caravane', 'porte', 1, 11, { cible: CARTE_DU_MONDE, libelle: 'La caravane des verriers' });
  m.object('entree', 'arrivee', 2, 12);
  m.object('vers-verriers', 'sortie', 31, 12, { cible: 'marche-verriers', arrivee: 'depuis-camp', libelle: 'Le convoi des verriers' });
  m.object('depuis-verriers', 'arrivee', 29, 12);
  m.object('vers-coeur', 'sortie', 15, 0, { cible: 'marche-coeur', arrivee: 'depuis-camp', libelle: 'L’échelle de corde du Cœur Spiral' });
  m.object('depuis-coeur', 'arrivee', 15, 2);
  m.object('vers-longue-ombre', 'sortie', 15, 25, { cible: 'marche-longue-ombre', arrivee: 'depuis-camp', libelle: 'L’échelle de Longue-Ombre' });
  m.object('depuis-longue-ombre', 'arrivee', 15, 23);
  // Quitter la Marche : le désert, et la halte morte qu'on voit de la piste.
  m.object('vers-desert', 'sortie', 0, 22, { cible: 'marche-desert', arrivee: 'depuis-camp', libelle: 'Quitter la Marche' });
  m.object('depuis-desert', 'arrivee', 2, 21);
  if (dresse) {
    for (const [c, r] of [[12, 10], [20, 14], [6, 14]]) m.setObstacle(c, r, 'feu-camp');
    for (const [c, r] of [[11, 15], [13, 15], [20, 10], [22, 10]]) m.setObstacle(c, r, 'etal');
    for (const [c, r] of [[4, 4], [28, 4], [4, 21], [28, 22], [12, 21]]) m.setObstacle(c, r, 'tente-beige');
    for (const [c, r] of [[20, 3], [11, 3], [24, 23]]) m.setObstacle(c, r, 'tente-ocre');
    m.setObstacle(27, 13, 'jalon');
    m.object('ahm-ras', 'pnj', 13, 11);
  } else {
    for (const [c, r] of [[4, 4], [28, 4], [4, 21], [28, 22], [12, 21], [20, 3], [11, 3], [24, 23]]) m.setObstacle(c, r, 'chariot');
    for (const [c, r] of [[6, 11], [22, 14], [11, 14]]) m.setObstacle(c, r, 'voile-ombre');
  }
  m.object('oss-amar', 'pnj', 9, 22, { disparaitSi: 'fin-arreter-reste' });
  m.setObstacle(4, 11, 'panneau');
  m.object('panneau-camp', 'panneau', 4, 11, { texte: dresse
    ? 'Le Camp du soir. Un jalon planté pour la nuit, sans un mot dessus : la Communion n’écrit pas. Un enfant te montre du doigt la Halte, la Tente des Mille Pas, la Tente de l’Eau.'
    : 'La Marche en route : les tentes pliées dans les chariots, la foule à pied, et au loin les douze Léviathans qui avancent au pas. Le soir, tout se remontera en trente minutes.' });
  return m.toTiled();
}

/** Le convoi des verriers (Vel'Amra) : les chariots-fours où l'on coule les jalons, l'atelier, le comptoir des cristaux. */
function marcheVerriers() {
  const m = new MapBuilder(26, 20);
  m.ground.fill(gid('sable'));
  for (let col = 0; col < 26; col++) for (const row of [10, 11]) m.setGround(col, row, 'piste');
  house(m, 'marche-atelier', 'four-verre', [8, 6], [8, 7]);
  house(m, 'marche-comptoir', 'tente-rouge', [18, 6], [18, 7]);
  for (const [c, r] of [[4, 6], [13, 5], [22, 5], [5, 15], [12, 15], [20, 15]]) m.setObstacle(c, r, 'four-verre');
  for (const [c, r] of [[9, 14], [10, 14], [11, 14], [16, 14], [17, 14]]) m.setObstacle(c, r, 'jalon');
  for (const [c, r] of [[15, 8], [3, 12]]) m.setObstacle(c, r, 'caisses');
  m.object('eskil', 'pnj', 12, 13, { disparaitSi: 'fin-forage-noir-rentre,fin-forage-noir-livre' });
  m.object('vers-camp', 'sortie', 0, 10, { cible: 'marche-camp', arrivee: 'depuis-verriers', libelle: 'Le Camp' });
  m.object('depuis-camp', 'arrivee', 2, 10);
  m.object('entree', 'arrivee', 2, 10);
  m.setObstacle(6, 9, 'panneau');
  m.object('panneau-verriers', 'panneau', 6, 9, { texte: 'Le convoi des verriers. Des tiges de verre d’un mètre vingt refroidissent en rang dans le sable : les jalons des haltes à venir.' });
  return m.toTiled();
}

/** A platform of carapace on a Léviathan's back: an oval, its rim a flank one does not cross. */
function leviathanBack(m, cx, cy, rx, ry, floor) {
  for (let row = 0; row < m.height; row++) {
    for (let col = 0; col < m.width; col++) {
      const d = ((col - cx) / rx) ** 2 + ((row - cy) / ry) ** 2;
      if (d <= 1) m.setGround(col, row, d < 0.55 && floor ? floor : 'carapace');
    }
  }
}

/** Le Cœur Spiral, sur le Léviathan central : le Pavillon de la Reine, le Temple, les piliers, les Perchoirs. */
function marcheCoeur() {
  const m = new MapBuilder(26, 22);
  m.ground.fill(0);
  leviathanBack(m, 13, 11, 11.5, 9.5, 'verre-sol');
  for (let col = 0; col <= 2; col++) m.setGround(col, 11, 'pont-corde');
  house(m, 'marche-pavillon', 'palais-cristal', [13, 4], [13, 5]);
  house(m, 'marche-temple', 'temple-desert', [6, 9], [7, 10]);
  house(m, 'marche-nid', 'nid-dragon', [20, 9], [20, 10]);
  for (const [c, r] of [[10, 8], [16, 8], [10, 14], [16, 14]]) m.setObstacle(c, r, 'pilier-cristal');
  m.setObstacle(19, 4, 'dragon-rouge');
  m.object('kresh-tal', 'objet', 19, 4);
  for (const [c, r] of [[7, 15], [19, 15]]) m.setObstacle(c, r, 'voile-ombre');
  m.object('vers-camp', 'sortie', 13, 20, { cible: 'marche-camp', arrivee: 'depuis-coeur', libelle: 'Redescendre au camp' });
  m.object('depuis-camp', 'arrivee', 13, 18);
  m.object('entree', 'arrivee', 13, 18);
  m.object('vers-longue-ombre', 'sortie', 0, 11, { cible: 'marche-longue-ombre', arrivee: 'depuis-coeur', libelle: 'Le pont de corde vers Longue-Ombre' });
  m.object('depuis-longue-ombre', 'arrivee', 3, 11);
  m.setObstacle(12, 16, 'panneau');
  m.object('panneau-coeur', 'panneau', 12, 16, { texte: 'Le Cœur Spiral. Le cristal pousse en spirale, sans murs, pour que le vent passe. Sous tes pieds nus, la carapace est tiède.' });
  return m.toTiled();
}

/** Le dos de Longue-Ombre, la plus vieille des douze : le clan-souche de Saal'Ema, et sa soigneuse près de la tête. */
function marcheLongueOmbre() {
  const m = new MapBuilder(24, 18);
  m.ground.fill(0);
  leviathanBack(m, 11, 9, 10.5, 7.5, null);
  for (let col = 0; col <= 1; col++) m.setGround(col, 9, 'pont-corde');
  m.setObstacle(21, 9, 'tete-leviathan');
  m.object('longue-ombre', 'objet', 21, 9);
  m.object('nes-mira', 'pnj', 18, 10);
  house(m, 'marche-saal-ema', 'tente-ocre', [8, 5], [8, 6]);
  for (const [c, r] of [[12, 4], [5, 12], [13, 13]]) m.setObstacle(c, r, 'tente-beige');
  for (const [c, r] of [[15, 6], [6, 9]]) m.setObstacle(c, r, 'voile-ombre');
  m.setObstacle(14, 12, 'citerne');
  m.object('vers-coeur', 'sortie', 0, 9, { cible: 'marche-coeur', arrivee: 'depuis-longue-ombre', libelle: 'Le pont de corde vers le Cœur Spiral' });
  m.object('depuis-coeur', 'arrivee', 3, 9);
  m.object('vers-camp', 'sortie', 11, 16, { cible: 'marche-camp', arrivee: 'depuis-longue-ombre', libelle: 'Descendre au camp' });
  m.object('depuis-camp', 'arrivee', 11, 14);
  m.object('entree', 'arrivee', 11, 14);
  return m.toTiled();
}

/** Hors de la Marche : neuf kilomètres de sable entre la piste et une halte morte ; un col entre deux lignes de dunes. */
function marcheDesert() {
  const m = new MapBuilder(28, 20);
  m.ground.fill(gid('sable'));
  for (const [c, r] of [[5, 4], [9, 15], [20, 6], [22, 16], [7, 9], [24, 3], [11, 18], [3, 16]]) m.setObstacle(c, r, 'dune');
  // Une crête de dunes du nord au sud ; on la passe par un col, que les pilleurs gardent tant que la quête dure.
  for (let row = 0; row < 20; row++) if (row < 9 || row > 11) m.setObstacle(14, row, 'dune');
  const pilleurs = { ennemi: 'pilleur-sables', dialogue: 'pilleurs-desert', apparaitSi: 'plus-lieu-commencee', disparaitSi: 'pilleurs-vaincus,pilleurs-partis,pilleurs-contournes,caisse-communion-reglee', texte: 'Deux pilleurs au chèche noir.' };
  m.object('pilleur-1', 'ennemi', 14, 9, pilleurs);
  m.object('pilleur-2', 'ennemi', 14, 10, pilleurs);
  m.object('pilleur-3', 'ennemi', 14, 11, pilleurs);
  // Le retour : la Marche ne revient pas, il faut la rattraper (un jet de Survie, src/data/dialogues/piste-retour.json).
  m.object('piste-retour', 'objet', 1, 10, { tuile: 'traces-pas' });
  m.object('chariot-perdu', 'objet', 6, 14, { tuile: 'chariot', apparaitSi: 'chariot-perdu-commence', disparaitSi: 'chariot-ramene' });
  m.object('depuis-camp', 'arrivee', 2, 10);
  m.object('entree', 'arrivee', 2, 10);
  m.object('vers-halte', 'sortie', 27, 10, { cible: 'marche-halte-morte', arrivee: 'depuis-desert', libelle: 'Le jalon, là-bas' });
  m.object('depuis-halte', 'arrivee', 25, 10);
  return m.toTiled();
}

/** La halte morte : un jalon debout, et sous le sable, un quai de l'Ancien Monde. */
function marcheHalteMorte() {
  const m = new MapBuilder(22, 16);
  m.ground.fill(gid('sable'));
  m.line([0, 11], [21, 11], 'rail-sable');
  m.rect(6, 8, 15, 10, 'quai');
  blocks(m, 'ruine', [[7, 8], [15, 8]]);
  blocks(m, 'dune', [[3, 3], [18, 4], [4, 14], [17, 14]]);
  blocks(m, 'butoir', [[21, 11]]);
  m.setObstacle(12, 6, 'jalon');
  m.object('jalon-halte', 'objet', 12, 6);
  m.object('caisse-communion', 'objet', 11, 9, { tuile: 'caisse-sable', disparaitSi: 'fin-plus-lieu-longue-ombre,fin-plus-lieu-edda' });
  m.object('edda-marche', 'pnj', 12, 9, { apparaitSi: 'plus-lieu-commencee', disparaitSi: 'caisse-communion-reglee' });
  // L'Écho de la halte morte (src/data/echos.json) se pose en (9, 9), une fois l'épisode dit au pied du jalon.
  m.setObstacle(14, 9, 'stele');
  m.object('panneau-halte-sables', 'panneau', 14, 9, { texte: 'Une plaque de l’Ancien Monde, que le sable a polie : « Halte des Sables — voie 7 ». La Communion n’écrit pas ; quelqu’un, avant elle, écrivait.' });
  m.object('vers-desert', 'sortie', 0, 8, { cible: 'marche-desert', arrivee: 'depuis-halte', libelle: 'Repartir vers la piste' });
  m.object('depuis-desert', 'arrivee', 2, 8);
  m.object('entree', 'arrivee', 2, 8);
  return m.toTiled();
}

const TENT_ROOM = { floor: 'tapis-sable', wall: 'mur-toile' };
const GLASS_ROOM = { floor: 'verre-sol', wall: 'pilier-cristal' };
Object.assign(INTERIORS, {
  'marche-halte': interior('marche-halte', {
    ...TENT_ROOM, w: 8, h: 6, outside: 'marche-camp',
    furniture: [[1, 1, 'tonneaux'], [1, 2, 'tonneaux'], [7, 1, 'citerne'], [3, 3, 'comptoir'], [4, 3, 'comptoir'], [2, 5, 'table'], [7, 4, 'table']],
    objects: [['tam-ruu', 'pnj', 4, 2]],
  }),
  'marche-mille-pas': interior('marche-mille-pas', {
    ...TENT_ROOM, w: 9, h: 7, outside: 'marche-camp',
    furniture: [[2, 1, 'ballots'], [7, 1, 'ballots'], [5, 3, 'feu-camp'], [1, 5, 'ballots'], [8, 5, 'ballots']],
    objects: [['ish-lenne', 'pnj', 5, 2]],
  }),
  'marche-eau': interior('marche-eau', {
    ...TENT_ROOM, w: 8, h: 6, outside: 'marche-camp',
    furniture: [[2, 1, 'citerne'], [4, 1, 'citerne'], [6, 1, 'citerne'], [3, 4, 'table']],
    objects: [['gardienne-eau', 'pnj', 4, 2], ['yel-dara', 'pnj', 6, 3]],
  }),
  'marche-guides': interior('marche-guides', {
    ...TENT_ROOM, outside: 'marche-camp',
    furniture: [[1, 1, 'ballots'], [6, 1, 'caisses'], [4, 3, 'table'], [1, 4, 'ballots']],
    objects: [['daru-khen', 'pnj', 3, 2], ['coffre-routes', 'objet', 6, 1]],
  }),
  'marche-relais': interior('marche-relais', { ...TENT_ROOM, outside: 'marche-camp', furniture: [[2, 1, 'etagere'], [3, 1, 'etagere'], [5, 4, 'table']], objects: [] }),
  'marche-ren': interior('marche-ren', { ...TENT_ROOM, outside: 'marche-camp', furniture: [[1, 1, 'lit'], [6, 1, 'lit'], [4, 3, 'table']], objects: [['dova-ren', 'pnj', 3, 2], ['ysha-ren', 'pnj', 6, 2]] }),
  'marche-atelier': interior('marche-atelier', {
    ...TENT_ROOM, outside: 'marche-verriers',
    furniture: [[2, 1, 'etabli'], [3, 1, 'etabli'], [6, 1, 'jalon'], [6, 2, 'jalon'], [1, 4, 'caisses']],
    objects: [['varo-ssin', 'pnj', 4, 3]],
  }),
  'marche-comptoir': interior('marche-comptoir', {
    ...TENT_ROOM, outside: 'marche-verriers',
    furniture: [[3, 3, 'comptoir'], [4, 3, 'comptoir'], [1, 1, 'caisses'], [6, 1, 'etagere']],
    objects: [['hiran-amra', 'pnj', 4, 2], ['lot-cristaux', 'objet', 6, 4, { tuile: 'caisses' }]],
  }),
  'marche-pavillon': interior('marche-pavillon', {
    ...GLASS_ROOM, w: 9, h: 7, outside: 'marche-coeur',
    furniture: [[2, 2, 'voile-ombre'], [7, 2, 'voile-ombre'], [1, 5, 'citerne']],
    objects: [['shal-vera', 'pnj', 5, 2]],
  }),
  'marche-temple': interior('marche-temple', {
    ...GLASS_ROOM, w: 8, h: 6, outside: 'marche-coeur',
    furniture: [[2, 1, 'jalon'], [4, 1, 'jalon'], [6, 1, 'jalon'], [1, 4, 'pilier-cristal']],
    objects: [['marcheuse-souffle', 'pnj', 4, 3]],
  }),
  'marche-nid': interior('marche-nid', { floor: 'sable', wall: 'mur-toile', w: 8, h: 6, outside: 'marche-coeur', furniture: [[1, 1, 'ballots'], [7, 1, 'citerne']], objects: [['keo-sa', 'pnj', 3, 3], ['dragonnet', 'pnj', 5, 2]] }),
  'marche-saal-ema': interior('marche-saal-ema', { ...TENT_ROOM, outside: 'marche-longue-ombre', furniture: [[1, 1, 'lit'], [6, 1, 'ballots'], [4, 3, 'table']], objects: [['saal-ema', 'pnj', 3, 2]] }),
});

// Les voies endormies à explorer (docs/gdd/voies.md, jalon 3, étape 6) : une réserve de plans de l'Ancien Monde. Chaque
// niveau d'une voie en tire un, puis le jeu le garnit au hasard sur ses points d'apparition : bêtes (`ennemi-1..3`),
// caisses (`coffre-1..3`), pièges (`piege-1..4`), un Écho (`echo-1`), l'objet d'un contrat (`contrat`), la descente.
function voiePlan(ground, layout) {
  const m = cityBlock(18, 14, ground, 'mur-brique');
  m.setObstacle(0, 7, null);
  m.object('sortie', 'sortie', 0, 7, { cible: CARTE_DU_MONDE, libelle: 'Remonter à la surface' });
  m.object('entree', 'arrivee', 2, 7);
  const spots = layout(m);
  for (const [name, [c, r]] of Object.entries(spots)) m.object(name, 'apparition', c, r);
  return m.toTiled();
}

const blocks = (m, tile, cells) => cells.forEach(([c, r]) => m.setObstacle(c, r, tile));
const fill = (m, tile, c0, r0, c1, r1) => {
  for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) m.setObstacle(c, r, tile);
};

const VOIE_MAPS = {
  // Le quai : deux quais, deux voies, des wagons morts.
  'voie-quai': voiePlan('dalles', (m) => {
    m.rect(1, 1, 16, 4, 'quai');
    m.rect(1, 10, 16, 12, 'quai');
    m.line([1, 6], [16, 6], 'rail');
    m.line([1, 8], [16, 8], 'rail');
    blocks(m, 'wagon', [[6, 6], [7, 6], [8, 6], [11, 8], [12, 8]]);
    blocks(m, 'ruine', [[4, 3], [9, 3], [14, 3], [4, 11], [9, 11], [14, 11]]);
    blocks(m, 'reverbere', [[2, 2], [15, 12]]);
    return {
      'ennemi-1': [10, 2], 'ennemi-2': [12, 11], 'ennemi-3': [14, 7],
      'coffre-1': [16, 1], 'coffre-2': [1, 12], 'coffre-3': [16, 11],
      'piege-1': [5, 7], 'piege-2': [9, 7], 'piege-3': [12, 4], 'piege-4': [6, 12],
      'echo-1': [7, 10], contrat: [7, 1], descente: [16, 7],
    };
  }),
  // Le tunnel : une galerie en lacet, coupée par deux murs.
  'voie-tunnel': voiePlan('sol-cendre', (m) => {
    fill(m, 'mur-brique', 5, 4, 16, 4);
    fill(m, 'mur-brique', 1, 9, 12, 9);
    m.line([1, 7], [16, 7], 'rail');
    m.line([5, 2], [16, 2], 'rail');
    m.line([1, 11], [12, 11], 'rail');
    blocks(m, 'wagon', [[8, 2], [9, 2]]);
    blocks(m, 'tas-cendres', [[8, 5], [11, 8], [3, 2], [9, 12], [15, 12]]);
    blocks(m, 'reverbere', [[6, 6], [13, 10]]);
    return {
      'ennemi-1': [12, 6], 'ennemi-2': [7, 11], 'ennemi-3': [3, 11],
      'coffre-1': [16, 1], 'coffre-2': [16, 5], 'coffre-3': [16, 12],
      'piege-1': [7, 7], 'piege-2': [14, 8], 'piege-3': [14, 9], 'piege-4': [10, 12],
      'echo-1': [11, 1], contrat: [13, 3], descente: [1, 12],
    };
  }),
  // Le dépôt : des allées de caisses, des tuyaux, un butoir.
  'voie-depot': voiePlan('dalles', (m) => {
    fill(m, 'caisses', 4, 1, 5, 4);
    fill(m, 'caisses', 4, 9, 5, 12);
    fill(m, 'caisses', 8, 3, 9, 5);
    fill(m, 'caisses', 8, 9, 9, 12);
    fill(m, 'caisses', 12, 1, 13, 4);
    fill(m, 'caisses', 12, 9, 13, 11);
    blocks(m, 'tuyaux', [[15, 1], [16, 2]]);
    m.line([14, 12], [16, 12], 'rail');
    blocks(m, 'butoir', [[16, 12]]);
    blocks(m, 'reverbere', [[2, 2], [10, 7]]);
    return {
      'ennemi-1': [7, 7], 'ennemi-2': [11, 6], 'ennemi-3': [15, 5],
      'coffre-1': [6, 1], 'coffre-2': [10, 12], 'coffre-3': [16, 10],
      'piege-1': [6, 6], 'piege-2': [10, 8], 'piege-3': [14, 7], 'piege-4': [7, 11],
      'echo-1': [2, 11], contrat: [11, 1], descente: [16, 7],
    };
  }),
  // Le poste d'aiguillage : des voies qui se croisent, des leviers que plus personne ne tire.
  'voie-aiguillage': voiePlan('sol-cendre', (m) => {
    m.line([1, 7], [16, 7], 'rail');
    m.line([3, 1], [14, 12], 'rail');
    m.line([3, 12], [14, 1], 'rail');
    blocks(m, 'poste-aiguillage', [[9, 4], [8, 10]]);
    blocks(m, 'levier', [[11, 3], [6, 10]]);
    blocks(m, 'reverbere', [[2, 2], [15, 2], [2, 11], [15, 11]]);
    blocks(m, 'tas-cendres', [[5, 4], [12, 9]]);
    return {
      'ennemi-1': [10, 7], 'ennemi-2': [14, 4], 'ennemi-3': [13, 11],
      'coffre-1': [1, 12], 'coffre-2': [16, 1], 'coffre-3': [16, 12],
      'piege-1': [4, 7], 'piege-2': [12, 7], 'piege-3': [6, 3], 'piege-4': [11, 11],
      'echo-1': [6, 7], contrat: [8, 1], descente: [16, 7],
    };
  }),
};

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
  'ironheart-forges': ironheartForges(),
  'ironheart-marche': ironheartMarche(),
  'ironheart-manufactures': ironheartManufactures(),
  'ironheart-triage': ironheartTriage(),
  'ironheart-cendriere': ironheartCendriere(),
  'ironheart-galerie': ironheartGalerie(),
  'sept-portes': septPortesPlace(),
  'sept-portes-parvis': septPortesParvis(),
  'sept-portes-halles': septPortesHalles(),
  'canopee-amphitheatre': amphitheatre(),
  'aetherhaven-quai': aetherhavenQuai(),
  'aetherhaven-marches': aetherhavenMarches(),
  'aetherhaven-haute-ile': aetherhavenHauteIle(),
  'bas-cendres': basCendres(),
  'voie-du-bas': voieDuBas(),
  'halte-cendres': halteCendres(),
  'coralia-port': coraliaPort(false),
  'coralia-port-reflux': coraliaPort(true),
  'coralia-canaux': coraliaCanaux(),
  'coralia-amiraute': coraliaAmiraute(),
  'coralia-voie-noyee': coraliaVoieNoyee(),
  'coralia-grotte': coraliaGrotte(),
  'marche-route': marcheCamp(false),
  'marche-camp': marcheCamp(true),
  'marche-verriers': marcheVerriers(),
  'marche-coeur': marcheCoeur(),
  'marche-longue-ombre': marcheLongueOmbre(),
  'marche-desert': marcheDesert(),
  'marche-halte-morte': marcheHalteMorte(),
  ...ENCOUNTER_MAPS,
  ...VOIE_MAPS,
})) {
  writeFileSync(new URL(`${id}.json`, out), JSON.stringify(map, null, 1) + '\n');
  console.log(`${id}.json`);
}
for (const [id, map] of Object.entries(INTERIORS)) {
  writeFileSync(new URL(`${id}.json`, out), JSON.stringify(map, null, 1) + '\n');
  console.log(`${id}.json`);
}
