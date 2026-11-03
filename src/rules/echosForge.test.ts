import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { MAPS } from '../data/maps';
import type { Tile } from '../engine/iso';
import { findPath } from '../engine/pathfinding';
import { findObject, isWalkable, parseTiledMap, tileKey } from '../engine/tiledMap';
import { createNewGame, findLocation, type GameState } from '../state/gameState';
import { ENCOUNTERS } from './combat';
import { applyEffects, startNode } from './dialogue';
import { ownedCount } from './inventory';
import { choose, optionTexts, testCharacter } from './questTestKit';
import { reputationScore } from './reputation';

/** « Les Échos sous la Forge », quête cachée de Ferros (docs/univers/quetes.md, point 9). */
const Q = 'echos-forge';
const ECHO_DIALOGUES = ['forge-eteinte', 'hesk', 'echo-chanson', 'enclume-marques', 'echo-promesse'];

/** Down through the trapdoor, at night: the quest starts with nobody to give it. */
function underTheForge(attributes = {}, skills = {}): GameState {
  const state = createNewGame(testCharacter(attributes, skills));
  expect(state.quests[Q]).toBeUndefined();
  choose(state, 'forge-eteinte', 'jour', 'Revenir à la nuit tombée');
  return state;
}

function hearThePromise(state: GameState): void {
  applyEffects(state, DIALOGUES['echo-promesse'].nodes.promesse.effects);
  choose(state, 'echo-promesse', 'promesse', 'L’écouter jusqu’au bout');
}

describe('Les Échos sous la Forge: places', () => {
  it('hides a trapdoor under the cold forge of the Forges-Basses, and every Écho can be reached below', () => {
    for (const [id, names] of [
      ['ironheart-forges', ['forge-eteinte', 'devant-forge-eteinte']],
      ['ironheart-galerie', ['vers-forge', 'hesk', 'echo-chanson', 'enclume-marques', 'echo-promesse']],
    ] as const) {
      const map = parseTiledMap(MAPS[findLocation(id)!.map]);
      const start = findObject(map, findLocation(id)!.entrance)!;
      const taken = new Set(map.objects.filter((o) => o.type === 'pnj').map(tileKey));
      const walk = (t: Tile) => isWalkable(map, t, taken);
      for (const name of names) {
        const o = findObject(map, name)!;
        expect(o, name).toBeDefined();
        const around = [-1, 0, 1].flatMap((dc) => [-1, 0, 1].map((dr) => ({ col: o.col + dc, row: o.row + dr })));
        expect(around.some((t) => walk(t) && findPath(start, t, walk) !== null), `${id}: ${name}`).toBe(true);
      }
    }
  });

  it('never names anyone from the novel: the Échos stay anonymous (decision of Cyril, 2026-11-02)', () => {
    const text = JSON.stringify(ECHO_DIALOGUES.map((id) => DIALOGUES[id]));
    for (const name of ['Cyril', 'Anne-Sophie', 'Elena', 'Eden', 'Léonie', 'Markus', 'Thaddeus', 'Voss']) expect(text, name).not.toContain(name);
  });
});

describe('Les Échos sous la Forge: a hidden quest with five choices', () => {
  it('starts only by going back to the cold forge at night', () => {
    const state = underTheForge();
    expect(state.quests[Q]).toBe('active');
    expect(startNode(DIALOGUES['forge-eteinte'], state)).toBe('trappe');
  });

  it('ignore: the Écho is left to its promise', () => {
    const state = underTheForge();
    applyEffects(state, DIALOGUES['echo-promesse'].nodes.promesse.effects);
    choose(state, 'echo-promesse', 'promesse', 'Laisser l’Écho');
    expect(state.quests[Q]).toBe('done');
    expect(startNode(DIALOGUES['echo-promesse'], state)).toBe('apaise');
  });

  it('follow (Mémoire 3): a secret niche and an iron bird', () => {
    const state = underTheForge({ memory: 3 });
    hearThePromise(state);
    expect(state.character!.recits).toContain('on-se-retrouvera');
    choose(state, 'echo-promesse', 'choix', 'Le suivre');
    expect(ownedCount(state.character!, 'oiseau-de-fer')).toBe(1);
    expect(state.quests[Q]).toBe('done');
  });

  it('archive: Noam classes what has no period', () => {
    const state = underTheForge({ memory: 2 });
    hearThePromise(state);
    expect(optionTexts(state, 'echo-promesse', 'choix')).toContain('Le suivre, là où il va.'); // shown greyed
    choose(state, 'echo-promesse', 'choix', 'Le garder par écrit');
    choose(state, 'echo-promesse', 'garder', 'Pour les Archives');
    expect(startNode(DIALOGUES['echo-promesse'], state)).toBe('ecrit-archives');
    expect(startNode(DIALOGUES.noam, state)).toBe('releve');
    applyEffects(state, DIALOGUES.noam.nodes.releve.effects);
    expect(state.quests[Q]).toBe('done');
    expect(ownedCount(state.character!, 'releve-echo')).toBe(0);
    expect(reputationScore(state, 'archives-ferros')).toBe(10);
  });

  it('entrust to someone close: Ragna sends the letter, Ilyane answers at Gardebois', () => {
    const state = underTheForge();
    hearThePromise(state);
    choose(state, 'echo-promesse', 'choix', 'Le garder par écrit');
    choose(state, 'echo-promesse', 'garder', 'Pour Ilyane');
    expect(startNode(DIALOGUES.hedda, state)).toBe('lettre');
    applyEffects(state, DIALOGUES.hedda.nodes.lettre.effects);
    expect(state.quests[Q]).toBe('done');
    expect(startNode(DIALOGUES.ilyane, state)).toBe('echo-lettre');
    applyEffects(state, DIALOGUES.ilyane.nodes['echo-lettre'].effects);
    expect(startNode(DIALOGUES.ilyane, state)).not.toBe('echo-lettre');
  });

  it('destroy: as the Law of Living Memory says, the struck Écho multiplies and turns violent', () => {
    const state = underTheForge();
    hearThePromise(state);
    choose(state, 'echo-promesse', 'choix', 'Le frapper');
    const strike = DIALOGUES['echo-promesse'].nodes.frapper.options[0].effects ?? [];
    expect(strike).toContainEqual({ startCombat: 'echos-furieux' });
    const fight = ENCOUNTERS.find((e) => e.id === 'echos-furieux')!;
    const map = parseTiledMap(MAPS['ironheart-galerie']);
    for (const e of fight.enemies) expect(isWalkable(map, findObject(map, e.object)!), e.object).toBe(true);
    // The fight won: the Échos are scattered for a while, the gallery is closed.
    applyEffects(state, [{ setFlag: 'echos-dechaines' }, ...fight.victoryEffects, { setFlag: fight.victoryFlag }]);
    expect(state.quests[Q]).toBe('done');
    expect(startNode(DIALOGUES.hesk, state)).toBe('colere');
    expect(startNode(DIALOGUES['forge-eteinte'], state)).toBe('scellee');
  });
});
