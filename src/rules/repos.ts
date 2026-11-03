import { findLocation, type GameState } from '../state/gameState';
import { characterStats } from './character';
import { findCompanion, restParty } from './companions';
import { fadeSouvenirs } from './echos';
import { restoreResonance } from './magic';
import { findRecit, forgetRecit, ordinaryRecits } from './recits';
import { formatDate, sleepUntil } from './time';
import { findPlace } from './world';

/**
 * Se reposer sans auberge, et se réveiller après une chute (étude du 2026-11-03, G2 et I1 ; décision de Cyril du
 * 2026-11-03 : « deux boutons à la mort »).
 * - Le repos gratuit : jusqu'au matin, la moitié des PV rendus (l'auberge les rend tous, avec les PR) ; jamais sous
 *   terre ni sur la route. Il n'y avait aucun soin gratuit : à moins de 6 Fers et blessé, on restait bloqué.
 * - Le réveil : à l'auberge de la dernière ville, guéri, contre un Récit ordinaire (le plus ancien) ; sans Récit,
 *   10 Fers ; sans Fers, rien.
 */

/** Share of the PV a night outside an inn gives back. */
export const REST_SHARE = 0.5;
/** What waking up at the inn costs when the hero carries no ordinary Récit. */
export const REVEIL_FERS = 10;
const DEFAULT_TOWN = 'gardebois';

/** Why the hero cannot rest here, or null when they can. */
export function restRefusal(state: GameState): string | null {
  const location = findLocation(state.location);
  if (state.voie || location?.voie) return 'Pas ici : sous terre, rien ne dort longtemps. Remonte d’abord.';
  if (location?.encounter) return 'Pas ici, sur la route : trouve un abri, ou une auberge.';
  return null;
}

/** A free night where one stands: the morning, half the PV back for the hero and the companions. Returns the notice. */
export function restUntilMorning(state: GameState): string {
  sleepUntil(state.time, 'matin');
  let healed = 0;
  const hero = state.character;
  if (hero) {
    const max = characterStats(hero).maxHp;
    const before = hero.hp;
    hero.hp = Math.min(max, hero.hp + Math.ceil(max * REST_SHARE));
    healed = hero.hp - before;
  }
  for (const m of state.groupe) {
    const max = findCompanion(m.id)?.hp ?? m.hp;
    m.hp = Math.min(max, m.hp + Math.ceil(max * REST_SHARE));
  }
  fadeSouvenirs(state.flags);
  return `Tu dors mal, d’un œil, sans toit ni lit : +${healed} PV. Le jour se lève. Nous sommes ${formatDate(state.time)}. Une auberge t’aurait tout rendu.`;
}

/** The town the hero wakes up in: the one of the place of the fall, else the last one walked in. */
export function reveilTown(state: GameState): string {
  const place = findLocation(state.location)?.place;
  if (place && findPlace(place)?.auberge) return place;
  const last = state.derniereVille;
  return last && findPlace(last)?.auberge ? last : DEFAULT_TOWN;
}

export interface ReveilPrice {
  /** The town's name, and its inn's location. */
  town: string;
  inn: string;
  /** The ordinary Récit let go (the oldest), or the Fers paid, or nothing at all. */
  recit?: string;
  fers?: number;
}

/** What waking up at the inn would cost, said on the death screen before choosing. */
export function reveilPrice(state: GameState): ReveilPrice {
  const town = findPlace(reveilTown(state))!;
  const price: ReveilPrice = { town: town.name, inn: town.auberge! };
  const hero = state.character;
  const recit = hero ? ordinaryRecits(hero)[0] : undefined;
  if (recit) price.recit = recit;
  else if ((hero?.fers ?? 0) >= REVEIL_FERS) price.fers = REVEIL_FERS;
  return price;
}

/** The label of the death screen's second button. */
export function reveilLabel(price: ReveilPrice): string {
  if (price.recit) return `Te réveiller à ${price.town} : tu oublies « ${findRecit(price.recit)?.titre ?? price.recit} »`;
  if (price.fers) return `Te réveiller à ${price.town} : −${price.fers} Fers`;
  return `Te réveiller à ${price.town}`;
}

/**
 * Someone carried the hero to the inn. The state as it was when the fight began (the fight is lost: its enemies stay),
 * moved to the inn, the morning after, healed like after a night there, the price paid. Returns what is told on waking.
 */
export function wakeUpAtInn(state: GameState): string {
  const price = reveilPrice(state);
  const inn = findLocation(price.inn)!;
  state.location = inn.id;
  state.entrance = inn.entrance;
  state.encounter = null;
  state.voie = null;
  sleepUntil(state.time, 'matin');
  const hero = state.character;
  if (hero) {
    hero.hp = characterStats(hero).maxHp;
    restoreResonance(hero);
    if (price.recit) forgetRecit(hero, price.recit);
    if (price.fers) hero.fers -= price.fers;
  }
  restParty(state);
  fadeSouvenirs(state.flags);
  const paid = price.recit
    ? ` Il te manque quelque chose : « ${findRecit(price.recit)?.titre ?? price.recit} », tu ne sais plus comment il commence.`
    : price.fers
      ? ` On t’a pris ${price.fers} Fers pour la peine.`
      : '';
  return `Quelqu’un t’a ramené·e jusqu’à l’auberge. Tu te réveilles à ${price.town}, courbatu·e, vivant·e.${paid}`;
}
