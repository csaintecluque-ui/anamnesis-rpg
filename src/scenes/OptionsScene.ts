import Phaser from 'phaser';
import { TEXT_SIZES, fontPx, getSettings, saveSettings, type Settings } from '../settings';
import { addTextButton } from '../ui/button';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';

const SMALL = { width: 64, height: 58, fontSize: 32 };
const VOLUME_STEP = 10;

/** Overlay opened from the title screen or the pause menu; « Retour » goes back to whichever opened it. */
export class OptionsScene extends Phaser.Scene {
  private layer!: Phaser.GameObjects.Container;

  constructor() {
    super('Options');
  }

  create(): void {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.ink, 1).setOrigin(0, 0).setInteractive();
    this.add.text(GAME_WIDTH / 2, 90, 'Options', { fontFamily: FONT_SERIF, fontSize: '40px', color: CSS.copper }).setOrigin(0.5);
    this.layer = this.add.container(0, 0);
    addTextButton(this, GAME_WIDTH / 2, GAME_HEIGHT - 80, 'Retour', () => this.scene.stop(), { width: 260, height: 76 });
    this.redraw();
  }

  private applyChange(change: Partial<Settings>): void {
    const next = { ...getSettings(), ...change };
    saveSettings(next);
    this.sound.volume = next.volume / 100;
    this.redraw();
  }

  private redraw(): void {
    this.layer.removeAll(true);
    const settings = getSettings();
    const label = (x: number, y: number, text: string, color: string = CSS.parchment): Phaser.GameObjects.Text => {
      const t = this.add.text(x, y, text, { fontFamily: FONT_SERIF, fontSize: '28px', color }).setOrigin(0, 0.5);
      this.layer.add(t);
      return t;
    };

    // Volume
    label(260, 220, 'Volume');
    this.layer.add(
      addTextButton(this, 640, 220, '−', () => this.applyChange({ volume: Math.max(0, settings.volume - VOLUME_STEP) }), {
        ...SMALL,
        enabled: settings.volume > 0,
      }).container,
    );
    this.layer.add(
      this.add.text(740, 220, `${settings.volume} %`, { fontFamily: FONT_SERIF, fontSize: '28px', color: CSS.parchment }).setOrigin(0.5),
    );
    this.layer.add(
      addTextButton(this, 840, 220, '+', () => this.applyChange({ volume: Math.min(100, settings.volume + VOLUME_STEP) }), {
        ...SMALL,
        enabled: settings.volume < 100,
      }).container,
    );
    label(260, 268, 'Le jeu n’a pas encore de sons : le réglage s’appliquera dès leur arrivée.', CSS.muted).setFontSize(18);

    // Text size
    label(260, 360, 'Taille du texte');
    TEXT_SIZES.forEach((size, i) => {
      this.layer.add(
        addTextButton(this, 690 + i * 200, 360, size.label, () => this.applyChange({ textSize: size.id }), {
          width: 180,
          height: 64,
          fontSize: 24,
          selected: settings.textSize === size.id,
        }).container,
      );
    });
    this.layer.add(
      this.add
        .text(GAME_WIDTH / 2, 470, 'Aperçu : « Te voilà. Les Gardiens de Mémoire m’ont annoncé ta venue. »', {
          fontFamily: FONT_SERIF,
          fontSize: fontPx(26),
          color: CSS.parchment,
          align: 'center',
          wordWrap: { width: 1000 },
        })
        .setOrigin(0.5),
    );
    label(260, 540, 'S’applique aux dialogues et aux messages du jeu.', CSS.muted).setFontSize(18);
  }
}
