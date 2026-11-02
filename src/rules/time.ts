/**
 * Le temps (demande de Cyril, 2026-11-02 ; docs/gdd/temps.md) : des jours, et quatre moments dans chaque jour.
 * Calendrier du canon [NOTION, « Géographie »] : 365 jours en douze mois sans nom (« le 4 du neuvième mois de 1387 »),
 * sept de 31 jours, quatre de 30, un de 28 ; l'ère se compte en AN (« après le Nexus »), le présent est l'an 3000.
 * Le jeu commence le 1er du huitième mois de l'an 3000 (choix proposé, accepté par Cyril).
 */
export const MOMENTS = ['matin', 'midi', 'soir', 'nuit'] as const;
export type Moment = (typeof MOMENTS)[number];

export interface GameTime {
  /** 1 on the first day of the game. */
  day: number;
  /** Index in MOMENTS. */
  phase: number;
}

export const START_TIME: GameTime = { day: 1, phase: 0 };
const START = { day: 1, month: 8, year: 3000 };
const MONTH_LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const ORDINALS = ['premier', 'deuxième', 'troisième', 'quatrième', 'cinquième', 'sixième', 'septième', 'huitième', 'neuvième', 'dixième', 'onzième', 'douzième'];

export const momentOf = (time: GameTime): Moment => MOMENTS[time.phase];
export const isNight = (time: GameTime): boolean => momentOf(time) === 'nuit';

/** Moves the clock forward by a number of moments (a quarter of a day each). */
export function advance(time: GameTime, phases: number): void {
  const total = time.phase + Math.max(0, Math.round(phases));
  time.day += Math.floor(total / MOMENTS.length);
  time.phase = total % MOMENTS.length;
}

/** Waits for a moment: nothing if it is already that moment, otherwise until it comes (later today, or tomorrow). */
export function waitUntil(time: GameTime, moment: Moment): number {
  const target = MOMENTS.indexOf(moment);
  const phases = (target - time.phase + MOMENTS.length) % MOMENTS.length;
  advance(time, phases);
  return phases;
}

/** Sleeps until a moment: always at least until the next one of its kind (sleeping in the morning wakes tomorrow). */
export function sleepUntil(time: GameTime, moment: Moment): number {
  const target = MOMENTS.indexOf(moment);
  const phases = ((target - time.phase + MOMENTS.length - 1) % MOMENTS.length) + 1;
  advance(time, phases);
  return phases;
}

/** Travel on the world map: a quarter of a day per moment, at least one. */
export function travelPhases(days: number): number {
  return Math.max(1, Math.round(days * MOMENTS.length));
}

export function calendarDate(time: GameTime): { day: number; month: number; year: number } {
  let { day, month, year } = START;
  for (let left = time.day - 1; left > 0; left--) {
    day++;
    if (day > MONTH_LENGTHS[month - 1]) {
      day = 1;
      month++;
      if (month > 12) {
        month = 1;
        year++;
      }
    }
  }
  return { day, month, year };
}

/** « le 1er du huitième mois de l'an 3000 », in the way of the canon. */
export function formatDate(time: GameTime): string {
  const d = calendarDate(time);
  return `le ${d.day === 1 ? '1er' : d.day} du ${ORDINALS[d.month - 1]} mois de l’an ${d.year}`;
}

/** « Jour 3 · soir », for the header. */
export function shortTime(time: GameTime): string {
  return `jour ${time.day} · ${momentOf(time)}`;
}

export function isGameTime(value: unknown): value is GameTime {
  if (typeof value !== 'object' || value === null) return false;
  const t = value as Record<string, unknown>;
  return Number.isInteger(t.day) && (t.day as number) >= 1 && Number.isInteger(t.phase) && (t.phase as number) >= 0 && (t.phase as number) < MOMENTS.length;
}
