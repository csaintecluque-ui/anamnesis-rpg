import voieData from '../data/voies.json';
import { isWalkable, tileKey, type GameMap, type MapObject } from '../engine/tiledMap';
import type { GameState, VoieState } from '../state/gameState';
import type { Rng } from './checks';
import { findEnemy } from './combat';
import { applyEffects, performRoll, type Dialogue, type DialogueOption, type Effect } from './dialogue';
import { findItem, ownedCount } from './inventory';
import { advance } from './time';
import { findPlace, type WorldPlace } from './world';

/**
 * Les voies endormies à explorer (docs/gdd/voies.md, jalon 3, étape 6) : des ruines de l'Ancien Monde sur la carte du
 * monde. Chaque niveau tire un plan dans une réserve (src/data/maps/voie-*.json) et le garnit au hasard, d'après la
 * graine de la visite : bêtes, caisses, pièges, un Écho, parfois ce qu'un contrat envoie chercher. On descend jusqu'au
 * terminus, puis on remonte ; la visite suivante tire une autre voie. Tout se refait à l'identique depuis
 * `GameState.voie` (même graine, même niveau) : une sauvegarde reprend le même niveau.
 */
interface VoieData {
  profondeur: number;
  plans: { id: string; nom: string }[];
  groupes: Record<string, string[][]>;
  butin: Record<string, string[]>;
  tresor: string[];
  echos: { id: string; texte: string }[];
  pieges: { id: string; repere: string; touche: string }[];
  /** Things a quest sends the hero to fetch on a given level (the adhesion quests, docs/gdd/factions.md). */
  quetes: { quest: string; item: string; flag: string; site: string; depth: number }[];
}

const DATA = voieData as VoieData;

/** How many levels a line goes down: the last one is the terminus. */
export const VOIE_DEPTH = DATA.profondeur;
export const VOIE_PLANS = DATA.plans;
export const VOIE_LOCATION = 'voie-endormie';
/** Story flags that only live for one level (a crate opened, a group beaten, a trap found). */
export const VOIE_FLAG_PREFIX = 'voie-';
export const MAX_TIER = 5;

export const groupFlag = (group: string): string => `voie-groupe-${group}-vaincu`;
const chestFlag = (k: number): string => `voie-coffre-${k}-ouvert`;
const trapFlag = (k: number): string => `voie-piege-${k}`;
const ECHO_FLAG = 'voie-echo-ecoute';
const CONTRACT_FLAG = 'voie-contrat-pris';
const QUEST_FLAG = 'voie-quete-pris';

/** Same generator as scripts/build-maps.mjs: a seed gives always the same draw. */
export function seededRng(seed: number): Rng {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T>(rng: Rng, list: readonly T[]): T => list[Math.floor(rng() * list.length)];
const between = (rng: Rng, min: number, max: number): number => min + Math.floor(rng() * (max - min + 1));

/** Fisher–Yates: the same draw on every browser (a random sort comparator is not). */
function shuffle<T>(rng: Rng, list: T[]): T[] {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

export function voieSite(voie: VoieState): WorldPlace | undefined {
  return findPlace(voie.site);
}

/** Danger of a level: the site's own, deeper and deeper (1 to 5). */
export function tierOf(voie: VoieState): number {
  return Math.min(MAX_TIER, (voieSite(voie)?.voie?.danger ?? 1) + voie.depth - 1);
}

/** The plan of each level, never the same twice in a row. */
export function voiePlan(voie: VoieState): string {
  const raw = (depth: number) => Math.floor(seededRng(voie.seed * 31 + depth)() * VOIE_PLANS.length);
  let index = raw(1);
  for (let depth = 2; depth <= voie.depth; depth++) index = raw(depth) === index ? (raw(depth) + 1) % VOIE_PLANS.length : raw(depth);
  return VOIE_PLANS[index].id;
}

export const isTerminus = (voie: VoieState): boolean => voie.depth >= VOIE_DEPTH;

/** « La halte des Fougères — niveau 2 », « … — le terminus ». */
export function voieTitle(voie: VoieState): string {
  const site = voieSite(voie)?.name ?? 'Une voie endormie';
  return `${site} — ${isTerminus(voie) ? 'le terminus' : `niveau ${voie.depth}`}`;
}

/** « de la halte des Fougères », « du tunnel de la Combe », « du Dépôt Sept ». */
export function deLieu(name: string): string {
  if (name.startsWith('Le ')) return `du ${name.slice(3)}`;
  if (name.startsWith('La ')) return `de la ${name.slice(3)}`;
  if (name.startsWith('L’')) return `de l’${name.slice(2)}`;
  return `de ${name}`;
}

export function clearVoieFlags(flags: Record<string, true>): void {
  for (const key of Object.keys(flags)) if (key.startsWith(VOIE_FLAG_PREFIX)) delete flags[key];
}

/** Going down into a sleeping line from the world map: a new draw, the first level. */
export function startVoie(state: GameState, site: string, rng: Rng = Math.random): void {
  state.voie = { site, seed: Math.floor(rng() * 2 ** 31), depth: 1 };
  clearVoieFlags(state.flags);
  state.encounter = null;
  state.location = VOIE_LOCATION;
  state.entrance = 'entree';
}

/** One level deeper: another plan, other beasts. It takes a while. */
export function descend(state: GameState): boolean {
  if (!state.voie || isTerminus(state.voie)) return false;
  state.voie.depth++;
  clearVoieFlags(state.flags);
  state.entrance = 'entree';
  advance(state.time, 1);
  return true;
}

/** Back to the surface: the world map opens on the site. */
export function leaveVoie(state: GameState): WorldPlace | undefined {
  const site = state.voie ? voieSite(state.voie) : undefined;
  state.voie = null;
  clearVoieFlags(state.flags);
  return site;
}

export interface VoieLevel {
  plan: string;
  title: string;
  tier: number;
  terminus: boolean;
  /** Placed on the plan's spawn points; added to the map by MapScene. */
  objects: MapObject[];
  /** One per crate, Écho or contract object of the level; registered by MapScene. */
  dialogues: Record<string, Dialogue>;
}

/** Spawn points of a plan, by name (objects of type `apparition`). */
function spots(map: GameMap): Map<string, { col: number; row: number }> {
  return new Map(map.objects.filter((o) => o.type === 'apparition').map((o) => [o.name, { col: o.col, row: o.row }]));
}

const AROUND = [[0, 0], [1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1], [2, 0], [0, 2], [-2, 0], [0, -2]];

/** Cells for a group of `count`, around a spot, walkable and free. */
function groupCells(map: GameMap, spot: { col: number; row: number }, count: number, taken: Set<string>): { col: number; row: number }[] {
  const cells: { col: number; row: number }[] = [];
  for (const [dc, dr] of AROUND) {
    const cell = { col: spot.col + dc, row: spot.row + dr };
    if (cells.length < count && isWalkable(map, cell, taken)) {
      cells.push(cell);
      taken.add(tileKey(cell));
    }
  }
  return cells;
}

/** The level the hero stands in: its plan, and what this visit's draw put on it. */
export function voieLevel(state: Pick<GameState, 'voie' | 'contrats' | 'character' | 'quests'>, map: GameMap): VoieLevel {
  const voie = state.voie!;
  const rng = seededRng(voie.seed * 97 + voie.depth * 13 + 7);
  const tier = tierOf(voie);
  const terminus = isTerminus(voie);
  const at = spots(map);
  const objects: MapObject[] = [];
  const dialogues: Record<string, Dialogue> = {};
  // Cells that crates, the Écho, the descent and the traps keep for themselves.
  const reserved = new Set([...at.entries()].filter(([name]) => !name.startsWith('ennemi')).map(([, cell]) => tileKey(cell)));
  const taken = new Set([...reserved, tileKey(at.get('descente')!)]);
  const contract = state.contrats.actif;
  const site = voie.site;

  // Beasts, one group per spot; a hunt contract brings its own on the first level.
  const hunt = contract?.kind === 'chasse' && contract.cible === site && voie.depth === 1 && !contract.fait ? contract : null;
  const groups = Math.min(hunt ? 2 : 3, (voie.depth === 1 ? 1 : 2) + (rng() < 0.5 ? 1 : 0));
  const placeGroup = (group: string, enemies: string[], spot: string, extra: Record<string, string> = {}) => {
    groupCells(map, at.get(spot)!, enemies.length, taken).forEach((cell, i) =>
      objects.push({
        name: `voie-ennemi-${group}-${i + 1}`,
        type: 'ennemi',
        ...cell,
        properties: { ennemi: enemies[i], voie: group, disparaitSi: groupFlag(group), texte: 'Quelque chose bouge dans le noir.', ...extra },
      }),
    );
  };
  for (let g = 1; g <= groups; g++) placeGroup(String(g), pick(rng, DATA.groupes[String(tier)]), `ennemi-${g}`);
  if (hunt) placeGroup('contrat', hunt.enemies ?? [], 'ennemi-3', { contrat: 'oui' });

  // Crates: one or two, and the station master's chest at the terminus.
  const crates = 1 + (rng() < 0.5 ? 1 : 0) + (terminus ? 1 : 0);
  for (let k = 1; k <= crates; k++) {
    const chief = terminus && k === crates;
    const id = `voie-coffre-${k}`;
    objects.push({ name: id, type: 'objet', ...at.get(`coffre-${chief ? 3 : k}`)!, properties: { tuile: 'caisses', lueur: 'oui', disparaitSi: chestFlag(k) } });
    dialogues[id] = crateDialogue(id, k, tier, chief, rng);
  }

  // Traps, hidden on the passages: more of them deeper down.
  const trapSpots = shuffle(rng, ['piege-1', 'piege-2', 'piege-3', 'piege-4']);
  const traps = Math.min(trapSpots.length, Math.floor(rng() * 2) + voie.depth - 1 + (tier >= 3 ? 1 : 0));
  trapSpots.slice(0, traps).forEach((spot, i) =>
    objects.push({ name: `voie-piege-${i + 1}`, type: 'piege', ...at.get(spot)!, properties: { piege: pick(rng, DATA.pieges).id, disparaitSi: trapFlag(i + 1) } }),
  );

  // The thing an adhesion quest sends the hero to fetch, on its level, where the Écho would stand.
  const owns = (item: string) => !!state.character?.inventory.some((s) => s.itemId === item);
  const wanted = DATA.quetes.find((q) => state.quests[q.quest] === 'active' && q.site === site && q.depth === voie.depth && !owns(q.item));
  if (wanted) {
    objects.push({ name: 'voie-quete', type: 'objet', ...at.get('echo-1')!, properties: { tuile: 'caisses', lueur: 'oui', disparaitSi: QUEST_FLAG } });
    dialogues['voie-quete'] = questDialogue(wanted.item, wanted.flag);
  }

  // An Écho of the Ancien Monde, one level in two.
  const echoRoll = rng();
  if (!wanted && echoRoll < 0.5) {
    const echo = pick(rng, DATA.echos);
    objects.push({ name: 'voie-echo', type: 'objet', ...at.get('echo-1')!, properties: { tuile: 'echo', echo: echo.id, disparaitSi: ECHO_FLAG } });
    dialogues['voie-echo'] = echoDialogue(echo.texte);
  }

  // A search contract: the thing lies on its level, until it is found.
  const search = contract?.kind === 'recherche' && contract.cible === site && contract.depth === voie.depth ? contract : null;
  const owned = search?.item && state.character?.inventory.some((s) => s.itemId === search.item);
  if (search?.item && !owned) {
    objects.push({ name: 'voie-contrat', type: 'objet', ...at.get('contrat')!, properties: { tuile: 'caisses', lueur: 'oui', disparaitSi: CONTRACT_FLAG } });
    dialogues['voie-contrat'] = contractDialogue(search.item);
  }

  if (!terminus) objects.push({ name: 'voie-descente', type: 'descente', ...at.get('descente')!, properties: { tuile: 'trou-fouille' } });
  return { plan: voiePlan(voie), title: voieTitle(voie), tier, terminus, objects, dialogues };
}

function crateDialogue(id: string, k: number, tier: number, chief: boolean, rng: Rng): Dialogue {
  const fers = between(rng, 4 + 4 * tier, 10 + 6 * tier) * (chief ? 2 : 1);
  const loot: Effect[] = [{ setFlag: chestFlag(k) }, { giveFers: fers }];
  if (chief || rng() < 0.6) {
    const item = pick(rng, DATA.butin[String(Math.min(MAX_TIER, tier + (chief ? 1 : 0)))]);
    // Arrows and bolts come by the handful (docs/gdd/combat.md, « Munitions »).
    loot.push({ giveItem: item, count: item === 'carreaux' || item === 'fleches' ? 8 : 1 });
  }
  if (chief && rng() < 0.15) loot.push({ giveItem: pick(rng, DATA.tresor) });
  const locked = chief || rng() < 0.35;
  // L'Athlétisme (feuille de route, chantier 2) : a strong arm opens it clean; missed, it opens all the same, and hurts.
  const force: DialogueOption = { text: 'Forcer le couvercle, à mains nues.', roll: { skill: 'athletics', difficulty: 9 + tier }, next: 'ouverte', failNext: 'arrachee' };
  const leave: DialogueOption = { text: 'Laisser.', next: 'fin' };
  const text = chief
    ? 'Le coffre du chef de gare : fer noir, une plaque de cuivre, un nom qu’on a gratté. Un cadenas rongé le tient fermé.'
    : locked
      ? 'Une caisse de l’Ancien Monde, fermée par un cadenas rongé de rouille.'
      : 'Une caisse de l’Ancien Monde, le couvercle entrouvert.';
  return {
    id,
    speaker: id,
    entries: [{ node: 'caisse' }],
    nodes: {
      caisse: {
        text,
        options: locked
          ? [{ text: 'Crocheter le cadenas.', roll: { skill: 'crafting', difficulty: 9 + tier }, next: 'ouverte', failNext: 'coince' }, force, leave]
          : [{ text: 'L’ouvrir.', next: 'ouverte' }, leave],
      },
      ...(locked
        ? {
            coince: { text: 'Le cadenas tient bon, et ta lime glisse sur la rouille.', options: [force, leave] },
            arrachee: {
              text: 'Le couvercle cède d’un coup, et ta main avec : une écharde de fer jusqu’à l’os.',
              effects: [{ blesser: 3 }],
              options: [{ text: 'Ouvrir.', next: 'ouverte' }],
            },
          }
        : {}),
      ouverte: {
        text: 'Le couvercle cède dans un nuage de poussière. Dedans, ce que quelqu’un a laissé là, il y a très longtemps, ou hier.',
        effects: loot,
        options: [{ text: 'Partir.', next: 'fin' }],
      },
    },
  };
}

function echoDialogue(texte: string): Dialogue {
  return {
    id: 'voie-echo',
    speaker: 'voie-echo',
    entries: [{ node: 'scene' }],
    nodes: {
      scene: {
        text: texte,
        options: [
          { text: 'Écouter jusqu’au bout.', effects: [{ setFlag: ECHO_FLAG }, { giveXp: 10 }], next: 'ecoute' },
          { text: 'Partir.', next: 'fin' },
        ],
      },
      ecoute: { text: 'L’Écho s’efface dans la poussière. Il reviendra, pour d’autres.', options: [{ text: 'Partir.', next: 'fin' }] },
    },
  };
}

function contractDialogue(item: string): Dialogue {
  const name = findItem(item)?.name ?? item;
  return {
    id: 'voie-contrat',
    speaker: 'voie-contrat',
    entries: [{ node: 'trouve' }],
    nodes: {
      trouve: {
        text: `Sous les gravats, à l’endroit que disait le contrat : ${name.charAt(0).toLowerCase()}${name.slice(1)}.`,
        options: [
          { text: 'La prendre.', effects: [{ giveItem: item }, { setFlag: CONTRACT_FLAG }], next: 'pris' },
          { text: 'Partir.', next: 'fin' },
        ],
      },
      pris: { text: 'Ce que les voies endormies gardent, elles le gardent bien. Pas cette fois.', options: [{ text: 'Partir.', next: 'fin' }] },
    },
  };
}

function questDialogue(item: string, flag: string): Dialogue {
  const name = findItem(item)?.name ?? item;
  return {
    id: 'voie-quete',
    speaker: 'voie-quete',
    entries: [{ node: 'trouve' }],
    nodes: {
      trouve: {
        text: `Sous les gravats, intacte malgré trois mille ans : ${name.charAt(0).toLowerCase()}${name.slice(1)}. Ce qu’on t’a envoyé chercher.`,
        options: [
          { text: 'La prendre.', effects: [{ giveItem: item }, { setFlag: QUEST_FLAG }, { setFlag: flag }], next: 'pris' },
          { text: 'Partir.', next: 'fin' },
        ],
      },
      pris: { text: 'Il faut maintenant remonter avec. Les voies endormies n’aiment pas qu’on leur prenne quelque chose.', options: [{ text: 'Partir.', next: 'fin' }] },
    },
  };
}

/** Experience for beating a group: half of what its beasts are worth, like the encounters on the road. */
export function groupXp(enemies: string[]): number {
  return Math.round(enemies.reduce((sum, id) => sum + (findEnemy(id)?.xp ?? 0), 0) / 2);
}

/** The group that sees the hero: one of its beasts within two cells. */
export function groupNear(objects: MapObject[], hero: { col: number; row: number }, gone: (o: MapObject) => boolean): string | null {
  const near = objects.find(
    (o) => o.type === 'ennemi' && o.properties.voie && !gone(o) && Math.max(Math.abs(o.col - hero.col), Math.abs(o.row - hero.row)) <= 2,
  );
  return near?.properties.voie ?? null;
}

export interface TrapOutcome {
  /** Seen in time: no harm. */
  spotted: boolean;
  text: string;
  notices: string[];
}

// --- La lampe à cristal (docs/gdd/voies.md, « La lampe », demande de Cyril du 2026-11-03) ----------------------------

export const LAMP_ITEM = 'lampe-cristal';
/** How far the lamp shows the traps, in cells, all around the hero. */
export const LAMP_RADIUS = 2;

export const carriesLamp = (state: Pick<GameState, 'character'>): boolean => !!state.character && ownedCount(state.character, LAMP_ITEM) > 0;

/** A trap seen in the lamp's light: it stays shown until the level is left (a `voie-` flag, cleared with it). */
export const trapSeenFlag = (trap: MapObject): string => `${trap.properties.disparaitSi}-vu`;

/** With the lamp, the traps within its reach are seen from where the hero stands. Returns those seen just now. */
export function lightTraps(state: GameState, objects: MapObject[], hero: { col: number; row: number }, gone: (o: MapObject) => boolean): MapObject[] {
  if (!carriesLamp(state)) return [];
  const seen = objects.filter(
    (o) =>
      o.type === 'piege' &&
      !gone(o) &&
      !state.flags[trapSeenFlag(o)] &&
      Math.max(Math.abs(o.col - hero.col), Math.abs(o.row - hero.row)) <= LAMP_RADIUS,
  );
  for (const trap of seen) state.flags[trapSeenFlag(trap)] = true;
  return seen;
}

/**
 * A hidden trap under the hero's feet: an Investigation roll to see it in time, or PV lost. A trap already seen in
 * the lamp's light is stepped over, without a roll.
 */
export function springTrap(state: GameState, trap: MapObject, rng: Rng = Math.random): TrapOutcome {
  const def = DATA.pieges.find((p) => p.id === trap.properties.piege) ?? DATA.pieges[0];
  const tier = state.voie ? tierOf(state.voie) : 1;
  const lit = !!state.flags[trapSeenFlag(trap)];
  state.flags[trap.properties.disparaitSi] = true;
  if (lit) return { spotted: true, text: def.repere, notices: [] };
  const roll = performRoll(state, { skill: 'investigation', difficulty: 9 + tier }, rng);
  if (roll.success) return { spotted: true, text: def.repere, notices: [roll.notice, ...applyEffects(state, [{ giveXp: 5 }])] };
  return { spotted: false, text: def.touche, notices: [roll.notice, ...applyEffects(state, [{ blesser: 2 + 2 * tier }])] };
}
