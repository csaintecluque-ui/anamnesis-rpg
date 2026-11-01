import type { TiledMapJson } from '../../engine/tiledMap';
import gardeboisJson from './gardebois.json';
import gareEngloutieJson from './gare-engloutie.json';
import aubergeRacineJson from './auberge-racine.json';
import maisonIlyaneJson from './maison-ilyane.json';
import maisonLunelierreJson from './maison-lunelierre.json';
import reserveCendreferJson from './reserve-cendrefer.json';

/** Tiled maps by id (`map` of src/data/locations.json). */
export const MAPS: Record<string, TiledMapJson> = {
  gardebois: gardeboisJson as TiledMapJson,
  'gare-engloutie': gareEngloutieJson as TiledMapJson,
  'maison-ilyane': maisonIlyaneJson as TiledMapJson,
  'auberge-racine': aubergeRacineJson as TiledMapJson,
  'maison-lunelierre': maisonLunelierreJson as TiledMapJson,
  'reserve-cendrefer': reserveCendreferJson as TiledMapJson,
};
