import type { Tile } from './iso';

/** Subset of the Tiled JSON format (isometric) that the game reads. */
interface TiledProperty {
  name: string;
  type: string;
  value: unknown;
}

interface TiledLayer {
  name: string;
  type: 'tilelayer' | 'objectgroup';
  width?: number;
  height?: number;
  data?: number[];
  objects?: { name: string; type: string; x: number; y: number; properties?: TiledProperty[] }[];
}

export interface TiledMapJson {
  orientation: string;
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  layers: TiledLayer[];
  tilesets: { firstgid: number; tilecount: number; tiles?: { id: number; properties?: TiledProperty[] }[] }[];
}

export interface MapObject {
  name: string;
  type: string;
  col: number;
  row: number;
  properties: Record<string, string>;
}

export interface GameMap {
  width: number;
  height: number;
  /** Frame index (gid − 1) per cell, or −1 when empty. Row-major. */
  ground: number[];
  obstacles: number[];
  objects: MapObject[];
  blocked: boolean[];
  /** Défense bonus given by the obstacle on each cell (tileset property "couverture"), 0 for none. */
  cover: number[];
  /** Frame index by tile name (tileset property "nom"), e.g. frames.heros. */
  frames: Record<string, number>;
  /** Large decor drawn as one image over several cells (tileset property "grand"): frame index → tile name. */
  big: Record<number, string>;
}

export function parseTiledMap(json: TiledMapJson): GameMap {
  if (json.orientation !== 'isometric') throw new Error('Only isometric Tiled maps are supported');
  const { width, height } = json;
  const tileset = json.tilesets[0];
  if (!tileset || json.tilesets.length !== 1) throw new Error('Exactly one tileset is expected');

  const blockingIds = new Set(
    (tileset.tiles ?? [])
      .filter((t) => t.properties?.some((p) => p.name === 'bloquant' && p.value === true))
      .map((t) => t.id),
  );

  const layer = (name: string): number[] => {
    const l = json.layers.find((x) => x.name === name && x.type === 'tilelayer');
    if (!l?.data || l.data.length !== width * height) throw new Error(`Tile layer "${name}" missing or wrong size`);
    return l.data.map((gid) => {
      if (gid === 0) return -1;
      const id = gid - tileset.firstgid;
      if (id < 0 || id >= tileset.tilecount) throw new Error(`Unknown tile gid ${gid} in "${name}"`);
      return id;
    });
  };

  const ground = layer('sol');
  const obstacles = layer('obstacles');
  const objects: MapObject[] = (json.layers.find((l) => l.name === 'objets')?.objects ?? []).map((o) => ({
    name: o.name,
    type: o.type,
    // Isometric object positions are stored in tile-height units on both axes.
    col: Math.floor(o.x / json.tileheight),
    row: Math.floor(o.y / json.tileheight),
    properties: Object.fromEntries((o.properties ?? []).map((p) => [p.name, String(p.value)])),
  }));

  const blocked = ground.map(
    (id, i) => id === -1 || blockingIds.has(id) || (obstacles[i] !== -1 && blockingIds.has(obstacles[i])),
  );
  const coverById = new Map<number, number>();
  for (const t of tileset.tiles ?? []) {
    const value = t.properties?.find((p) => p.name === 'couverture')?.value;
    if (typeof value === 'number' && value > 0) coverById.set(t.id, value);
  }
  const cover = obstacles.map((id) => coverById.get(id) ?? 0);
  const frames: Record<string, number> = {};
  for (const t of tileset.tiles ?? []) {
    const name = t.properties?.find((p) => p.name === 'nom')?.value;
    if (typeof name === 'string') frames[name] = t.id;
  }
  const big: Record<number, string> = {};
  for (const t of tileset.tiles ?? []) {
    if (t.properties?.some((p) => p.name === 'grand' && p.value === true)) {
      const name = t.properties.find((p) => p.name === 'nom')?.value;
      if (typeof name === 'string') big[t.id] = name;
    }
  }
  return { width, height, ground, obstacles, objects, blocked, cover, frames, big };
}

/**
 * A large decor covers a block of cells holding the same tile; its image is drawn once, from the block's front
 * cell (the one with no same tile below-right or below-left of it), whose diamond bottom is the block's.
 */
export function isBigAnchor(map: GameMap, { col, row }: Tile): boolean {
  const frame = map.obstacles[row * map.width + col];
  const same = (c: number, r: number) => c < map.width && r < map.height && map.obstacles[r * map.width + c] === frame;
  return !same(col + 1, row) && !same(col, row + 1);
}

export function isWalkable(map: GameMap, { col, row }: Tile, occupied: ReadonlySet<string> = new Set()): boolean {
  if (col < 0 || row < 0 || col >= map.width || row >= map.height) return false;
  return !map.blocked[row * map.width + col] && !occupied.has(tileKey({ col, row }));
}

export function tileKey({ col, row }: Tile): string {
  return `${col},${row}`;
}

export function findObject(map: GameMap, name: string): MapObject | undefined {
  return map.objects.find((o) => o.name === name);
}
