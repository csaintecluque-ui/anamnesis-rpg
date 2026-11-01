import type { TiledMapJson } from '../../engine/tiledMap';
import gardeboisJson from './gardebois.json';
import gareEngloutieJson from './gare-engloutie.json';

/** Tiled maps by id (`map` of src/data/locations.json). */
export const MAPS: Record<string, TiledMapJson> = {
  gardebois: gardeboisJson as TiledMapJson,
  'gare-engloutie': gareEngloutieJson as TiledMapJson,
};
