import type { LocationDef } from '../state/gameState';
import { momentOf, type GameTime } from './time';

/**
 * Les marées de Coralia (docs/gdd/chapitre-6.md, la mécanique propre à la ville ; docs/gdd/villes.md) : deux fois par
 * jour, le matin et le soir, la mer se retire ; un lieu qui a une carte de marée basse (`maree`) la montre alors.
 */
export function mareeBasse(time: GameTime): boolean {
  const moment = momentOf(time);
  return moment === 'matin' || moment === 'soir';
}

/** The map a location shows now: its low-tide map in the morning and the evening, its own the rest of the time. */
export function mapAtTide(location: Pick<LocationDef, 'map' | 'maree'>, time: GameTime): string {
  return location.maree && mareeBasse(time) ? location.maree : location.map;
}
