import echoData from '../data/echos.json';
import type { MapObject } from '../engine/tiledMap';
import type { GameState } from '../state/gameState';
import type { Dialogue, DialogueOption, Effect } from './dialogue';
import { advance, isNight, momentOf, type Moment } from './time';
import { SKILLS, type SkillId } from './attributes';

/**
 * Le Livre des Échos (docs/gdd/echos.md, jalon 3, étape 3) : des Échos cachés dans les lieux, certains la nuit
 * seulement, qu'on recueille en les écoutant jusqu'au bout. Canon [E2] : quatre types (silencieux, complets,
 * interactifs, maudits), et un danger : l'addiction à revivre le passé — ici l'« emprise ».
 */
export type EchoType = 'silencieux' | 'complet' | 'interactif' | 'maudit';

export interface EchoDef {
  id: string;
  titre: string;
  /** Location id (src/data/locations.json) and cell where the Écho stands. */
  lieu: string;
  col: number;
  row: number;
  /** When it shows: a moment of the day, « jour » (any but the night), or always. */
  moment?: Moment | 'jour';
  type: EchoType;
  texte: string;
  /** A Récit learned when the Écho is gathered. */
  recit?: string;
  xp: number;
  /** The skill a reliving sharpens until the next sleep (« souvenir vif », feuille de route, chantier 1). */
  don: SkillId;
  /** Hidden to a hero whose Mémoire is lower (4 or 5). */
  memoire?: number;
}

/** What a reliving gives to the Écho's skill, until the next sleep; and what it costs in emprise. */
export const SOUVENIR_BONUS = 3;
export const EMPRISE_PAR_REVIE = 2;
const SOUVENIR_PREFIX = 'souvenir-';
export const souvenirFlag = (skill: SkillId): string => `${SOUVENIR_PREFIX}${skill}`;

/** The bonus of a « souvenir vif » to rolls of this skill, if one is fresh. */
export function souvenirBonus(state: Pick<GameState, 'flags'>, skill: SkillId): number {
  return state.flags[souvenirFlag(skill)] ? SOUVENIR_BONUS : 0;
}

/** A night's sleep: the « souvenir vif » fades. */
export function fadeSouvenirs(flags: Record<string, true>): void {
  for (const key of Object.keys(flags)) if (key.startsWith(SOUVENIR_PREFIX)) delete flags[key];
}

export const ECHOS = echoData as EchoDef[];
export const EMPRISE_MAX = 10;
/** PV lost when a cursed Écho holds on. */
export const ECHO_MAUDIT_PV = 8;
export const TYPE_LABELS: Record<EchoType, string> = {
  silencieux: 'Écho silencieux',
  complet: 'Écho complet',
  interactif: 'Écho interactif',
  maudit: 'Écho maudit',
};

export const echoFlag = (id: string): string => `echo-recueilli-${id}`;
export const echoDialogueId = (id: string): string => `echo-${id}`;

/** Is it the Écho's moment? */
export function echoShows(moment: string | undefined, state: Pick<GameState, 'time'>): boolean {
  if (!moment) return true;
  return moment === 'jour' ? !isNight(state.time) : momentOf(state.time) === moment;
}

/** The Échos of a place, as map objects drawn with the Écho's tile (MapScene adds them to the map). */
export function echoObjects(location: string, memoire = Infinity): MapObject[] {
  // Some Échos only show to a hero who remembers well (Mémoire 4 or 5, feuille de route, chantier 1).
  return ECHOS.filter((e) => e.lieu === location && memoire >= (e.memoire ?? 0)).map((e) => ({
    name: echoDialogueId(e.id),
    type: 'objet',
    col: e.col,
    row: e.row,
    properties: { tuile: 'echo', ...(e.moment ? { moment: e.moment } : {}), echo: e.id },
  }));
}

export function collectedEchos(state: Pick<GameState, 'flags'>): EchoDef[] {
  return ECHOS.filter((e) => state.flags[echoFlag(e.id)]);
}

/** The emprise weighs on every roll of the dice: −1 from 3, −2 from 5. */
export function empriseMalus(state: Pick<GameState, 'emprise'>): number {
  return state.emprise >= 5 ? 2 : state.emprise >= 3 ? 1 : 0;
}

/**
 * Reliving a gathered Écho (feuille de route, chantier 1): a « souvenir vif », +3 to the rolls of its skill until the
 * next sleep (one at a time) ; but a quarter of a day lost, and the emprise grows by 2, when a night eases it by 1.
 */
export function relive(state: GameState, id: string): string[] {
  const echo = ECHOS.find((e) => e.id === id);
  if (!echo || !state.flags[echoFlag(id)]) return [];
  state.emprise = Math.min(EMPRISE_MAX, state.emprise + EMPRISE_PAR_REVIE);
  advance(state.time, 1);
  fadeSouvenirs(state.flags);
  state.flags[souvenirFlag(echo.don)] = true;
  return [`Souvenir vif : +${SOUVENIR_BONUS} en ${skillLabel(echo.don)} jusqu’au prochain sommeil`, `Emprise des Échos : ${state.emprise}`];
}

const skillLabel = (skill: SkillId): string => SKILLS.find((s) => s.id === skill)?.name ?? skill;

/** A night's sleep loosens the emprise a little. */
export function easeEmprise(state: GameState): void {
  state.emprise = Math.max(0, state.emprise - 1);
}

/** Where the emprise stands, for the Livre des Échos. */
export function empriseLabel(state: Pick<GameState, 'emprise'>): string {
  if (state.emprise >= 5) return 'Tu penses aux Échos sans cesse (−2 aux jets). Dors, et éloigne-toi d’eux.';
  if (state.emprise >= 3) return 'Les Échos t’appellent ; ta main tremble (−1 aux jets).';
  return 'Les Échos se taisent quand tu t’éloignes.';
}

/** One dialogue per Écho (src/data/dialogues/index.ts), built from src/data/echos.json. */
export function echoDialogues(): Record<string, Dialogue> {
  const out: Record<string, Dialogue> = {};
  for (const e of ECHOS) {
    const gather: Effect[] = [{ setFlag: echoFlag(e.id) }, { giveXp: e.xp }, ...(e.recit ? [{ learnRecit: e.recit }] : [])];
    const listen: DialogueOption =
      e.type === 'maudit'
        ? { text: 'Écouter jusqu’au bout.', roll: { skill: 'lore', difficulty: 12 }, effects: gather, next: 'recueilli', failNext: 'piege' }
        : { text: 'Écouter jusqu’au bout.', effects: gather, next: 'recueilli' };
    out[echoDialogueId(e.id)] = {
      id: echoDialogueId(e.id),
      speaker: echoDialogueId(e.id),
      entries: [{ requires: [{ flag: echoFlag(e.id) }], node: 'revivre' }, { node: 'scene' }],
      nodes: {
        scene: { text: e.texte, night: e.moment === 'nuit', options: [listen, { text: 'Partir.', next: 'fin' }] },
        recueilli: {
          text: 'L’Écho s’apaise sans disparaître. Tu le gardes : il rejoint ton Livre des Échos.',
          options: [{ text: 'Partir.', next: 'fin' }],
        },
        // A cursed Écho holds on when the roll fails (canon [E2] : « ils piègent les vivants »).
        ...(e.type === 'maudit'
          ? {
              piege: {
                text: 'La main ne lâche pas. Le froid te monte jusqu’à l’épaule, et la voûte de l’Écho craque au-dessus de toi.',
                effects: [{ blesser: ECHO_MAUDIT_PV }],
                options: [{ text: 'S’arracher à l’Écho.', effects: gather, next: 'recueilli' }],
              },
            }
          : {}),
        revivre: {
          text: `L’Écho « ${e.titre} » rejoue, pour toi seul·e. Il serait si facile de rester.`,
          night: e.moment === 'nuit',
          options: [
            {
              text: `Revivre encore (+${SOUVENIR_BONUS} en ${skillLabel(e.don)} jusqu’au sommeil ; emprise +${EMPRISE_PAR_REVIE}).`,
              effects: [{ revivre: e.id }, { avis: 'liane', delta: -1 }],
              next: 'revecu',
            },
            { text: 'Partir.', next: 'fin' },
          ],
        },
        revecu: {
          text: 'Tu restes. Le temps passe sans toi. Quand l’Écho se tait, tu as froid, et tu voudrais déjà recommencer.',
          options: [{ text: 'Partir.', next: 'fin' }],
        },
      },
    };
  }
  return out;
}
