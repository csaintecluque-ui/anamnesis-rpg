import Phaser from 'phaser';
import { HAS_MOUSE } from './viewport';

/**
 * A mouse (or trackpad) suggests a keyboard too: shortcut hints are shown on PC, hidden on phones and tablets where
 * they would only take room. Shortcuts themselves always work.
 */
export const SHOW_KEY_HINTS = HAS_MOUSE;

const REPEATABLE = new Set(['UP', 'DOWN', 'LEFT', 'RIGHT']);

/**
 * Phaser key names (keydown-<NAME>); a listener is removed with its scene. A key held down does not repeat the action
 * (test du 2026-11-06 : Entrée maintenue avalait les répliques à une seule option).
 */
export function onKeys(scene: Phaser.Scene, keys: string[], handler: () => void): void {
  const once = (event?: KeyboardEvent) => {
    if (!event?.repeat) handler();
  };
  for (const key of keys) {
    // The arrows may repeat: held down, they still run through a list.
    scene.input.keyboard?.on(`keydown-${key}`, REPEATABLE.has(key) ? handler : once);
    // Tab picks things in the game (a place, an enemy, a tab): the browser must not move the focus away.
    if (key === 'TAB') scene.input.keyboard?.addCapture(key);
  }
}

/** "Menu" → "Menu (Échap)" on PC, unchanged elsewhere. */
export function withKeyHint(label: string, key: string): string {
  return SHOW_KEY_HINTS ? `${label} (${key})` : label;
}

/** Top-row digits and the numeric keypad, for "press 1 to pick the first option". */
export const DIGIT_KEYS = [
  ['ONE', 'NUMPAD_ONE'],
  ['TWO', 'NUMPAD_TWO'],
  ['THREE', 'NUMPAD_THREE'],
  ['FOUR', 'NUMPAD_FOUR'],
  ['FIVE', 'NUMPAD_FIVE'],
  ['SIX', 'NUMPAD_SIX'],
  ['SEVEN', 'NUMPAD_SEVEN'],
  ['EIGHT', 'NUMPAD_EIGHT'],
  ['NINE', 'NUMPAD_NINE'],
];
