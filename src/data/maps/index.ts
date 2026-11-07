import type { TiledMapJson } from '../../engine/tiledMap';

/**
 * Every map at once, for the tests (and the scripts that read them all). The game loads them town by town
 * (`./load.ts`): importing this file from the game would put all of them back in the first download.
 */
const FILES = import.meta.glob<TiledMapJson>('./*.json', { import: 'default', eager: true });

export const MAPS: Record<string, TiledMapJson> = Object.fromEntries(
  Object.entries(FILES).map(([path, json]) => [path.slice(2, -'.json'.length), json]),
);
