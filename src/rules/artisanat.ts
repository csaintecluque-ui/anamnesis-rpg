import recetteData from '../data/recettes.json';
import type { GameState } from '../state/gameState';
import type { Slot } from './character';
import { SLOTS } from './character';
import { applyEffects, type Effect } from './dialogue';
import { equip, findItem, ownedCount } from './inventory';

/**
 * L'artisanat (docs/gdd/artisanat.md, jalon 3, étape 7) : la forge de l'atelier Cendrefer à Ironheart (Hedda) améliore
 * les armes et les armures ; les herbes du Comptoir de la Sève à Canopéa (Sévane) font des remèdes. Les matières viennent
 * du butin des bêtes ; chaque recette coûte aussi quelques Fers.
 */
export interface Recette {
  id: string;
  /** « forge » or « herbes ». */
  atelier: string;
  produit: { item: string; count?: number };
  ingredients: { item: string; count: number }[];
  fers: number;
  /** What it brings, in a few words. */
  texte: string;
}

export const RECETTES = recetteData as Recette[];

/** The two workshops, and who keeps them. */
export const ATELIERS: Record<string, { nom: string; hote: string; verbe: string }> = {
  forge: { nom: 'La forge de l’atelier Cendrefer', hote: 'hedda', verbe: 'Forger' },
  herbes: { nom: 'Les herbes du Comptoir de la Sève', hote: 'sevane', verbe: 'Préparer' },
};

export const recettesOf = (atelier: string): Recette[] => RECETTES.filter((r) => r.atelier === atelier);

/** What is still missing to make it: « 1 Crocs de Loup de Rouille de plus », « 12 Fers de plus ». Empty when ready. */
export function missing(state: Pick<GameState, 'character'>, r: Recette): string[] {
  const c = state.character;
  if (!c) return ['un personnage'];
  const lacks = r.ingredients
    .filter((i) => ownedCount(c, i.item) < i.count)
    .map((i) => `${i.count - ownedCount(c, i.item)} ${findItem(i.item)?.name ?? i.item}`);
  if (c.fers < r.fers) lacks.push(`${r.fers - c.fers} Fers`);
  return lacks;
}

/**
 * Makes it: the materials and the Fers go, the thing comes. An armour or a weapon worn when improved is worn again,
 * improved, in the same place.
 */
export function craft(state: GameState, r: Recette): string[] {
  const c = state.character;
  if (!c || missing(state, r).length) return [];
  const worn: Slot | undefined = SLOTS.find((slot) => r.ingredients.some((i) => c.equipment[slot] === i.item));
  const effects: Effect[] = [
    ...r.ingredients.map((i): Effect => ({ takeItem: i.item, count: i.count })),
    { giveFers: -r.fers },
    { giveItem: r.produit.item, count: r.produit.count ?? 1 },
  ];
  const notices = applyEffects(state, effects);
  if (worn) equip(c, r.produit.item, worn);
  return notices;
}
