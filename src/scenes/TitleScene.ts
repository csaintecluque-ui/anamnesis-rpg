import Phaser from 'phaser';
import { CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';

interface MenuEntry {
  label: string;
  enabled: boolean;
  action?: () => void;
}

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create(): void {
    const cx = GAME_WIDTH / 2;

    this.add
      .text(cx, 190, 'ANAMNESIS', {
        fontFamily: FONT_SERIF,
        fontSize: '84px',
        color: CSS.parchment,
        letterSpacing: 12,
      })
      .setOrigin(0.5);

    this.add.rectangle(cx, 260, 220, 1, 0xc9804f);

    const entries: MenuEntry[] = [
      { label: 'Nouvelle partie', enabled: true, action: () => this.scene.start('IsoTest') },
      { label: 'Charger', enabled: false },
      { label: 'Options', enabled: false },
    ];

    entries.forEach((entry, i) => {
      const text = this.add
        .text(cx, 360 + i * 64, entry.label, {
          fontFamily: FONT_SERIF,
          fontSize: '34px',
          color: entry.enabled ? CSS.parchment : CSS.muted,
        })
        .setOrigin(0.5)
        .setPadding(24, 10, 24, 10);

      if (!entry.enabled) return;
      text.setInteractive({ useHandCursor: true });
      text.on('pointerover', () => text.setColor(CSS.copper));
      text.on('pointerout', () => text.setColor(CSS.parchment));
      text.on('pointerup', () => entry.action?.());
    });

    // Discreet signature (CLAUDE.md §6): seal + "Anamnesis · CSC".
    this.add.image(GAME_WIDTH - 70, GAME_HEIGHT - 70, 'seal').setDisplaySize(72, 72).setAlpha(0.85);
    this.add
      .text(GAME_WIDTH - 120, GAME_HEIGHT - 70, 'Anamnesis · CSC', {
        fontFamily: FONT_SERIF,
        fontSize: '18px',
        color: CSS.muted,
      })
      .setOrigin(1, 0.5);
  }
}
