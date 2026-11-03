import recetteData from '../data/recettes.json';
import type { GameState } from '../state/gameState';
import type { SkillId } from './attributes';
import type { Slot } from './character';
import { SLOTS } from './character';
import { applyEffects, skillScore, type Effect } from './dialogue';
import { equip, findItem, ownedCount } from './inventory';

/**
 * L'artisanat (docs/gdd/artisanat.md, jalon 3, étape 7) : la forge de l'atelier Cendrefer à Ironheart (Ragna) améliore
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
  /**
   * The skill it asks to make it oneself (feuille de route, chantier 2) : Artisanat at the forge, Médecine at the herbs.
   * Without it, the keeper does the work, for twice the Fers.
   */
  competence: { skill: SkillId; min: number };
  /** What it brings, in a few words. */
  texte: string;
}

export const RECETTES = recetteData as Recette[];

/** The two workshops, who keeps them, and the button: to make it oneself, or to have the keeper make it. */
export const ATELIERS: Record<string, { nom: string; hote: string; hoteNom: string; verbe: string; faireFaire: string }> = {
  forge: { nom: 'La forge de l’atelier Cendrefer', hote: 'hedda', hoteNom: 'Ragna', verbe: 'Forger', faireFaire: 'Faire forger' },
  herbes: { nom: 'Les herbes du Comptoir de la Sève', hote: 'sevane', hoteNom: 'Sévane', verbe: 'Préparer', faireFaire: 'Faire préparer' },
};

/** The keeper's work, when the hero lacks the skill: the recipe's Fers once more. */
export const KEEPER_FEE_FACTOR = 2;

/** Whether the hero has the skill to make it with their own hands. */
export function canMakeOneself(state: Pick<GameState, 'character'>, r: Recette): boolean {
  return skillScore(state, r.competence.skill) >= r.competence.min;
}

/** What it costs in Fers: the recipe's, or twice as much when the keeper does the work. */
export function costOf(state: Pick<GameState, 'character'>, r: Recette): number {
  return canMakeOneself(state, r) ? r.fers : KEEPER_FEE_FACTOR * r.fers;
}

export const recettesOf = (atelier: string): Recette[] => RECETTES.filter((r) => r.atelier === atelier);

/** What is still missing to make it: « 1 Crocs de Loup de Rouille de plus », « 12 Fers de plus ». Empty when ready. */
export function missing(state: Pick<GameState, 'character'>, r: Recette): string[] {
  const c = state.character;
  if (!c) return ['un personnage'];
  const lacks = r.ingredients
    .filter((i) => ownedCount(c, i.item) < i.count)
    .map((i) => `${i.count - ownedCount(c, i.item)} ${findItem(i.item)?.name ?? i.item}`);
  const fers = costOf(state, r);
  if (c.fers < fers) lacks.push(`${fers - c.fers} Fers`);
  return lacks;
}

/**
 * Makes it: the materials and the Fers go (twice the Fers when the keeper does the work), the thing comes. An armour or
 * a weapon worn when improved is worn again, improved, in the same place.
 */
export function craft(state: GameState, r: Recette): string[] {
  const c = state.character;
  if (!c || missing(state, r).length) return [];
  const worn: Slot | undefined = SLOTS.find((slot) => r.ingredients.some((i) => c.equipment[slot] === i.item));
  const effects: Effect[] = [
    ...r.ingredients.map((i): Effect => ({ takeItem: i.item, count: i.count })),
    { giveFers: -costOf(state, r) },
    { giveItem: r.produit.item, count: r.produit.count ?? 1 },
  ];
  const notices = applyEffects(state, effects);
  if (worn) equip(c, r.produit.item, worn);
  return notices;
}
