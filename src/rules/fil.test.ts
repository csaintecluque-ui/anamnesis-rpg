import { describe, expect, it } from 'vitest';
import { WORLD } from './world';
import { QUESTS } from './dialogue';
import { createNewGame } from '../state/gameState';
import { FIL, filPage } from './fil';
import { testCharacter } from './questTestKit';

/** La page « Le fil » (docs/gdd/fil-directeur.md, validé par Cyril le 2026-11-04). */
describe('le fil directeur au journal', () => {
  it('commence par dire où aller, puis se remplit au fil de l’histoire', () => {
    const state = createNewGame(testCharacter());
    expect(filPage(state).savoirs).toEqual([FIL.avant]);
    expect(filPage(state).question).toBeUndefined();
    state.quests['dernier-train'] = 'active';
    expect(filPage(state).piste?.cible).toBe('gardebois');
    state.quests['dernier-train'] = 'done';
    state.quests['audience'] = 'active';
    expect(filPage(state).savoirs).toHaveLength(1);
    expect(filPage(state).piste?.cible).toBe('canopee');
    state.flags['page-lue'] = true;
    state.quests['memoires-monde-perdu'] = 'done';
    const page = filPage(state);
    expect(page.question).toContain('sept caisses');
    expect(page.piste?.cible).toBe('aetherhaven');
  });

  it('compte sept caisses, une par continent, toutes inconnues pour l’instant', () => {
    const page = filPage(createNewGame(testCharacter()));
    expect(page.caisses.map((c) => c.continent)).toHaveLength(7);
    expect(page.caisses.every((c) => c.etat === 'inconnue')).toBe(true);
  });

  it('ne parle que de quêtes qui existent, et ne vise que des lieux de la carte du monde', () => {
    const quests = new Set(QUESTS.map((q) => q.id));
    const targets = new Set([...WORLD.places.map((p) => p.id), ...WORLD.distant.map((d) => d.name)]);
    for (const line of [FIL.question, ...FIL.savoirs, ...FIL.pistes]) if (line.quest) expect(quests.has(line.quest), line.quest).toBe(true);
    for (const p of FIL.pistes) if (p.cible) expect(targets.has(p.cible), p.cible).toBe(true);
  });
});
