import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { createNewGame } from '../state/gameState';
import { applyEffects, goesTo, startNode, visibleOptions } from './dialogue';
import {
  ENCOUNTER_VICTORY_FLAG,
  RENCONTRES,
  WORLD,
  clearEncounterFlags,
  encounterChecks,
  encounterObjects,
  findPlace,
  findRencontre,
  knownPlaces,
  pickRencontre,
  pickTerrain,
  placeOfLocation,
  rencontreXp,
  rollEncounter,
  travelTimeLabel,
  zoneAt,
} from './world';
import type { AttributeId } from './attributes';
import { createDraft, finalizeCharacter, type Character, type CharacterDraft } from './character';

/** A complete level 1 character (like the dialogue tests'), with some attributes changed afterwards. */
function testCharacter(overrides: Partial<Record<AttributeId, number>> = {}): Character {
  const draft: CharacterDraft = {
    ...createDraft(),
    name: 'Aube',
    feat: 'tough',
    allocated: { body: 3, agility: 3, vigor: 3, intellect: 3, presence: 3, perception: 4, memory: 5 },
    originBonus: ['body', 'vigor'],
  };
  draft.skillRanks = { ...draft.skillRanks, lore: 3, stealth: 3 };
  const character = finalizeCharacter(draft);
  Object.assign(character.attributes, overrides);
  return character;
}

/** Plays back fixed values, in order. */
const sequence = (...values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length];
};

describe('world map (docs/gdd/carte-du-monde.md)', () => {
  it('knows Gardebois and Canopéa from the start', () => {
    expect(knownPlaces({}).map((p) => p.id)).toEqual(['gardebois', 'canopee']);
  });

  it('puts every house of a place on that place, and encounters nowhere', () => {
    expect(placeOfLocation('auberge-racine')?.id).toBe('gardebois');
    expect(placeOfLocation('gare-engloutie')?.id).toBe('gardebois');
    expect(placeOfLocation('canopee-relais')?.id).toBe('canopee');
    expect(placeOfLocation('rencontre-route')).toBeUndefined();
  });

  it('is lisière near the border of Ferros, forest elsewhere', () => {
    const gardebois = findPlace('gardebois')!;
    const canopee = findPlace('canopee')!;
    expect(zoneAt(gardebois.x, gardebois.y)).toBe('lisiere');
    expect(zoneAt(canopee.x, canopee.y)).toBe('foret');
  });

  it('says how long the walk takes', () => {
    expect(travelTimeLabel(50)).toBe('moins d’un jour de marche');
    expect(travelTimeLabel(WORLD.travel.pixelsPerDay)).toBe('environ un jour de marche');
    expect(travelTimeLabel(WORLD.travel.pixelsPerDay * 2.2)).toBe('environ 2 jours de marche');
  });

  it('checks for an encounter at regular steps, never right after leaving', () => {
    const { safeDistance, encounterEvery } = WORLD.travel;
    expect(encounterChecks(0, safeDistance - 1)).toBe(0);
    expect(encounterChecks(safeDistance - 1, safeDistance)).toBe(1);
    expect(encounterChecks(safeDistance, safeDistance + encounterEvery - 1)).toBe(0);
    expect(encounterChecks(0, safeDistance + 2 * encounterEvery)).toBe(3);
  });

  it('meets an encounter only on a lucky roll, drawn from the zone by weight', () => {
    expect(rollEncounter('foret', sequence(0.99))).toBeNull();
    const met = rollEncounter('foret', sequence(0, 0));
    expect(met?.zones).toContain('foret');
    // Wolves of rust only roam near the border of Ferros.
    for (let i = 0; i < 20; i++) expect(pickRencontre('foret', sequence(i / 20))?.id).not.toBe('loups-rouille');
    const lisiere = new Set(Array.from({ length: 20 }, (_, i) => pickRencontre('lisiere', sequence(i / 20))?.id));
    expect(lisiere.has('loups-rouille')).toBe(true);
    expect(lisiere.has('ours-mousse')).toBe(false);
  });

  it('picks the terrain among those of the encounter', () => {
    const r = findRencontre('rodeurs')!;
    expect(pickTerrain(r, sequence(0))).toBe(r.terrains[0]);
    expect(pickTerrain(r, sequence(0.99))).toBe(r.terrains.at(-1));
  });

  it('pays half of what the enemies are worth', () => {
    expect(rencontreXp(findRencontre('rodeurs')!)).toBe(15);
    expect(rencontreXp(findRencontre('colporteuse')!)).toBe(0);
  });

  it('forgets only the flags of the previous encounter', () => {
    const flags: Record<string, true> = { 'rencontre-vaincue': true, 'rencontre-cache-ouverte': true, 'laissez-passer': true };
    clearEncounterFlags(flags);
    expect(flags).toEqual({ 'laissez-passer': true });
  });

  it('turns an encounter into map objects on its spawn points', () => {
    const spawns = ['apparition-1', 'apparition-2', 'pnj-1', 'objet-1', 'decor-1'].map((name, i) => ({ name, type: 'apparition', col: i, row: 1, properties: {} }));
    const wolves = encounterObjects(findRencontre('loups-rouille')!, spawns);
    expect(wolves.map((o) => [o.type, o.col, o.properties.ennemi, o.properties.disparaitSi])).toEqual([
      ['ennemi', 0, 'loup-rouille', ENCOUNTER_VICTORY_FLAG],
      ['ennemi', 1, 'loup-rouille', ENCOUNTER_VICTORY_FLAG],
    ]);
    const seller = encounterObjects(findRencontre('colporteuse')!, spawns);
    expect(seller.map((o) => [o.name, o.type, o.col])).toEqual([
      ['colporteuse', 'pnj', 2],
      ['decor-1', 'decor', 4],
    ]);
    expect(() => encounterObjects(findRencontre('loups-rouille')!, spawns.slice(2))).toThrow();
  });

  it('only keeps encounter flags in dialogues of encounters', () => {
    for (const r of RENCONTRES) {
      for (const id of [...(r.npcs ?? []).map((n) => n.id), ...(r.objects ?? []).map((o) => o.id)]) {
        const flags = JSON.stringify(DIALOGUES[id]).match(/"(?:setFlag|flag|notFlag)":\s*"([^"]+)"/g) ?? [];
        for (const f of flags) expect(f, id).toMatch(/rencontre-/);
      }
    }
  });
});

describe('Canopéa dialogues (docs/univers/lieux/villes.md)', () => {
  it('opens the seed loft with an Artisanat roll, then leads inside', () => {
    const dialogue = DIALOGUES['porte-grenier'];
    const pick = dialogue.nodes.verrouillee.options[0];
    expect(pick.roll).toEqual({ skill: 'crafting', difficulty: 12 });
    expect(dialogue.nodes.ouverte.effects).toEqual([{ setFlag: 'grenier-deverrouille' }]);
    expect(goesTo(dialogue.nodes.ouverte.options[0].effects)).toEqual({ location: 'canopee-grenier', arrivee: undefined });
  });

  it('remembers a stolen sack: the town talks about it', () => {
    const state = createNewGame(testCharacter());
    applyEffects(state, DIALOGUES['graines-conseil'].nodes.sacs.options[0].effects);
    expect(state.flags['vol-grenier']).toBe(true);
    expect(state.character!.inventory.some((s) => s.itemId === 'graines-lumiere')).toBe(true);
    expect(startNode(DIALOGUES['graines-conseil'], state)).toBe('vide');
    expect(startNode(DIALOGUES.veline, state)).toBe('vol');
    const news = visibleOptions(DIALOGUES.lisandre.nodes.accueil, state).map((v) => v.option.next);
    expect(news).toContain('nouvelles-vol');
    expect(news).not.toContain('nouvelles');
  });

  it('lets one hear Anselme with Mémoire 3, and comfort Aïlis once', () => {
    const state = createNewGame(testCharacter({ memory: 2 }));
    const listen = (s: typeof state) => visibleOptions(DIALOGUES['arbre-anselme'].nodes.arbre, s)[0];
    expect(listen(state).enabled).toBe(false);
    state.character!.attributes.memory = 3;
    expect(listen(state).enabled).toBe(true);
    expect(startNode(DIALOGUES.ailis, state)).toBe('accueil');
    applyEffects(state, listen(state).option.effects);
    expect(startNode(DIALOGUES.ailis, state)).toBe('voix');
    applyEffects(state, DIALOGUES.ailis.nodes.voix.options[0].effects);
    expect(startNode(DIALOGUES.ailis, state)).toBe('accueil');
  });

  it('teaches the Récit of Kael at the relay, once', () => {
    const state = createNewGame(testCharacter());
    const ask = () => visibleOptions(DIALOGUES.mirelle.nodes.ordre, state)[0].option;
    const notices = applyEffects(state, ask().effects);
    expect(notices).toContain('Récit retenu : Kael, le Premier Chroniqueur');
    expect(ask().effects).toBeUndefined();
  });
});
