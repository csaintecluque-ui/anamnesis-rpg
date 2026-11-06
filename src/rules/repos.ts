import { findLocation, type GameState } from '../state/gameState';
import { characterStats } from './character';
import { findCompanion, restParty } from './companions';
import { fadeSouvenirs } from './echos';
import { restoreResonance } from './magic';
import { findRecit, forgetRecit, ordinaryRecits } from './recits';
import { findEnemy } from './combat';
import { heroKey, rngFor } from './graine';
import { MOMENTS, formatDate, sleepUntil, waitUntil } from './time';
import { findPlace } from './world';

/**
 * Se reposer sans auberge, et se réveiller après une chute (étude du 2026-11-03, G2 et I1 ; décision de Cyril du
 * 2026-11-03 : « deux boutons à la mort »).
 * - Le repos gratuit : jusqu'au matin, les PV remontés à la moitié au plus (l'auberge les rend tous, avec les PR) ;
 *   jamais sous terre ni sur la route. Il n'y avait aucun soin gratuit : à moins de 6 Fers et blessé, on restait bloqué.
 *   Depuis le test du 2026-11-06 (décision de Cyril) : une nuit par jour (réveillé·e d'une nuit dehors, qui se recouche
 *   avant le soir attend d'abord que la journée passe), et hors des villes (un lieu qui dit qui rôde : `nuit`), un risque d'être attaqué dans la nuit, tiré d'une
 *   graine (le jour, le lieu, le héros) : recharger n'y change rien.
 * - Le réveil : à l'auberge de la dernière ville, guéri, contre un Récit ordinaire (le plus ancien) ; sans Récit,
 *   10 Fers ; sans Fers, rien.
 */

/** A night outside an inn raises the PV to this share of the maximum, never more (test du 2026-11-06). */
export const REST_SHARE = 0.5;
/** The chance of an attack in the night, outside the towns. */
export const NIGHT_ATTACK_CHANCE = 1 / 3;
/** Set for the night of an attack (it expires the next day): the hero who rests again sleeps in peace. */
export const NIGHT_FLAG = 'nuit-agitee';
const EVENING = MOMENTS.indexOf('soir');
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

/**
 * Who comes in the night, if anyone, where the hero lies down: outside the towns only (a location that says who prowls
 * there), one night in three, the same draw for the same night, the same place and the same hero.
 */
export function nightAttack(state: GameState): string[] | null {
  const location = findLocation(state.location);
  if (!location?.nuit?.length || state.flags[NIGHT_FLAG]) return null;
  const rng = rngFor('nuit', state.time.day, location.id, heroKey(state.character));
  if (rng() >= NIGHT_ATTACK_CHANCE) return null;
  return [...location.nuit[Math.floor(rng() * location.nuit.length)]];
}

/**
 * One night outside a day: who woke from one today and lies down again before the evening waits for the day to pass.
 * Returns what is told of it.
 */
function waitForTheEvening(state: GameState): string {
  if (state.reposLibre !== state.time.day || state.time.phase >= EVENING) return '';
  waitUntil(state.time, 'soir');
  return 'Tu as déjà dormi dehors cette nuit : la journée passe à attendre le soir. ';
}

/** The night falls on the hero lying there, and something comes: the moment is the night. Returns the notice. */
export function beginNightAttack(state: GameState): string {
  const wait = waitForTheEvening(state);
  waitUntil(state.time, 'nuit');
  state.flags[NIGHT_FLAG] = true;
  state.expirations = { ...state.expirations, [NIGHT_FLAG]: state.time.day };
  return `${wait}Tu t’allonges à même le sol, loin de tout mur. Au cœur de la nuit, un bruit te réveille : on vient.`;
}

/** Experience for the beasts of the night: half of what they are worth, like those of the road. */
export function nightXp(enemyIds: string[]): number {
  return Math.round(enemyIds.reduce((sum, id) => sum + (findEnemy(id)?.xp ?? 0), 0) / 2);
}

/** The PV a night outside raises to: half the maximum, or what one has if it is more. */
const restedHp = (hp: number, max: number): number => Math.max(hp, Math.min(max, Math.ceil(max * REST_SHARE)));

/**
 * A free night where one stands: the morning, the PV of the hero and the companions raised to half, never more.
 * Returns the notice.
 */
export function restUntilMorning(state: GameState): string {
  const wait = waitForTheEvening(state);
  sleepUntil(state.time, 'matin');
  state.reposLibre = state.time.day;
  let healed = 0;
  const hero = state.character;
  if (hero) {
    const before = hero.hp;
    hero.hp = restedHp(hero.hp, characterStats(hero).maxHp);
    healed = hero.hp - before;
  }
  for (const m of state.groupe) m.hp = restedHp(m.hp, findCompanion(m.id)?.hp ?? m.hp);
  fadeSouvenirs(state.flags);
  const pv = healed > 0 ? ` : +${healed} PV` : '';
  return `${wait}Tu dors mal, d’un œil, sans toit ni lit${pv}. Le jour se lève. Nous sommes ${formatDate(state.time)}. Le sol ne rend pas plus de la moitié des forces : une auberge t’aurait tout rendu.`;
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
