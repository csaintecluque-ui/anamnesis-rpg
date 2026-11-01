import type { Tile } from './iso';

const STRAIGHT = 10;
const DIAGONAL = 14;
const NEIGHBOURS: [number, number, number][] = [
  [1, 0, STRAIGHT],
  [-1, 0, STRAIGHT],
  [0, 1, STRAIGHT],
  [0, -1, STRAIGHT],
  [1, 1, DIAGONAL],
  [1, -1, DIAGONAL],
  [-1, 1, DIAGONAL],
  [-1, -1, DIAGONAL],
];

/**
 * A* on the tile grid, 8 directions. Diagonal steps may not cut a blocked corner.
 * Returns the tiles to walk through after `start`, ending on `goal`; [] if already there; null if unreachable.
 */
export function findPath(
  start: Tile,
  goal: Tile,
  walkable: (tile: Tile) => boolean,
  maxNodes = 5000,
): Tile[] | null {
  if (start.col === goal.col && start.row === goal.row) return [];
  if (!walkable(goal)) return null;

  const key = (t: Tile) => `${t.col},${t.row}`;
  const heuristic = (t: Tile) => {
    const dc = Math.abs(t.col - goal.col);
    const dr = Math.abs(t.row - goal.row);
    return STRAIGHT * (dc + dr) + (DIAGONAL - 2 * STRAIGHT) * Math.min(dc, dr);
  };

  const open: { tile: Tile; f: number }[] = [{ tile: start, f: heuristic(start) }];
  const cost = new Map<string, number>([[key(start), 0]]);
  const cameFrom = new Map<string, Tile>();
  let visited = 0;

  while (open.length > 0 && visited < maxNodes) {
    let best = 0;
    for (let i = 1; i < open.length; i++) if (open[i].f < open[best].f) best = i;
    const { tile: current } = open.splice(best, 1)[0];
    visited++;

    if (current.col === goal.col && current.row === goal.row) {
      const path: Tile[] = [];
      for (let t: Tile | undefined = current; t && key(t) !== key(start); t = cameFrom.get(key(t))) path.unshift(t);
      return path;
    }

    for (const [dc, dr, stepCost] of NEIGHBOURS) {
      const next = { col: current.col + dc, row: current.row + dr };
      if (!walkable(next)) continue;
      if (dc !== 0 && dr !== 0) {
        const sideA = { col: current.col + dc, row: current.row };
        const sideB = { col: current.col, row: current.row + dr };
        if (!walkable(sideA) || !walkable(sideB)) continue;
      }
      const nextCost = (cost.get(key(current)) ?? 0) + stepCost;
      if (nextCost < (cost.get(key(next)) ?? Infinity)) {
        cost.set(key(next), nextCost);
        cameFrom.set(key(next), current);
        open.push({ tile: next, f: nextCost + heuristic(next) });
      }
    }
  }
  return null;
}

/**
 * Every tile reachable from `start` in at most `maxSteps` steps (8 directions, no cutting a blocked corner), with
 * the shortest path in steps to it, as findPath returns them. Combat moves cost 1 PA per step, so this is exactly
 * where a fighter can go this turn. `start` itself is not included.
 */
export function reachable(start: Tile, maxSteps: number, walkable: (tile: Tile) => boolean): Map<string, Tile[]> {
  const key = (t: Tile) => `${t.col},${t.row}`;
  const paths = new Map<string, Tile[]>();
  let frontier: { tile: Tile; path: Tile[] }[] = [{ tile: start, path: [] }];
  const seen = new Set([key(start)]);
  for (let step = 0; step < maxSteps && frontier.length > 0; step++) {
    const next: { tile: Tile; path: Tile[] }[] = [];
    for (const { tile, path } of frontier) {
      for (const [dc, dr] of NEIGHBOURS) {
        const to = { col: tile.col + dc, row: tile.row + dr };
        if (seen.has(key(to)) || !walkable(to)) continue;
        if (dc !== 0 && dr !== 0 && (!walkable({ col: tile.col + dc, row: tile.row }) || !walkable({ col: tile.col, row: tile.row + dr }))) continue;
        seen.add(key(to));
        const toPath = [...path, to];
        paths.set(key(to), toPath);
        next.push({ tile: to, path: toPath });
      }
    }
    frontier = next;
  }
  return paths;
}
