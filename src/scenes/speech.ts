import Phaser from 'phaser';
import { fontPx } from '../settings';
import { COLORS, CSS, FONT_SERIF } from '../ui/theme';

/**
 * A speech bubble above someone on the map: their name (copper, italic) and a short line. Passers-by say theirs when
 * touched, and everyone on the map speaks up on their own when the hero walks by (« comme dans Fallout », Cyril,
 * 2026-11-04 ; docs/gdd/figurants.md). `scale` keeps it readable when the view is zoomed out.
 */
export const BUBBLE_MS = 3800;
const BUBBLE_WIDTH = 230;

export function speechBubble(scene: Phaser.Scene, x: number, bottom: number, name: string, line: string, scale: number): Phaser.GameObjects.Container {
  const label = scene.add.text(0, 0, name, { fontFamily: FONT_SERIF, fontSize: fontPx(11), color: CSS.copper, fontStyle: 'italic' });
  const text = scene.add.text(0, label.height + 2, `« ${line} »`, {
    fontFamily: FONT_SERIF,
    fontSize: fontPx(12),
    color: CSS.parchment,
    wordWrap: { width: BUBBLE_WIDTH },
  });
  const width = Math.max(label.width, text.width) + 16;
  const height = label.height + text.height + 12;
  const frame = scene.add.rectangle(-8, -6, width, height, COLORS.ink, 0.9).setOrigin(0, 0).setStrokeStyle(1, COLORS.copper, 0.9);
  return scene.add
    .container(x - ((width - 16) * scale) / 2, bottom - (height - 6) * scale, [frame, label, text])
    .setScale(scale)
    .setDepth(100001);
}

/** How much the names and bubbles over the map grow when the view is farther away, to stay readable. */
export const labelScaleFor = (zoom: number): number => Math.max(1, 1.2 / zoom);
