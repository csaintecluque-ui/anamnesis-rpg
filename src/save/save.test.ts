import { describe, expect, it } from 'vitest';
import {
  changeAttribute,
  changeSkill,
  createDraft,
  finalizeCharacter,
  toggleOriginBonus,
  type Character,
  type CharacterDraft,
} from '../rules/character';
import { createNewGame, type GameState } from '../state/gameState';
import {
  SAVE_MAX_CHARS,
  SAVE_VERSION,
  createSave,
  exportFileName,
  formatPlayTime,
  parseSave,
  serializeSave,
} from './codec';
import { SAVE_KEY_PREFIX, SaveStore, type KeyValueStorage } from './store';

class MemoryStorage implements KeyValueStorage {
  readonly data = new Map<string, string>();
  failWrites = false;
  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    if (this.failWrites) throw new DOMException('quota', 'QuotaExceededError');
    this.data.set(key, value);
  }
  removeItem(key: string): void {
    this.data.delete(key);
  }
}

const NOW = new Date('2026-11-01T14:32:00Z');

function hero(): Character {
  let d: CharacterDraft = { ...createDraft(), name: 'Aube', feat: 'tough' };
  d = changeAttribute(changeAttribute(changeAttribute(d, 'memory', 1), 'memory', 1), 'presence', 1);
  d = toggleOriginBonus(toggleOriginBonus(d, 'body'), 'vigor');
  for (const id of ['lore', 'lore', 'lore', 'diplomacy', 'diplomacy', 'stealth'] as const) d = changeSkill(d, id, 1);
  return finalizeCharacter(d);
}

const state: GameState = {
  character: hero(),
  location: 'iso-test',
  position: { col: 4, row: 7 },
  playTimeSeconds: 3725,
};

describe('save codec', () => {
  it('round-trips a game state', () => {
    const parsed = parseSave(serializeSave(createSave(state, NOW)));
    expect(parsed).toEqual({
      ok: true,
      value: { game: 'anamnesis', version: SAVE_VERSION, savedAt: NOW.toISOString(), state },
    });
  });

  it('copies the state so later changes do not leak into the save', () => {
    const live = createNewGame();
    const save = createSave(live, NOW);
    live.position.col = 9;
    expect(save.state.position.col).toBe(0);
  });

  it.each([
    ['not JSON', '{oops', 'pas une sauvegarde lisible'],
    ['JSON from elsewhere', '{"hello": 1}', 'pas une sauvegarde d’Anamnesis'],
    ['an array', '[1, 2]', 'pas une sauvegarde d’Anamnesis'],
    ['a future version', JSON.stringify({ game: 'anamnesis', version: SAVE_VERSION + 1 }), 'version plus récente'],
    ['a bad version', JSON.stringify({ game: 'anamnesis', version: 'one' }), 'Version de sauvegarde inconnue'],
    ['a huge file', ' '.repeat(SAVE_MAX_CHARS + 1), 'trop gros'],
  ])('rejects %s with a clear French message', (_label, text, message) => {
    const parsed = parseSave(text);
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) expect(parsed.error).toContain(message);
  });

  it.each([
    ['an unknown location', { ...state, location: 'nulle-part' }, 'lieu inconnu'],
    ['a fractional position', { ...state, position: { col: 1.5, row: 0 } }, 'position invalide'],
    ['a negative play time', { ...state, playTimeSeconds: -1 }, 'temps de jeu invalide'],
    ['a missing state', undefined, 'état de jeu absent'],
  ])('rejects a save with %s', (_label, badState, message) => {
    const text = JSON.stringify({ game: 'anamnesis', version: SAVE_VERSION, savedAt: NOW.toISOString(), state: badState });
    const parsed = parseSave(text);
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) expect(parsed.error).toContain(message);
  });

  it('migrates a version 1 save (no character yet) without losing the position', () => {
    const v1 = JSON.stringify({
      game: 'anamnesis',
      version: 1,
      savedAt: NOW.toISOString(),
      state: { location: 'iso-test', position: { col: 2, row: 5 }, playTimeSeconds: 60 },
    });
    const parsed = parseSave(v1);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.value.version).toBe(SAVE_VERSION);
      expect(parsed.value.state).toEqual({ character: null, location: 'iso-test', position: { col: 2, row: 5 }, playTimeSeconds: 60 });
    }
  });

  it('rejects a version 2 save whose character is missing or broken', () => {
    const base = { game: 'anamnesis', version: SAVE_VERSION, savedAt: NOW.toISOString() };
    const { character: _omit, ...withoutCharacter } = state;
    const missing = parseSave(JSON.stringify({ ...base, state: withoutCharacter }));
    expect(missing.ok).toBe(false);
    const broken = parseSave(JSON.stringify({ ...base, state: { ...state, character: { ...state.character, feat: 'flying' } } }));
    expect(broken.ok).toBe(false);
    if (!broken.ok) expect(broken.error).toContain('don inconnu');
  });

  it('rejects an invalid date', () => {
    const text = JSON.stringify({ game: 'anamnesis', version: SAVE_VERSION, savedAt: 'hier', state });
    expect(parseSave(text).ok).toBe(false);
  });

  it('names export files after the slot and the local date', () => {
    expect(exportFileName('emplacement-2', new Date(2026, 10, 1, 9, 5))).toBe(
      'anamnesis-emplacement-2-2026-11-01-0905.json',
    );
  });

  it('formats play time as hours and minutes', () => {
    expect(formatPlayTime(0)).toBe('0 h 00');
    expect(formatPlayTime(3725)).toBe('1 h 02');
  });
});

describe('SaveStore', () => {
  it('reports empty slots, then reads back what it wrote', () => {
    const store = new SaveStore(new MemoryStorage());
    expect(store.read('slot1')).toEqual({ kind: 'empty' });
    expect(store.write('slot1', state, NOW).ok).toBe(true);
    const content = store.read('slot1');
    expect(content.kind).toBe('save');
    if (content.kind === 'save') expect(content.save.state).toEqual(state);
  });

  it('keeps slots independent and removes one without touching the others', () => {
    const store = new SaveStore(new MemoryStorage());
    store.write('slot1', state, NOW);
    store.write('auto', { ...state, playTimeSeconds: 10 }, NOW);
    store.remove('slot1');
    expect(store.read('slot1').kind).toBe('empty');
    expect(store.read('auto').kind).toBe('save');
  });

  it('flags corrupted slots instead of crashing', () => {
    const storage = new MemoryStorage();
    storage.setItem(SAVE_KEY_PREFIX + 'slot2', '{broken');
    expect(new SaveStore(storage).read('slot2').kind).toBe('corrupted');
  });

  it('imports a valid exported file into any slot', () => {
    const store = new SaveStore(new MemoryStorage());
    const exported = serializeSave(createSave(state, NOW));
    expect(store.importText('slot3', exported).ok).toBe(true);
    const content = store.read('slot3');
    expect(content.kind === 'save' && content.save.state).toEqual(state);
  });

  it('never overwrites a slot with an invalid import', () => {
    const store = new SaveStore(new MemoryStorage());
    store.write('slot1', state, NOW);
    expect(store.importText('slot1', '{"hello": 1}').ok).toBe(false);
    const content = store.read('slot1');
    expect(content.kind === 'save' && content.save.state).toEqual(state);
  });

  it('turns a full storage into an error result', () => {
    const storage = new MemoryStorage();
    storage.failWrites = true;
    const result = new SaveStore(storage).write('slot1', state, NOW);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('espace de stockage');
  });
});
