import type { Character } from './character';
import { WEAR_DULL, WEAR_WORN, wearPenalty } from './character';
import { findItem } from './inventory';

/**
 * L'usure (feuille de route, chantier 6 : « des dépenses qui reviennent ») : les armes et l'armure s'émoussent au fil
 * des combats, et se réparent chez un marchand ; le cristal se fatigue à force de lancers, et se réaccorde chez la
 * tailleuse (contre des Fers) ou chez Vanel (contre une nuit au Bosquet). docs/gdd/economie.md.
 */

/** Casts after which the worn crystal loses a Point de Résonance (and so on). */
export const CAST_WEAR = 6;
/** A repair costs the item's price × its fights ÷ this. */
export const REPAIR_DIVISOR = 40;
/** What a crystal costs to tune at the tailleuse's. */
export const TUNE_PRICE = 20;

const UNWORN = 'mains-nues';

export function wearOf(c: Pick<Character, 'usure'>, itemId: string): number {
  return c.usure?.[itemId] ?? 0;
}

/** After a fight: each weapon in hand and the armour wear by one; says when one gets dulled or worn. */
export function wearEquipment(c: Character): string[] {
  const notices: string[] = [];
  const worn = [...new Set([c.equipment.mainDroite, c.equipment.mainGauche, c.equipment.armure])].filter((id): id is string => !!id && id !== UNWORN);
  for (const id of worn) {
    const before = wearPenalty(c, id);
    c.usure = { ...c.usure, [id]: Math.min(WEAR_WORN, wearOf(c, id) + 1) };
    const after = wearPenalty(c, id);
    if (after > before) {
      const item = findItem(id);
      const what = item?.slot === 'armure' ? 'en Défense' : 'au toucher';
      notices.push(`${item?.name ?? id} ${after === 2 ? 'est abîmé·e' : 's’émousse'} (−${after} ${what}) : fais-le réparer`);
    }
  }
  return notices;
}

/** What it costs to set an item right again; 0 when it has not worn. */
export function repairCost(c: Pick<Character, 'usure'>, itemId: string): number {
  const wear = wearOf(c, itemId);
  return wear > 0 ? Math.max(1, Math.ceil(((findItem(itemId)?.price ?? 0) * wear) / REPAIR_DIVISOR)) : 0;
}

/** Pays the repair and sets the item right; false when there is nothing to repair or not enough Fers. */
export function repair(c: Character, itemId: string): boolean {
  const cost = repairCost(c, itemId);
  if (cost === 0 || c.fers < cost) return false;
  c.fers -= cost;
  const usure = { ...c.usure };
  delete usure[itemId];
  c.usure = usure;
  return true;
}

/** The Points de Résonance a tired crystal takes off its maximum. */
export function crystalWear(c: Pick<Character, 'usureCristal'>): number {
  return Math.floor((c.usureCristal ?? 0) / CAST_WEAR);
}

export { WEAR_DULL, WEAR_WORN };
