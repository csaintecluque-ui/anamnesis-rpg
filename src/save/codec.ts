import { characterError, DEFAULT_AVATAR, RESONANCE_BASE, STARTING_FERS, STARTING_WEAPON } from '../rules/character';
import { findPlace, findRencontre } from '../rules/world';
import { findLocation, type GameState } from '../state/gameState';
import { START_TIME, isGameTime } from '../rules/time';
import { findCompanion } from '../rules/companions';

export const SAVE_VERSION = 12;
export const SAVE_MAX_CHARS = 1_000_000;
const GAME_MARKER = 'anamnesis';

export interface SaveFile {
  game: typeof GAME_MARKER;
  version: number;
  savedAt: string;
  state: GameState;
}

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

const ok = <T>(value: T): Result<T> => ({ ok: true, value });
const fail = <T>(error: string): Result<T> => ({ ok: false, error });

/** Upgrades an older save one version at a time; key = version being upgraded from. */
const MIGRATIONS: Record<number, (save: Record<string, unknown>) => Record<string, unknown>> = {
  // v1 predates character creation: the player creates one on load, then resumes where they were.
  1: (save) => ({ ...save, state: isRecord(save.state) ? { ...save.state, character: null } : save.state }),
  // v2 saves lived on the temporary test ground, now replaced by Gardebois: resume at its entrance.
  2: (save) => {
    if (!isRecord(save.state)) return save;
    const fromTestGround = save.state.location === 'iso-test';
    return {
      ...save,
      state: {
        ...save.state,
        location: fromTestGround ? 'gardebois' : save.state.location,
        position: fromTestGround ? { col: 0, row: 0 } : save.state.position,
        entrance: fromTestGround ? 'entree' : null,
      },
    };
  },
  // v3 predates dialogues: no story flags or quests yet.
  3: (save) => ({ ...save, state: isRecord(save.state) ? { ...save.state, flags: {}, quests: {} } : save.state }),
  // v4 predates Récits (docs/gdd/memoire.md, piste B): no character predates this field, so an empty list.
  4: (save) => {
    if (!isRecord(save.state)) return save;
    const character = isRecord(save.state.character) ? { ...save.state.character, recits: [] } : save.state.character;
    return { ...save, state: { ...save.state, character } };
  },
  // v5 predates the inventory (docs/gdd/inventaire.md): starting funds, nothing carried or equipped.
  5: (save) => {
    if (!isRecord(save.state)) return save;
    const character = isRecord(save.state.character)
      ? { ...save.state.character, fers: STARTING_FERS, inventory: [], equipment: { mainGauche: null, mainDroite: null, armure: null } }
      : save.state.character;
    return { ...save, state: { ...save.state, character } };
  },
  // v6 fought with a free sword and bow; weapons now come from the hands (docs/gdd/combat.md). A hero with
  // empty hands gets the starting dagger, in the right hand, like a new character.
  6: (save) => {
    if (!isRecord(save.state) || !isRecord(save.state.character)) return save;
    const c = save.state.character;
    const equipment = isRecord(c.equipment) ? c.equipment : {};
    if (equipment.mainDroite || equipment.mainGauche || !Array.isArray(c.inventory)) return save;
    const inventory = c.inventory as { itemId: string; count: number }[];
    const owned = inventory.some((s) => s.itemId === STARTING_WEAPON);
    const character = {
      ...c,
      inventory: owned ? inventory : [...inventory, { itemId: STARTING_WEAPON, count: 1 }],
      equipment: { ...equipment, mainDroite: STARTING_WEAPON },
    };
    return { ...save, state: { ...save.state, character } };
  },
  // v7 predates the choice of look (docs/gdd/jalon-2.md): the hero keeps the look of the first version.
  7: (save) => {
    if (!isRecord(save.state) || !isRecord(save.state.character)) return save;
    return { ...save, state: { ...save.state, character: { ...save.state.character, avatar: DEFAULT_AVATAR } } };
  },
  // v8 predates the world map and its random encounters (docs/gdd/carte-du-monde.md): none under way.
  8: (save) => ({ ...save, state: isRecord(save.state) ? { ...save.state, encounter: null } : save.state }),
  // v9 predates the time of day (docs/gdd/temps.md): the first morning.
  9: (save) => ({ ...save, state: isRecord(save.state) ? { ...save.state, time: { ...START_TIME } } : save.state }),
  // v10 predates the magic (docs/gdd/magie.md): Résonance at rank 0, its Points de Résonance full, no crystal worn.
  10: (save) => {
    if (!isRecord(save.state) || !isRecord(save.state.character)) return save;
    const c = save.state.character;
    const character = {
      ...c,
      skills: { ...(isRecord(c.skills) ? c.skills : {}), resonance: 0 },
      equipment: { ...(isRecord(c.equipment) ? c.equipment : {}), cristal: null },
      resonance: RESONANCE_BASE,
    };
    return { ...save, state: { ...save.state, character } };
  },
  // v11 predates the bestiary and the companions (docs/gdd/jalon-3.md): nothing met, nobody along.
  11: (save) => ({ ...save, state: isRecord(save.state) ? { ...save.state, bestiaire: {}, groupe: [] } : save.state }),
};

export function createSave(state: GameState, now: Date): SaveFile {
  return { game: GAME_MARKER, version: SAVE_VERSION, savedAt: now.toISOString(), state: structuredClone(state) };
}

export function serializeSave(save: SaveFile): string {
  return JSON.stringify(save, null, 2);
}

export function parseSave(text: string): Result<SaveFile> {
  if (text.length > SAVE_MAX_CHARS) return fail('Ce fichier est trop gros pour être une sauvegarde.');

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return fail('Ce fichier n’est pas une sauvegarde lisible.');
  }
  if (!isRecord(raw) || raw.game !== GAME_MARKER) return fail('Ce fichier n’est pas une sauvegarde d’Anamnesis.');
  if (!Number.isInteger(raw.version) || (raw.version as number) < 1) return fail('Version de sauvegarde inconnue.');
  if ((raw.version as number) > SAVE_VERSION) {
    return fail('Cette sauvegarde vient d’une version plus récente du jeu : mets le jeu à jour.');
  }

  let save: Record<string, unknown> = raw;
  for (let v = raw.version as number; v < SAVE_VERSION; v++) {
    const migrate = MIGRATIONS[v];
    if (!migrate) return fail('Cette sauvegarde est trop ancienne pour être reprise.');
    save = { ...migrate(save), version: v + 1 };
  }

  if (typeof save.savedAt !== 'string' || Number.isNaN(Date.parse(save.savedAt))) {
    return fail('La date de la sauvegarde est invalide.');
  }
  const stateError = validateState(save.state);
  if (stateError) return fail(`Sauvegarde abîmée : ${stateError}`);

  return ok(save as unknown as SaveFile);
}

function validateState(state: unknown): string | null {
  if (!isRecord(state)) return 'état de jeu absent.';
  if (typeof state.location !== 'string' || !findLocation(state.location)) return 'lieu inconnu.';
  const pos = state.position;
  if (!isRecord(pos) || !Number.isInteger(pos.col) || !Number.isInteger(pos.row)) return 'position invalide.';
  if (state.entrance !== null && typeof state.entrance !== 'string') return 'point d’arrivée invalide.';
  if (typeof state.playTimeSeconds !== 'number' || !(state.playTimeSeconds >= 0)) return 'temps de jeu invalide.';
  if (!isRecord(state.flags) || Object.values(state.flags).some((v) => v !== true)) return 'repères d’histoire invalides.';
  if (!isRecord(state.quests) || Object.values(state.quests).some((v) => v !== 'active' && v !== 'done')) {
    return 'quêtes invalides.';
  }
  if (state.encounter !== null && !isEncounter(state.encounter)) return 'rencontre invalide.';
  if (!isGameTime(state.time)) return 'heure du jour invalide.';
  if (!isRecord(state.bestiaire) || Object.values(state.bestiaire).some((v) => !Number.isInteger(v) || (v as number) < 0)) {
    return 'bestiaire invalide.';
  }
  if (
    !Array.isArray(state.groupe) ||
    state.groupe.some((m) => !isRecord(m) || typeof m.id !== 'string' || !findCompanion(m.id) || !Number.isInteger(m.hp) || (m.hp as number) < 1)
  ) {
    return 'compagnons invalides.';
  }
  if (state.character !== null) return characterError(state.character);
  return null;
}

function isEncounter(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    !!findRencontre(value.id) &&
    Number.isFinite(value.x) &&
    Number.isFinite(value.y) &&
    (value.destination === null || (typeof value.destination === 'string' && !!findPlace(value.destination)))
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** e.g. anamnesis-emplacement-1-2026-11-01-1432.json (local time). */
export function exportFileName(slotFileTag: string, date: Date): string {
  const stamp = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}`;
  return `anamnesis-${slotFileTag}-${stamp}.json`;
}

export function formatPlayTime(seconds: number): string {
  const totalMinutes = Math.floor(seconds / 60);
  return `${Math.floor(totalMinutes / 60)} h ${pad(totalMinutes % 60)}`;
}
