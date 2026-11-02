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
}

export const FIGURANTS = figurantData as FigurantDef[];

export function figurantsAt(location: string): FigurantDef[] {
  return FIGURANTS.filter((f) => f.location === location);
}

export const isStanding = (f: FigurantDef): boolean => f.path.length === 1;
