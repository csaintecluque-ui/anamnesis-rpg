import Phaser from 'phaser';
import { COLORS, CSS, FONT_SERIF } from './theme';

export interface ButtonOptions {
  width?: number;
  height?: number;
  fontSize?: number;
  enabled?: boolean;
  selected?: boolean;
}

export interface TextButton {
  container: Phaser.GameObjects.Container;
  setLabel(label: string): void;
}

/** Framed text button sized for touch (≥ 80 game px tall ≈ 44 px on a landscape phone). */
export function addTextButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  onClick: () => void,
  { width = 200, height = 80, fontSize = 26, enabled = true, selected = false }: ButtonOptions = {},
): TextButton {
  const frame = scene.add
    .rectangle(0, 0, width, height, selected ? 0x5a3a26 : 0x2a211c)
    .setStrokeStyle(selected ? 3 : 2, COLORS.copper, enabled ? (selected ? 1 : 0.8) : 0.25);
  const text = scene.add
    .text(0, 0, label, {
      fontFamily: FONT_SERIF,
      fontSize: `${fontSize}px`,
      color: enabled ? CSS.parchment : CSS.muted,
      align: 'center',
    })
    .setOrigin(0.5);
  const container = scene.add.container(x, y, [frame, text]);

  if (enabled) {
    frame.setInteractive({ useHandCursor: true });
    frame.on('pointerover', () => text.setColor(CSS.copper));
    frame.on('pointerout', () => text.setColor(CSS.parchment));
    frame.on(
      'pointerup',
      (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => {
        event.stopPropagation();
        onClick();
      },
    );
  }

  return { container, setLabel: (value) => text.setText(value) };
}
