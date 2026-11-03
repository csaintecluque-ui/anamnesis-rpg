import { describe, expect, it, vi } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import itemData from '../data/items.json';
import { MAPS } from '../data/maps';
import { parseTiledMap, type GameMap, type MapObject } from '../engine/tiledMap';
import { LOCATIONS, createNewGame, findLocation, type GameState } from '../state/gameState';
import { ENCOUNTERS } from './combat';
import { END, QUESTS, applyEffects, conditionMet, goesTo, hasStoryEntry, raconterOption, startNode, startsCombat, visibleOptions, type Dialogue, type Effect } from './dialogue';
import { FIGURANTS, figurantLines, figurantsAt } from './figurants';
import { equip, merchantDiscount, ownedCount } from './inventory';
import { journalQuests } from './journal';
import { levelForXp } from './leveling';
import { choose, optionTexts, testCharacter } from './questTestKit';
import { knowsRecit } from './recits';
import { reputationLevel, reputationPrices, reputationScore } from './reputation';
import { waitUntil } from './time';
import { ENCOUNTER_VICTORY_FLAG, WORLD_MAP_TARGET, clearEncounterFlags, findPlace, knownPlaces, rencontreXp, storyRencontre, zoneAt } from './world';

/**
 * Parcours : le contenu actuel joué d'affilée, dans une seule partie (un seul GameState), comme le ferait un joueur :
 * on marche de porte en porte, on parle aux PNJ présents sur la carte, les combats sont gagnés (effets de victoire),
 * les jets de dés réussissent sauf mention contraire. Puis des variantes d'ordre et quelques cas limites.
 * Les points encore à trancher par Cyril sont marqués « À trancher par Cyril » ; le reste vérifie le comportement voulu.
 */

// --- Outils ------------------------------------------------------------------------------------------------------

const mapCache = new Map<string, GameMap>();
function mapOf(location: string): GameMap {
  const id = findLocation(location)!.map;
  if (!mapCache.has(id)) mapCache.set(id, parseTiledMap(MAPS[id]));
  return mapCache.get(id)!;
}

/** Same rule as MapScene.gone: `disparaitSi` (one flag is enough), `apparaitSi` (absent until one flag is set). */
function gone(state: GameState, o: MapObject): boolean {
  const any = (list?: string) => (list ?? '').split(',').some((f) => f.trim() && state.flags[f.trim()]);
  if (o.type === 'pnj' && state.groupe.some((m) => m.id === o.name)) return true;
  return any(o.properties.disparaitSi) || (!!o.properties.apparaitSi && !any(o.properties.apparaitSi));
}

/** Is this NPC / object standing on that map now? */
function present(state: GameState, location: string, name: string): boolean {
  const o = mapOf(location).objects.find((x) => x.name === name);
  if (!o) throw new Error(`${location} : pas d’objet ${name}`);
  return !gone(state, o);
}

/** Opens a conversation where the hero stands (NPC, object, locked door or figurant); the first node's effects apply. */
function talk(state: GameState, id: string): string {
  const o = mapOf(state.location).objects.find((x) => x.name === id || x.properties.dialogue === id);
  if (o) {
    expect(gone(state, o), `${id} a disparu de ${state.location}`).toBe(false);
    if (o.properties.verrou) expect(state.flags[o.properties.verrou], `${o.name} : déjà ouverte, pas de dialogue`).toBeFalsy();
  } else {
    const figurant = figurantsAt(state.location).find((f) => f.dialogue === id);
    expect(figurant, `${id} n’est pas à ${state.location}`).toBeDefined();
    expect(hasStoryEntry(DIALOGUES[id], state), `${id} n’a rien à dire`).toBe(true);
  }
  const node = startNode(DIALOGUES[id], state);
  applyEffects(state, DIALOGUES[id].nodes[node].effects);
  return node;
}

/** Talks to a companion travelling with the hero (a tap on them, on the map); the first node's effects apply. */
function companion(state: GameState, id: string): string {
  expect(state.groupe.some((m) => m.id === id), `${id} n’est pas dans le groupe`).toBe(true);
  const d = DIALOGUES[`compagnon-${id}`];
  const node = startNode(d, state);
  applyEffects(state, d.nodes[node].effects);
  return node;
}

/** Chooses an option (visible, enabled; a roll succeeds); a `goTo` moves the hero, as DialogueScene does. */
/** Tells a Récit through a node's « raconter » option: its target node and that node's effects. */
function tell(state: GameState, dialogue: string, node: string, recit: string): void {
  const view = visibleOptions(DIALOGUES[dialogue].nodes[node], state).find((v) => v.option.raconter);
  expect(view, `${dialogue}/${node} : pas d’option pour raconter`).toBeDefined();
  const option = raconterOption(view!.option.raconter!, recit);
  applyEffects(state, option.effects);
  applyEffects(state, DIALOGUES[dialogue].nodes[option.next]?.effects);
}

function say(state: GameState, dialogue: string, node: string, text: string): void {
  const option = choose(state, dialogue, node, text);
  const place = goesTo(option.effects);
  if (place) {
    expect(findLocation(place.location), place.location).toBeDefined();
    state.location = place.location;
  }
}

/** Walks through a door or an exit of the current map; a locked door needs its flag. */
function walk(state: GameState, target: string): void {
  const exit = mapOf(state.location).objects.find((o) => (o.type === 'porte' || o.type === 'sortie') && o.properties.cible === target);
  expect(exit, `${state.location} → ${target} : pas de passage`).toBeDefined();
  if (exit!.properties.verrou) expect(state.flags[exit!.properties.verrou], `${exit!.name} est verrouillée`).toBe(true);
  state.location = target;
}

/** Leaves by the world map for a known place; the story encounter on the way (if any) is met and won. */
function travel(state: GameState, placeId: string): string | null {
  expect(mapOf(state.location).objects.some((o) => o.properties.cible === WORLD_MAP_TARGET), `${state.location} : pas de sortie`).toBe(true);
  expect(knownPlaces(state.flags, state.quests).map((p) => p.id)).toContain(placeId);
  const from = findPlace(findLocation(state.location)!.place!)!;
  const to = findPlace(placeId)!;
  const met = storyRencontre(state, zoneAt(from.x, from.y)) ?? storyRencontre(state, zoneAt(to.x, to.y));
  if (met) {
    clearEncounterFlags(state.flags);
    state.flags[met.story!.flag] = true;
    applyEffects(state, [{ giveXp: rencontreXp(met) }]);
    state.flags[ENCOUNTER_VICTORY_FLAG] = true;
  }
  state.location = to.location;
  return met?.id ?? null;
}

/** A fight started from a dialogue, won (src/data/encounters.json), around its centre object on this map. */
function win(state: GameState, encounter: string): void {
  const e = ENCOUNTERS.find((x) => x.id === encounter)!;
  expect(mapOf(state.location).objects.some((o) => o.name === e.center), `${e.center} pas à ${state.location}`).toBe(true);
  applyEffects(state, e.victoryEffects);
  state.flags[e.victoryFlag] = true;
}

/** The Golem of the Gare (MapScene.startGolemFight), won. */
function golem(state: GameState): void {
  expect(state.location).toBe('gare-engloutie');
  expect(!state.flags['golem-vaincu'] && !state.flags['chantier-arrete'] && state.quests['dernier-train'] === 'active').toBe(true);
  applyEffects(state, [{ setFlag: 'chantier-arrete' }, { completeQuest: 'dernier-train' }, { giveXp: 70 }, { giveFers: 30 }]);
  state.flags['golem-vaincu'] = true;
}

/** XP and Fers won (or spent) by a step; Fers never go below zero. */
function gained(state: GameState, run: () => void): { xp: number; fers: number } {
  const xp = state.character!.xp;
  const fers = state.character!.fers;
  run();
  expect(state.character!.fers, 'Fers négatifs').toBeGreaterThanOrEqual(0);
  return { xp: state.character!.xp - xp, fers: state.character!.fers - fers };
}

const journalStep = (state: GameState, quest: string) => journalQuests(state).find((q) => q.id === quest);
const QUEST_ITEMS = (itemData as { id: string; quest?: boolean }[]).filter((i) => i.quest).map((i) => i.id);
const questItems = (state: GameState) => QUEST_ITEMS.filter((id) => ownedCount(state.character!, id) > 0).sort();
/**
 * Quests left undone. The adhesion quests of the factions of Ferros exclude one another (rivals, docs/gdd/factions.md)
 * and ask for a descent into a sleeping line: they have their own tests (factions.test.ts).
 */
const ADHESIONS = ['lanterne-triage', 'fonds-echos', 'ce-qui-se-souvient'];
const unfinished = (state: GameState) => QUESTS.filter((q) => !ADHESIONS.includes(q.id) && state.quests[q.id] !== 'done').map((q) => q.id);

// --- Balayages : gains répétables, entrées de dialogue qui en cachent une autre -------------------------------------

interface Gain {
  key: string;
  after: GameState;
}

/** Every XP or Fers gain one conversation can give from this state (rolls succeed or fail), with the state after. */
function gains(start: GameState, id: string, limit = 600): Gain[] {
  const d = DIALOGUES[id];
  const s0 = structuredClone(start);
  const entry = startNode(d, s0);
  applyEffects(s0, d.nodes[entry].effects);
  const queue = [{ node: entry, state: s0 }];
  const seen = new Set<string>();
  const out: Gain[] = [];
  while (queue.length && seen.size < limit) {
    const { node, state } = queue.shift()!;
    const key = `${node}|${JSON.stringify([state.flags, state.quests, state.character!.recits, state.character!.inventory, state.character!.fers >= 100])}`;
    if (seen.has(key)) continue;
    seen.add(key);
    visibleOptions(d.nodes[node], state).forEach((view, i) => {
      if (!view.enabled) return;
      const outcomes: [string, boolean][] = [[view.option.next, true]];
      if (view.option.roll && view.option.failNext) outcomes.push([view.option.failNext, false]);
      for (const [next, success] of outcomes) {
        const s = structuredClone(state);
        const before = { xp: s.character!.xp, fers: s.character!.fers };
        if (success) applyEffects(s, view.option.effects);
        if (next !== END) applyEffects(s, d.nodes[next].effects);
        if (s.character!.xp > before.xp || s.character!.fers > before.fers) out.push({ key: `${id}/${node}#${i}${success ? '' : '-échec'} « ${view.option.text} »`, after: s });
        if (next !== END) queue.push({ node: next, state: s });
      }
    });
  }
  return out;
}

/** Can the hero still open this dialogue somewhere (an NPC or object still on its map, a locked door, a figurant)? */
function openable(state: GameState, id: string): boolean {
  for (const location of LOCATIONS.filter((l) => !l.encounter)) {
    for (const o of mapOf(location.id).objects) {
      if (o.properties.dialogue === id && o.properties.verrou) return !state.flags[o.properties.verrou];
      if (o.name === id && !gone(state, o)) return true;
    }
  }
  return FIGURANTS.some((f) => f.dialogue === id) && hasStoryEntry(DIALOGUES[id], state);
}

/** Gains found again in a new conversation after being taken once (while the speaker can still be met). */
function repeatableGains(state: GameState): string[] {
  const found = new Set<string>();
  for (const id of Object.keys(DIALOGUES)) {
    for (const g of gains(state, id)) {
      if (openable(g.after, id) && gains(g.after, id).some((again) => again.key === g.key)) found.add(g.key);
    }
  }
  return [...found];
}

function reachable(d: Dialogue, from: string, state: GameState): Set<string> {
  const seen = new Set<string>();
  const queue = [from];
  while (queue.length) {
    const n = queue.shift()!;
    if (n === END || seen.has(n)) continue;
    seen.add(n);
    for (const v of visibleOptions(d.nodes[n], state)) {
      if (!v.enabled) continue;
      queue.push(v.option.next);
      if (v.option.failNext) queue.push(v.option.failNext);
    }
  }
  return seen;
}

const CONDITION_FLAGS = new Set(
  [...JSON.stringify(DIALOGUES).matchAll(/"(?:flag|notFlag)":"([^"]+)"/g)].map((m) => m[1]).concat(QUESTS.flatMap((q) => (q.etapes ?? []).map((e) => e.si))),
);

/**
 * Entries whose conditions hold but that an earlier entry hides, when what they hide matters: a quest to start or
 * finish, a quest item, or (unless `questsOnly`) a flag that some condition or journal step reads.
 */
function maskedEntries(state: GameState, questsOnly = false): string[] {
  const out: string[] = [];
  const matters = (e: Effect) =>
    ('startQuest' in e && !state.quests[e.startQuest]) ||
    ('completeQuest' in e && state.quests[e.completeQuest] !== 'done') ||
    ('giveItem' in e && QUEST_ITEMS.includes(e.giveItem)) ||
    (!questsOnly && 'setFlag' in e && !state.flags[e.setFlag] && CONDITION_FLAGS.has(e.setFlag));
  for (const d of Object.values(DIALOGUES)) {
    const holding = d.entries.filter((e) => (e.requires ?? []).every((c) => conditionMet(state, c)));
    if (holding.length < 2) continue;
    const main = reachable(d, holding[0].node, state);
    for (const e of holding.slice(1)) {
      const hidden = [...reachable(d, e.node, state)].filter((n) => !main.has(n));
      const lost = hidden.flatMap((n) => [...(d.nodes[n].effects ?? []), ...visibleOptions(d.nodes[n], state).flatMap((v) => v.option.effects ?? [])]).filter(matters);
      if (lost.length) out.push(`${d.id}: ${holding[0].node} cache ${e.node} ${JSON.stringify([...new Set(lost.map((x) => JSON.stringify(x)))])}`);
    }
  }
  return out;
}

const NAVIGATION = ['gardebois', 'canopee', 'ironheart', 'sept-portes', 'compagnie-lisieres', 'nacelliers', 'travailleurs-rail', 'marches-cendres', 'archives-ferros'];
const reputations = (state: GameState) => Object.fromEntries(NAVIGATION.map((p) => [p, reputationScore(state, p)]));

// ---------------------------------------------------------------------------------------------------------------
// A. Parcours principal : Gardebois, la caravane, Canopéa, Ironheart, les voyages — dans l'ordre du contenu.
// ---------------------------------------------------------------------------------------------------------------

describe('Parcours complet, d’une traite', () => {
  const s = createNewGame(testCharacter({}, { diplomacy: 3, investigation: 2, crafting: 2, survival: 2 }));

  it('Gardebois : Ilyane lance « Le Dernier Train », Tobias donne le laissez-passer', () => {
    expect(s.location).toBe('gardebois');
    expect(s.character!.fers).toBe(15);
    expect(talk(s, 'ilyane')).toBe('accueil');
    const g = gained(s, () => {
      say(s, 'ilyane', 'accueil', 'Que se passe-t-il');
      say(s, 'ilyane', 'trouble', 'Tes mains tremblent');
      say(s, 'ilyane', 'atteinte', 'Que puis-je faire');
      say(s, 'ilyane', 'cause', 'La loi de la Mémoire Vivante');
      say(s, 'ilyane', 'savant', 'J’irai à la Gare');
    });
    expect(g).toEqual({ xp: 20, fers: 0 });
    expect(s.quests['dernier-train']).toBe('active');
    expect(journalStep(s, 'dernier-train')).toMatchObject({ done: false });
    expect(talk(s, 'ilyane')).toBe('en-cours');

    expect(talk(s, 'tobias')).toBe('accueil');
    const pass = gained(s, () => {
      say(s, 'tobias', 'accueil', 'Je dois entrer sur le chantier');
      say(s, 'tobias', 'chantier', 'Si ce chantier');
    });
    expect(pass).toEqual({ xp: 25, fers: 0 });
    expect(s.flags['laissez-passer']).toBe(true);
    expect(talk(s, 'tobias')).toBe('accueil-passe');
    expect(optionTexts(s, 'tobias', 'accueil-passe')).toEqual(['Merci encore pour le laissez-passer.', 'Voir l’étal.', 'Que racontent les gens, au marché ?', 'Au revoir.']);
    // L'étal, dès l'accueil (étude du 2026-11-03, B9 : il fallait passer par les rumeurs).
    expect(optionTexts(s, 'tobias', 'accueil')).toContain('Voir l’étal.');
  });

  it('Gardebois : les trois quêtes annexes se donnent avant la Gare', () => {
    walk(s, 'maison-lunelierre');
    expect(talk(s, 'maelis')).toBe('demande');
    say(s, 'maelis', 'demande', 'Je vais t’aider');
    expect(talk(s, 'nell')).toBe('silence');
    walk(s, 'gardebois');
    expect(talk(s, 'liane')).toBe('demande');
    say(s, 'liane', 'demande', 'Où en trouver');
    walk(s, 'reserve-cendrefer');
    expect(talk(s, 'brann')).toBe('demande');
    say(s, 'brann', 'demande', 'Je vais la chercher');
    walk(s, 'gardebois');
    expect(['berceuse', 'herbes-lisiere', 'caisse-egaree'].map((q) => s.quests[q])).toEqual(['active', 'active', 'active']);
    expect(journalQuests(s).filter((q) => !q.done).map((q) => q.id)).toEqual(['caisse-egaree', 'herbes-lisiere', 'berceuse', 'dernier-train']);
  });

  it('La Gare : l’Écho, la caisse de prospection, puis la foreuse sabotée de nuit', () => {
    walk(s, 'gare-engloutie');
    expect(talk(s, 'echo-dernier-train')).toBe('approche');
    expect(gained(s, () => say(s, 'echo-dernier-train', 'approche', 'Entrer dans l’Écho'))).toEqual({ xp: 15, fers: 0 });
    expect(knowsRecit(s.character, 'savant-corvan')).toBe(true);
    expect(talk(s, 'caisse-prospection')).toBe('pleine');
    expect(gained(s, () => say(s, 'caisse-prospection', 'pleine', 'Prendre la bourse'))).toEqual({ xp: 0, fers: 25 });
    expect(talk(s, 'caisse-prospection')).toBe('vide');

    expect(talk(s, 'foreuse')).toBe('jour');
    say(s, 'foreuse', 'jour', 'Attendre la nuit');
    say(s, 'foreuse', 'nuit', 'Se glisser');
    expect(gained(s, () => say(s, 'foreuse', 'au-pied', 'Saboter'))).toEqual({ xp: 70, fers: 30 });
    expect(s.quests['dernier-train']).toBe('done');
    expect(talk(s, 'foreuse')).toBe('faussee');
    expect(talk(s, 'ingrid')).toBe('apres-sabotage');
    expect(talk(s, 'echo-dernier-train')).toBe('apaise');
    expect(gained(s, () => say(s, 'echo-dernier-train', 'apaise', 'Entrer dans l’Écho'))).toEqual({ xp: 0, fers: 0 });
    expect(reputationScore(s, 'gardebois')).toBe(15);
    expect(journalStep(s, 'dernier-train')).toMatchObject({ done: true });
  });

  it('Retour chez Ilyane : la lettre pour le Conseil (« L’audience » reste ouverte pendant tout Canopéa)', () => {
    walk(s, 'gardebois');
    expect(talk(s, 'ilyane')).toBe('resolu');
    say(s, 'ilyane', 'resolu', 'Et maintenant');
    expect(s.quests.audience).toBe('active');
    expect(questItems(s)).toEqual(['lettre-ilyane']);
    // Ilyane oublie (feuille de route, chantier 4) : une chanson de son carnet.
    expect(talk(s, 'ilyane')).toBe('oubli-1');
    say(s, 'ilyane', 'oubli-1', 'Je reviendrai');
    expect(talk(s, 'ilyane')).toBe('resolu');
    expect(optionTexts(s, 'ilyane', 'resolu')).toEqual(['Je resterai sur mes gardes.']);
  });

  it('« La berceuse oubliée » : l’Écho au pied de l’Arbre-Titan, puis Nell', () => {
    expect(talk(s, 'echo-berceuse')).toBe('chant');
    say(s, 'echo-berceuse', 'chant', 'Entrer dans l’Écho');
    expect(present(s, 'gardebois', 'echo-berceuse')).toBe(false);
    walk(s, 'maison-lunelierre');
    expect(talk(s, 'maelis')).toBe('retour');
    expect(talk(s, 'nell')).toBe('chanson');
    expect(gained(s, () => say(s, 'nell', 'chanson', 'Lui chanter'))).toEqual({ xp: 30, fers: 0 });
    expect(s.quests.berceuse).toBe('done');
    expect(talk(s, 'maelis')).toBe('apres');
    expect(talk(s, 'nell')).toBe('apres');
    walk(s, 'gardebois');
  });

  it('« Les herbes de lisière » : trois touffes, puis Liane', () => {
    expect(talk(s, 'liane')).toBe('attente');
    for (const id of ['sauge-1', 'sauge-2']) {
      expect(talk(s, id)).toBe('cueillir');
      say(s, id, 'cueillir', 'La cueillir');
      expect(present(s, 'gardebois', id)).toBe(false);
    }
    expect(talk(s, 'rocher-sauge')).toBe('chercher');
    say(s, 'rocher-sauge', 'chercher', 'Repérer la lueur');
    expect(talk(s, 'rocher-sauge')).toBe('vide');
    expect(talk(s, 'liane')).toBe('rendu');
    expect(gained(s, () => say(s, 'liane', 'rendu', 'Merci, Liane'))).toEqual({ xp: 20, fers: 0 });
    expect(s.quests['herbes-lisiere']).toBe('done');
    expect([ownedCount(s.character!, 'bandage'), ownedCount(s.character!, 'fiole-seve')]).toEqual([2, 1]);
    expect(talk(s, 'liane')).toBe('apres');
  });

  it('« La caisse égarée » : les Rôdeurs enfumés, la caisse rendue à Brann', () => {
    expect(talk(s, 'caisse-egaree')).toBe('gardee');
    say(s, 'caisse-egaree', 'gardee', 'Les éloigner');
    expect(present(s, 'gardebois', 'rodeur-caisse-1')).toBe(false);
    say(s, 'caisse-egaree', 'eloignes', 'Prendre la caisse');
    expect(present(s, 'gardebois', 'caisse-egaree')).toBe(false);
    walk(s, 'reserve-cendrefer');
    expect(talk(s, 'brann')).toBe('rendu');
    expect(gained(s, () => say(s, 'brann', 'rendu', 'Merci, Brann'))).toEqual({ xp: 25, fers: 25 });
    expect(s.quests['caisse-egaree']).toBe('done');
    expect(merchantDiscount(s.flags, 'tobias')).toBe(0.2);
    expect(talk(s, 'brann')).toBe('apres');
    walk(s, 'gardebois');
    expect(reputationScore(s, 'gardebois')).toBe(35);
    expect(reputationLevel(s, 'gardebois').id).toBe('amitie');
    expect(repeatableGains(s)).toEqual([]);
  });

  it('« La caravane de midi » : le commis pressé, les Loups sur la route, Véline', () => {
    expect(talk(s, 'commis-caravane')).toBe('presse');
    say(s, 'commis-caravane', 'presse', 'Je peux la porter');
    expect(s.quests['caravane-midi']).toBe('active');
    expect(questItems(s)).toEqual(['lettre-ilyane', 'sacoche-compagnie']);
    const loups = gained(s, () => expect(travel(s, 'canopee')).toBe('loups-caravane'));
    expect(loups.xp).toBeGreaterThan(0);
    expect(journalStep(s, 'caravane-midi')?.step).toMatch(/Loups de Rouille/);
    expect(s.location).toBe('canopee-nacelle');
    expect(talk(s, 'veline')).toBe('caravane');
    expect(gained(s, () => say(s, 'veline', 'caravane', 'La voici'))).toEqual({ xp: 30, fers: 15 });
    expect(s.quests['caravane-midi']).toBe('done');
    expect(s.flags['membre-compagnie-lisieres']).toBe(true);
    expect(reputationPrices(s, 'tobias')).toBeLessThan(0);
    expect(questItems(s)).toEqual(['lettre-ilyane']);
    // Véline did not greet the hero first (the satchel came first): she does it now.
    expect(talk(s, 'veline')).toBe('accueil');
    say(s, 'veline', 'accueil', 'Je suis en apprentissage');
    expect(talk(s, 'veline')).toBe('retour');
  });

  it('« Les lettres de Malo » et « Le chant d’Anselme » : une seule descente au Sol des Racines', () => {
    expect(talk(s, 'malo')).toBe('souci');
    say(s, 'malo', 'souci', 'Je peux t’aider');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-feuillevent');
    expect(talk(s, 'ailis')).toBe('accueil');
    say(s, 'ailis', 'accueil', 'Parler à un arbre');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-nacelle');
    walk(s, 'canopee-aieux');
    expect(talk(s, 'arbre-anselme')).toBe('arbre');
    say(s, 'arbre-anselme', 'arbre', 'Poser la main');
    expect(talk(s, 'arbre-ancien')).toBe('arbre');
    expect(gained(s, () => say(s, 'arbre-ancien', 'arbre', 'Poser la main sur les signes'))).toEqual({ xp: 10, fers: 0 });
    walk(s, 'canopee-nacelle');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-atelier');
    expect(talk(s, 'elouan')).toBe('proposition');
    say(s, 'elouan', 'proposition', 'J’irai chercher');
    expect(s.quests['chant-anselme']).toBe('active');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-nacelle');

    // Two quests send the hero down: Véline's first entry (the letters) serves both.
    expect(talk(s, 'veline')).toBe('descente');
    say(s, 'veline', 'descente', 'Je peux la chercher');
    expect(journalStep(s, 'lettres-malo')?.step).toMatch(/Véline accepte/);
    say(s, 'veline', 'permission', 'Allons-y');
    expect(s.location).toBe('sol-racines');
    expect(present(s, 'sol-racines', 'garrik')).toBe(false);
    expect(talk(s, 'lettres-eparpillees')).toBe('lettres');
    say(s, 'lettres-eparpillees', 'lettres', 'Ramasser');
    expect(talk(s, 'traces-fouille')).toBe('trou');
    say(s, 'traces-fouille', 'trou', 'Examiner les outils');
    expect(talk(s, 'sacoche-lettres')).toBe('ours');
    say(s, 'sacoche-lettres', 'ours', 'L’attirer plus loin');
    say(s, 'sacoche-lettres', 'eloigne', 'Prendre la sacoche');
    expect(present(s, 'sol-racines', 'sacoche-lettres')).toBe(false);
    expect(present(s, 'sol-racines', 'ours-sol')).toBe(false);
    expect(talk(s, 'arbre-retour-anselme')).toBe('arbre-quete');
    expect(gained(s, () => say(s, 'arbre-retour-anselme', 'arbre-quete', 'Toquer'))).toEqual({ xp: 10, fers: 0 });
    expect(talk(s, 'arbre-retour-anselme')).toBe('arbre');
    expect(journalStep(s, 'chant-anselme')?.step).toMatch(/branche/);
    expect(journalStep(s, 'lettres-malo')?.step).toMatch(/sacoche/);
    walk(s, 'canopee-nacelle');

    expect(talk(s, 'malo')).toBe('retour');
    expect(gained(s, () => say(s, 'malo', 'retour', 'La voici'))).toEqual({ xp: 30, fers: 10 });
    expect(s.quests['lettres-malo']).toBe('done');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-atelier');
    expect(talk(s, 'elouan')).toBe('branche');
    say(s, 'elouan', 'branche', 'Je l’ai entendue');
    expect(questItems(s)).toEqual(['flute-anselme', 'lettre-ilyane']);
    expect(journalStep(s, 'chant-anselme')?.step).toMatch(/flûte est prête/);
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-feuillevent');
    expect(talk(s, 'ailis')).toBe('flute');
    expect(gained(s, () => say(s, 'ailis', 'flute', 'Elouan l’a taillée'))).toEqual({ xp: 40, fers: 0 });
    expect(s.quests['chant-anselme']).toBe('done');
    expect(questItems(s)).toEqual(['lettre-ilyane']);
    expect(talk(s, 'ailis')).toBe('voix');
    expect(gained(s, () => say(s, 'ailis', 'voix', 'J’ai touché'))).toEqual({ xp: 15, fers: 0 });
    expect(talk(s, 'ailis')).toBe('apres-chant');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-nacelle');
    expect(talk(s, 'malo')).toBe('flute');
    expect(optionTexts(s, 'malo', 'flute')).toEqual(['Merci pour la nouvelle, Malo.', 'À bientôt, Malo.']);
    say(s, 'malo', 'flute', 'Merci pour la nouvelle, Malo');
    expect(talk(s, 'malo')).toBe('ami');
  });

  it('« Les graines qui manquent » : Véline, Lisandre, Elvan qui rapporte les sacs', () => {
    expect(talk(s, 'veline')).toBe('retour');
    say(s, 'veline', 'retour', 'Quoi de neuf');
    expect(s.quests.graines).toBe('active');
    walk(s, 'canopee-auberge');
    expect(talk(s, 'lisandre')).toBe('flute');
    say(s, 'lisandre', 'flute', 'Merci pour la nouvelle');
    say(s, 'lisandre', 'accueil', 'Quelles nouvelles');
    say(s, 'lisandre', 'nouvelles', 'Il manque des graines');
    expect(journalStep(s, 'graines')?.step).toMatch(/Elvan Morelle/);
    expect(talk(s, 'elvan')).toBe('confrontation');
    say(s, 'elvan', 'confrontation', 'Ton ballot brille');
    expect(journalStep(s, 'graines')?.step).toMatch(/avoué/);
    expect(gained(s, () => say(s, 'elvan', 'aveu', 'Rapporte-les'))).toEqual({ xp: 40, fers: 0 });
    expect(s.quests.graines).toBe('done');
    expect(talk(s, 'elvan')).toBe('apres-rendu');
    walk(s, 'canopee-nacelle');
    expect(talk(s, 'veline')).toBe('graines-merci');
    say(s, 'veline', 'graines-merci', 'Que la sève coule');
    expect(talk(s, 'veline')).toBe('retour');
    expect(optionTexts(s, 'veline', 'retour')).not.toContain('Quoi de neuf, à la nacelle ?');
  });

  it('« Le carnet de chansons » : Mirelle, la caravane jusqu’à Gardebois, Ilyane, puis retour', () => {
    walk(s, 'canopee-aieux');
    walk(s, 'canopee-relais');
    expect(talk(s, 'mirelle')).toBe('accueil');
    say(s, 'mirelle', 'accueil', 'Tu connais Ilyane');
    say(s, 'mirelle', 'ilyane', 'Je peux le lui rapporter');
    expect(s.quests['carnet-chansons']).toBe('active');
    expect(talk(s, 'mirelle')).toBe('accueil');
    say(s, 'mirelle', 'accueil', 'Parle-moi des Gardiens');
    say(s, 'mirelle', 'ordre', 'Oui, raconte');
    walk(s, 'canopee-aieux');
    walk(s, 'canopee-nacelle');

    expect(talk(s, 'chef-caravane')).toBe('accueil');
    say(s, 'chef-caravane', 'accueil', 'Pour Gardebois');
    expect(optionTexts(s, 'chef-caravane', 'gardebois')).toEqual(['Montrer ta marque de la Compagnie.', 'Une autre fois.']);
    expect(gained(s, () => say(s, 'chef-caravane', 'gardebois', 'Montrer ta marque'))).toEqual({ xp: 0, fers: 0 });
    say(s, 'chef-caravane', 'trajet-gardebois', 'Descendre');
    expect(s.location).toBe('gardebois');
    expect(talk(s, 'ilyane')).toBe('carnet');
    expect(gained(s, () => say(s, 'ilyane', 'carnet', 'La dix-sept'))).toEqual({ xp: 25, fers: 0 });
    expect(s.quests['carnet-chansons']).toBe('done');
    expect(questItems(s)).toEqual(['lettre-ilyane']);
    expect(talk(s, 'ilyane')).toBe('resolu');
    walk(s, 'auberge-racine');
    expect(talk(s, 'sylvan')).toBe('ilyane-chante');
    walk(s, 'gardebois');
    expect(talk(s, 'convoyeuse')).toBe('accueil');
    expect(optionTexts(s, 'convoyeuse', 'accueil')).toEqual(['À Canopéa.', 'Pas aujourd’hui.']);
    say(s, 'convoyeuse', 'accueil', 'À Canopéa');
    say(s, 'convoyeuse', 'canopee', 'Montrer ta marque');
    say(s, 'convoyeuse', 'trajet-canopee', 'Monter');
    expect(s.location).toBe('canopee-nacelle');
    expect(reputationScore(s, 'gardebois')).toBe(40);
  });

  it('« L’audience » : la lettre, le Bosquet muet, Garrik, le rapport, le sauf-conduit', () => {
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-conseil');
    expect(talk(s, 'huissier')).toBe('lettre');
    say(s, 'huissier', 'lettre', 'Entrer');
    expect(s.location).toBe('canopee-amphitheatre');
    expect(talk(s, 'kael-marchevent')).toBe('audience');
    say(s, 'kael-marchevent', 'audience', 'Ilyane');
    expect(questItems(s)).toEqual([]);
    say(s, 'kael-marchevent', 'lettre', 'Une foreuse');
    say(s, 'kael-marchevent', 'recit-gare', 'Les papiers');
    say(s, 'kael-marchevent', 'lyra', 'Et ce mal');
    say(s, 'kael-marchevent', 'thalorin', 'Je peux chercher');
    expect(journalStep(s, 'audience')?.step).toMatch(/Triumvirat veut savoir/);
    expect(talk(s, 'lyra')).toBe('enquete');
    expect(talk(s, 'thalorin')).toBe('enquete');
    // Everything else is finished at Canopéa: the inquiry hides nothing that matters.
    expect(maskedEntries(s, true)).toEqual([]);
    walk(s, 'canopee-conseil');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-nacelle');
    walk(s, 'canopee-aieux');
    expect(talk(s, 'arbre-anselme')).toBe('muet');
    expect(talk(s, 'arbre-ancien')).toBe('silence');
    say(s, 'arbre-ancien', 'silence', 'Écouter plus profond');
    expect(journalStep(s, 'audience')?.step).toMatch(/Sol des R/);
    walk(s, 'canopee-nacelle');
    expect(talk(s, 'veline')).toBe('descente-conseil');
    say(s, 'veline', 'descente-conseil', 'Descends');
    expect(s.location).toBe('sol-racines');
    expect(present(s, 'sol-racines', 'garrik')).toBe(true);
    expect(talk(s, 'garrik')).toBe('rencontre');
    say(s, 'garrik', 'rencontre', 'Ce sol est sacré');
    say(s, 'garrik', 'defensif', 'Là-haut');
    say(s, 'garrik', 'convaincu', 'Je t’écoute');
    expect(gained(s, () => say(s, 'garrik', 'aveu', 'Pars'))).toEqual({ xp: 30, fers: 0 });
    expect(present(s, 'sol-racines', 'garrik')).toBe(false);
    expect(journalStep(s, 'audience')?.step).toMatch(/rapport/);
    walk(s, 'canopee-nacelle');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-conseil');
    expect(talk(s, 'huissier')).toBe('retour');
    say(s, 'huissier', 'retour', 'Entrer');
    expect(talk(s, 'kael-marchevent')).toBe('rapport');
    say(s, 'kael-marchevent', 'rapport', 'Des fouilleurs');
    say(s, 'kael-marchevent', 'rapport-suite', 'Ils cherchent');
    say(s, 'kael-marchevent', 'cle', 'Que va faire');
    expect(gained(s, () => say(s, 'kael-marchevent', 'choix', 'Le sol est sacré'))).toEqual({ xp: 15, fers: 0 });
    expect(gained(s, () => say(s, 'kael-marchevent', 'fin-accord', 'Et moi'))).toEqual({ xp: 60, fers: 0 });
    expect(s.quests.audience).toBe('done');
    expect(s.quests['cle-rouille-bleue']).toBe('active');
    expect(questItems(s)).toEqual(['sauf-conduit']);
    for (const npc of ['kael-marchevent', 'lyra', 'thalorin']) expect(talk(s, npc)).toBe('apres');
    expect(reputationScore(s, 'canopee')).toBe(10 + 10 + 15 + 10 + 10);
    expect(knownPlaces(s.flags, s.quests).map((p) => p.id)).toContain('ironheart');
    // The Récits of the main story are never forgotten (decision of Cyril, 2026-11-02): Corvan and the Triumvirat stay.
    expect(knowsRecit(s.character, 'savant-corvan')).toBe(true);
    expect(knowsRecit(s.character, 'triumvirat-vert')).toBe(true);
  });

  it('Canopéa après l’audience : les nouvelles circulent, rien ne se rouvre', () => {
    walk(s, 'canopee-conseil');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-nacelle');
    walk(s, 'canopee-auberge');
    expect(talk(s, 'lisandre')).toBe('vote-accord');
    walk(s, 'canopee-nacelle');
    walk(s, 'canopee-aieux');
    walk(s, 'canopee-relais');
    expect(talk(s, 'mirelle')).toBe('bosquet');
    walk(s, 'canopee-aieux');
    expect(talk(s, 'arbre-ancien')).toBe('arbre');
    expect(talk(s, 'arbre-anselme')).toBe('arbre');
    walk(s, 'canopee-nacelle');
    expect(talk(s, 'veline')).toBe('retour');
    expect(repeatableGains(s)).toEqual([]);
    expect(maskedEntries(s, true)).toEqual([]);
  });

  it('« Un prêt de la Terre » : Vanel prête un cristal de Vie, Tiven soigné, un rang de Résonance appris', () => {
    walk(s, 'canopee-aieux');
    expect(talk(s, 'vanel')).toBe('accueil');
    say(s, 'vanel', 'accueil', 'Qu’est-ce qu’un cristal');
    say(s, 'vanel', 'cristal', 'Apprends-moi');
    expect(s.quests['pret-terre']).toBe('active');
    expect(ownedCount(s.character!, 'cristal-vanel')).toBe(1);
    expect(talk(s, 'vanel')).toBe('attente');
    walk(s, 'canopee-nacelle');
    expect(talk(s, 'tiven')).toBe('quete');
    // Le cristal au fond du sac ne soigne personne : l'option attend qu'on le porte au cou.
    const poser = () => visibleOptions(DIALOGUES.tiven.nodes.quete, s).find((v) => v.option.text.startsWith('Poser'))!;
    expect(poser().missing).toBe('Il te faut porter un cristal de Vie.');
    expect(equip(s.character!, 'cristal-vanel', 'cristal')).toBe(true);
    expect(poser().enabled).toBe(true);
    expect(poser().tags).toEqual(['Guérison naturelle · 2 PR']);
    const pr = s.character!.resonance;
    expect(gained(s, () => say(s, 'tiven', 'quete', 'Poser le cristal'))).toEqual({ xp: 15, fers: 0 });
    expect(s.character!.resonance).toBe(pr - 2);
    expect(talk(s, 'tiven')).toBe('gueri');
    walk(s, 'canopee-aieux');
    expect(gained(s, () => expect(talk(s, 'vanel')).toBe('retour'))).toEqual({ xp: 40, fers: 0 });
    expect(s.quests['pret-terre']).toBe('done');
    expect(s.character!.skills.resonance).toBe(1);
    say(s, 'vanel', 'retour', 'Qu’apprend-on ensuite');
    say(s, 'vanel', 'lueur', 'Et à Ferros');
    expect(talk(s, 'vanel')).toBe('apres');
    walk(s, 'canopee-nacelle');
    expect(repeatableGains(s)).toEqual([]);
  });

  it('Ironheart en train : Boulon, puis « La Clé de Rouille Bleue » confiée à Noam', () => {
    expect(talk(s, 'halte-ouest')).toBe('halte');
    say(s, 'halte-ouest', 'halte', 'Prendre le train');
    expect(gained(s, () => say(s, 'halte-ouest', 'billet', 'Prendre un billet.'))).toEqual({ xp: 0, fers: -40 });
    say(s, 'halte-ouest', 'train-ironheart', 'Descendre');
    expect(s.location).toBe('ironheart-forges');
    expect(talk(s, 'boulon')).toBe('accueil-quete');
    say(s, 'boulon', 'accueil-quete', 'Un certain Kaelis');
    expect(talk(s, 'boulon')).toBe('accueil');

    expect(talk(s, 'renfoncement')).toBe('mur');
    say(s, 'renfoncement', 'mur', 'Chercher le passage');
    say(s, 'renfoncement', 'trouve', 'Descendre');
    expect(s.location).toBe('ironheart-marche');
    expect(journalStep(s, 'cle-rouille-bleue')?.step).toMatch(/Marché des Cendres/);
    expect(talk(s, 'kaelis')).toBe('accueil-garrik');
    expect(gained(s, () => say(s, 'kaelis', 'accueil-garrik', 'Pourquoi certaines reliques'))).toEqual({ xp: 15, fers: 0 });
    expect(journalStep(s, 'cle-rouille-bleue')?.step).toMatch(/Veilleuse/);
    walk(s, 'ironheart-forges');

    // Le cristal au cou : Ferros tient des listes (docs/gdd/magie.md).
    expect(talk(s, 'patrouilleur')).toBe('liste');
    say(s, 'patrouilleur', 'liste', 'C’est interdit');
    say(s, 'patrouilleur', 'liste-pourquoi', 'Et le funiculaire');
    expect(talk(s, 'patrouilleur')).toBe('controle');
    say(s, 'patrouilleur', 'controle', 'Montrer le sauf-conduit');
    say(s, 'patrouilleur', 'sauf', 'Monter');
    expect(s.location).toBe('ironheart-manufactures');
    walk(s, 'ironheart-archives');
    expect(talk(s, 'noam')).toBe('accueil');
    say(s, 'noam', 'accueil', 'Classez-vous aussi');
    expect(optionTexts(s, 'noam', 'verdantis')).toEqual(['Le lire.', 'Une autre fois.']);
    say(s, 'noam', 'verdantis', 'Le lire');
    say(s, 'noam', 'tg-accord', 'Merci');
    say(s, 'noam', 'accueil', 'Je cherche ce qui concerne le dernier train');
    expect(optionTexts(s, 'noam', 'train')).toContain('Et si je trouvais cette clé ?');
    walk(s, 'ironheart-manufactures');
    walk(s, 'ironheart-forges');

    expect(talk(s, 'veilleuse')).toBe('question-cle');
    // The Récit of Corvan is kept (a Récit of the main story): the Veilleuse can be told of the last train.
    expect(optionTexts(s, 'veilleuse', 'question-cle')).toEqual([
      'J’ai vu le dernier train, moi aussi, dans l’Écho de la Gare Engloutie.',
      'Laisse-moi écouter le convoi avec toi.',
      'Lui parler de ce que la clé ouvre.',
      'Et si je te laissais une histoire, contre la clé ?',
    ]);
    say(s, 'veilleuse', 'question-cle', 'Lui parler de ce que la clé ouvre');
    expect(gained(s, () => say(s, 'veilleuse', 'ouvre', 'Aux Archives'))).toEqual({ xp: 25, fers: 0 });
    expect(questItems(s)).toEqual(['cle-rouille-bleue', 'cristal-vanel', 'sauf-conduit']);
    expect(journalStep(s, 'cle-rouille-bleue')?.step).toMatch(/J’ai la clé/);
    expect(talk(s, 'veilleuse')).toBe('avec-cle');
    walk(s, 'ironheart-manufactures');
    walk(s, 'ironheart-archives');
    expect(talk(s, 'noam')).toBe('cle');
    expect(gained(s, () => say(s, 'noam', 'cle', 'La lui confier'))).toEqual({ xp: 70, fers: 0 });
    expect(s.quests['cle-rouille-bleue']).toBe('done');
    expect(questItems(s)).toEqual(['cristal-vanel', 'sauf-conduit']);
    expect(reputationScore(s, 'ironheart')).toBe(10);
    expect(reputationScore(s, 'archives-ferros')).toBe(20);
    expect(talk(s, 'noam')).toBe('apres-archives');
    walk(s, 'ironheart-manufactures');
    walk(s, 'ironheart-forges');
    expect(talk(s, 'veilleuse')).toBe('apres');
  });

  it('« Le Rail des Cendres » : les indices, Joss, le tunnel, la Cendrière, la dette rachetée', () => {
    walk(s, 'ironheart-pension');
    expect(talk(s, 'dorna')).toBe('cristal');
    say(s, 'dorna', 'cristal', 'Merci du conseil');
    expect(talk(s, 'dorna')).toBe('accueil');
    say(s, 'dorna', 'accueil', 'Quelles nouvelles');
    say(s, 'dorna', 'nouvelles', 'Et au triage');
    walk(s, 'ironheart-forges');
    walk(s, 'ironheart-triage');
    expect(talk(s, 'varka')).toBe('accueil');
    say(s, 'varka', 'accueil', 'Peur de quoi');
    say(s, 'varka', 'convois', 'Je vais trouver');
    expect(s.quests['rail-cendres']).toBe('active');
    walk(s, 'ironheart-forges');
    expect(talk(s, 'veilleuse')).toBe('apres');
    say(s, 'veilleuse', 'apres', 'Les convois du triage');
    expect(journalStep(s, 'rail-cendres')?.step).toMatch(/Veilleuse/);
    walk(s, 'ironheart-triage');
    expect(talk(s, 'aiguillage')).toBe('levier-quete');
    say(s, 'aiguillage', 'levier-quete', 'Examiner le mécanisme');
    expect(talk(s, 'registre-departs')).toBe('registre');
    expect(talk(s, 'joss')).toBe('soupcon');
    say(s, 'joss', 'soupcon', 'La goupille limée');
    expect(talk(s, 'joss')).toBe('avoue');
    say(s, 'joss', 'avoue', 'Comment entrer');
    expect(talk(s, 'tunnel-cendriere')).toBe('guetteur');
    say(s, 'tunnel-cendriere', 'guetteur', '« Levier ouvert. »');
    say(s, 'tunnel-cendriere', 'passe', 'Entrer');
    expect(s.location).toBe('ironheart-cendriere');
    expect(talk(s, 'sorn')).toBe('accueil');
    expect(journalStep(s, 'rail-cendres')?.step).toMatch(/Cendrière/);
    expect(talk(s, 'pilote')).toBe('machine');
    say(s, 'pilote', 'machine', 'Poser la main');
    walk(s, 'ironheart-triage');
    expect(talk(s, 'ostrik')).toBe('rapport');
    expect(talk(s, 'varka')).toBe('verdict');
    expect(gained(s, () => say(s, 'varka', 'verdict', 'Et je rachète la dette'))).toEqual({ xp: 50, fers: -30 });
    expect(s.quests['rail-cendres']).toBe('done');
    expect(talk(s, 'joss')).toBe('merci');
    expect(talk(s, 'ostrik')).toBe('accueil');
    expect(present(s, 'ironheart-cendriere', 'sorn')).toBe(false);
    expect(present(s, 'ironheart-forges', 'pilote-endormi')).toBe(true);
    expect(reputationScore(s, 'travailleurs-rail')).toBe(20 + 10);
    expect(reputationScore(s, 'ironheart')).toBe(15);
    walk(s, 'ironheart-forges');
  });

  it('« Les Échos sous la Forge » : la trappe, Hesk, l’Écho confié à Ragna pour Ilyane', () => {
    expect(talk(s, 'forge-eteinte')).toBe('jour');
    say(s, 'forge-eteinte', 'jour', 'Revenir à la nuit');
    expect(s.quests['echos-forge']).toBe('active');
    say(s, 'forge-eteinte', 'nuit', 'Ouvrir la trappe');
    expect(s.location).toBe('ironheart-galerie');
    expect(talk(s, 'hesk')).toBe('accueil');
    say(s, 'hesk', 'accueil', 'Ce que la terre');
    expect(talk(s, 'echo-chanson')).toBe('ecoute');
    say(s, 'echo-chanson', 'ecoute', 'Retenir la mélodie');
    expect(talk(s, 'enclume-marques')).toBe('enclume');
    // La Lueur du cristal, à la place de l'Investigation : un Point de Résonance.
    const pr = s.character!.resonance;
    say(s, 'enclume-marques', 'enclume', 'Approcher la lueur');
    expect(s.character!.resonance).toBe(pr - 1);
    expect(talk(s, 'echo-promesse')).toBe('promesse');
    say(s, 'echo-promesse', 'promesse', 'L’écouter jusqu’au bout');
    say(s, 'echo-promesse', 'choix', 'Le garder par écrit');
    say(s, 'echo-promesse', 'garder', 'Pour Ilyane');
    expect(questItems(s)).toEqual(['cristal-vanel', 'lettre-echo', 'sauf-conduit']);
    expect(journalStep(s, 'echos-forge')?.step).toMatch(/Ragna/);
    walk(s, 'ironheart-forges');
    walk(s, 'ironheart-atelier');
    expect(gained(s, () => expect(talk(s, 'hedda')).toBe('lettre'))).toEqual({ xp: 40, fers: 0 });
    expect(s.quests['echos-forge']).toBe('done');
    expect(questItems(s)).toEqual(['cristal-vanel', 'sauf-conduit']);
    expect(talk(s, 'hedda')).toBe('accueil-remise');
    walk(s, 'ironheart-forges');
    walk(s, 'ironheart-martelroux');
    expect(talk(s, 'rika')).toBe('accueil');
    say(s, 'rika', 'accueil', 'J’ai rapporté sa caisse');
    walk(s, 'ironheart-forges');
  });

  it('« Le registre du Puits Trois » : Kerta dans la file, Tam, les plans du masque cousus par Ragna', () => {
    expect(talk(s, 'tam')).toBe('accueil');
    expect(talk(s, 'kerta')).toBe('accueil');
    say(s, 'kerta', 'accueil', 'Pourquoi la file');
    say(s, 'kerta', 'file', 'Et toi');
    say(s, 'kerta', 'probleme', 'Où est le problème');
    expect(s.quests['registre-puits']).toBe('active');
    expect(talk(s, 'kerta')).toBe('attente');
    expect(talk(s, 'tam')).toBe('parle');
    expect(journalStep(s, 'registre-puits')?.step).toMatch(/Ragna/);
    say(s, 'tam', 'parle', 'Et si tu restes');
    say(s, 'tam', 'reste', 'Ragna Cendrefer');
    say(s, 'tam', 'hedda', 'Donne-les-moi');
    expect(questItems(s)).toContain('plans-masque');
    walk(s, 'ironheart-atelier');
    expect(gained(s, () => expect(talk(s, 'hedda')).toBe('masques'))).toEqual({ xp: 50, fers: 0 });
    expect(s.quests['registre-puits']).toBe('done');
    expect(questItems(s)).not.toContain('plans-masque');
    expect(talk(s, 'hedda')).toBe('accueil-remise');
    walk(s, 'ironheart-forges');
    expect(talk(s, 'kerta')).toBe('apres-masques');
    expect(talk(s, 'tam')).toBe('apres-masques');
    expect(figurantLines(figurantsAt('ironheart-forges').find((f) => f.id === 'ouvrier-forges')!, s)[0]).toMatch(/masque/);
    expect(reputationScore(s, 'ironheart')).toBe(25);
  });

  it('Les voyages : caravane de Boulon, Ilyane reçoit l’Écho, convoyeuse, train des cheminots', () => {
    expect(talk(s, 'boulon')).toBe('accueil');
    say(s, 'boulon', 'accueil', 'Une caravane pour Gardebois');
    say(s, 'boulon', 'caravane', 'Montrer ta marque');
    say(s, 'boulon', 'trajet-gardebois', 'Descendre');
    expect(s.location).toBe('gardebois');
    expect(gained(s, () => expect(talk(s, 'ilyane')).toBe('echo-lettre'))).toEqual({ xp: 10, fers: 0 });
    // La Clé finie, Ilyane a une lettre de Hesper : le chapitre 4 s'ouvre, la Porte du sud paraît sur la carte.
    // La clé classée aux Archives : la lettre de Hesper le dit (feuille de route, chantier 4).
    expect(talk(s, 'ilyane')).toBe('appel-archives');
    expect(knownPlaces(s.flags, s.quests).map((p) => p.id)).not.toContain('sept-portes');
    say(s, 'ilyane', 'appel-archives', 'J’irai à Sept-Portes');
    expect(s.quests['memoires-monde-perdu']).toBe('active');
    expect(knownPlaces(s.flags, s.quests).map((p) => p.id)).toContain('sept-portes');
    // Ilyane oublie : un instant, elle ne reconnaît plus le héros.
    expect(talk(s, 'ilyane')).toBe('oubli-3');
    say(s, 'ilyane', 'oubli-3', 'Je suis là');
    expect(talk(s, 'ilyane')).toBe('nouvelles-canopee');
    walk(s, 'auberge-racine');
    expect(talk(s, 'sylvan')).toBe('triumvirat');
    walk(s, 'gardebois');
    expect(figurantLines(figurantsAt('gardebois').find((f) => f.dialogue === 'commis-caravane')!, s)[0]).toMatch(/loups/);
    expect(talk(s, 'convoyeuse')).toBe('accueil');
    say(s, 'convoyeuse', 'accueil', 'À Ironheart');
    say(s, 'convoyeuse', 'ironheart', 'Montrer ta marque');
    say(s, 'convoyeuse', 'trajet-ironheart', 'Descendre');
    expect(s.location).toBe('ironheart-forges');
    expect(talk(s, 'guichet-ouest')).toBe('guichet');
    expect(optionTexts(s, 'guichet-ouest', 'guichet')).toEqual([expect.stringMatching(/^Prendre un billet : les cheminots/), 'Pas aujourd’hui.']);
    expect(gained(s, () => say(s, 'guichet-ouest', 'guichet', 'Prendre un billet : les cheminots'))).toEqual({ xp: 0, fers: -30 });
    say(s, 'guichet-ouest', 'train-canopee', 'Monter');
    expect(s.location).toBe('canopee-nacelle');
    expect(travel(s, 'gardebois')).toBeNull();
  });

  it('Les compagnons : Liane veut oublier Saule (le vieux champignon), Boulon rayé du matériel par Noam', () => {
    expect(s.location).toBe('gardebois');
    expect(talk(s, 'liane')).toBe('apres');
    say(s, 'liane', 'apres', 'Viens avec moi');
    expect(s.groupe).toEqual([]);
    say(s, 'liane', 'recrue', 'Compris');
    expect(s.groupe.map((m) => m.id)).toEqual(['liane']);
    expect(present(s, 'gardebois', 'liane')).toBe(false);
    expect(companion(s, 'liane')).toBe('route');
    // La nuit tombe (à la belle étoile) : Liane mâche quelque chose.
    waitUntil(s.time, 'nuit');
    expect(companion(s, 'liane')).toBe('nuit');
    say(s, 'compagnon-liane', 'nuit', 'Qu’est-ce que tu mâches');
    expect(s.quests['oubli-liane']).toBe('active');
    say(s, 'compagnon-liane', 'aveu', 'Que veux-tu faire');
    say(s, 'compagnon-liane', 'choix', 'Allons chercher le vieux champignon');
    expect(journalStep(s, 'oubli-liane')?.step).toMatch(/Champignon-Mémoire/);
    walk(s, 'gare-engloutie');
    expect(talk(s, 'champignon-ancien')).toBe('champi');
    say(s, 'champignon-ancien', 'champi', 'Le cueillir');
    expect(present(s, 'gare-engloutie', 'champignon-ancien')).toBe(false);
    expect(companion(s, 'liane')).toBe('manger');
    expect(gained(s, () => say(s, 'compagnon-liane', 'manger', 'Je ne te dirai rien'))).toEqual({ xp: 40, fers: 0 });
    expect(s.quests['oubli-liane']).toBe('done');
    expect(companion(s, 'liane')).toBe('legere');
    walk(s, 'gardebois');

    expect(travel(s, 'ironheart')).toBeNull();
    expect(talk(s, 'boulon')).toBe('accueil');
    say(s, 'boulon', 'accueil', 'Parlons un peu');
    say(s, 'boulon', 'parler', 'Tu ne voyages jamais');
    say(s, 'boulon', 'voyage', 'Et si tu venais avec moi');
    expect(s.quests['contrat-boulon']).toBe('active');
    walk(s, 'ironheart-manufactures');
    walk(s, 'ironheart-archives');
    expect(talk(s, 'noam')).toBe('registre');
    say(s, 'noam', 'registre', 'Il se souvient de chaque voyageur');
    walk(s, 'ironheart-manufactures');
    walk(s, 'ironheart-forges');
    expect(gained(s, () => expect(talk(s, 'boulon')).toBe('libre'))).toEqual({ xp: 40, fers: 0 });
    say(s, 'boulon', 'libre', 'En route, Boulon');
    expect(s.groupe.map((m) => m.id)).toEqual(['liane', 'boulon']);
    expect(companion(s, 'boulon')).toBe('gare');
    expect(repeatableGains(s)).toEqual([]);
  });

  it('« Les Mémoires du Monde Perdu » : Sept-Portes, Ambroise convaincu, la page, la dame en gris dénoncée', () => {
    travel(s, 'sept-portes');
    expect(s.location).toBe('sept-portes');
    walk(s, 'sept-portes-parvis');
    walk(s, 'sept-portes-gardiens');
    expect(talk(s, 'hesper')).toBe('appel');
    say(s, 'hesper', 'appel', 'Et la clé');
    say(s, 'hesper', 'cle', 'J’y vais');
    expect(talk(s, 'hesper')).toBe('en-cours');
    walk(s, 'sept-portes-parvis');
    walk(s, 'sept-portes-bibliotheque');
    expect(talk(s, 'ambroise')).toBe('registre');
    say(s, 'ambroise', 'registre', 'Une clé de rouille bleue');
    say(s, 'ambroise', 'chaine', 'Et personne d’autre');
    expect(present(s, 'sept-portes-auberge', 'edda')).toBe(true);
    say(s, 'ambroise', 'edda-demande', 'Et si c’est moi');
    // La parole : le Récit de Kael, appris chez Mirelle (Diplomatie 3 ne suffit plus : il faut 4, rang et Présence).
    say(s, 'ambroise', 'demande', 'Kael a bâti');
    walk(s, 'sept-portes-fonds-muet');
    expect(gained(s, () => expect(talk(s, 'page-dernier-depart')).toBe('page'))).toEqual({ xp: 50, fers: 0 });
    expect(knowsRecit(s.character, 'dernier-depart')).toBe(true);
    expect(journalStep(s, 'memoires-monde-perdu')?.step).toMatch(/Edda|dame en gris|Hesper/);
    walk(s, 'sept-portes-bibliotheque');
    expect(talk(s, 'registre-consultations')).toBe('registre');
    say(s, 'registre-consultations', 'registre', 'Examiner la demande d’Edda Varn');
    expect(s.flags['main-edda-fausse']).toBe(true);
    walk(s, 'sept-portes-parvis');
    walk(s, 'sept-portes');
    walk(s, 'sept-portes-auberge');
    expect(talk(s, 'edda')).toBe('offre');
    say(s, 'edda', 'offre', 'Je sais qui vous êtes');
    walk(s, 'sept-portes');
    walk(s, 'sept-portes-parvis');
    walk(s, 'sept-portes-bibliotheque');
    expect(talk(s, 'ambroise')).toBe('denonce');
    expect(gained(s, () => say(s, 'ambroise', 'denonce', 'Edda Varn est morte'))).toEqual({ xp: 30, fers: 0 });
    expect(present(s, 'sept-portes-auberge', 'edda')).toBe(false);
    expect(s.flags.raccompagne).toBeUndefined();
    walk(s, 'sept-portes-parvis');
    walk(s, 'sept-portes-gardiens');
    expect(gained(s, () => expect(talk(s, 'hesper')).toBe('fin-denonce'))).toEqual({ xp: 80, fers: 0 });
    expect(s.quests['memoires-monde-perdu']).toBe('done');
    expect(s.flags['piste-zephyria']).toBe(true);
    expect(talk(s, 'hesper')).toBe('apres');
    expect(reputationScore(s, 'sept-portes')).toBe(25);
    expect(repeatableGains(s)).toEqual([]);
  });

  it('Bilan : tout est fini, rien ne traîne, rien ne se gagne deux fois', () => {
    expect(unfinished(s)).toEqual([]);
    expect(journalQuests(s).every((q) => q.done)).toBe(true);
    expect(questItems(s)).toEqual(['cristal-vanel', 'sauf-conduit']);
    expect(s.character!.fers).toBe(20);
    expect(levelForXp(s.character!.xp)).toBe(5);
    expect(reputations(s)).toEqual({
      gardebois: 40,
      canopee: 55,
      ironheart: 25,
      'sept-portes': 25,
      'compagnie-lisieres': 20,
      nacelliers: 25,
      'travailleurs-rail': 30,
      'marches-cendres': -20,
      'archives-ferros': 30,
    });
    expect(repeatableGains(s)).toEqual([]);
    expect(maskedEntries(s, true)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------------------------------------------
// B. Variante : la parole à la Gare, l'audience tout de suite, Ironheart avant les quêtes annexes de Canopéa.
// ---------------------------------------------------------------------------------------------------------------

describe('Variante : Ironheart avant les quêtes annexes (parole, combats, autres fins)', () => {
  const s = createNewGame(testCharacter({}, { diplomacy: 3, survival: 2, investigation: 2 }));

  it('« Le Dernier Train » par la parole : sans laissez-passer, le contremaître barre la route ; Tobias le donne', () => {
    expect(talk(s, 'ilyane')).toBe('accueil');
    say(s, 'ilyane', 'accueil', 'Que se passe-t-il');
    say(s, 'ilyane', 'trouble', 'D’où vient ce mal');
    say(s, 'ilyane', 'cause', 'J’irai voir');
    walk(s, 'gare-engloutie');
    // Décision de Cyril (2026-11-02) : le laissez-passer ouvre le chantier de jour ; sans lui, la nuit ou le Golem.
    expect(talk(s, 'ingrid')).toBe('barriere');
    expect(talk(s, 'foreuse')).toBe('jour');
    expect(optionTexts(s, 'foreuse', 'jour')[0]).toMatch(/Attendre la nuit/);
    walk(s, 'gardebois');
    say(s, 'tobias', 'accueil', 'Je dois entrer sur le chantier');
    say(s, 'tobias', 'chantier', 'Si ce chantier');
    expect(s.flags['laissez-passer']).toBe(true);
    walk(s, 'gare-engloutie');
    expect(talk(s, 'ingrid')).toBe('accueil');
    say(s, 'ingrid', 'accueil', 'Ce chantier');
    // Ingrid résiste (feuille de route, chantier 5) : une preuve, puis une issue pour elle.
    say(s, 'ingrid', 'cause', 'Arrêtez le forage');
    say(s, 'ingrid', 'resiste', 'Ils dorment, oui');
    expect(gained(s, () => say(s, 'ingrid', 'resiste-2', 'Alors écrivez à Ferros'))).toEqual({ xp: 80, fers: 30 });
    expect(s.flags['ingrid-rapport']).toBe(true);
    expect(s.quests['dernier-train']).toBe('done');
    expect(talk(s, 'foreuse')).toBe('arretee');
    expect(talk(s, 'ingrid')).toBe('apres');
    // The Golem no longer moves (MapScene.startGolemFight): no second reward.
    expect(s.flags['chantier-arrete']).toBe(true);
    walk(s, 'gardebois');
    expect(talk(s, 'ilyane')).toBe('resolu');
    say(s, 'ilyane', 'resolu', 'Et maintenant');
  });

  it('Canopéa par la carte du monde : pas de Loups sans la sacoche ; l’audience commence', () => {
    expect(travel(s, 'canopee')).toBeNull();
    expect(talk(s, 'veline')).toBe('accueil');
    say(s, 'veline', 'accueil', 'Juste quelqu’un qui voyage');
    expect(talk(s, 'malo')).toBe('souci');
    say(s, 'malo', 'souci', 'Je peux t’aider');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-conseil');
    expect(talk(s, 'huissier')).toBe('lettre');
    say(s, 'huissier', 'lettre', 'Entrer');
    expect(talk(s, 'kael-marchevent')).toBe('audience');
    // The letter can be kept: Kael takes it back at the end (envoi).
    say(s, 'kael-marchevent', 'audience', 'Une foreuse');
    say(s, 'kael-marchevent', 'recit-gare', 'Les papiers');
    say(s, 'kael-marchevent', 'lyra', 'Et ce mal');
    say(s, 'kael-marchevent', 'thalorin', 'Je peux chercher');
    expect(questItems(s)).toEqual(['lettre-ilyane']);
  });

  it('Pendant l’enquête, « Le chant d’Anselme » commence par Aïlis ; « Les graines » s’annoncent chez Véline', () => {
    // The Bosquet stays silent (muet): Aïlis tells of Anselme's tree from her « inquiete » entry instead.
    walk(s, 'canopee-conseil');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-feuillevent');
    expect(talk(s, 'ailis')).toBe('inquiete');
    expect(optionTexts(s, 'ailis', 'inquiete')).toEqual(['Parlez-moi de l’arbre où il repose.', 'Le Triumvirat m’a demandé de comprendre. Je trouverai.']);
    say(s, 'ailis', 'inquiete', 'Parlez-moi de l’arbre');
    expect(s.flags['anselme-connu']).toBe(true);
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-atelier');
    expect(talk(s, 'elouan')).toBe('proposition');
    say(s, 'elouan', 'proposition', 'J’irai chercher');
    expect(s.quests['chant-anselme']).toBe('active');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-nacelle');
    walk(s, 'canopee-aieux');
    expect(talk(s, 'arbre-anselme')).toBe('muet');
    walk(s, 'canopee-nacelle');

    expect(talk(s, 'veline')).toBe('descente-conseil');
    expect(optionTexts(s, 'veline', 'descente-conseil')).toEqual(['Descends-moi.', 'Quoi de neuf, à la nacelle ?', 'Pas maintenant.']);
    say(s, 'veline', 'descente-conseil', 'Quoi de neuf');
    // Pendant l'enquête aussi, « Quoi de neuf » lance « Les graines qui manquent », comme dans « retour ».
    expect(s.quests.graines).toBe('active');
    expect(maskedEntries(s, true)).toEqual([]);
  });

  it('Garrik vaincu, la sacoche de Malo et la branche d’Anselme prises en passant, la frontière fermée', () => {
    // Véline's inquiry entry comes before the letters' and Anselme's; it lowers the hero all the same.
    expect(talk(s, 'veline')).toBe('descente-conseil');
    say(s, 'veline', 'descente-conseil', 'Descends');
    expect(talk(s, 'garrik')).toBe('rencontre');
    say(s, 'garrik', 'rencontre', 'Ce sol est sacré');
    expect(startsCombat(DIALOGUES.garrik.nodes.defensif.options[1].effects)).toBe('fouilleur-sol');
    say(s, 'garrik', 'defensif', 'Alors je vais te faire partir');
    win(s, 'fouilleur-sol');
    expect(present(s, 'sol-racines', 'garrik')).toBe(false);
    expect(talk(s, 'sacoche-lettres')).toBe('ours');
    say(s, 'sacoche-lettres', 'ours', 'Glisser la main');
    expect(journalStep(s, 'lettres-malo')?.step).toMatch(/sacoche/);
    expect(talk(s, 'arbre-retour-anselme')).toBe('arbre-quete');
    say(s, 'arbre-retour-anselme', 'arbre-quete', 'Ramasser');
    expect(journalStep(s, 'chant-anselme')?.step).toMatch(/branche/);
    walk(s, 'canopee-nacelle');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-conseil');
    expect(talk(s, 'huissier')).toBe('retour');
    say(s, 'huissier', 'retour', 'Entrer');
    expect(talk(s, 'kael-marchevent')).toBe('rapport');
    say(s, 'kael-marchevent', 'rapport', 'Des fouilleurs');
    say(s, 'kael-marchevent', 'rapport-suite', 'Ils cherchent');
    say(s, 'kael-marchevent', 'cle', 'Que va faire');
    say(s, 'kael-marchevent', 'choix', 'Fermez la frontière');
    say(s, 'kael-marchevent', 'fin-frontiere', 'Et moi');
    expect(s.quests.audience).toBe('done');
    expect(questItems(s)).toEqual(['branche-anselme', 'sauf-conduit']);
    walk(s, 'canopee-conseil');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-nacelle');
  });

  it('Ironheart d’abord : la clé vendue à Kaelis', () => {
    expect(travel(s, 'ironheart')).toBeNull();
    expect(talk(s, 'boulon')).toBe('accueil-quete');
    say(s, 'boulon', 'accueil-quete', 'Un certain Kaelis');
    expect(talk(s, 'renfoncement')).toBe('mur');
    say(s, 'renfoncement', 'mur', 'Chercher le passage');
    say(s, 'renfoncement', 'trouve', 'Descendre');
    expect(talk(s, 'kaelis')).toBe('accueil-garrik');
    say(s, 'kaelis', 'accueil-garrik', 'Pourquoi certaines reliques');
    walk(s, 'ironheart-forges');
    expect(talk(s, 'veilleuse')).toBe('question-cle');
    say(s, 'veilleuse', 'question-cle', 'Laisse-moi écouter');
    say(s, 'veilleuse', 'ecoute', 'Et la clé');
    walk(s, 'ironheart-marche');
    expect(talk(s, 'kaelis')).toBe('offre');
    expect(gained(s, () => say(s, 'kaelis', 'offre', 'La lui vendre'))).toEqual({ xp: 60, fers: 100 });
    expect(s.quests['cle-rouille-bleue']).toBe('done');
    expect(questItems(s)).toEqual(['branche-anselme', 'sauf-conduit']);
    expect(talk(s, 'kaelis')).toBe('apres-vente');
    walk(s, 'ironheart-forges');
    expect(talk(s, 'veilleuse')).toBe('apres');
  });

  it('« Le Rail des Cendres » : la garde de nuit, les pilleurs vaincus, le Bureau prévenu', () => {
    walk(s, 'ironheart-triage');
    expect(talk(s, 'varka')).toBe('accueil');
    say(s, 'varka', 'accueil', 'Peur de quoi');
    say(s, 'varka', 'convois', 'Je vais trouver');
    expect(talk(s, 'varka')).toBe('enquete');
    say(s, 'varka', 'enquete', 'Monter la garde');
    expect(talk(s, 'aiguillage')).toBe('levier-quete');
    say(s, 'aiguillage', 'levier-quete', 'Attendre la nuit');
    expect(present(s, 'ironheart-triage', 'pilleur-1')).toBe(true);
    say(s, 'aiguillage', 'veille', 'Les arrêter');
    win(s, 'aiguillage-cendres');
    expect(present(s, 'ironheart-triage', 'pilleur-1')).toBe(false);
    expect(journalStep(s, 'rail-cendres')?.step).toMatch(/pilleurs/);
    expect(talk(s, 'tunnel-cendriere')).toBe('guetteur');
    say(s, 'tunnel-cendriere', 'guetteur', '« Tes deux amis');
    say(s, 'tunnel-cendriere', 'passe', 'Entrer');
    expect(talk(s, 'sorn')).toBe('accueil');
    walk(s, 'ironheart-triage');
    expect(talk(s, 'ostrik')).toBe('rapport');
    expect(gained(s, () => say(s, 'ostrik', 'rapport', 'Tout'))).toEqual({ xp: 40, fers: 60 });
    expect(present(s, 'ironheart-triage', 'joss')).toBe(false);
    expect(present(s, 'ironheart-cendriere', 'sorn')).toBe(false);
    expect(present(s, 'ironheart-forges', 'pilote-endormi')).toBe(false);
    expect(talk(s, 'varka')).toBe('apres-bureau');
    walk(s, 'ironheart-forges');
  });

  it('« Les Échos sous la Forge » : l’Écho frappé, la galerie scellée', () => {
    expect(talk(s, 'forge-eteinte')).toBe('jour');
    say(s, 'forge-eteinte', 'jour', 'Revenir à la nuit');
    say(s, 'forge-eteinte', 'nuit', 'Ouvrir la trappe');
    expect(talk(s, 'echo-promesse')).toBe('promesse');
    say(s, 'echo-promesse', 'promesse', 'L’écouter jusqu’au bout');
    say(s, 'echo-promesse', 'choix', 'Le frapper');
    say(s, 'echo-promesse', 'frapper', 'Frapper');
    expect(present(s, 'ironheart-galerie', 'echo-furieux-1')).toBe(true);
    // Once struck, the Écho can no longer be ignored, followed or written down: only the fight is left.
    expect(optionTexts(s, 'echo-promesse', 'promesse')).toEqual(['L’écouter jusqu’au bout.', 'Partir.']);
    expect(optionTexts(s, 'echo-promesse', 'choix')).toEqual(['Le frapper pour le dissiper.', 'Réfléchir encore.']);
    win(s, 'echos-furieux');
    expect(s.quests['echos-forge']).toBe('done');
    expect(present(s, 'ironheart-galerie', 'echo-promesse')).toBe(false);
    expect(present(s, 'ironheart-galerie', 'echo-furieux-1')).toBe(false);
    expect(talk(s, 'hesk')).toBe('colere');
    walk(s, 'ironheart-forges');
    expect(talk(s, 'forge-eteinte')).toBe('scellee');
  });

  it('Retour à Canopéa en train : Malo, puis « Le chant d’Anselme » par le carnet de Mirelle', () => {
    expect(talk(s, 'guichet-ouest')).toBe('guichet');
    expect(optionTexts(s, 'guichet-ouest', 'guichet')).toEqual(['Prendre un billet.', 'Pas aujourd’hui.']);
    expect(gained(s, () => say(s, 'guichet-ouest', 'guichet', 'Prendre un billet.'))).toEqual({ xp: 0, fers: -40 });
    say(s, 'guichet-ouest', 'train-canopee', 'Monter');
    expect(talk(s, 'malo')).toBe('retour');
    say(s, 'malo', 'retour', 'La voici');
    // The branch was taken during the inquiry: Véline has no reason to lower the hero again.
    expect(talk(s, 'veline')).toBe('retour');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-atelier');
    expect(talk(s, 'elouan')).toBe('branche');
    expect(optionTexts(s, 'elouan', 'branche')).toEqual(['Où trouver la mélodie ?', 'Je reviens.']);
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-nacelle');
    walk(s, 'canopee-aieux');
    walk(s, 'canopee-relais');
    expect(talk(s, 'mirelle')).toBe('chanson');
    say(s, 'mirelle', 'chanson', 'Connais-tu');
    say(s, 'mirelle', 'carnet', 'Merci, Mirelle');
    say(s, 'mirelle', 'accueil', 'Tu connais Ilyane');
    say(s, 'mirelle', 'ilyane', 'Je peux le lui rapporter');
    walk(s, 'canopee-aieux');
    walk(s, 'canopee-nacelle');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-atelier');
    expect(talk(s, 'elouan')).toBe('branche');
    expect(optionTexts(s, 'elouan', 'branche')).not.toContain('Je l’ai entendue au Bosquet. Je peux te la fredonner.');
    say(s, 'elouan', 'branche', 'Mirelle m’a montré');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-feuillevent');
    expect(talk(s, 'ailis')).toBe('flute');
    expect(gained(s, () => say(s, 'ailis', 'flute', 'Elouan l’a taillée'))).toEqual({ xp: 30, fers: 0 });
    expect(s.quests['chant-anselme']).toBe('done');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-nacelle');
  });

  it('« Les graines qui manquent » après Ironheart : Elvan dénoncé quitte le Nid', () => {
    // Déjà lancée pendant l'enquête du Triumvirat (Véline, « Quoi de neuf »).
    expect(s.quests.graines).toBe('active');
    walk(s, 'canopee-auberge');
    expect(talk(s, 'lisandre')).toBe('vote');
    say(s, 'lisandre', 'vote', 'Merci pour la nouvelle');
    say(s, 'lisandre', 'accueil', 'Quelles nouvelles');
    say(s, 'lisandre', 'nouvelles', 'Il manque des graines');
    expect(talk(s, 'elvan')).toBe('confrontation');
    say(s, 'elvan', 'confrontation', 'Ton ballot brille');
    expect(gained(s, () => say(s, 'elvan', 'aveu', 'Je vais le dire'))).toEqual({ xp: 30, fers: 0 });
    expect(present(s, 'canopee-auberge', 'elvan')).toBe(false);
    expect(talk(s, 'lisandre')).toBe('elvan-parti');
    walk(s, 'canopee-nacelle');
    expect(talk(s, 'veline')).toBe('graines-merci');
    say(s, 'veline', 'graines-merci', 'Que la sève coule');
  });

  it('« Un prêt de la Terre » à court de Résonance : le cristal forcé fait saigner du nez', () => {
    walk(s, 'canopee-aieux');
    expect(talk(s, 'vanel')).toBe('accueil');
    say(s, 'vanel', 'accueil', 'Apprends-moi');
    say(s, 'vanel', 'apprendre', 'Et si je force trop');
    expect(equip(s.character!, 'cristal-vanel', 'cristal')).toBe(true);
    walk(s, 'canopee-nacelle');
    // Toute la Résonance déjà dépensée : chaque point manquant se paie de 3 PV, jamais du dernier.
    s.character!.resonance = 0;
    const hp = s.character!.hp;
    expect(hp).toBeGreaterThan(6);
    expect(talk(s, 'tiven')).toBe('quete');
    const poser = visibleOptions(DIALOGUES.tiven.nodes.quete, s).find((v) => v.option.text.startsWith('Poser'))!;
    expect(poser.tags).toEqual(['Guérison naturelle · 2 PR (nez qui saigne : −6 PV, risque de marque)']);
    // Le jet du prix est raté (un 1) : la première marque (docs/gdd/passe-sombre.md).
    const dice = vi.spyOn(Math, 'random').mockReturnValue(0);
    say(s, 'tiven', 'quete', 'Poser le cristal');
    dice.mockRestore();
    expect(s.character!.hp).toBe(hp - 6);
    expect(s.character!.resonance).toBe(0);
    expect(s.character!.marques).toBe(1);
    walk(s, 'canopee-aieux');
    expect(talk(s, 'vanel')).toBe('retour');
    expect(s.quests['pret-terre']).toBe('done');
    expect(s.character!.skills.resonance).toBe(1);
    // Vanel voit les veines ; il les reprend, et le rang de Résonance qu'il vient d'apprendre avec.
    expect(talk(s, 'vanel')).toBe('marques');
    say(s, 'vanel', 'marques', 'Reprends-les');
    expect(s.character!.marques).toBe(0);
    expect(s.character!.skills.resonance).toBe(0);
    expect(talk(s, 'vanel')).toBe('apres');
    walk(s, 'canopee-nacelle');
  });

  it('« Le carnet de chansons » et « La caravane de midi » en dernier, par la caravane payante', () => {
    expect(travel(s, 'gardebois')).toBeNull();
    expect(talk(s, 'ilyane')).toBe('carnet');
    say(s, 'ilyane', 'carnet', 'La dix-sept');
    expect(talk(s, 'commis-caravane')).toBe('presse');
    say(s, 'commis-caravane', 'presse', 'Je peux la porter');
    expect(talk(s, 'convoyeuse')).toBe('accueil');
    say(s, 'convoyeuse', 'accueil', 'À Canopéa');
    expect(gained(s, () => say(s, 'convoyeuse', 'canopee', 'Payer le voyage'))).toEqual({ xp: 0, fers: -15 });
    say(s, 'convoyeuse', 'trajet-canopee', 'Monter');
    expect(talk(s, 'veline')).toBe('caravane');
    say(s, 'veline', 'caravane', 'La voici');
    expect(s.quests['caravane-midi']).toBe('done');
    // By the caravan (or the train) the wolves are never met: the commis does not speak of them.
    expect(s.flags['loups-caravane']).toBeUndefined();
    const commis = figurantLines(figurantsAt('gardebois').find((f) => f.dialogue === 'commis-caravane')!, s)[0];
    expect(commis).toMatch(/viande séchée/);
    expect(commis).not.toMatch(/loups/);
    expect(talk(s, 'chef-caravane')).toBe('accueil');
    say(s, 'chef-caravane', 'accueil', 'Pour Gardebois');
    say(s, 'chef-caravane', 'gardebois', 'Montrer ta marque');
    say(s, 'chef-caravane', 'trajet-gardebois', 'Descendre');
    expect(s.location).toBe('gardebois');
  });

  it('Gardebois en dernier : berceuse (Érudition), herbes (Survie), caisse (combat)', () => {
    walk(s, 'maison-lunelierre');
    expect(talk(s, 'maelis')).toBe('demande');
    say(s, 'maelis', 'demande', 'Je vais t’aider');
    walk(s, 'gardebois');
    expect(talk(s, 'echo-berceuse')).toBe('chant');
    say(s, 'echo-berceuse', 'chant', 'Noter les vers');
    walk(s, 'maison-lunelierre');
    expect(talk(s, 'nell')).toBe('chanson');
    say(s, 'nell', 'chanson', 'Lui chanter');
    walk(s, 'gardebois');
    expect(talk(s, 'liane')).toBe('demande');
    say(s, 'liane', 'demande', 'Où en trouver');
    for (const id of ['sauge-1', 'sauge-2']) {
      expect(talk(s, id)).toBe('cueillir');
      say(s, id, 'cueillir', 'La cueillir');
    }
    expect(talk(s, 'rocher-sauge')).toBe('chercher');
    say(s, 'rocher-sauge', 'chercher', 'Suivre l’odeur');
    expect(talk(s, 'liane')).toBe('rendu');
    say(s, 'liane', 'rendu', 'Merci, Liane');
    walk(s, 'reserve-cendrefer');
    expect(talk(s, 'brann')).toBe('demande');
    say(s, 'brann', 'demande', 'Je vais la chercher');
    walk(s, 'gardebois');
    expect(talk(s, 'caisse-egaree')).toBe('gardee');
    say(s, 'caisse-egaree', 'gardee', 'Les affronter');
    win(s, 'caisse-egaree');
    expect(talk(s, 'caisse-egaree')).toBe('libre');
    say(s, 'caisse-egaree', 'libre', 'Prendre la caisse');
    walk(s, 'reserve-cendrefer');
    expect(talk(s, 'brann')).toBe('rendu');
    say(s, 'brann', 'rendu', 'Merci, Brann');
  });

  it('Les compagnons, autrement : le nom de Saule gravé au Bosquet ; la page de Boulon arrachée', () => {
    walk(s, 'gardebois');
    expect(talk(s, 'liane')).toBe('apres');
    say(s, 'liane', 'apres', 'Viens avec moi');
    say(s, 'liane', 'recrue', 'Compris');
    waitUntil(s.time, 'nuit');
    expect(companion(s, 'liane')).toBe('nuit');
    say(s, 'compagnon-liane', 'nuit', 'Qu’est-ce que tu mâches');
    say(s, 'compagnon-liane', 'aveu', 'Ça te ronge');
    say(s, 'compagnon-liane', 'ronge', 'Il y a peut-être un autre chemin');
    say(s, 'compagnon-liane', 'choix', 'Allons graver son nom');
    say(s, 'compagnon-liane', 'graver-ok', 'Je serai là');
    expect(s.avis.liane).toBe(1);
    expect(travel(s, 'canopee')).toBeNull();
    walk(s, 'canopee-aieux');
    expect(talk(s, 'arbre-vierge')).toBe('lisse');
    expect(gained(s, () => say(s, 'arbre-vierge', 'lisse', 'Laisser Liane graver'))).toEqual({ xp: 40, fers: 0 });
    expect([s.quests['oubli-liane'], knowsRecit(s.character!, 'saule'), s.avis.liane]).toEqual(['done', true, 3]);
    expect(companion(s, 'liane')).toBe('route-bon');
    expect(talk(s, 'arbre-vierge')).toBe('grave');
    walk(s, 'canopee-nacelle');

    expect(travel(s, 'ironheart')).toBeNull();
    expect(talk(s, 'boulon')).toBe('accueil');
    say(s, 'boulon', 'accueil', 'Parlons un peu');
    say(s, 'boulon', 'parler', 'Tu ne voyages jamais');
    say(s, 'boulon', 'voyage', 'Et si tu venais avec moi');
    // Le cristal au cou : le patrouilleur inscrit d'abord le héros sur sa liste, puis le sauf-conduit ouvre le funiculaire.
    expect(talk(s, 'patrouilleur')).toBe('liste');
    say(s, 'patrouilleur', 'liste', 'Et le funiculaire');
    say(s, 'patrouilleur', 'controle', 'Montrer le sauf-conduit');
    say(s, 'patrouilleur', 'sauf', 'Monter');
    expect(s.location).toBe('ironheart-manufactures');
    walk(s, 'ironheart-archives');
    expect(talk(s, 'noam')).toBe('registre');
    say(s, 'noam', 'registre', 'Arracher la page');
    walk(s, 'ironheart-manufactures');
    walk(s, 'ironheart-forges');
    expect(talk(s, 'boulon')).toBe('libre');
    say(s, 'boulon', 'libre', 'Attends-moi ici');
    expect([s.quests['contrat-boulon'], s.groupe.map((m) => m.id)]).toEqual(['done', ['liane']]);
    expect(talk(s, 'boulon')).toBe('revient');
  });

  it('« Le registre du Puits Trois » : Dask prend le masque à son nom, Tam monte aux Manufactures', () => {
    expect(talk(s, 'kerta')).toBe('accueil');
    say(s, 'kerta', 'accueil', 'Qu’est-ce qui ne va pas');
    say(s, 'kerta', 'probleme', 'Où est le problème');
    say(s, 'kerta', 'probleme2', 'Et ce que veut Tam');
    expect(s.flags['laissez-passer-ironheart']).toBe(true);
    walk(s, 'ironheart-manufactures');
    expect(talk(s, 'dask')).toBe('dossier');
    say(s, 'dask', 'dossier', 'Que voulez-vous');
    expect(gained(s, () => say(s, 'dask', 'nom', 'Marché conclu'))).toEqual({ xp: 0, fers: 0 });
    expect(talk(s, 'dask')).toBe('apres');
    walk(s, 'ironheart-forges');
    expect(talk(s, 'tam')).toBe('decision');
    // The mask now belongs to Dask: it can no longer stay down below.
    expect(optionTexts(s, 'tam', 'decision')).toEqual(['Monte. Pour ta mère, et pour tes poumons.', 'Je ne sais pas.']);
    expect(gained(s, () => say(s, 'tam', 'decision', 'Monte'))).toEqual({ xp: 50, fers: 0 });
    expect(s.quests['registre-puits']).toBe('done');
    expect(present(s, 'ironheart-forges', 'tam')).toBe(false);
    expect(talk(s, 'kerta')).toBe('apres-monte');
  });

  it('« Les Mémoires du Monde Perdu » de nuit : le portier passé, la ligne vendue à la dame en gris', () => {
    expect(travel(s, 'gardebois')).toBeNull();
    const appel = talk(s, 'ilyane');
    // La clé vendue aux Marches : elle est déjà entre des gants fins (feuille de route, chantier 4).
    expect(appel).toBe('appel-vendue');
    say(s, 'ilyane', appel, 'J’irai à Sept-Portes');
    travel(s, 'sept-portes');
    walk(s, 'sept-portes-parvis');
    walk(s, 'sept-portes-gardiens');
    expect(talk(s, 'hesper')).toBe('appel');
    walk(s, 'sept-portes-parvis');
    walk(s, 'sept-portes-bibliotheque');
    expect(talk(s, 'ambroise')).toBe('registre');
    say(s, 'ambroise', 'registre', 'Une clé de rouille bleue');
    say(s, 'ambroise', 'chaine', 'Et personne d’autre');
    say(s, 'ambroise', 'edda-demande', 'Et si c’est moi');
    say(s, 'ambroise', 'demande', 'Je reviendrai');
    // La nuit, Discrétion 14 pour passer le portier.
    waitUntil(s.time, 'nuit');
    expect(talk(s, 'porte-fonds-muet')).toBe('fermee');
    say(s, 'porte-fonds-muet', 'fermee', 'Passer quand le portier');
    say(s, 'porte-fonds-muet', 'passe', 'Entrer');
    expect(s.location).toBe('sept-portes-fonds-muet');
    expect(talk(s, 'page-dernier-depart')).toBe('page');
    walk(s, 'sept-portes-bibliotheque');
    walk(s, 'sept-portes-parvis');
    walk(s, 'sept-portes');
    walk(s, 'sept-portes-auberge');
    expect(talk(s, 'edda')).toBe('offre');
    expect(optionTexts(s, 'edda', 'offre')).toEqual(['La lui vendre, pour deux cents Fers.', 'Non.']);
    expect(gained(s, () => say(s, 'edda', 'offre', 'La lui vendre'))).toEqual({ xp: 0, fers: 200 });
    expect(present(s, 'sept-portes-auberge', 'edda')).toBe(false);
    walk(s, 'sept-portes');
    walk(s, 'sept-portes-parvis');
    walk(s, 'sept-portes-gardiens');
    expect(gained(s, () => expect(talk(s, 'hesper')).toBe('fin-vendue'))).toEqual({ xp: 60, fers: 0 });
    expect(s.quests['memoires-monde-perdu']).toBe('done');
    expect(reputationScore(s, 'sept-portes')).toBe(15);
  });

  it('Bilan de la variante', () => {
    expect(unfinished(s)).toEqual([]);
    expect(questItems(s)).toEqual(['cristal-vanel', 'sauf-conduit']);
    expect(reputations(s)).toEqual({
      gardebois: 40,
      canopee: 50,
      ironheart: 25,
      'sept-portes': 15,
      'compagnie-lisieres': 0,
      nacelliers: 25,
      'travailleurs-rail': -25,
      'marches-cendres': 10,
      'archives-ferros': -10,
    });
    expect(repeatableGains(s)).toEqual([]);
    expect(maskedEntries(s, true)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------------------------------------------
// C. Variante : « Le Rail des Cendres » avant « La Clé », la garde de nuit ratée, le silence vendu aux Marches.
// ---------------------------------------------------------------------------------------------------------------

/** Gardebois and « L’audience » the short way: the Récit of Corvan for Ingrid, Commandement for Garrik. */
function prelude(s: GameState): void {
  expect(talk(s, 'ilyane')).toBe('accueil');
  say(s, 'ilyane', 'accueil', 'Que se passe-t-il');
  say(s, 'ilyane', 'trouble', 'D’où vient ce mal');
  say(s, 'ilyane', 'cause', 'J’irai voir');
  walk(s, 'gare-engloutie');
  expect(talk(s, 'echo-dernier-train')).toBe('approche');
  say(s, 'echo-dernier-train', 'approche', 'Entrer dans l’Écho');
  // Le laissez-passer, payé cinquante Fers à Tobias (le contremaître ne laisse pas passer sans lui, le jour).
  expect(talk(s, 'ingrid')).toBe('barriere');
  walk(s, 'gardebois');
  s.character!.fers += 50;
  say(s, 'tobias', 'accueil', 'Je dois entrer sur le chantier');
  say(s, 'tobias', 'chantier', 'Combien');
  say(s, 'tobias', 'prix', 'Payer cinquante Fers');
  expect(s.flags['laissez-passer']).toBe(true);
  walk(s, 'gare-engloutie');
  expect(talk(s, 'ingrid')).toBe('accueil');
  say(s, 'ingrid', 'accueil', 'Ce chantier');
  // Le Récit de l'Écho, raconté à Ingrid (feuille de route, chantiers 1 et 5).
  tell(s, 'ingrid', 'cause', 'savant-corvan');
  expect(s.quests['dernier-train']).toBe('done');
  walk(s, 'gardebois');
  expect(talk(s, 'ilyane')).toBe('resolu');
  say(s, 'ilyane', 'resolu', 'Et maintenant');
  travel(s, 'canopee');
  walk(s, 'canopee-ramures');
  walk(s, 'canopee-conseil');
  expect(talk(s, 'huissier')).toBe('lettre');
  say(s, 'huissier', 'lettre', 'Entrer');
  expect(talk(s, 'kael-marchevent')).toBe('audience');
  say(s, 'kael-marchevent', 'audience', 'Ilyane');
  say(s, 'kael-marchevent', 'lettre', 'Une foreuse');
  say(s, 'kael-marchevent', 'recit-gare', 'Les papiers');
  say(s, 'kael-marchevent', 'lyra', 'Et ce mal');
  say(s, 'kael-marchevent', 'thalorin', 'Je peux chercher');
  walk(s, 'canopee-conseil');
  walk(s, 'canopee-ramures');
  walk(s, 'canopee-nacelle');
  // Véline never greeted the hero: the inquiry's entry comes first anyway.
  expect(talk(s, 'veline')).toBe('descente-conseil');
  say(s, 'veline', 'descente-conseil', 'Descends');
  expect(talk(s, 'garrik')).toBe('rencontre');
  say(s, 'garrik', 'rencontre', 'Pose cette pioche');
  say(s, 'garrik', 'intimide', 'Qui t’a payé');
  say(s, 'garrik', 'aveu', 'Pars');
  walk(s, 'canopee-nacelle');
  walk(s, 'canopee-ramures');
  walk(s, 'canopee-conseil');
  expect(talk(s, 'huissier')).toBe('retour');
  say(s, 'huissier', 'retour', 'Entrer');
  expect(talk(s, 'kael-marchevent')).toBe('rapport');
  say(s, 'kael-marchevent', 'rapport', 'Des fouilleurs');
  say(s, 'kael-marchevent', 'rapport-suite', 'Que va faire');
  say(s, 'kael-marchevent', 'choix', 'Gardez le commerce');
  say(s, 'kael-marchevent', 'fin-commerce', 'Et moi');
  expect(s.quests.audience).toBe('done');
  walk(s, 'canopee-conseil');
  walk(s, 'canopee-ramures');
  walk(s, 'canopee-nacelle');
}

describe('Variante : « Le Rail des Cendres » avant « La Clé de Rouille Bleue »', () => {
  const s = createNewGame(testCharacter({}, { diplomacy: 3, command: 2 }));

  it('Gardebois et l’audience par le chemin court (Récit de Corvan, Commandement)', () => {
    prelude(s);
    expect(knowsRecit(s.character, 'savant-corvan')).toBe(true);
    expect(questItems(s)).toEqual(['sauf-conduit']);
  });

  it('Le Rail commence d’abord ; pendant la Clé, la Veilleuse parle encore des convois', () => {
    expect(travel(s, 'ironheart')).toBeNull();
    walk(s, 'ironheart-triage');
    expect(talk(s, 'varka')).toBe('accueil');
    say(s, 'varka', 'accueil', 'Peur de quoi');
    say(s, 'varka', 'convois', 'Je vais trouver');
    walk(s, 'ironheart-forges');
    expect(talk(s, 'veilleuse')).toBe('accueil');
    expect(optionTexts(s, 'veilleuse', 'accueil')).toContain('Les convois du triage, qui partent seuls la nuit ?');
    expect(talk(s, 'boulon')).toBe('accueil-quete');
    say(s, 'boulon', 'accueil-quete', 'Un certain Kaelis');
    expect(talk(s, 'renfoncement')).toBe('mur');
    say(s, 'renfoncement', 'mur', 'Chercher le passage');
    say(s, 'renfoncement', 'trouve', 'Descendre');
    expect(talk(s, 'kaelis')).toBe('accueil-garrik');
    say(s, 'kaelis', 'accueil-garrik', 'Pourquoi certaines reliques');
    walk(s, 'ironheart-forges');
    expect(talk(s, 'veilleuse')).toBe('question-cle');
    // « question-cle » is full (four options): the Rail's clue is one step further, in « ouvre ».
    expect(maskedEntries(s).filter((m) => m.startsWith('veilleuse'))).toEqual([]);
    say(s, 'veilleuse', 'question-cle', 'Lui parler de ce que la clé ouvre');
    expect(optionTexts(s, 'veilleuse', 'ouvre')).toContain('Les convois du triage, qui partent seuls la nuit ?');
    expect(gained(s, () => say(s, 'veilleuse', 'ouvre', 'Les convois du triage'))).toEqual({ xp: 5, fers: 0 });
    expect(journalStep(s, 'rail-cendres')?.step).toMatch(/Veilleuse/);
    expect(talk(s, 'veilleuse')).toBe('question-cle');
    say(s, 'veilleuse', 'question-cle', 'Lui parler de ce que la clé ouvre');
    expect(optionTexts(s, 'veilleuse', 'ouvre')).not.toContain('Les convois du triage, qui partent seuls la nuit ?');
  });

  it('La garde de nuit ratée, Joss convaincu, le silence vendu à Sorn', () => {
    walk(s, 'ironheart-triage');
    expect(talk(s, 'aiguillage')).toBe('levier-quete');
    say(s, 'aiguillage', 'levier-quete', 'Attendre la nuit');
    // The stealth roll fails: « veille-rate », and the hero runs away.
    choose(s, 'aiguillage', 'veille-rate', 'Fuir');
    expect(present(s, 'ironheart-triage', 'pilleur-1')).toBe(true);
    expect(talk(s, 'registre-departs')).toBe('registre');
    expect(talk(s, 'joss')).toBe('soupcon');
    say(s, 'joss', 'soupcon', 'Je ne suis pas du Bureau');
    expect(talk(s, 'joss')).toBe('avoue');
    say(s, 'joss', 'avoue', 'Comment entrer');
    expect(talk(s, 'tunnel-cendriere')).toBe('guetteur');
    say(s, 'tunnel-cendriere', 'guetteur', '« Levier ouvert. »');
    say(s, 'tunnel-cendriere', 'passe', 'Entrer');
    expect(talk(s, 'sorn')).toBe('accueil');
    say(s, 'sorn', 'accueil', 'Combien');
    expect(gained(s, () => say(s, 'sorn', 'marche', 'Marché conclu'))).toEqual({ xp: 30, fers: 80 });
    expect(s.quests['rail-cendres']).toBe('done');
    walk(s, 'ironheart-triage');
    // The Rail is settled (here by the Marches): the pilleurs left standing after the failed watch are gone too.
    expect(present(s, 'ironheart-triage', 'pilleur-1')).toBe(false);
    expect(present(s, 'ironheart-triage', 'pilleur-2')).toBe(false);
    expect(talk(s, 'aiguillage')).toBe('levier');
    expect(talk(s, 'varka')).toBe('apres-marches');
    // Joss knew too much: the Marches do not leave a witness (docs/gdd/passe-sombre.md).
    expect(present(s, 'ironheart-triage', 'joss')).toBe(false);
    expect(figurantLines(figurantsAt('ironheart-triage').find((f) => f.id === 'cheminote-triage')!, s)[0]).toMatch(/Joss/);
    walk(s, 'ironheart-forges');
  });

  it('La Clé ensuite : le Récit de Corvan ouvre la main de la Veilleuse, qui garde la clé', () => {
    expect(talk(s, 'veilleuse')).toBe('question-cle');
    say(s, 'veilleuse', 'question-cle', 'J’ai vu le dernier train');
    expect(talk(s, 'veilleuse')).toBe('avec-cle');
    say(s, 'veilleuse', 'avec-cle', 'L’étudier d’abord');
    expect(gained(s, () => say(s, 'veilleuse', 'etude', 'Te la rendre'))).toEqual({ xp: 60, fers: 0 });
    expect(s.quests['cle-rouille-bleue']).toBe('done');
    expect(talk(s, 'veilleuse')).toBe('rendue-apres');
    walk(s, 'ironheart-marche');
    expect(talk(s, 'kaelis')).toBe('apres');
    walk(s, 'ironheart-forges');
  });

  it('« Les Échos » : suivre l’Écho et garder l’oiseau de fer ; le train coûte plus cher', () => {
    expect(talk(s, 'forge-eteinte')).toBe('jour');
    say(s, 'forge-eteinte', 'jour', 'Revenir à la nuit');
    say(s, 'forge-eteinte', 'nuit', 'Ouvrir la trappe');
    expect(talk(s, 'echo-promesse')).toBe('promesse');
    say(s, 'echo-promesse', 'promesse', 'L’écouter jusqu’au bout');
    say(s, 'echo-promesse', 'choix', 'Le suivre');
    expect(s.quests['echos-forge']).toBe('done');
    expect(talk(s, 'echo-promesse')).toBe('apaise');
    walk(s, 'ironheart-forges');
    expect(talk(s, 'guichet-ouest')).toBe('guichet');
    expect(optionTexts(s, 'guichet-ouest', 'guichet')).toEqual([expect.stringMatching(/^Prendre un billet : les convois/), 'Pas aujourd’hui.']);
    expect(questItems(s)).toEqual(['oiseau-de-fer', 'sauf-conduit']);
    expect([reputationScore(s, 'ironheart'), reputationScore(s, 'travailleurs-rail'), reputationScore(s, 'marches-cendres')]).toEqual([0, 0, 10]);
    expect(repeatableGains(s)).toEqual([]);
  });

  it('« Le registre du Puits Trois » : le sceau de Dask, mal apposé ; Tam pris à l’inspection', () => {
    expect(talk(s, 'kerta')).toBe('accueil');
    say(s, 'kerta', 'accueil', 'Qu’est-ce qui ne va pas');
    say(s, 'kerta', 'probleme', 'Où est le problème');
    s.flags['laissez-passer-ironheart'] = true;
    walk(s, 'ironheart-manufactures');
    expect(talk(s, 'dask')).toBe('dossier');
    // The Subterfuge roll fails: the seal smears, and nobody says so.
    choose(s, 'dask', 'dossier', 'Pendant qu’il cherche');
    applyEffects(s, DIALOGUES.dask.nodes['faux-bancal'].effects);
    walk(s, 'ironheart-forges');
    expect(talk(s, 'tam')).toBe('decision');
    expect(optionTexts(s, 'tam', 'decision')).toHaveLength(3);
    expect(gained(s, () => say(s, 'tam', 'decision', 'Monte'))).toEqual({ xp: 20, fers: 0 });
    expect(s.flags['tam-arrete']).toBe(true);
    expect(s.flags['tam-monte']).toBeUndefined();
    expect(present(s, 'ironheart-forges', 'tam')).toBe(false);
    expect(talk(s, 'kerta')).toBe('apres-arrete');
    expect(reputationScore(s, 'ironheart')).toBe(-5);
  });
});

// ---------------------------------------------------------------------------------------------------------------
// D. Variante : Canopéa d'abord, avant même « Le Dernier Train » ; l'audience sans la lettre d'Ilyane.
// ---------------------------------------------------------------------------------------------------------------

describe('Variante : Canopéa d’abord, puis Gardebois', () => {
  const s = createNewGame(testCharacter());

  it('Malo, Anselme et le carnet se font avant la première quête de Gardebois', () => {
    expect(travel(s, 'canopee')).toBeNull();
    expect(talk(s, 'veline')).toBe('accueil');
    say(s, 'veline', 'accueil', 'Je suis en apprentissage');
    expect(talk(s, 'malo')).toBe('souci');
    say(s, 'malo', 'souci', 'Je peux t’aider');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-feuillevent');
    expect(talk(s, 'ailis')).toBe('accueil');
    say(s, 'ailis', 'accueil', 'Parler à un arbre');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-atelier');
    expect(talk(s, 'elouan')).toBe('proposition');
    say(s, 'elouan', 'proposition', 'J’irai chercher');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-nacelle');
    expect(talk(s, 'veline')).toBe('descente');
    say(s, 'veline', 'descente', 'Je peux la chercher');
    say(s, 'veline', 'permission', 'Allons-y');
    expect(talk(s, 'sacoche-lettres')).toBe('ours');
    say(s, 'sacoche-lettres', 'ours', 'Glisser la main');
    expect(talk(s, 'arbre-retour-anselme')).toBe('arbre-quete');
    say(s, 'arbre-retour-anselme', 'arbre-quete', 'Ramasser');
    walk(s, 'canopee-nacelle');
    expect(talk(s, 'malo')).toBe('retour');
    say(s, 'malo', 'retour', 'La voici');
    walk(s, 'canopee-aieux');
    walk(s, 'canopee-relais');
    expect(talk(s, 'mirelle')).toBe('chanson');
    say(s, 'mirelle', 'chanson', 'Connais-tu');
    say(s, 'mirelle', 'carnet', 'Merci, Mirelle');
    say(s, 'mirelle', 'accueil', 'Tu connais Ilyane');
    say(s, 'mirelle', 'ilyane', 'Je peux le lui rapporter');
    walk(s, 'canopee-aieux');
    walk(s, 'canopee-nacelle');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-atelier');
    expect(talk(s, 'elouan')).toBe('branche');
    say(s, 'elouan', 'branche', 'Mirelle m’a montré');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-feuillevent');
    expect(talk(s, 'ailis')).toBe('flute');
    say(s, 'ailis', 'flute', 'Elouan l’a taillée');
    expect([s.quests['lettres-malo'], s.quests['chant-anselme']]).toEqual(['done', 'done']);
    // The Council's door stays shut before the Gare, whatever the town thinks of the hero.
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-conseil');
    expect(reputationScore(s, 'canopee')).toBe(20);
    expect(talk(s, 'huissier')).toBe('accueil');
    say(s, 'huissier', 'accueil', 'Le Conseil accepterait-il');
    expect(s.quests.audience).toBeUndefined();
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-nacelle');
  });

  it('Ilyane reçoit son carnet avant de donner « Le Dernier Train », qui reste à prendre ; le Golem le termine', () => {
    expect(travel(s, 'gardebois')).toBeNull();
    expect(talk(s, 'ilyane')).toBe('carnet');
    say(s, 'ilyane', 'carnet', 'La dix-sept');
    expect(s.quests['carnet-chansons']).toBe('done');
    expect(talk(s, 'ilyane')).toBe('accueil');
    say(s, 'ilyane', 'accueil', 'Que se passe-t-il');
    say(s, 'ilyane', 'trouble', 'D’où vient ce mal');
    say(s, 'ilyane', 'cause', 'J’irai voir');
    walk(s, 'gare-engloutie');
    expect(gained(s, () => golem(s))).toEqual({ xp: 70, fers: 30 });
    // Le cœur du Golem tenait la foreuse sous tension (feuille de route, chantier 5).
    expect(talk(s, 'foreuse')).toBe('arretee-golem');
    expect(talk(s, 'ingrid')).toBe('apres-golem');
    walk(s, 'gardebois');
    expect(talk(s, 'ilyane')).toBe('resolu');
  });

  it('L’audience s’ouvre aussi sans la lettre, par la réputation ; Kael fait sans', () => {
    expect(travel(s, 'canopee')).toBeNull();
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-conseil');
    expect(talk(s, 'huissier')).toBe('nouvelles');
    say(s, 'huissier', 'nouvelles', 'Je viens de Gardebois');
    expect(s.quests.audience).toBe('active');
    say(s, 'huissier', 'admis', 'Entrer');
    expect(talk(s, 'kael-marchevent')).toBe('audience');
    expect(optionTexts(s, 'kael-marchevent', 'audience')).toEqual([expect.stringMatching(/^Une foreuse/)]);
    // Ilyane no longer offers the letter once the audience is under way.
    expect(visibleOptions(DIALOGUES.ilyane.nodes.resolu, s).map((v) => v.option.text)).toEqual(['Je resterai sur mes gardes.']);
    expect(repeatableGains(s)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------------------------------------------
// E. Cas limites relevés pendant le parcours.
// ---------------------------------------------------------------------------------------------------------------

describe('Cas limites', () => {
  it('La chaudière ouverte en grand : la foreuse se tait, Pell meurt ; Ingrid, Ilyane et le lavoir s’en souviennent', () => {
    const s = createNewGame(testCharacter());
    say(s, 'ilyane', 'accueil', 'Que se passe-t-il');
    say(s, 'ilyane', 'trouble', 'D’où vient ce mal');
    say(s, 'ilyane', 'cause', 'J’irai voir');
    walk(s, 'gare-engloutie');
    expect(talk(s, 'foreuse')).toBe('jour');
    say(s, 'foreuse', 'jour', 'Attendre la nuit');
    say(s, 'foreuse', 'nuit', 'Se glisser');
    expect(optionTexts(s, 'foreuse', 'au-pied')).toEqual(['Saboter le mécanisme.', 'Ouvrir la chaudière en grand, et courir.', 'Repartir sans rien toucher.']);
    // Une mort n'est pas une solution : moins d'XP (feuille de route, chantier 5).
    expect(gained(s, () => say(s, 'foreuse', 'au-pied', 'Ouvrir la chaudière'))).toEqual({ xp: 50, fers: 30 });
    expect(s.quests['dernier-train']).toBe('done');
    expect(talk(s, 'foreuse')).toBe('explosee');
    expect(talk(s, 'ingrid')).toBe('apres-explosion');
    walk(s, 'gardebois');
    expect(figurantLines(FIGURANTS.find((f) => f.id === 'lavandiere')!, s)[0]).toMatch(/pour toujours/);
    expect(talk(s, 'ilyane')).toBe('pell');
    say(s, 'ilyane', 'pell', 'Je m’en souviendrai');
    say(s, 'ilyane', 'resolu', 'Et maintenant');
    expect(s.quests.audience).toBe('active');
    expect(talk(s, 'ilyane')).toBe('oubli-1');
    say(s, 'ilyane', 'oubli-1', 'Je reviendrai');
    expect(talk(s, 'ilyane')).toBe('resolu');
  });

  it('Ingrid ne termine pas « Le Dernier Train » tant qu’Ilyane ne l’a pas donné', () => {
    const s = createNewGame(testCharacter({}, { diplomacy: 3, command: 3 }));
    s.character!.recits.push('savant-corvan');
    walk(s, 'gare-engloutie');
    expect(talk(s, 'ingrid')).toBe('accueil');
    say(s, 'ingrid', 'accueil', 'Ce chantier');
    expect(optionTexts(s, 'ingrid', 'cause')).toEqual(['Je reviendrai.']);
    expect(s.quests['dernier-train']).toBeUndefined();
    walk(s, 'gardebois');
    expect(talk(s, 'ilyane')).toBe('accueil');
  });

  it('L’Écho frappé, le combat fui : plus d’autre issue que le combat, et les Échos furieux restent jusque-là', () => {
    const s = createNewGame(testCharacter());
    s.quests.audience = 'done';
    s.location = 'ironheart-forges';
    expect(talk(s, 'forge-eteinte')).toBe('jour');
    say(s, 'forge-eteinte', 'jour', 'Revenir à la nuit');
    say(s, 'forge-eteinte', 'nuit', 'Ouvrir la trappe');
    expect(talk(s, 'echo-promesse')).toBe('promesse');
    say(s, 'echo-promesse', 'promesse', 'L’écouter jusqu’au bout');
    say(s, 'echo-promesse', 'choix', 'Le frapper');
    say(s, 'echo-promesse', 'frapper', 'Frapper');
    // The hero flees the fight: no victory flag. The Écho can no longer be ignored, followed or written down.
    expect(talk(s, 'echo-promesse')).toBe('promesse');
    expect(optionTexts(s, 'echo-promesse', 'promesse')).toEqual(['L’écouter jusqu’au bout.', 'Partir.']);
    say(s, 'echo-promesse', 'promesse', 'L’écouter jusqu’au bout');
    expect(optionTexts(s, 'echo-promesse', 'choix')).toEqual(['Le frapper pour le dissiper.', 'Réfléchir encore.']);
    expect(s.quests['echos-forge']).toBe('active');
    expect(present(s, 'ironheart-galerie', 'echo-furieux-1')).toBe(true);
    expect(talk(s, 'hesk')).toBe('accueil');
    // The fight, at last, settles everything.
    say(s, 'echo-promesse', 'choix', 'Le frapper');
    say(s, 'echo-promesse', 'frapper', 'Frapper');
    win(s, 'echos-furieux');
    expect(s.quests['echos-forge']).toBe('done');
    expect(present(s, 'ironheart-galerie', 'echo-furieux-1')).toBe(false);
    expect(talk(s, 'hesk')).toBe('colere');
  });

  it('Malo annonce la flûte avant de parler de ses lettres, puis enchaîne sur elles', () => {
    const s = createNewGame(testCharacter());
    s.quests['chant-anselme'] = 'done';
    s.location = 'canopee-nacelle';
    expect(talk(s, 'malo')).toBe('flute');
    expect(optionTexts(s, 'malo', 'flute')).toEqual(['Merci pour la nouvelle.', 'À bientôt, Malo.']);
    say(s, 'malo', 'flute', 'Merci pour la nouvelle.');
    say(s, 'malo', 'souci', 'Je peux t’aider');
    expect(s.quests['lettres-malo']).toBe('active');
    expect(talk(s, 'malo')).toBe('attente');
  });
});
