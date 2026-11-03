import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { MAPS } from '../data/maps';
import { findPath } from '../engine/pathfinding';
import { findObject, isWalkable, parseTiledMap, tileKey, type MapObject } from '../engine/tiledMap';
import type { Tile } from '../engine/iso';
import { createNewGame, type GameState } from '../state/gameState';
import { ENCOUNTERS } from './combat';
import { applyEffects, goesTo, startNode, startsCombat, visibleOptions, type DialogueOption } from './dialogue';
import { reputationScore } from './reputation';
import { testCharacter } from './questTestKit';

/** « Les lettres de Malo » et le Sol des Racines (docs/univers/quetes.md). */
const sol = parseTiledMap(MAPS['sol-racines']);

function choose(state: GameState, dialogue: string, node: string, text: string): DialogueOption {
  const view = visibleOptions(DIALOGUES[dialogue].nodes[node], state).find((v) => v.option.text.startsWith(text));
  if (!view) throw new Error(`${dialogue}/${node}: no option « ${text} »`);
  applyEffects(state, view.option.effects);
  const next = DIALOGUES[dialogue].nodes[view.option.next];
  if (next?.effects) applyEffects(state, next.effects);
  return view.option;
}

describe('le Sol des Racines', () => {
  const start = findObject(sol, 'descente')!;
  const blocked = new Set(sol.objects.filter((o) => o.type === 'ennemi').map(tileKey));
  const walk = (t: Tile) => isWalkable(sol, t, blocked);
  const reach = (o: MapObject) =>
    [-1, 0, 1].flatMap((dc) => [-1, 0, 1].map((dr) => ({ col: o.col + dc, row: o.row + dr }))).some((t) => walk(t) && findPath(start, t, walk) !== null);

  it('lets one reach the nacelle, the letters, the satchel and the bear from the arrival', () => {
    for (const name of ['nacelle-remontee', 'lettres-eparpillees', 'sacoche-lettres', 'ours-sol', 'arbre-retour-anselme']) {
      expect(reach(findObject(sol, name)!), name).toBe(true);
    }
  });

  it('closes the dig behind Titan roots: the only way in is where the bear sleeps (étude, un obstacle par chapitre)', () => {
    expect(reach(findObject(sol, 'traces-fouille')!)).toBe(false);
    expect(reach(findObject(sol, 'garrik')!)).toBe(false);
    // The bear gone (rolled over, lured away, beaten), the way is open.
    const open = (t: Tile) => isWalkable(sol, t, new Set());
    const reachOpen = (o: MapObject) =>
      [-1, 0, 1].flatMap((dc) => [-1, 0, 1].map((dr) => ({ col: o.col + dc, row: o.row + dr }))).some((t) => open(t) && findPath(start, t, open) !== null);
    expect(reachOpen(findObject(sol, 'traces-fouille')!)).toBe(true);
    expect(reachOpen(findObject(sol, 'garrik')!)).toBe(true);
    expect(findObject(sol, 'ours-sol')!.properties.disparaitSi.split(',')).toEqual(['ours-sol-vaincu', 'ours-sol-eloigne', 'ours-sol-roule']);
  });

  it('a hand that does not wake him: the bear rolls over and frees the way, the satchel taken', () => {
    const state = createNewGame(testCharacter());
    const stealth = DIALOGUES['sacoche-lettres'].nodes.ours.options[0];
    expect(stealth.roll?.skill).toBe('stealth');
    expect(stealth.effects).toEqual([{ setFlag: 'ours-sol-roule' }]);
    applyEffects(state, stealth.effects);
    applyEffects(state, DIALOGUES['sacoche-lettres'].nodes[stealth.next].effects);
    expect([state.flags['ours-sol-roule'], state.flags['sacoche-retrouvee']]).toEqual([true, true]);
    expect(startNode(DIALOGUES['sacoche-lettres'], state)).toBe('libre');
  });

  it('is closed: one goes back up by the nacelle only', () => {
    for (let col = 0; col < sol.width; col++) for (const row of [0, sol.height - 1]) expect(isWalkable(sol, { col, row })).toBe(false);
    for (let row = 0; row < sol.height; row++) for (const col of [0, sol.width - 1]) expect(isWalkable(sol, { col, row })).toBe(false);
    expect(findObject(sol, 'nacelle-remontee')?.properties.cible).toBe('canopee-nacelle');
  });

  it('places the bear fight around the satchel', () => {
    const fight = ENCOUNTERS.find((e) => e.id === 'ours-sacoche')!;
    expect(fight.center).toBe('sacoche-lettres');
    expect(fight.enemies.map((e) => e.object)).toEqual(['ours-sol']);
    expect(isWalkable(sol, findObject(sol, 'ours-sol')!)).toBe(true);
  });
});

describe('Les lettres de Malo', () => {
  it('starts with Malo, goes down with Véline once she agrees, and ends with Malo', () => {
    const state = createNewGame();
    expect(startNode(DIALOGUES.malo, state)).toBe('souci');
    choose(state, 'malo', 'souci', 'Je peux t’aider');
    expect(state.quests['lettres-malo']).toBe('active');
    expect(startNode(DIALOGUES.veline, state)).toBe('descente');
    choose(state, 'veline', 'descente', 'Je peux la chercher');
    expect(state.flags['descente-autorisee']).toBe(true);
    const down = choose(state, 'veline', 'permission', 'Allons-y');
    expect(goesTo(down.effects)).toEqual({ location: 'sol-racines', arrivee: 'descente' });
    // Later visits: Véline lowers the hero again without asking.
    const again = visibleOptions(DIALOGUES.veline.nodes.descente, state).map((v) => v.option.text);
    expect(again).toContain('Redescends-moi, s’il te plaît.');
    expect(again).not.toContain('Je peux la chercher, si tu me descends.');

    expect(startNode(DIALOGUES['sacoche-lettres'], state)).toBe('ours');
    state.flags['ours-sol-vaincu'] = true;
    expect(startNode(DIALOGUES['sacoche-lettres'], state)).toBe('libre');
    choose(state, 'sacoche-lettres', 'libre', 'La prendre');
    expect(state.flags['sacoche-retrouvee']).toBe(true);
    expect(startNode(DIALOGUES.veline, state)).not.toBe('descente');

    expect(startNode(DIALOGUES.malo, state)).toBe('retour');
    const before = reputationScore(state, 'canopee');
    choose(state, 'malo', 'retour', 'La voici');
    expect(state.quests['lettres-malo']).toBe('done');
    expect(reputationScore(state, 'canopee')).toBe(before + 10);
    expect(startNode(DIALOGUES.malo, state)).toBe('ami');
  });

  it('offers three ways past the bear: stealth, berries (Survie 2) or a fight', () => {
    const state = createNewGame();
    const options = DIALOGUES['sacoche-lettres'].nodes.ours.options;
    expect(options[0].roll).toEqual({ skill: 'stealth', difficulty: 11 });
    expect(options[0].failNext).toBe('reveil');
    expect(options[1].roll).toEqual({ skill: 'survival', difficulty: 11 });
    expect(startsCombat(options[2].effects)).toBe('ours-sacoche');
    // Berries that fail wake the bear: a fight, or a step back.
    expect(DIALOGUES['sacoche-lettres'].nodes[options[1].failNext!].options.map((o) => startsCombat(o.effects))).toEqual(['ours-sacoche', null]);
    expect(visibleOptions(DIALOGUES['sacoche-lettres'].nodes.ours, state)[1].enabled).toBe(true);
  });

  it('leaves a lead for « L’audience »: the dig and the Marché des Cendres label', () => {
    const state = createNewGame();
    expect(visibleOptions(DIALOGUES['traces-fouille'].nodes.trou, state)[1].option.roll).toEqual({ skill: 'investigation', difficulty: 11 });
    choose(state, 'traces-fouille', 'trou', 'Regarder au fond');
    expect(state.flags['fouille-vue']).toBe(true);
    expect(state.flags['fouille-marches']).toBeUndefined();
  });
});
