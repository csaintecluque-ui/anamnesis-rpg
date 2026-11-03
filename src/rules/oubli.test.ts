import { describe, expect, it } from 'vitest';
import { createNewGame } from '../state/gameState';
import { applyEffects } from './dialogue';
import { ITEMS } from './inventory';
import { categoryOf, itemUses } from './objets';
import { forgettable, letGo, recitUses, recitsToForget } from './oubli';
import { testCharacter } from './questTestKit';

/** L'oubli choisi (feuille de route, chantier 1 ; docs/gdd/memoire.md). */
describe('choosing what to forget', () => {
  it('asks for a choice once a Récit too many is learned, the Récits of the main story aside', () => {
    const state = createNewGame(testCharacter()); // Mémoire 5: six ordinary Récits
    applyEffects(state, ['voix-ecorce', 'berceuse-de-maelis', 'saule', 'deux-apprenties', 'chant-anselme', 'puits-trois', 'savant-corvan'].map((id) => ({ learnRecit: id })));
    expect(recitsToForget(state)).toBe(0);
    applyEffects(state, [{ learnRecit: 'soixante-douze-heures' }]);
    expect(recitsToForget(state)).toBe(1);
    expect(forgettable(state)).not.toContain('savant-corvan');
    expect(letGo(state, 'saule')).toEqual(['Récit oublié : Saule, le frère de Liane']);
    expect(recitsToForget(state)).toBe(0);
  });

  it('says what each Récit is good for: its themes, the veillées that like it, who it opens an answer with', () => {
    const uses = recitUses('kael-chroniqueur');
    expect(uses.some((l) => l.startsWith('Thèmes :'))).toBe(true);
    expect(uses.find((l) => l.startsWith('Ouvre une réponse'))).toMatch(/Ambroise Encrelune/);
  });

  it('the Champignon-Mémoire: a Récit forgotten on purpose, and the Échos’ hold drops to nothing', () => {
    const state = createNewGame(testCharacter());
    applyEffects(state, [{ learnRecit: 'saule' }]);
    state.emprise = 6;
    expect(letGo(state, 'saule', true)).toEqual(['Récit oublié : Saule, le frère de Liane', 'L’emprise des Échos retombe à zéro']);
    expect(state.emprise).toBe(0);
    const mushroom = ITEMS.find((i) => i.id === 'champignon-memoire-frais')!;
    expect(categoryOf(mushroom)).toBe('remedes');
    expect(itemUses(mushroom)[0]).toMatch(/Récit à oublier.*emprise des Échos retombe à zéro/);
  });
});
