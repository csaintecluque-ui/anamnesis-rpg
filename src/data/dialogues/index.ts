import type { Dialogue } from '../../rules/dialogue';
import caisseProspection from './caisse-prospection.json';
import echoDernierTrain from './echo-dernier-train.json';
import ilyane from './ilyane.json';
import ingrid from './ingrid.json';
import tobias from './tobias.json';

/** Dialogue files by object name (PNJ or Écho) of the maps. */
export const DIALOGUES: Record<string, Dialogue> = {
  ilyane: ilyane as Dialogue,
  tobias: tobias as Dialogue,
  ingrid: ingrid as Dialogue,
  'echo-dernier-train': echoDernierTrain as Dialogue,
  'caisse-prospection': caisseProspection as Dialogue,
};
