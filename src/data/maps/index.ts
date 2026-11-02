import type { TiledMapJson } from '../../engine/tiledMap';
import gardeboisJson from './gardebois.json';
import gareEngloutieJson from './gare-engloutie.json';
import aubergeRacineJson from './auberge-racine.json';
import maisonIlyaneJson from './maison-ilyane.json';
import maisonLunelierreJson from './maison-lunelierre.json';
import reserveCendreferJson from './reserve-cendrefer.json';
import canopeeNacelleJson from './canopee-nacelle.json';
import canopeeRamuresJson from './canopee-ramures.json';
import canopeeAieuxJson from './canopee-aieux.json';
import canopeeAubergeJson from './canopee-auberge.json';
import canopeeComptoirJson from './canopee-comptoir.json';
import canopeeConseilJson from './canopee-conseil.json';
import canopeeFeuilleventJson from './canopee-feuillevent.json';
import canopeeAtelierJson from './canopee-atelier.json';
import canopeeGrenierJson from './canopee-grenier.json';
import canopeeRelaisJson from './canopee-relais.json';
import solRacinesJson from './sol-racines.json';
import rencontreClairiereJson from './rencontre-clairiere.json';
import rencontreRouteJson from './rencontre-route.json';
import rencontreRuinesJson from './rencontre-ruines.json';

/** Tiled maps by id (`map` of src/data/locations.json). */
export const MAPS: Record<string, TiledMapJson> = {
  gardebois: gardeboisJson as TiledMapJson,
  'gare-engloutie': gareEngloutieJson as TiledMapJson,
  'maison-ilyane': maisonIlyaneJson as TiledMapJson,
  'auberge-racine': aubergeRacineJson as TiledMapJson,
  'maison-lunelierre': maisonLunelierreJson as TiledMapJson,
  'reserve-cendrefer': reserveCendreferJson as TiledMapJson,
  'canopee-nacelle': canopeeNacelleJson as TiledMapJson,
  'canopee-ramures': canopeeRamuresJson as TiledMapJson,
  'canopee-aieux': canopeeAieuxJson as TiledMapJson,
  'canopee-auberge': canopeeAubergeJson as TiledMapJson,
  'canopee-comptoir': canopeeComptoirJson as TiledMapJson,
  'canopee-conseil': canopeeConseilJson as TiledMapJson,
  'canopee-feuillevent': canopeeFeuilleventJson as TiledMapJson,
  'canopee-atelier': canopeeAtelierJson as TiledMapJson,
  'canopee-grenier': canopeeGrenierJson as TiledMapJson,
  'canopee-relais': canopeeRelaisJson as TiledMapJson,
  'sol-racines': solRacinesJson as TiledMapJson,
  'rencontre-clairiere': rencontreClairiereJson as TiledMapJson,
  'rencontre-route': rencontreRouteJson as TiledMapJson,
  'rencontre-ruines': rencontreRuinesJson as TiledMapJson,
};
