import { describe, expect, it } from 'vitest';
import { createNewGame } from '../state/gameState';
import { testCharacter } from '../rules/questTestKit';
import { AUTO_LOCK, writeAuto } from './autosave';
import { saveStore } from './browser';

/** La sauvegarde auto ne perd plus la partie qu'elle gardait quand on charge un emplacement (test du 2026-11-06). */

const registry = () => {
  const data = new Map<string, unknown>();
  return { get: (k: string) => data.get(k), set: (k: string, v: unknown) => data.set(k, v) };
};
const autoLocation = () => {
  const content = saveStore.read('auto');
  return content.kind === 'save' ? content.save.state.location : null;
};

describe('the auto save', () => {
  it('keeps the game it held when another slot is loaded, until that one moves on', () => {
    const r = registry();
    const a = createNewGame(testCharacter());
    a.location = 'gardebois';
    expect(writeAuto(r, a, 'progres')).toBe(true);
    // A slot is loaded: the auto save is locked.
    r.set(AUTO_LOCK, true);
    const b = createNewGame(testCharacter());
    b.location = 'canopee-nacelle';
    expect(writeAuto(r, b, 'rafraichir')).toBe(false);
    expect(autoLocation()).toBe('gardebois');
    // The loaded game moves on (a new place, a quest finished): now it is the one kept.
    expect(writeAuto(r, b, 'progres')).toBe(true);
    expect(autoLocation()).toBe('canopee-nacelle');
    expect(writeAuto(r, b, 'rafraichir')).toBe(true);
  });

  it('writes nothing without a hero', () => {
    expect(writeAuto(registry(), createNewGame(null), 'progres')).toBe(false);
  });
});
