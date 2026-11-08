import Phaser from 'phaser';
import { TEXT_SIZES, fontPx, getSettings, saveSettings, type Settings } from '../settings';
import { setMusicVolume } from '../audio/conductor';
import { addTextButton } from '../ui/button';
import { SHOW_KEY_HINTS, onKeys, withKeyHint } from '../ui/keys';
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
    addTextButton(this, GAME_WIDTH / 2, GAME_HEIGHT - 56, withKeyHint('Retour', 'Échap'), () => this.scene.stop(), {
      width: 260,
      height: 76,
    });
    onKeys(this, ['ESC'], () => this.scene.stop());
    this.redraw();
  }

  private applyChange(change: Partial<Settings>): void {
    const next = { ...getSettings(), ...change };
    saveSettings(next);
    this.sound.volume = next.volume / 100;
    setMusicVolume(next.music);
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

    // Volume, then the music alone under it (docs/gdd/son.md).
    const percentRow = (y: number, name: string, value: number, change: (v: number) => Partial<Settings>): void => {
      label(260, y, name);
      this.layer.add(
        addTextButton(this, 640, y, '−', () => this.applyChange(change(Math.max(0, value - VOLUME_STEP))), { ...SMALL, enabled: value > 0 }).container,
      );
      this.layer.add(this.add.text(740, y, `${value} %`, { fontFamily: FONT_SERIF, fontSize: '28px', color: CSS.parchment }).setOrigin(0.5));
      this.layer.add(
        addTextButton(this, 840, y, '+', () => this.applyChange(change(Math.min(100, value + VOLUME_STEP))), { ...SMALL, enabled: value < 100 }).container,
      );
    };
    percentRow(150, 'Volume', settings.volume, (volume) => ({ volume }));
    percentRow(218, 'Musique', settings.music, (music) => ({ music }));
    label(260, 260, 'Le volume règle tout ; la musique se règle à part, sous lui (0 % : sans musique).', CSS.muted).setFontSize(18);

    // Text size
    label(260, 318, 'Taille du texte');
    TEXT_SIZES.forEach((size, i) => {
      this.layer.add(
        addTextButton(this, 690 + i * 200, 318, size.label, () => this.applyChange({ textSize: size.id }), {
          width: 180,
          height: 64,
          fontSize: 24,
          selected: settings.textSize === size.id,
        }).container,
      );
    });
    this.layer.add(
      this.add
        .text(GAME_WIDTH / 2, 384, 'Aperçu : « Te voilà. Les Gardiens de Mémoire m’ont annoncé ta venue. »', {
          fontFamily: FONT_SERIF,
          fontSize: fontPx(26),
          color: CSS.parchment,
          align: 'center',
          wordWrap: { width: 1000 },
        })
        .setOrigin(0.5),
    );
    label(260, 424, 'S’applique aux dialogues et aux messages du jeu.', CSS.muted).setFontSize(18);

    // The place's small map (étude A7).
    label(260, 480, 'Mini-carte');
    [
      { label: 'Affichée', on: true },
      { label: 'Masquée', on: false },
    ].forEach((choice, i) => {
      this.layer.add(
        addTextButton(this, 690 + i * 200, 480, choice.label, () => this.applyChange({ miniMap: choice.on }), {
          width: 180,
          height: 64,
          fontSize: 24,
          selected: settings.miniMap === choice.on,
        }).container,
      );
    });
    if (SHOW_KEY_HINTS) label(260, 516, 'La touche M l’affiche ou la masque sur la carte.', CSS.muted).setFontSize(18);

    // Full screen (PC, Android). Safari on iPhone has no full-screen API: the installed app already fills the screen.
    if (this.scale.fullscreen.available) {
      label(260, 568, 'Plein écran');
      const on = this.scale.isFullscreen;
      this.layer.add(
        addTextButton(this, 790, 568, on ? 'Quitter le plein écran' : 'Passer en plein écran', () => this.toggleFullscreen(), {
          width: 380,
          height: 64,
          fontSize: 24,
        }).container,
      );
      if (SHOW_KEY_HINTS) label(260, 604, 'La touche F11 du navigateur fonctionne aussi.', CSS.muted).setFontSize(18);
    }
  }

  private toggleFullscreen(): void {
    // Redraw once the browser has actually switched (it can refuse, or the player can leave with Échap or F11).
    this.scale.once(Phaser.Scale.Events.ENTER_FULLSCREEN, () => this.redraw());
    this.scale.once(Phaser.Scale.Events.LEAVE_FULLSCREEN, () => this.redraw());
    this.scale.toggleFullscreen();
  }
}
