import Phaser from 'phaser';
import { endingOf, epiloguePages, type EpiloguePage } from '../rules/epilogue';
import { fontPx } from '../settings';
import type { GameState } from '../state/gameState';
import { addTextButton } from '../ui/button';
import { onKeys, withKeyHint } from '../ui/keys';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';
import { HAS_MOUSE } from '../ui/viewport';

const TEXT_WIDTH = 980;
const BUTTON = HAS_MOUSE ? { width: 260, height: 52, fontSize: 21 } : { width: 300, height: 72, fontSize: 24 };

/**
 * L'épilogue (chapitre 9, docs/gdd/chapitre-9.md) : une page par fil, sur l'encre, après une fin de « La voie sept ».
 * Opened over the paused map. « Le dernier passager » ends the game: a last page, then the title screen. The other
 * ends give the world back: the map resumes.
 */
export class EpilogueScene extends Phaser.Scene {
  private pages: EpiloguePage[] = [];
  private index = 0;
  private layer!: Phaser.GameObjects.Container;
  private last = false;

  constructor() {
    super('Epilogue');
  }

  create(): void {
    const state = this.registry.get('game') as GameState;
    this.last = endingOf(state) === 'monte';
    this.pages = epiloguePages(state);
    if (this.last) this.pages.push({ titre: 'Anamnesis', texte: 'Merci d’avoir joué jusqu’au bout de la voie sept.\n\nAnamnesis · CSC' });
    this.index = 0;
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.ink, 1).setOrigin(0, 0).setInteractive().setDepth(-3);
    this.paintEnding(endingOf(state));
    this.layer = this.add.container(0, 0);
    onKeys(this, ['ENTER', 'SPACE', 'RIGHT'], () => this.next());
    this.show();
  }

  /**
   * The ending's illustration (mise en beauté, docs/ASSETS.md : illustrations/fin-<fin>.jpg), behind the pages under a
   * veil of ink, loaded when the epilogue opens; without it, the ink alone, as before.
   */
  private paintEnding(ending: string | null): void {
    if (!ending) return;
    const key = `illustration-fin-${ending}`;
    const place = (): void => {
      if (!this.textures.exists(key) || !this.scene.isActive()) return;
      // Depths: the ink (−3), the picture (−2), its veil (−1), the pages (0).
      const image = this.add.image(0, 0, key).setOrigin(0, 0).setDisplaySize(GAME_WIDTH, GAME_HEIGHT).setAlpha(0).setDepth(-2);
      this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.ink, 0.62).setOrigin(0, 0).setDepth(-1);
      this.tweens.add({ targets: image, alpha: 1, duration: 1200 });
    };
    if (this.textures.exists(key)) return place();
    this.load.image(key, `illustrations/fin-${ending}.jpg`);
    this.load.once(Phaser.Loader.Events.COMPLETE, place);
    this.load.start();
  }

  private show(): void {
    this.layer.removeAll(true);
    const page = this.pages[this.index];
    if (!page) return this.close();
    const title = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT * 0.2, page.titre, { fontFamily: FONT_SERIF, fontSize: fontPx(40), color: CSS.copper }).setOrigin(0.5);
    const body = this.add
      .text(GAME_WIDTH / 2, title.y + 70, page.texte, {
        fontFamily: FONT_SERIF,
        fontSize: fontPx(25),
        color: CSS.parchment,
        lineSpacing: 10,
        align: page.titre === 'Les sept caisses' ? 'left' : 'center',
        wordWrap: { width: TEXT_WIDTH },
      })
      .setOrigin(0.5, 0);
    // A long page (the seven caisses) shrinks to fit above the button.
    for (let size = 24; body.y + body.height > GAME_HEIGHT - 150 && size >= 15; size--) body.setFontSize(fontPx(size));
    const count = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 150, `${this.index + 1} / ${this.pages.length}`, { fontFamily: FONT_SERIF, fontSize: fontPx(18), color: CSS.muted }).setOrigin(0.5);
    const end = this.index === this.pages.length - 1;
    const label = end ? (this.last ? 'Fin' : 'Reprendre la route') : 'Suivant';
    const button = addTextButton(this, GAME_WIDTH / 2, GAME_HEIGHT - 90, withKeyHint(label, 'Entrée'), () => this.next(), BUTTON);
    this.layer.add([title, body, count, button.container]);
    this.layer.setAlpha(0);
    this.tweens.add({ targets: this.layer, alpha: 1, duration: 600 });
  }

  private next(): void {
    this.index++;
    this.show();
  }

  private close(): void {
    if (this.last) {
      this.scene.stop('Hud');
      this.scene.stop('Map');
      this.scene.start('Title');
      return;
    }
    this.scene.resume('Map');
    this.scene.stop();
  }
}
