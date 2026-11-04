import type { Character } from './character';
import { ownedCount } from './inventory';
import type { LocationDef } from '../state/gameState';
import { mapAtTide } from './marees';
import { momentOf, type GameTime } from './time';

/**
 * La Marche-Mère (docs/gdd/chapitre-7.md, la mécanique propre à la ville) : le matin et à midi, la Marche avance, le
 * camp plié et le sable qui défile ; le soir et la nuit, elle dresse le camp. Un lieu qui a une carte du camp (`camp`)
 * la montre alors.
 */
export function campDresse(time: GameTime): boolean {
  const moment = momentOf(time);
  return moment === 'soir' || moment === 'nuit';
}

/** The map a location shows now: its low-tide map (Coralia), its camp map (the Marche, at evening), or its own. */
export function mapNow(location: Pick<LocationDef, 'map' | 'maree' | 'camp'>, time: GameTime): string {
  if (location.camp) return campDresse(time) ? location.camp : location.map;
  return mapAtTide(location, time);
}

/** The sand runs under the map while the Marche walks: on its lands (`sable`), in the morning and at noon. */
export function sableDefile(location: Pick<LocationDef, 'sable'>, time: GameTime): boolean {
  return !!location.sable && !campDresse(time);
}

/** Water of the errance (src/data/items.json): who carries a full gourd does not suffer from the heat. */
export const GOURDE = 'gourde-errance';
/** What the heat costs, off the Marche (`soif`), to whoever has no water: these hit points, on each arrival. */
export const SOIF_PV = 4;

/** The heat, off the Marche: null if a gourd of the water of the errance keeps it off, otherwise the hit points it took (never the last one). */
export function chaleur(character: Character): number | null {
  if (ownedCount(character, GOURDE) > 0) return null;
  const lost = Math.min(SOIF_PV, Math.max(0, character.hp - 1));
  character.hp -= lost;
  return lost;
}
