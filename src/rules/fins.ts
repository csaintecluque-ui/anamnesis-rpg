import type { QuestDef } from './dialogue';

/**
 * Les fins vues (étude du 2026-11-03, B11) : a main quest with several endings says, once finished, how many of them
 * the player has seen (« Fins vues : 2 / 7 »), and which. An ending sets `fin-<quest>-<id>` (src/data/quests.json,
 * `fins`); the endings seen in any game on this device are remembered (like the options), so that a second game
 * counts the first one's.
 */

export const finFlag = (quest: string, fin: string): string => `fin-${quest}-${fin}`;

const KEY = 'anamnesis.fins';

/** The endings seen in this game and in the others on this device: the ending flags. */
export function rememberEndings(flags: Record<string, true>): Set<string> {
  let remembered: string[] = [];
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]') as unknown;
    if (Array.isArray(raw)) remembered = raw.filter((x): x is string => typeof x === 'string');
  } catch {
    // Storage blocked or damaged: only this game's endings.
  }
  const seen = new Set([...remembered, ...Object.keys(flags).filter((f) => f.startsWith('fin-'))]);
  if (seen.size > remembered.length) {
    try {
      localStorage.setItem(KEY, JSON.stringify([...seen]));
    } catch {
      // Kept for this page only.
    }
  }
  return seen;
}

/** For a quest with two endings or more: the titles of those seen, and how many there are. */
export function endingsSeen(quest: Pick<QuestDef, 'id' | 'fins'>, seen: ReadonlySet<string>): { seen: string[]; total: number } | undefined {
  if (!quest.fins || quest.fins.length < 2) return undefined;
  return { seen: quest.fins.filter((f) => seen.has(finFlag(quest.id, f.id))).map((f) => f.titre), total: quest.fins.length };
}
