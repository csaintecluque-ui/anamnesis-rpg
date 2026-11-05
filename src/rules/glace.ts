import type { Character } from './character';
import { ownedCount } from './inventory';

/**
 * Khrysos (docs/gdd/chapitre-8.md, le moteur ; docs/univers/lieux/khrysos.md) : −5 °C dans la cité, −60 °C dehors
 * [NOTION]. À la surface, le froid prend des PV à qui n'a pas de manteau, à chaque arrivée, comme la chaleur hors de
 * la Marche (src/rules/marche.ts) ; jamais le dernier. L'Atelier Facettier en vend un.
 */

/** The fur coat of Khrysos (src/data/items.json): who carries it does not suffer from the cold. */
export const MANTEAU = 'manteau-givre';
/** Every coat that keeps the cold off: Brodd's, and the white one of the Vigiles Blancs. */
export const MANTEAUX = [MANTEAU, 'manteau-vigile'];
/** What the cold of the surface (`froid`) costs to whoever has no coat: these hit points, on each arrival. */
export const FROID_PV = 5;

/** The cold, at the surface: null if a coat keeps it off, otherwise the hit points it took (never the last one). */
export function froid(character: Character): number | null {
  if (MANTEAUX.some((id) => ownedCount(character, id) > 0)) return null;
  const lost = Math.min(FROID_PV, Math.max(0, character.hp - 1));
  character.hp -= lost;
  return lost;
}

/** What the map says of the cold, on arriving at the surface. */
export function froidMessage(lost: number | null): string {
  if (lost === null) return 'Le froid. Tu serres le manteau de fourrure, et il ne passe pas.';
  return lost > 0 ? `Le froid, et rien pour s’en garder : tu perds ${lost} PV. Il faudrait un manteau.` : 'Le froid. Tu ne sens plus tes mains, mais tu tiens debout.';
}
