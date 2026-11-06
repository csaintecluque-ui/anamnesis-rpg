/**
 * Le temps de jeu (demande de Cyril, 2026-11-06 : mesurer le vrai temps qu'on met à finir l'histoire). Une seule horloge,
 * branchée sur la boucle du jeu (src/main.ts) : elle compte tout le temps d'une partie, la carte, la carte du monde,
 * les dialogues, les combats, le journal, le troc, les veillées ; pas l'écran titre, les emplacements, la pause ni les
 * options ; et plus rien après cinq minutes sans un geste (une partie laissée ouverte ne compte pas).
 */

/** The scenes where the game is not being played, even if one is loaded. */
export const NOT_PLAYING = ['Boot', 'Title', 'Slots', 'Pause', 'Options'];
/** Without a key, a click, a touch or a move of the mouse for this long, the clock stops. */
export const IDLE_AFTER_MS = 5 * 60 * 1000;
/** One frame never counts for more than this (a tab come back from the background, a slow phone). */
export const MAX_STEP_MS = 1000;

/** Seconds of play to add for one frame of `deltaMs`, given the scenes running and the time since the last input. */
export function playTimeStep(deltaMs: number, activeScenes: string[], msSinceInput: number): number {
  if (deltaMs <= 0 || msSinceInput > IDLE_AFTER_MS) return 0;
  if (activeScenes.some((key) => NOT_PLAYING.includes(key))) return 0;
  return Math.min(deltaMs, MAX_STEP_MS) / 1000;
}
