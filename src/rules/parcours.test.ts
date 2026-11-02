import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import itemData from '../data/items.json';
import { MAPS } from '../data/maps';
import { parseTiledMap, type GameMap, type MapObject } from '../engine/tiledMap';
import { LOCATIONS, createNewGame, findLocation, type GameState } from '../state/gameState';
import { ENCOUNTERS } from './combat';
import { END, QUESTS, applyEffects, conditionMet, goesTo, hasStoryEntry, startNode, startsCombat, visibleOptions, type Dialogue, type Effect } from './dialogue';
import { FIGURANTS, figurantLines, figurantsAt } from './figurants';
import { merchantDiscount, ownedCount } from './inventory';
import { journalQuests } from './journal';
import { choose, optionTexts, testCharacter } from './questTestKit';
import { knowsRecit } from './recits';
import { reputationLevel, reputationPrices, reputationScore } from './reputation';
import { ENCOUNTER_VICTORY_FLAG, WORLD_MAP_TARGET, clearEncounterFlags, findPlace, knownPlaces, rencontreXp, storyRencontre, zoneAt } from './world';

// ---------------------------------------------------------------------------------------------------------------
// Outils du parcours : une seule partie, jouée comme le ferait le jeu (cartes, portes, dialogues, combats simulés).
// ---------------------------------------------------------------------------------------------------------------

const mapCache = new Map<string, GameMap>();
function mapOf(location: string): GameMap {
  const id = findLocation(location)!.map;
  if (!mapCache.has(id)) mapCache.set(id, parseTiledMap(MAPS[id]));
  return mapCache.get(id)!;
}

/** Same rule as MapScene.gone (disparaitSi / apparaitSi). */
function gone(state: GameState, o: MapObject): boolean {
  const any = (list?: string) => (list ?? '').split(',').some((f) => f.trim() && state.flags[f.trim()]);
  return any(o.properties.disparaitSi) || (!!o.properties.apparaitSi && !any(o.properties.apparaitSi));
}

/** Is this NPC / object standing on that map now? */
function present(state: GameState, location: string, name: string): boolean {
  const o = mapOf(location).objects.find((x) => x.name === name);
  if (!o) throw new Error(`${location} : pas d’objet ${name}`);
  return !gone(state, o);
}

/** Opens a conversation where the hero stands: the NPC must be on the map; the first node's effects apply. */
function talk(state: GameState, id: string): string {
  const o = mapOf(state.location).objects.find((x) => x.name === id || x.properties.dialogue === id);
  if (o) {
    expect(gone(state, o), `${id} a disparu de ${state.location}`).toBe(false);
  } else {
    const figurant = figurantsAt(state.location).find((f) => f.dialogue === id);
    expect(figurant, `${id} n’est pas à ${state.location}`).toBeDefined();
    expect(hasStoryEntry(DIALOGUES[id], state), `${id} n’a rien à dire`).toBe(true);
  }
  const node = startNode(DIALOGUES[id], state);
  applyEffects(state, DIALOGUES[id].nodes[node].effects);
  return node;
}

/** Chooses an option; a `goTo` moves the hero, as DialogueScene does. */
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

/** Leaves by the world map for a known place; a story encounter on the way is met (and fought, if `fight`). */
function travel(state: GameState, placeId: string, fight = true): string | null {
  const from = mapOf(state.location).objects.some((o) => o.properties.cible === WORLD_MAP_TARGET);
  expect(from, `${state.location} : pas de sortie vers la carte du monde`).toBe(true);
  const place = findPlace(placeId)!;
  expect(knownPlaces(state.flags, state.quests).map((p) => p.id), placeId).toContain(placeId);
  const start = findPlace(findLocation(state.location)!.place!)!;
  const met = storyRencontre(state, zoneAt(start.x, start.y)) ?? storyRencontre(state, zoneAt(place.x, place.y));
  if (met) {
    clearEncounterFlags(state.flags);
    state.flags[met.story!.flag] = true;
    if (fight) {
      applyEffects(state, [{ giveXp: rencontreXp(met) }]);
      state.flags[ENCOUNTER_VICTORY_FLAG] = true;
    }
  }
  state.location = place.location;
  return met?.id ?? null;
}

/** A fight started from a dialogue, won (src/data/encounters.json). */
function win(state: GameState, encounter: string): void {
  const e = ENCOUNTERS.find((x) => x.id === encounter)!;
  expect(mapOf(state.location).objects.some((o) => o.name === e.center), `${e.center} pas à ${state.location}`).toBe(true);
  applyEffects(state, e.victoryEffects);
  state.flags[e.victoryFlag] = true;
}

/** The Golem of the Gare (MapScene.startGolemFight), won. */
function golem(state: GameState): void {
  expect(state.location).toBe('gare-engloutie');
  expect(state.flags['golem-vaincu'] || state.flags['chantier-arrete'] || state.quests['dernier-train'] !== 'active').toBeFalsy();
  applyEffects(state, [{ setFlag: 'chantier-arrete' }, { completeQuest: 'dernier-train' }, { giveXp: 70 }, { giveFers: 30 }]);
  state.flags['golem-vaincu'] = true;
}

/** XP and Fers won (or spent) by a step. */
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

// --- Diagnostics: repeatable gains, and dialogue entries hiding another one ---------------------------------------

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

/** Entries that hold but are hidden by an earlier one, when what they hide matters for a quest. */
function maskedEntries(state: GameState): string[] {
  const out: string[] = [];
  const matters = (e: Effect) =>
    ('startQuest' in e && !state.quests[e.startQuest]) ||
    ('completeQuest' in e && state.quests[e.completeQuest] !== 'done') ||
    ('giveItem' in e && QUEST_ITEMS.includes(e.giveItem)) ||
    ('setFlag' in e && !state.flags[e.setFlag] && CONDITION_FLAGS.has(e.setFlag));
  for (const d of Object.values(DIALOGUES)) {
    const holding = d.entries.filter((e) => (e.requires ?? []).every((c) => conditionMet(state, c)));
    if (holding.length < 2) continue;
    const main = reachable(d, holding[0].node, state);
    for (const e of holding.slice(1)) {
      const hidden = [...reachable(d, e.node, state)].filter((n) => !main.has(n));
      const lost = hidden.flatMap((n) => [...(d.nodes[n].effects ?? []), ...visibleOptions(d.nodes[n], state).flatMap((v) => v.option.effects ?? [])]).filter(matters);
      if (lost.length) out.push(`${d.id}: « ${holding[0].node} » cache « ${e.node} » ${JSON.stringify(lost)}`);
    }
  }
  return out;
}

function diag(label: string, state: GameState): void {
  console.log(`\n### ${label}\nmasqués:\n  ${maskedEntries(state).join('\n  ')}\nrépétables:\n  ${repeatableGains(state).join('\n  ')}`);
}

// ---------------------------------------------------------------------------------------------------------------
// Parcours principal : Gardebois, la caravane, Canopéa, Ironheart, les voyages — une seule partie.
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
    expect(gained(s, () => {
      say(s, 'tobias', 'accueil', 'Je dois entrer sur le chantier');
      say(s, 'tobias', 'chantier', 'Si ce chantier');
    })).toEqual({ xp: 25, fers: 0 });
    expect(s.flags['laissez-passer']).toBe(true);
    expect(optionTexts(s, 'tobias', 'accueil')).toContain('Merci encore pour le laissez-passer.');
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
    const g = gained(s, () => say(s, 'foreuse', 'au-pied', 'Saboter'));
    expect(g).toEqual({ xp: 70, fers: 30 });
    expect(s.quests['dernier-train']).toBe('done');
    expect(talk(s, 'foreuse')).toBe('faussee');
    expect(talk(s, 'ingrid')).toBe('apres-sabotage');
    expect(talk(s, 'echo-dernier-train')).toBe('apaise');
    expect(reputationScore(s, 'gardebois')).toBe(15);
    expect(journalStep(s, 'dernier-train')).toMatchObject({ done: true });
  });

  it('Retour chez Ilyane : la lettre pour le Conseil (« L’audience » reste ouverte pendant tout Canopéa)', () => {
    walk(s, 'gardebois');
    expect(talk(s, 'ilyane')).toBe('resolu');
    say(s, 'ilyane', 'resolu', 'Et maintenant');
    expect(s.quests.audience).toBe('active');
    expect(questItems(s)).toEqual(['lettre-ilyane']);
    expect(optionTexts(s, 'ilyane', 'resolu')).not.toContain('Et maintenant ?');
  });

  it('« La berceuse oubliée » : l’Écho au pied de l’Arbre-Titan, puis Nell', () => {
    expect(present(s, 'gardebois', 'echo-berceuse')).toBe(true);
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
    expect(ownedCount(s.character!, 'bandage')).toBe(2);
    expect(ownedCount(s.character!, 'fiole-seve')).toBe(1);
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
  });

  it('« La caravane de midi » : le commis pressé, les Loups sur la route, Véline', () => {
    expect(talk(s, 'commis-caravane')).toBe('presse');
    say(s, 'commis-caravane', 'presse', 'Je peux la porter');
    expect(s.quests['caravane-midi']).toBe('active');
    expect(questItems(s)).toEqual(['lettre-ilyane', 'sacoche-compagnie']);
    diag('fin de Gardebois', s);
    const xp = s.character!.xp;
    expect(travel(s, 'canopee')).toBe('loups-caravane');
    expect(s.character!.xp).toBeGreaterThan(xp);
    expect(journalStep(s, 'caravane-midi')?.step).toMatch(/Loups de Rouille/);
    expect(travel.length).toBeGreaterThan(0);
    expect(s.location).toBe('canopee-nacelle');
    expect(talk(s, 'veline')).toBe('caravane');
    expect(gained(s, () => say(s, 'veline', 'caravane', 'La voici'))).toEqual({ xp: 30, fers: 15 });
    expect(s.quests['caravane-midi']).toBe('done');
    expect(s.flags['membre-compagnie-lisieres']).toBe(true);
    expect(questItems(s)).toEqual(['lettre-ilyane']);
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
    diag('avant l’audience', s);
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
    diag('pendant l’enquête', s);
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
    say(s, 'kael-marchevent', 'choix', 'Le sol est sacré');
    const g = gained(s, () => say(s, 'kael-marchevent', 'fin-accord', 'Et moi'));
    expect(g).toEqual({ xp: 60, fers: 0 });
    expect(s.quests.audience).toBe('done');
    expect(s.quests['cle-rouille-bleue']).toBe('active');
    expect(questItems(s)).toEqual(['sauf-conduit']);
    for (const npc of ['kael-marchevent', 'lyra', 'thalorin']) expect(talk(s, npc)).toBe('apres');
    expect(reputationScore(s, 'canopee')).toBe(10 + 10 + 15 + 10 + 10);
    expect(knownPlaces(s.flags, s.quests).map((p) => p.id)).toContain('ironheart');
    console.log('récits', s.character!.recits, 'cap', s.character!.attributes.memory + 1);
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
    walk(s, 'canopee-nacelle');
    diag('fin de Canopéa', s);
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
    console.log('veilleuse question-cle', optionTexts(s, 'veilleuse', 'question-cle'));
    say(s, 'veilleuse', 'question-cle', 'Lui parler de ce que la clé ouvre');
    expect(gained(s, () => say(s, 'veilleuse', 'ouvre', 'Aux Archives'))).toEqual({ xp: 25, fers: 0 });
    expect(questItems(s)).toEqual(['cle-rouille-bleue', 'sauf-conduit']);
    expect(talk(s, 'veilleuse')).toBe('avec-cle');
    walk(s, 'ironheart-manufactures');
    walk(s, 'ironheart-archives');
    expect(talk(s, 'noam')).toBe('cle');
    expect(gained(s, () => say(s, 'noam', 'cle', 'La lui confier'))).toEqual({ xp: 70, fers: 0 });
    expect(s.quests['cle-rouille-bleue']).toBe('done');
    expect(questItems(s)).toEqual(['sauf-conduit']);
    expect(reputationScore(s, 'ironheart')).toBe(10);
    expect(reputationScore(s, 'archives-ferros')).toBe(20);
    expect(talk(s, 'noam')).toBe('apres-archives');
    walk(s, 'ironheart-manufactures');
    walk(s, 'ironheart-forges');
    expect(talk(s, 'veilleuse')).toBe('apres');
  });

  it('« Le Rail des Cendres » : les indices, Joss, le tunnel, la Cendrière, la dette rachetée', () => {
    walk(s, 'ironheart-pension');
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

  it('« Les Échos sous la Forge » : la trappe, Hesk, l’Écho confié à Hedda pour Ilyane', () => {
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
    say(s, 'enclume-marques', 'enclume', 'Examiner les marques');
    expect(talk(s, 'echo-promesse')).toBe('promesse');
    say(s, 'echo-promesse', 'promesse', 'L’écouter jusqu’au bout');
    say(s, 'echo-promesse', 'choix', 'Le garder par écrit');
    say(s, 'echo-promesse', 'garder', 'Pour Ilyane');
    expect(questItems(s)).toEqual(['lettre-echo', 'sauf-conduit']);
    expect(journalStep(s, 'echos-forge')?.step).toMatch(/Hedda/);
    walk(s, 'ironheart-forges');
    walk(s, 'ironheart-atelier');
    const g = gained(s, () => expect(talk(s, 'hedda')).toBe('lettre'));
    expect(g).toEqual({ xp: 40, fers: 0 });
    expect(s.quests['echos-forge']).toBe('done');
    expect(questItems(s)).toEqual(['sauf-conduit']);
    expect(talk(s, 'hedda')).toBe('accueil-remise');
    walk(s, 'ironheart-forges');
    walk(s, 'ironheart-martelroux');
    expect(talk(s, 'rika')).toBe('accueil');
    say(s, 'rika', 'accueil', 'J’ai rapporté sa caisse');
    walk(s, 'ironheart-forges');
  });

  it('Les voyages : caravane de Boulon, Ilyane reçoit l’Écho, convoyeuse, train des cheminots', () => {
    expect(talk(s, 'boulon')).toBe('accueil');
    say(s, 'boulon', 'accueil', 'Une caravane pour Gardebois');
    say(s, 'boulon', 'caravane', 'Montrer ta marque');
    say(s, 'boulon', 'trajet-gardebois', 'Descendre');
    expect(s.location).toBe('gardebois');
    expect(gained(s, () => expect(talk(s, 'ilyane')).toBe('echo-lettre'))).toEqual({ xp: 10, fers: 0 });
    expect(talk(s, 'ilyane')).toBe('nouvelles-canopee');
    walk(s, 'auberge-racine');
    expect(talk(s, 'sylvan')).toBe('triumvirat');
    walk(s, 'gardebois');
    expect(figurantLines(figurantsAt('gardebois').find((f) => f.dialogue === 'commis-caravane')!, s)[0]).toMatch(/loups/);
    say(s, 'convoyeuse', 'accueil', 'À Ironheart');
    say(s, 'convoyeuse', 'ironheart', 'Montrer ta marque');
    say(s, 'convoyeuse', 'trajet-ironheart', 'Descendre');
    expect(s.location).toBe('ironheart-forges');
    expect(talk(s, 'guichet-ouest')).toBe('guichet');
    expect(optionTexts(s, 'guichet-ouest', 'guichet')).toEqual(['Prendre un billet : les cheminots te font un prix.', 'Pas aujourd’hui.'].map((t) => optionTexts(s, 'guichet-ouest', 'guichet').find((x) => x.startsWith(t.slice(0, 30))) ?? t));
    expect(gained(s, () => say(s, 'guichet-ouest', 'guichet', 'Prendre un billet : les cheminots'))).toEqual({ xp: 0, fers: -30 });
    say(s, 'guichet-ouest', 'train-canopee', 'Monter');
    expect(s.location).toBe('canopee-nacelle');
    expect(travel(s, 'gardebois')).toBeNull();
  });

  it('Bilan : tout est fini, rien ne traîne, rien ne se gagne deux fois', () => {
    expect(QUESTS.map((q) => [q.id, s.quests[q.id]])).toEqual(QUESTS.map((q) => [q.id, 'done']));
    expect(journalQuests(s).every((q) => q.done)).toBe(true);
    expect(questItems(s)).toEqual(['sauf-conduit']);
    console.log('bilan', { xp: s.character!.xp, fers: s.character!.fers, recits: s.character!.recits }, ['gardebois', 'canopee', 'ironheart', 'compagnie-lisieres', 'nacelliers', 'travailleurs-rail', 'marches-cendres', 'archives-ferros'].map((p) => `${p}=${reputationScore(s, p)}`));
    diag('fin', s);
  });
});

// ---------------------------------------------------------------------------------------------------------------
// Variante B : la parole à la Gare, l'audience tout de suite, Ironheart avant les quêtes annexes de Canopéa.
// ---------------------------------------------------------------------------------------------------------------

describe('Variante : Ironheart avant les quêtes annexes (parole, combats, autres fins)', () => {
  const s = createNewGame(testCharacter({}, { diplomacy: 3, survival: 2 }));

  it('« Le Dernier Train » par la parole, sans passer chez Tobias', () => {
    expect(talk(s, 'ilyane')).toBe('accueil');
    say(s, 'ilyane', 'accueil', 'Que se passe-t-il');
    say(s, 'ilyane', 'trouble', 'D’où vient ce mal');
    say(s, 'ilyane', 'cause', 'J’irai voir');
    walk(s, 'gare-engloutie');
    expect(s.flags['laissez-passer']).toBeUndefined();
    expect(talk(s, 'ingrid')).toBe('accueil');
    say(s, 'ingrid', 'accueil', 'Ce chantier');
    expect(gained(s, () => say(s, 'ingrid', 'cause', 'Arrêtez le forage'))).toEqual({ xp: 70, fers: 30 });
    expect(s.quests['dernier-train']).toBe('done');
    expect(talk(s, 'foreuse')).toBe('arretee');
    expect(talk(s, 'ingrid')).toBe('apres');
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
    say(s, 'kael-marchevent', 'audience', 'Une foreuse');
    say(s, 'kael-marchevent', 'recit-gare', 'Les papiers');
    say(s, 'kael-marchevent', 'lyra', 'Et ce mal');
    say(s, 'kael-marchevent', 'thalorin', 'Je peux chercher');
    expect(questItems(s)).toEqual(['lettre-ilyane']);
  });

  it('Pendant l’enquête, « Le chant d’Anselme » ne peut pas commencer', () => {
    diag('B pendant l’enquête', s);
    walk(s, 'canopee-conseil');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-feuillevent');
    expect(talk(s, 'ailis')).toBe('inquiete');
    console.log('ailis inquiete', optionTexts(s, 'ailis', 'inquiete'));
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-atelier');
    expect(talk(s, 'elouan')).toBe('accueil');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-nacelle');
    walk(s, 'canopee-aieux');
    expect(talk(s, 'arbre-anselme')).toBe('muet');
    walk(s, 'canopee-nacelle');
  });

  it('Garrik vaincu, la sacoche prise en passant, la frontière fermée', () => {
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
    walk(s, 'canopee-nacelle');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-conseil');
    say(s, 'huissier', 'retour', 'Entrer');
    expect(talk(s, 'kael-marchevent')).toBe('rapport');
    say(s, 'kael-marchevent', 'rapport', 'Des fouilleurs');
    say(s, 'kael-marchevent', 'rapport-suite', 'Ils cherchent');
    say(s, 'kael-marchevent', 'cle', 'Que va faire');
    say(s, 'kael-marchevent', 'choix', 'Fermez la frontière');
    say(s, 'kael-marchevent', 'fin-frontiere', 'Et moi');
    expect(s.quests.audience).toBe('done');
    expect(questItems(s)).toEqual(['sauf-conduit']);
    walk(s, 'canopee-conseil');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-nacelle');
  });

  it('Ironheart d’abord : la clé vendue à Kaelis', () => {
    expect(travel(s, 'ironheart')).toBeNull();
    expect(talk(s, 'boulon')).toBe('accueil-quete');
    say(s, 'boulon', 'accueil-quete', 'Un certain Kaelis');
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
    expect(talk(s, 'kaelis')).toBe('apres-vente');
    walk(s, 'ironheart-forges');
    expect(talk(s, 'veilleuse')).toBe('apres');
  });

  it('« Le Rail des Cendres » : la garde de nuit, les pilleurs vaincus, le Bureau prévenu', () => {
    walk(s, 'ironheart-triage');
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
    say(s, 'tunnel-cendriere', 'guetteur', '« Tes deux amis');
    say(s, 'tunnel-cendriere', 'passe', 'Entrer');
    expect(talk(s, 'sorn')).toBe('accueil');
    walk(s, 'ironheart-triage');
    expect(talk(s, 'ostrik')).toBe('rapport');
    expect(gained(s, () => say(s, 'ostrik', 'rapport', 'Tout'))).toEqual({ xp: 40, fers: 60 });
    expect(present(s, 'ironheart-triage', 'joss')).toBe(false);
    expect(present(s, 'ironheart-cendriere', 'sorn')).toBe(false);
    expect(talk(s, 'varka')).toBe('apres-bureau');
    walk(s, 'ironheart-forges');
  });

  it('« Les Échos sous la Forge » : l’Écho frappé, la galerie scellée', () => {
    say(s, 'forge-eteinte', 'jour', 'Revenir à la nuit');
    say(s, 'forge-eteinte', 'nuit', 'Ouvrir la trappe');
    expect(talk(s, 'echo-promesse')).toBe('promesse');
    say(s, 'echo-promesse', 'promesse', 'L’écouter jusqu’au bout');
    say(s, 'echo-promesse', 'choix', 'Le frapper');
    say(s, 'echo-promesse', 'frapper', 'Frapper');
    expect(present(s, 'ironheart-galerie', 'echo-furieux-1')).toBe(true);
    win(s, 'echos-furieux');
    expect(s.quests['echos-forge']).toBe('done');
    expect(talk(s, 'hesk')).toBe('colere');
    walk(s, 'ironheart-forges');
    expect(talk(s, 'forge-eteinte')).toBe('scellee');
  });

  it('Retour à Canopéa en train : Malo, puis « Le chant d’Anselme » par le carnet', () => {
    expect(optionTexts(s, 'guichet-ouest', 'guichet')).toContain('Prendre un billet.');
    expect(gained(s, () => say(s, 'guichet-ouest', 'guichet', 'Prendre un billet.'))).toEqual({ xp: 0, fers: -40 });
    say(s, 'guichet-ouest', 'train-canopee', 'Monter');
    expect(talk(s, 'malo')).toBe('retour');
    say(s, 'malo', 'retour', 'La voici');
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
    expect(talk(s, 'veline')).toBe('descente-anselme');
    say(s, 'veline', 'descente-anselme', 'Allons-y');
    say(s, 'arbre-retour-anselme', 'arbre-quete', 'Ramasser');
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
    say(s, 'elouan', 'branche', 'Mirelle m’a montré');
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-feuillevent');
    expect(talk(s, 'ailis')).toBe('flute');
    expect(gained(s, () => say(s, 'ailis', 'flute', 'Elouan l’a taillée'))).toEqual({ xp: 30, fers: 0 });
    walk(s, 'canopee-ramures');
    walk(s, 'canopee-nacelle');
  });

  it('« Les graines qui manquent » après Ironheart : Elvan dénoncé quitte le Nid', () => {
    expect(talk(s, 'veline')).toBe('retour');
    say(s, 'veline', 'retour', 'Quoi de neuf');
    walk(s, 'canopee-auberge');
    expect(talk(s, 'lisandre')).toBe('vote');
    say(s, 'lisandre', 'vote', 'Merci pour la nouvelle');
    say(s, 'lisandre', 'accueil', 'Quelles nouvelles');
    say(s, 'lisandre', 'nouvelles', 'Il manque des graines');
    expect(talk(s, 'elvan')).toBe('confrontation');
    say(s, 'elvan', 'confrontation', 'Ton ballot brille');
    say(s, 'elvan', 'aveu', 'Je vais le dire');
    expect(present(s, 'canopee-auberge', 'elvan')).toBe(false);
    expect(talk(s, 'lisandre')).toBe('elvan-parti');
    walk(s, 'canopee-nacelle');
  });

  it('« Le carnet de chansons » et « La caravane de midi » en dernier, par la caravane payante', () => {
    expect(travel(s, 'gardebois')).toBeNull();
    expect(talk(s, 'ilyane')).toBe('carnet');
    say(s, 'ilyane', 'carnet', 'La dix-sept');
    expect(talk(s, 'commis-caravane')).toBe('presse');
    say(s, 'commis-caravane', 'presse', 'Je peux la porter');
    say(s, 'convoyeuse', 'accueil', 'À Canopéa');
    expect(gained(s, () => say(s, 'convoyeuse', 'canopee', 'Payer le voyage'))).toEqual({ xp: 0, fers: -15 });
    say(s, 'convoyeuse', 'trajet-canopee', 'Monter');
    expect(talk(s, 'veline')).toBe('caravane');
    say(s, 'veline', 'caravane', 'La voici');
    expect(s.quests['caravane-midi']).toBe('done');
    console.log('commis', figurantLines(figurantsAt('gardebois').find((f) => f.dialogue === 'commis-caravane')!, s), s.flags['loups-caravane']);
    say(s, 'chef-caravane', 'accueil', 'Pour Gardebois');
    say(s, 'chef-caravane', 'gardebois', 'Montrer ta marque');
    say(s, 'chef-caravane', 'trajet-gardebois', 'Descendre');
  });

  it('Gardebois en dernier : berceuse, herbes, caisse par le combat', () => {
    walk(s, 'maison-lunelierre');
    say(s, 'maelis', 'demande', 'Je vais t’aider');
    walk(s, 'gardebois');
    expect(talk(s, 'echo-berceuse')).toBe('chant');
    say(s, 'echo-berceuse', 'chant', 'Noter les vers');
    walk(s, 'maison-lunelierre');
    expect(talk(s, 'nell')).toBe('chanson');
    say(s, 'nell', 'chanson', 'Lui chanter');
    walk(s, 'gardebois');
    say(s, 'liane', 'demande', 'Où en trouver');
    say(s, 'sauge-1', 'cueillir', 'La cueillir');
    say(s, 'sauge-2', 'cueillir', 'La cueillir');
    say(s, 'rocher-sauge', 'chercher', 'Suivre l’odeur');
    expect(talk(s, 'liane')).toBe('rendu');
    say(s, 'liane', 'rendu', 'Merci, Liane');
    walk(s, 'reserve-cendrefer');
    say(s, 'brann', 'demande', 'Je vais la chercher');
    walk(s, 'gardebois');
    expect(talk(s, 'caisse-egaree')).toBe('gardee');
    say(s, 'caisse-egaree', 'gardee', 'Les affronter');
    win(s, 'caisse-egaree');
    expect(talk(s, 'caisse-egaree')).toBe('libre');
    say(s, 'caisse-egaree', 'libre', 'Prendre la caisse');
    walk(s, 'reserve-cendrefer');
    say(s, 'brann', 'rendu', 'Merci, Brann');
  });

  it('Bilan de la variante', () => {
    expect(QUESTS.filter((q) => s.quests[q.id] !== 'done').map((q) => q.id)).toEqual([]);
    expect(questItems(s)).toEqual(['sauf-conduit']);
    console.log('bilan B', { xp: s.character!.xp, fers: s.character!.fers }, ['gardebois', 'canopee', 'ironheart', 'compagnie-lisieres', 'nacelliers', 'travailleurs-rail', 'marches-cendres', 'archives-ferros'].map((p) => `${p}=${reputationScore(s, p)}`));
    diag('fin B', s);
  });
});

// ---------------------------------------------------------------------------------------------------------------
// Variante C : « Le Rail des Cendres » avant « La Clé », la garde de nuit ratée, le silence vendu aux Marches.
// ---------------------------------------------------------------------------------------------------------------

/** Gardebois and « L’audience » the short way: the Récit of Corvan for Ingrid, Commandement for Garrik. */
function prelude(s: GameState): void {
  say(s, 'ilyane', 'accueil', 'Que se passe-t-il');
  say(s, 'ilyane', 'trouble', 'D’où vient ce mal');
  say(s, 'ilyane', 'cause', 'J’irai voir');
  walk(s, 'gare-engloutie');
  expect(talk(s, 'echo-dernier-train')).toBe('approche');
  say(s, 'echo-dernier-train', 'approche', 'Entrer dans l’Écho');
  expect(talk(s, 'ingrid')).toBe('accueil');
  say(s, 'ingrid', 'accueil', 'Ce chantier');
  say(s, 'ingrid', 'cause', 'Je connais l’histoire du savant Corvan');
  walk(s, 'gardebois');
  say(s, 'ilyane', 'resolu', 'Et maintenant');
  travel(s, 'canopee');
  walk(s, 'canopee-ramures');
  walk(s, 'canopee-conseil');
  say(s, 'huissier', 'lettre', 'Entrer');
  say(s, 'kael-marchevent', 'audience', 'Ilyane');
  say(s, 'kael-marchevent', 'lettre', 'Une foreuse');
  say(s, 'kael-marchevent', 'recit-gare', 'Les papiers');
  say(s, 'kael-marchevent', 'lyra', 'Et ce mal');
  say(s, 'kael-marchevent', 'thalorin', 'Je peux chercher');
  walk(s, 'canopee-conseil');
  walk(s, 'canopee-ramures');
  walk(s, 'canopee-nacelle');
  expect(talk(s, 'veline')).toBe('descente-conseil');
  say(s, 'veline', 'descente-conseil', 'Descends');
  say(s, 'garrik', 'rencontre', 'Pose cette pioche');
  say(s, 'garrik', 'intimide', 'Qui t’a payé');
  say(s, 'garrik', 'aveu', 'Pars');
  walk(s, 'canopee-nacelle');
  walk(s, 'canopee-ramures');
  walk(s, 'canopee-conseil');
  say(s, 'huissier', 'retour', 'Entrer');
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
  const s = createNewGame(testCharacter({}, { diplomacy: 2, command: 2 }));

  it('Gardebois et l’audience par le chemin court', () => {
    prelude(s);
    expect(knowsRecit(s.character, 'savant-corvan')).toBe(true);
  });

  it('Le Rail commence d’abord ; Kaelis parle ; la Veilleuse ne parle plus des convois', () => {
    expect(travel(s, 'ironheart')).toBeNull();
    walk(s, 'ironheart-triage');
    say(s, 'varka', 'accueil', 'Peur de quoi');
    say(s, 'varka', 'convois', 'Je vais trouver');
    walk(s, 'ironheart-forges');
    expect(talk(s, 'veilleuse')).toBe('accueil');
    expect(optionTexts(s, 'veilleuse', 'accueil')).toContain('Les convois du triage, qui partent seuls la nuit ?');
    say(s, 'boulon', 'accueil-quete', 'Un certain Kaelis');
    say(s, 'renfoncement', 'mur', 'Chercher le passage');
    say(s, 'renfoncement', 'trouve', 'Descendre');
    say(s, 'kaelis', 'accueil-garrik', 'Pourquoi certaines reliques');
    walk(s, 'ironheart-forges');
    expect(talk(s, 'veilleuse')).toBe('question-cle');
    console.log('C veilleuse', optionTexts(s, 'veilleuse', 'question-cle'));
    diag('C rail + kaelis', s);
  });

  it('La garde de nuit ratée, Joss convaincu, le silence vendu à Sorn', () => {
    walk(s, 'ironheart-triage');
    say(s, 'aiguillage', 'levier-quete', 'Attendre la nuit');
    // The roll fails: « veille-rate », then run away.
    choose(s, 'aiguillage', 'veille-rate', 'Fuir');
    expect(present(s, 'ironheart-triage', 'pilleur-1')).toBe(true);
    expect(talk(s, 'registre-departs')).toBe('registre');
    expect(talk(s, 'joss')).toBe('soupcon');
    say(s, 'joss', 'soupcon', 'Je ne suis pas du Bureau');
    say(s, 'joss', 'avoue', 'Comment entrer');
    say(s, 'tunnel-cendriere', 'guetteur', '« Levier ouvert. »');
    say(s, 'tunnel-cendriere', 'passe', 'Entrer');
    say(s, 'sorn', 'accueil', 'Combien');
    expect(gained(s, () => say(s, 'sorn', 'marche', 'Marché conclu'))).toEqual({ xp: 30, fers: 80 });
    expect(s.quests['rail-cendres']).toBe('done');
    walk(s, 'ironheart-triage');
    console.log('C pilleurs après la fin', present(s, 'ironheart-triage', 'pilleur-1'), talk(s, 'aiguillage'));
    expect(talk(s, 'varka')).toBe('apres-marches');
    expect(talk(s, 'joss')).toBe('apres');
    walk(s, 'ironheart-forges');
  });

  it('La Clé ensuite : la Veilleuse la garde, étudiée d’abord', () => {
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

  it('« Les Échos » : suivre l’Écho, garder l’oiseau de fer ; le train coûte plus cher', () => {
    say(s, 'forge-eteinte', 'jour', 'Revenir à la nuit');
    say(s, 'forge-eteinte', 'nuit', 'Ouvrir la trappe');
    say(s, 'echo-promesse', 'promesse', 'L’écouter jusqu’au bout');
    say(s, 'echo-promesse', 'choix', 'Le suivre');
    expect(s.quests['echos-forge']).toBe('done');
    walk(s, 'ironheart-forges');
    expect(optionTexts(s, 'guichet-ouest', 'guichet')).toEqual(['Prendre un billet : les convois ne sont plus sûrs.', 'Pas aujourd’hui.'].map((t, i) => (i === 0 ? optionTexts(s, 'guichet-ouest', 'guichet')[0] : t)));
    console.log('bilan C', questItems(s), ['ironheart', 'travailleurs-rail', 'marches-cendres', 'archives-ferros'].map((p) => `${p}=${reputationScore(s, p)}`));
    diag('fin C', s);
  });
});
