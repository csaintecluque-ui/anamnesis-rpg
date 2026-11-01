import { characterStats, type Character } from './character';

/** Hidden testing tools (docs/gdd/interface.md, « Mode test »): not part of the game's rules. */
export const TEST_FERS = 50;

export function addTestFers(character: Character): void {
  character.fers += TEST_FERS;
}

/** Back to full PV; returns how many were restored. */
export function restoreFullHp(character: Character): number {
  const max = characterStats(character).maxHp;
  const restored = Math.max(0, max - character.hp);
  character.hp = max;
  return restored;
}
