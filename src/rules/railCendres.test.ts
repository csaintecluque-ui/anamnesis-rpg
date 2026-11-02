import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { MAPS } from '../data/maps';
import type { Tile } from '../engine/iso';
import { findPath } from '../engine/pathfinding';
import { findObject, isWalkable, parseTiledMap, tileKey, type MapObject } from '../engine/tiledMap';
import { createNewGame, findLocation, type GameState } from '../state/gameState';
import { ENCOUNTERS } from './combat';
import { applyEffects, startNode } from './dialogue';
import { FIGURANTS, figurantLines } from './figurants';
import { choose, optionTexts, testCharacter } from './questTestKit';
import { reputationScore } from './reputation';

/** « Le Rail des Cendres », quête secondaire de Ferros (docs/univers/quetes.md, docs/univers/lieux/ironheart.md). */
const Q = 'rail-cendres';

function atTriage(attributes = {}, skills = {}): GameState {
  const state = createNewGame(testCharacter(attributes, skills));
  choose(state, 'varka', 'accueil', 'Peur de quoi');
  choose(state, 'varka', 'convois', 'Je vais trouver');
  return state;
}

/** The evidence path: no skill needed, only looking at the lever (Investigation 2 or Artisanat 2) and the register. */
function jossConfesses(state: GameState): void {
  choose(state, 'aiguillage', 'levier-quete', 'Examiner le mécanisme');
  applyEffects(state, DIALOGUES['registre-departs'].nodes.registre.effects);
  expect(startNode(DIALOGUES.joss, state)).toBe('soupcon');
  choose(state, 'joss', 'soupcon', 'La goupille limée');
}

/** Through the tunnel with Joss's word, then Sorn at the Cendrière. */
function truth(state: GameState): void {
  jossConfesses(state);
  choose(state, 'tunnel-cendriere', 'guetteur', '« Levier ouvert. »');
  expect(state.flags['cendriere-ouverte']).toBe(true);
  applyEffects(state, DIALOGUES.sorn.nodes.accueil.effects);
}

describe('Le Rail des Cendres: places', () => {
  const reach = (id: string, names: string[]) => {
    const map = parseTiledMap(MAPS[findLocation(id)!.map]);
    const start = findObject(map, findLocation(id)!.entrance)!;
    const taken = new Set(map.objects.filter((o) => o.type === 'pnj' || o.type === 'ennemi').map(tileKey));
    const walk = (t: Tile) => isWalkable(map, t, taken);
    for (const name of names) {
      const o: MapObject = findObject(map, name)!;
      expect(o, `${id}: ${name}`).toBeDefined();
      const around = [-1, 0, 1].flatMap((dc) => [-1, 0, 1].map((dr) => ({ col: o.col + dc, row: o.row + dr })));
      expect(around.some((t) => walk(t) && findPath(start, t, walk) !== null), `${id}: ${name}`).toBe(true);
    }
  };

  it('leads from the Forges-Basses to the triage, and through the tunnel to the Cendrière', () => {
    reach('ironheart-forges', ['vers-triage', 'pilote-endormi', 'veilleuse']);
    reach('ironheart-triage', ['vers-forges', 'varka', 'joss', 'ostrik', 'aiguillage', 'registre-departs', 'tunnel-cendriere', 'panneau-triage']);
    reach('ironheart-cendriere', ['vers-triage', 'sorn', 'pilote']);
  });

  it('fights the pilleurs around the lever, where they stand', () => {
    const fight = ENCOUNTERS.find((e) => e.id === 'aiguillage-cendres')!;
    const map = parseTiledMap(MAPS['ironheart-triage']);
    expect(findObject(map, fight.center)).toBeDefined();
    for (const e of fight.enemies) expect(isWalkable(map, findObject(map, e.object)!), e.object).toBe(true);
  });
});

describe('Le Rail des Cendres: the investigation', () => {
  it('starts with Varka, at the triage', () => {
    const state = atTriage();
    expect(state.quests[Q]).toBe('active');
    expect(startNode(DIALOGUES.varka, state)).toBe('enquete');
  });

  it('makes Joss talk with the evidence, without any skill', () => {
    const state = atTriage({}, { diplomacy: 0, command: 0, investigation: 2 });
    jossConfesses(state);
    expect(state.flags['joss-avoue']).toBe(true);
    expect(startNode(DIALOGUES.joss, state)).toBe('avoue');
  });

  it('lets the Veilleuse tell what she heard, once', () => {
    const state = atTriage();
    choose(state, 'veilleuse', 'accueil', 'Les convois du triage');
    expect(state.flags['indice-veilleuse']).toBe(true);
    expect(optionTexts(state, 'veilleuse', 'accueil')).not.toContain('Les convois du triage, qui partent seuls la nuit ?');
  });

  it('keeps the tunnel shut to whoever has nothing to say', () => {
    const state = createNewGame(testCharacter());
    expect(startNode(DIALOGUES['tunnel-cendriere'], state)).toBe('ferme');
    const started = atTriage();
    expect(optionTexts(started, 'tunnel-cendriere', 'guetteur')).toEqual(['Se glisser dans l’ombre des wagons.', 'Faire demi-tour.']);
  });

  it('follows the convoy from the night watch, or fights the pilleurs', () => {
    const state = atTriage();
    choose(state, 'varka', 'enquete', 'Monter la garde');
    expect(startNode(DIALOGUES.aiguillage, state)).toBe('levier-quete');
    choose(state, 'aiguillage', 'levier-quete', 'Attendre la nuit');
    expect(state.flags['veille-aiguillage']).toBe(true);
    choose(state, 'aiguillage', 'veille', 'Les laisser faire');
    expect(state.flags['cendriere-ouverte']).toBe(true);
    expect(optionTexts(state, 'aiguillage', 'levier-quete')).not.toContain('Attendre la nuit, caché près du levier.');
    const fight = atTriage();
    choose(fight, 'aiguillage', 'levier-quete', 'Attendre la nuit');
    expect(DIALOGUES.aiguillage.nodes.veille.options[0].effects).toContainEqual({ startCombat: 'aiguillage-cendres' });
    fight.flags['pilleurs-vaincus'] = true;
    expect(optionTexts(fight, 'tunnel-cendriere', 'guetteur')).toContain('« Tes deux amis de l’aiguillage ne viendront pas. »');
  });

  it('hears the machine’s last order with Mémoire 3', () => {
    const state = atTriage({ memory: 3 });
    applyEffects(state, DIALOGUES.pilote.nodes.machine.effects);
    choose(state, 'pilote', 'machine', 'Poser la main');
    expect(state.character!.recits).toContain('machine-vers-ouest');
    expect(state.flags['verite-rail']).toBe(true);
  });
});

describe('Le Rail des Cendres: three endings', () => {
  it('leaves it to the railway workers, and can pay Joss’s debt', () => {
    const state = atTriage({}, { investigation: 2 });
    truth(state);
    expect(startNode(DIALOGUES.varka, state)).toBe('verdict');
    state.character!.fers = 40;
    choose(state, 'varka', 'verdict', 'Et je rachète la dette');
    expect(state.character!.fers).toBe(10);
    expect(state.quests[Q]).toBe('done');
    expect(reputationScore(state, 'travailleurs-rail')).toBe(30);
    expect(reputationScore(state, 'marches-cendres')).toBeLessThan(0);
    expect(startNode(DIALOGUES.joss, state)).toBe('merci');
    expect(startNode(DIALOGUES.varka, state)).toBe('apres-rail');
  });

  it('tells the Bureau: a bounty, and the workers’ trust lost', () => {
    const state = atTriage({}, { investigation: 2 });
    truth(state);
    const fers = state.character!.fers;
    choose(state, 'ostrik', 'rapport', 'Tout :');
    expect(state.character!.fers).toBe(fers + 60);
    expect(reputationScore(state, 'ironheart')).toBe(10);
    expect(reputationScore(state, 'travailleurs-rail')).toBeLessThan(0);
    expect(startNode(DIALOGUES.varka, state)).toBe('apres-bureau');
  });

  it('takes the Marches’ money for silence', () => {
    const state = atTriage({}, { investigation: 2 });
    truth(state);
    choose(state, 'sorn', 'accueil', 'Combien');
    choose(state, 'sorn', 'marche', 'Marché conclu');
    expect(state.quests[Q]).toBe('done');
    expect(reputationScore(state, 'marches-cendres')).toBe(15);
    expect(reputationScore(state, 'travailleurs-rail')).toBe(-20);
    const cheminot = FIGURANTS.find((f) => f.id === 'cheminot-triage')!;
    expect(figurantLines(cheminot, state)[0]).toMatch(/convoi parti seul/);
  });
});

describe('quality pass (2026-11-02)', () => {
  it('lets one walk away from the pilleurs after a failed watch', () => {
    expect(DIALOGUES.aiguillage.nodes['veille-rate'].options.some((o) => o.next === 'fin' && !o.effects)).toBe(true);
  });

  it('gives no more experience from the Écho once it has been seen', () => {
    const state = createNewGame(testCharacter({ memory: 4 }));
    choose(state, 'echo-dernier-train', 'approche', 'Observer');
    expect(startNode(DIALOGUES['echo-dernier-train'], state)).toBe('apaise');
    const xp = state.character!.xp;
    choose(state, 'echo-dernier-train', 'apaise', 'Entrer dans l’Écho');
    expect(state.character!.xp).toBe(xp);
    expect(state.character!.recits).toContain('savant-corvan');
  });

  it('greets the hero at the station once, even when Kael already sent them for the key', () => {
    const state = createNewGame(testCharacter());
    state.quests.audience = 'done';
    state.quests['cle-rouille-bleue'] = 'active';
    expect(startNode(DIALOGUES.boulon, state)).toBe('accueil-quete');
    applyEffects(state, DIALOGUES.boulon.nodes['accueil-quete'].effects);
    expect(startNode(DIALOGUES.boulon, state)).toBe('accueil');
  });
});
