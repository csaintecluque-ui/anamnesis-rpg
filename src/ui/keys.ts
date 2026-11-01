import Phaser from 'phaser';
import { HAS_MOUSE } from './viewport';

/**
 * A mouse (or trackpad) suggests a keyboard too: shortcut hints are shown on PC, hidden on phones and tablets where
 * they would only take room. Shortcuts themselves always work.
 */
export const SHOW_KEY_HINTS = HAS_MOUSE;

/** Phaser key names (keydown-<NAME>); a listener is removed with its scene. */
export function onKeys(scene: Phaser.Scene, keys: string[], handler: () => void): void {
  for (const key of keys) scene.input.keyboard?.on(`keydown-${key}`, handler);
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
