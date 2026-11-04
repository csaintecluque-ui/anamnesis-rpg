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
  /**
   * Lines that follow the story: the last reaction whose condition holds replaces `lines` (docs/gdd/figurants.md).
   * A condition is a quest (`quest` + `status`, done by default) and/or a story flag.
   */
  reactions?: FigurantReaction[];
  /** Painted walk sheet (public/, 8 directions × 64 × 96 frames, npm run walk); without it, the tile hops along. */
  walk?: string;
}

export interface FigurantReaction {
  quest?: string;
  status?: 'active' | 'done';
  flag?: string;
  lines: string[];
}

export const FIGURANTS = figurantData as FigurantDef[];

/** What they say now: the story's latest echo in their mouth, or their usual lines. */
export function figurantLines(
  def: Pick<FigurantDef, 'lines' | 'reactions'>,
  state: { flags: Record<string, true>; quests: Record<string, 'active' | 'done'> },
): string[] {
  const holds = (r: FigurantReaction) =>
    (!r.quest || state.quests[r.quest] === (r.status ?? 'done')) && (!r.flag || !!state.flags[r.flag]);
  return [...(def.reactions ?? [])].reverse().find(holds)?.lines ?? def.lines;
}

export function figurantsAt(location: string): FigurantDef[] {
  return FIGURANTS.filter((f) => f.location === location);
}

export const isStanding = (f: FigurantDef): boolean => f.path.length === 1;

/** Texture key of a figurant's walk sheet (loaded by BootScene). */
export const walkSheetKey = (f: FigurantDef): string => `marche-figurant-${f.id}`;
