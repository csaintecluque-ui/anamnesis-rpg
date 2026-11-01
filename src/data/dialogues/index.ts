import type { Dialogue } from '../../rules/dialogue';
import brann from './brann.json';
import caisseEgaree from './caisse-egaree.json';
import caisseProspection from './caisse-prospection.json';
import carnetsIlyane from './carnets-ilyane.json';
import cristalVeille from './cristal-veille.json';
import echoBerceuse from './echo-berceuse.json';
import echoDernierTrain from './echo-dernier-train.json';
import foreuse from './foreuse.json';
import ilyane from './ilyane.json';
import ingrid from './ingrid.json';
import liane from './liane.json';
import maelis from './maelis.json';
import nell from './nell.json';
import rocherSauge from './rocher-sauge.json';
import sauge1 from './sauge-1.json';
import sauge2 from './sauge-2.json';
import sylvan from './sylvan.json';
import tobias from './tobias.json';

/** Dialogue files by object name (PNJ, Écho or object) of the maps. */
export const DIALOGUES: Record<string, Dialogue> = {
  ilyane: ilyane as Dialogue,
  tobias: tobias as Dialogue,
  ingrid: ingrid as Dialogue,
  'echo-dernier-train': echoDernierTrain as Dialogue,
  'caisse-prospection': caisseProspection as Dialogue,
  foreuse: foreuse as Dialogue,
  brann: brann as Dialogue,
  'caisse-egaree': caisseEgaree as Dialogue,
  'carnets-ilyane': carnetsIlyane as Dialogue,
  'cristal-veille': cristalVeille as Dialogue,
  'echo-berceuse': echoBerceuse as Dialogue,
  liane: liane as Dialogue,
  maelis: maelis as Dialogue,
  nell: nell as Dialogue,
  'rocher-sauge': rocherSauge as Dialogue,
  'sauge-1': sauge1 as Dialogue,
  'sauge-2': sauge2 as Dialogue,
  sylvan: sylvan as Dialogue,
};
