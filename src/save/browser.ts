import { SAVE_MAX_CHARS, exportFileName, serializeSave, type SaveFile } from './codec';
import { SaveStore, type KeyValueStorage, type SlotDef } from './store';

class MemoryStorage implements KeyValueStorage {
  private readonly data = new Map<string, string>();
  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
  removeItem(key: string): void {
    this.data.delete(key);
  }
}

function openStorage(): { storage: KeyValueStorage; persistent: boolean } {
  try {
    const probe = 'anamnesis.probe';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return { storage: window.localStorage, persistent: true };
  } catch {
    // Storage disabled (some private modes): the game still runs, saves last until the tab closes.
    return { storage: new MemoryStorage(), persistent: false };
  }
}

const opened = openStorage();
export const saveStore = new SaveStore(opened.storage);
export const storageIsPersistent = opened.persistent;

let persistRequested = false;
/** Asks the browser not to evict saves under storage pressure (no prompt on iOS/Chrome). */
export function requestPersistentStorage(): void {
  if (persistRequested) return;
  persistRequested = true;
  void navigator.storage?.persist?.().catch(() => undefined);
}

/** On touch devices the share sheet offers "Save to Files"; elsewhere, a plain download. */
export async function exportSave(save: SaveFile, slot: SlotDef): Promise<void> {
  const name = exportFileName(slot.fileTag, new Date(save.savedAt));
  const file = new File([serializeSave(save)], name, { type: 'application/json' });

  if (navigator.maxTouchPoints > 0 && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Sauvegarde Anamnesis' });
      return;
    } catch (error) {
      if ((error as DOMException).name === 'AbortError') return;
    }
  }

  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export type PickedFile = { kind: 'cancelled' } | { kind: 'too-big' } | { kind: 'unreadable' } | { kind: 'text'; text: string };

/** Opens the system file picker. Must run inside a user gesture (a pointer handler). */
export function pickSaveFile(): Promise<PickedFile> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.addEventListener(
      'change',
      () => {
        const file = input.files?.[0];
        if (!file) return resolve({ kind: 'cancelled' });
        // UTF-8 uses at most 4 bytes per character: anything larger cannot fit the character limit.
        if (file.size > SAVE_MAX_CHARS * 4) return resolve({ kind: 'too-big' });
        file.text().then(
          (text) => resolve({ kind: 'text', text }),
          () => resolve({ kind: 'unreadable' }),
        );
      },
      { once: true },
    );
    input.addEventListener('cancel', () => resolve({ kind: 'cancelled' }), { once: true });
    input.click();
  });
}
