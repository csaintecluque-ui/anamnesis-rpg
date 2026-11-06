import type { Character } from './character';
import type { Rng } from './checks';

/**
 * Des tirages qui ne changent pas quand on recharge (test du 2026-11-06, décision de Cyril) : comme les voies
 * endormies, une graine donne toujours le même tirage. Elle se fait du jour, de ce qu'on tente, et du héros.
 */

/** Same generator as scripts/build-maps.mjs: a seed gives always the same draw. */
export function seededRng(seed: number): Rng {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** FNV-1a over the parts: the same words give the same number, on every browser. */
export function seedOf(...parts: (string | number)[]): number {
  let h = 0x811c9dc5;
  for (const ch of parts.join('|')) {
    h ^= ch.codePointAt(0)!;
    h = Math.imul(h, 0x01000193);
  }
  return h | 0;
}

/** The hero, as a part of a seed: two heroes do not draw the same dice. */
export const heroKey = (hero: Pick<Character, 'name' | 'avatar'> | null): string => (hero ? `${hero.name}/${hero.avatar}` : '');

/** A generator for one attempt: the same day, the same thing tried, the same hero, the same draw. */
export const rngFor = (...parts: (string | number)[]): Rng => seededRng(seedOf(...parts));
