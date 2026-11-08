import fondData from '../data/fonds.json';

/**
 * Les fonds peints (mise en beauté, 2026-11-08, docs/ASSETS.md) : sous la carte des lieux en plein air, une peinture
 * (le ciel d'Aetherhaven, la mer de Coralia, le sable de Marche-Mère…) remplace la couleur unie. Les fichiers
 * (public/fonds/<id>.jpg, faits par `npm run art`) sont chargés à la première vue, puis gardés hors ligne.
 */
export const FONDS = fondData as Record<string, string[]>;

/** The painted background of a location, if it has one. */
export function fondOf(locationId: string): string | null {
  for (const [id, locations] of Object.entries(FONDS)) if (locations.includes(locationId)) return id;
  return null;
}

/** The scale that makes an image of w × h cover the camera (w, h, zoom), whatever the zoom. */
export function coverScale(imageWidth: number, imageHeight: number, cameraWidth: number, cameraHeight: number, zoom: number): number {
  return Math.max(cameraWidth / imageWidth, cameraHeight / imageHeight) / zoom;
}
