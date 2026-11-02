import type { GameState } from '../state/gameState';
import { createSave, parseSave, serializeSave, type Result, type SaveFile } from './codec';

export type SlotId = 'auto' | 'slot1' | 'slot2' | 'slot3';

export interface SlotDef {
  id: SlotId;
  label: string;
  fileTag: string;
  manual: boolean;
}

export const SLOTS: SlotDef[] = [
  { id: 'slot1', label: 'Emplacement 1', fileTag: 'emplacement-1', manual: true },
  { id: 'slot2', label: 'Emplacement 2', fileTag: 'emplacement-2', manual: true },
  { id: 'slot3', label: 'Emplacement 3', fileTag: 'emplacement-3', manual: true },
  { id: 'auto', label: 'Sauvegarde auto', fileTag: 'auto', manual: false },
];

export const SAVE_KEY_PREFIX = 'anamnesis.save.';

export type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export type SlotContent =
  | { kind: 'empty' }
  | { kind: 'save'; save: SaveFile }
  | { kind: 'corrupted'; error: string };

export class SaveStore {
  private readonly storage: KeyValueStorage;

  constructor(storage: KeyValueStorage) {
    this.storage = storage;
  }

  /** The most recent readable save of all slots (where the hero resumes after dying), or null. */
  latest(): SaveFile | null {
    let best: SaveFile | null = null;
    for (const slot of SLOTS) {
      const content = this.read(slot.id);
      if (content.kind === 'save' && (!best || content.save.savedAt > best.savedAt)) best = content.save;
    }
    return best;
  }

  read(slot: SlotId): SlotContent {
    const text = this.storage.getItem(SAVE_KEY_PREFIX + slot);
    if (text === null) return { kind: 'empty' };
    const parsed = parseSave(text);
    return parsed.ok ? { kind: 'save', save: parsed.value } : { kind: 'corrupted', error: parsed.error };
  }

  write(slot: SlotId, state: GameState, now = new Date()): Result<SaveFile> {
    return this.writeFile(slot, createSave(state, now));
  }

  /** Validates imported text before it can overwrite anything. */
  importText(slot: SlotId, text: string): Result<SaveFile> {
    const parsed = parseSave(text);
    return parsed.ok ? this.writeFile(slot, parsed.value) : parsed;
  }

  remove(slot: SlotId): void {
    this.storage.removeItem(SAVE_KEY_PREFIX + slot);
  }

  private writeFile(slot: SlotId, save: SaveFile): Result<SaveFile> {
    try {
      this.storage.setItem(SAVE_KEY_PREFIX + slot, serializeSave(save));
      return { ok: true, value: save };
    } catch {
      return { ok: false, error: 'Impossible d’enregistrer : l’espace de stockage de l’appareil est plein ou bloqué.' };
    }
  }
}
