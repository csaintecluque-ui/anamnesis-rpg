import figurantData from '../data/figurants.json';

/**
 * Passers-by and townsfolk « de remplissage » (docs/gdd/figurants.md): no quest, one or two lines each. They walk a
 * loop of waypoints (or stand still when the path has a single cell); a tap makes them stop and say a line in a
 * speech bubble. Walking ones never block the hero; standing ones do, like NPCs.
 */
export interface FigurantDef {
  id: string;
  location: string;
  name: string;
  /** Tile drawn for them (scripts/tiles-def.mjs). */
  tile: string;
  /** Waypoints [col, row], walked in a loop; a single one: they stay there. */
  path: [number, number][];
  lines: string[];
  /** Step duration multiplier: below 1 hurries (children), above 1 dawdles. */
  pace?: number;
  /**
   * A dialogue (src/data/dialogues/) opened instead of the bubble while one of its conditional entries holds; its
   * last, unconditional entry means « nothing to say »: back to the bubble (the commis of « La caravane de midi »).
   */
  dialogue?: string;
  /** Painted walk sheet (public/, 8 directions × 64 × 96 frames, npm run walk); without it, the tile hops along. */
  walk?: string;
}

export const FIGURANTS = figurantData as FigurantDef[];

export function figurantsAt(location: string): FigurantDef[] {
  return FIGURANTS.filter((f) => f.location === location);
}

export const isStanding = (f: FigurantDef): boolean => f.path.length === 1;

/** Texture key of a figurant's walk sheet (loaded by BootScene). */
export const walkSheetKey = (f: FigurantDef): string => `marche-figurant-${f.id}`;
