/** Player preferences: per device, not part of a save (a save file moved to another device keeps that device's options). */
export interface Settings {
  /** 0 to 100. */
  volume: number;
  textSize: TextSize;
  /** Hidden testing tools in the pause menu (docs/gdd/interface.md, « Mode test »). */
  testMode: boolean;
  /** The place's small map in the corner (étude du 2026-11-03, A7): M, or the options. */
  miniMap: boolean;
}

export type TextSize = 'normale' | 'grande';

export const TEXT_SIZES: { id: TextSize; label: string; scale: number }[] = [
  { id: 'normale', label: 'Normale', scale: 1 },
  { id: 'grande', label: 'Grande', scale: 1.15 },
];

export const DEFAULT_SETTINGS: Settings = { volume: 80, textSize: 'normale', testMode: false, miniMap: true };
const KEY = 'anamnesis.settings';

export function parseSettings(raw: string | null): Settings {
  if (!raw) return { ...DEFAULT_SETTINGS };
  try {
    const value = JSON.parse(raw) as Partial<Settings>;
    const volume = Number.isInteger(value.volume) ? Math.min(100, Math.max(0, value.volume as number)) : DEFAULT_SETTINGS.volume;
    const textSize = TEXT_SIZES.some((t) => t.id === value.textSize) ? (value.textSize as TextSize) : DEFAULT_SETTINGS.textSize;
    return { volume, textSize, testMode: value.testMode === true, miniMap: value.miniMap !== false };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

let current: Settings | null = null;

export function getSettings(): Settings {
  if (!current) {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(KEY);
    } catch {
      // Storage blocked (some private modes): defaults for this session.
    }
    current = parseSettings(raw);
  }
  return current;
}

export function saveSettings(settings: Settings): void {
  current = { ...settings };
  try {
    localStorage.setItem(KEY, JSON.stringify(current));
  } catch {
    // Kept in memory until the page closes.
  }
}

export function textScale(): number {
  return TEXT_SIZES.find((t) => t.id === getSettings().textSize)?.scale ?? 1;
}

/** Font size in px for a base size, following the player's text size. */
export function fontPx(base: number): string {
  return `${Math.round(base * textScale())}px`;
}
