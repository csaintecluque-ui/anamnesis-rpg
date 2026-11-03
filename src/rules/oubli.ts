import { DIALOGUES } from '../data/dialogues';
import npcData from '../data/npcs.json';
import type { GameState } from '../state/gameState';
import type { Condition } from './dialogue';
import { gardienTalesBonus } from './factions';
import { findRecit, forgetRecit, ordinaryRecits, recitOverflow } from './recits';
import { PUBLICS, THEMES, type Theme } from './veillees';

/**
 * L'oubli choisi (feuille de route, chantier 1 ; docs/gdd/memoire.md) : past the cap, the hero chooses which Récit to let
 * go, knowing what each is good for ; a Champignon-Mémoire makes one forget on purpose, and the Échos' hold goes with it.
 */

/** Ordinary Récits too many for this hero now (cap: Mémoire + 1, plus the rank among the Gardiens). */
export function recitsToForget(state: GameState): number {
  return state.character ? recitOverflow(state.character, gardienTalesBonus(state)) : 0;
}

/** What a Récit is good for: the veillées that like (or loathe) it, the people for whom it opens an answer. */
export function recitUses(id: string): string[] {
  const recit = findRecit(id);
  if (!recit) return [];
  const themes = (recit.themes ?? []) as Theme[];
  const lines: string[] = [];
  if (themes.length) lines.push(`Thèmes : ${themes.map((t) => THEMES[t] ?? t).join(', ')}.`);
  const likes = (p: (typeof PUBLICS)[number]) => p.aime.some((t) => themes.includes(t as Theme));
  const loathes = (p: (typeof PUBLICS)[number]) => p.deteste.some((t) => themes.includes(t as Theme));
  const liked = PUBLICS.filter((p) => likes(p) && !loathes(p)).map((p) => p.nom);
  const split = PUBLICS.filter((p) => likes(p) && loathes(p)).map((p) => p.nom);
  const loathed = PUBLICS.filter((p) => loathes(p) && !likes(p)).map((p) => p.nom);
  if (liked.length) lines.push(`Plaît à la veillée : ${liked.join(', ')}.`);
  if (split.length) lines.push(`Divise : ${split.join(', ')}.`);
  if (loathed.length) lines.push(`Déplaît : ${loathed.join(', ')}.`);
  const speakers = new Set<string>();
  const asks = (conditions: Condition[] = []) => conditions.some((c) => 'recit' in c && c.recit === id);
  for (const d of Object.values(DIALOGUES)) {
    if (Object.values(d.nodes).some((n) => n.options.some((o) => asks(o.requires)))) {
      speakers.add((npcData as { id: string; name: string }[]).find((n) => n.id === d.speaker)?.name ?? d.speaker);
    }
  }
  if (speakers.size) lines.push(`Ouvre une réponse : ${[...speakers].slice(0, 3).join(', ')}${speakers.size > 3 ? '…' : ''}.`);
  return lines;
}

/** The Récits one may let go, in the order they were learned. */
export const forgettable = (state: GameState): string[] => (state.character ? ordinaryRecits(state.character) : []);

/** Lets a Récit go; with a Champignon-Mémoire, the Échos' hold goes too (`withMushroom`). */
export function letGo(state: GameState, id: string, withMushroom = false): string[] {
  if (!state.character || !forgetRecit(state.character, id)) return [];
  const notices = [`Récit oublié : ${findRecit(id)?.titre ?? id}`];
  if (withMushroom) {
    state.emprise = 0;
    notices.push('L’emprise des Échos retombe à zéro');
  }
  return notices;
}
