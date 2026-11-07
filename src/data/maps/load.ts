import type { TiledMapJson } from '../../engine/tiledMap';

/**
 * Les cartes chargées ville par ville (test du 2026-11-06 : 11,4 Mo de code au démarrage). Each map is fetched when
 * the hero first walks into it (the build groups them by town: one map of Coralia brings the others), and kept. The
 * game never imports `./index.ts`, which holds them all at once: that one is for the tests.
 */
const LOADERS = import.meta.glob<TiledMapJson>('./*.json', { import: 'default' });
const idOf = (path: string): string => path.slice(2, -'.json'.length);
const PATHS = new Map(Object.keys(LOADERS).map((path) => [idOf(path), path]));
const cache = new Map<string, TiledMapJson>();

export const MAP_IDS: string[] = [...PATHS.keys()];

/** A map already fetched, or undefined. */
export function cachedMap(id: string): TiledMapJson | undefined {
  return cache.get(id);
}

/** Fetches a map (once). Rejects for a map that does not exist. */
export async function loadMap(id: string): Promise<TiledMapJson> {
  const known = cache.get(id);
  if (known) return known;
  const path = PATHS.get(id);
  if (!path) throw new Error(`Carte inconnue : ${id}`);
  const json = await LOADERS[path]();
  cache.set(id, json);
  return json;
}

/** Every map (the developer's panel, to list the flags the maps wait for). */
export async function loadAllMaps(): Promise<TiledMapJson[]> {
  return Promise.all(MAP_IDS.map(loadMap));
}

/** The maps fetched so far. */
export function cachedMaps(): TiledMapJson[] {
  return [...cache.values()];
}
