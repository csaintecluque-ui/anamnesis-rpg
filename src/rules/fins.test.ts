import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { createNewGame } from '../state/gameState';
import { GOLEM_VICTORY_EFFECTS } from './combat';
import { QUESTS, type Effect } from './dialogue';
import { endingsSeen, finFlag } from './fins';
import { journalQuests } from './journal';
import { testCharacter } from './questTestKit';

/** Les fins vues des quêtes principales (étude du 2026-11-03, B11 ; docs/gdd/interface.md). */

/** Every list of effects of the game's data: the dialogues' nodes and options, and the Golem's victory. */
const effectLists = (): Effect[][] => [
  ...Object.values(DIALOGUES).flatMap((d) => Object.values(d.nodes).flatMap((n) => [n.effects ?? [], ...n.options.map((o) => o.effects ?? [])])),
  GOLEM_VICTORY_EFFECTS,
];

describe('les fins vues (étude B11)', () => {
  const withEndings = QUESTS.filter((q) => (q.fins ?? []).length >= 2);

  it('les quêtes à plusieurs issues les déclarent', () => {
    expect(withEndings.map((q) => [q.id, q.fins!.length])).toEqual([
      ['dernier-train', 7],
      ['cle-rouille-bleue', 3],
      ['memoires-monde-perdu', 3],
      ['noms-qui-montent', 4],
      ['onze-etats', 3],
      ['second-cristal', 4],
      ['voiles-dormantes', 3],
      ['asile', 2],
      ['convoi-pain', 3],
      ['sous-la-faille', 3],
      ['caisse-cendriere', 4],
      ['caisse-sans-main', 4],
      ['mer-rend', 4],
      ['don-rendu', 3],
      ['lune-rouge', 4],
      ['cargo-noir', 3],
      ['grotte-reflux', 3],
      ['plus-lieu', 4],
      ['deux-nombres', 3],
      ['forage-noir', 3],
      ['sept-nuits', 3],
      ['arreter', 3],
      ['dragonnet', 3],
      ['glace-pris', 4],
      ['cristal-hesite', 3],
    ]);
  });

  it('chaque façon de finir une de ces quêtes pose le repère d’une de ses fins, et chaque fin a la sienne', () => {
    for (const quest of withEndings) {
      const flags = new Set(quest.fins!.map((f) => finFlag(quest.id, f.id)));
      const set = new Set<string>();
      for (const effects of effectLists()) {
        if (!effects.some((e) => 'completeQuest' in e && e.completeQuest === quest.id)) continue;
        const fin = effects.find((e): e is { setFlag: string } => 'setFlag' in e && flags.has(e.setFlag));
        expect(fin, `${quest.id} : une fin sans repère`).toBeDefined();
        set.add(fin!.setFlag);
      }
      expect([...set].sort()).toEqual([...flags].sort());
    }
  });

  it('le journal dit les fins vues d’une quête finie, celles de cette partie et des autres', () => {
    const state = createNewGame(testCharacter());
    state.quests['dernier-train'] = 'done';
    state.flags[finFlag('dernier-train', 'sabotage')] = true;
    const quest = journalQuests(state).find((q) => q.id === 'dernier-train');
    expect(quest?.finsVues).toEqual({ seen: ['La foreuse sabotée'], total: 7 });
    const remembered = new Set([finFlag('dernier-train', 'sabotage'), finFlag('dernier-train', 'golem')]);
    expect(journalQuests(state, remembered).find((q) => q.id === 'dernier-train')?.finsVues?.seen).toEqual(['La foreuse sabotée', 'Le Golem vaincu']);
    expect(endingsSeen({ id: 'x', fins: [{ id: 'a', titre: 'A' }] }, remembered)).toBeUndefined();
    // A quest finished in an older save, before the endings were counted: one ending seen, not named.
    state.quests['cle-rouille-bleue'] = 'done';
    expect(journalQuests(state).find((q) => q.id === 'cle-rouille-bleue')?.finsVues).toEqual({ seen: ['Une fin vue avant que le journal ne les compte'], total: 3 });
  });
});
