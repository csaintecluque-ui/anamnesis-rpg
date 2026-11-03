import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { createNewGame, type GameState } from '../state/gameState';
import { applyEffects, raconterOption, raconterTarget, visibleOptions, type RaconterDef } from './dialogue';
import { ownedCount } from './inventory';
import { choose, testCharacter } from './questTestKit';
import { knowsRecit } from './recits';

/** Raconter, et donner, un Récit (feuille de route, chantier 1 ; docs/gdd/memoire.md). */
function hero(memory = 3, recits: string[] = ['berceuse-de-maelis']): GameState {
  const state = createNewGame(testCharacter({ memory }));
  state.character!.recits.push(...recits);
  return state;
}

/** Picks the option that asks for a Récit, tells this one: its effects, then those of the node it leads to. */
function tell(state: GameState, dialogue: string, node: string, text: string, recit: string): string {
  const view = visibleOptions(DIALOGUES[dialogue].nodes[node], state).find((v) => v.option.text.startsWith(text));
  if (!view?.option.raconter) throw new Error(`${dialogue}/${node}: pas d’option « ${text} » pour raconter`);
  const picked = raconterOption(view.option.raconter, recit);
  applyEffects(state, picked.effects);
  applyEffects(state, DIALOGUES[dialogue].nodes[picked.next].effects);
  return picked.next;
}

describe('telling a Récit', () => {
  it('leads by the Récit itself, then by what it speaks of, then refused or plainly heard', () => {
    const def: RaconterDef = { aime: ['trains'], recits: { saule: 'pour-saule' }, touche: 'touche', refus: 'refus', neutre: 'neutre' };
    expect(raconterTarget(def, 'saule')).toEqual({ node: 'pour-saule', accepted: true });
    expect(raconterTarget(def, 'convoi-sans-conducteur')).toEqual({ node: 'touche', accepted: true });
    expect(raconterTarget(def, 'berceuse-de-maelis')).toEqual({ node: 'refus', accepted: false });
    expect(raconterTarget({ neutre: 'neutre' }, 'berceuse-de-maelis')).toEqual({ node: 'neutre', accepted: true });
  });

  it('is offered only with a Récit to tell; the Récits of the main story are never given away', () => {
    const empty = hero(3, []);
    const texts = visibleOptions(DIALOGUES['echo-dernier-train'].nodes.approche, empty).map((v) => v.option.text);
    expect(texts.some((t) => t.startsWith('Lui donner'))).toBe(false);
    const principal = hero(3, ['savant-corvan']);
    expect(visibleOptions(DIALOGUES['echo-dernier-train'].nodes.approche, principal).some((v) => v.option.raconter)).toBe(false);
  });
});

describe('a Récit given away, one in each chapter (a memory choice that costs)', () => {
  it('ch. 1: the Écho of the last train lets in who gives it a story, even without Mémoire 4', () => {
    const state = hero(3);
    expect(tell(state, 'echo-dernier-train', 'approche', 'Lui donner', 'berceuse-de-maelis')).toBe('don-entree');
    expect(knowsRecit(state.character, 'berceuse-de-maelis')).toBe(false);
    choose(state, 'echo-dernier-train', 'don-entree', 'Entrer dans l’Écho');
    expect(knowsRecit(state.character, 'savant-corvan')).toBe(true);
  });

  it('ch. 2: the old tree of the silent Bosquet drinks the story and shows the way down', () => {
    const state = hero(2);
    state.quests.audience = 'active';
    state.flags['audience-tenue'] = true;
    expect(tell(state, 'arbre-ancien', 'silence', 'Confier', 'berceuse-de-maelis')).toBe('confie');
    expect([state.flags['piste-racines'], knowsRecit(state.character, 'berceuse-de-maelis')]).toEqual([true, false]);
  });

  it('ch. 3: the Veilleuse trades the key for a story with a train in it, and gives the others back', () => {
    const state = hero(2, ['berceuse-de-maelis', 'convoi-sans-conducteur']);
    state.quests['cle-rouille-bleue'] = 'active';
    state.flags['kaelis-parle'] = true;
    choose(state, 'veilleuse', 'question-cle', 'Et si je te laissais une histoire');
    expect(tell(state, 'veilleuse', 'echange', 'Lui laisser', 'berceuse-de-maelis')).toBe('pas-trains');
    expect(knowsRecit(state.character, 'berceuse-de-maelis')).toBe(true);
    expect(tell(state, 'veilleuse', 'echange', 'Lui laisser', 'convoi-sans-conducteur')).toBe('don-histoire');
    expect(knowsRecit(state.character, 'convoi-sans-conducteur')).toBe(false);
    choose(state, 'veilleuse', 'don-histoire', 'Prendre la clé');
    expect(ownedCount(state.character!, 'cle-rouille-bleue')).toBe(1);
  });

  it('ch. 4: Ambroise enters a story in the Registre, a hand for a hand, and opens the Fonds Muet', () => {
    const state = hero(2);
    state.quests['memoires-monde-perdu'] = 'active';
    state.flags['hesper-vue'] = true;
    applyEffects(state, DIALOGUES.ambroise.nodes['edda-demande'].effects);
    expect(tell(state, 'ambroise', 'edda-demande', 'Une main contre une main', 'berceuse-de-maelis')).toBe('depot');
    expect([state.flags['fonds-muet-ouvert'], knowsRecit(state.character, 'berceuse-de-maelis')]).toEqual([true, false]);
  });
});
