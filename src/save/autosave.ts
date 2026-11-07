import type { GameState } from '../state/gameState';
import { saveStore } from './browser';

/**
 * La sauvegarde auto (test du 2026-11-06). Elle s'écrit à chaque lieu, après un sommeil, une quête finie, un combat
 * gagné, et quand on quitte la page ; mais charger un emplacement ne doit pas l'écraser : la partie qu'elle gardait
 * (peut-être jamais sauvegardée ailleurs) serait perdue. Après un chargement, elle reste donc verrouillée jusqu'au
 * premier vrai progrès : un nouveau lieu, une quête finie, un combat gagné, un sommeil.
 */

/** Registry key: set when a save is loaded, cleared by the first progress. */
export const AUTO_LOCK = 'autoVerrouillee';

interface Registry {
  get(key: string): unknown;
  set(key: string, value: unknown): unknown;
}

/** `progres`: something happened, write and unlock ; `rafraichir`: the same game again (a map rebuilt, the page left), write unless locked. */
export type AutoReason = 'progres' | 'rafraichir';

/** Writes the auto save, unless a save just loaded has not moved on yet. Returns whether it was written. */
export function writeAuto(registry: Registry, state: GameState | undefined, reason: AutoReason): boolean {
  if (!state?.character) return false;
  // « Le dernier passager » (chapitre 9) is not written: the auto save keeps the moment before the choice.
  if (state.flags['fin-voie-sept-monte']) return false;
  if (reason === 'progres') registry.set(AUTO_LOCK, false);
  else if (registry.get(AUTO_LOCK)) return false;
  const saved = saveStore.write('auto', state);
  if (!saved.ok) console.warn('Sauvegarde auto impossible :', saved.error);
  return saved.ok;
}
