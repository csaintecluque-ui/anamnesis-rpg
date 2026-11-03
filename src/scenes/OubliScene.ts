import Phaser from 'phaser';
import { findRecit } from '../rules/recits';
import { forgettable, letGo, recitUses, recitsToForget } from '../rules/oubli';
import { fontPx } from '../settings';
import type { GameState } from '../state/gameState';
import { addTextButton } from '../ui/button';
import { DIGIT_KEYS, onKeys, withKeyHint } from '../ui/keys';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';
import { HAS_MOUSE } from '../ui/viewport';
import { removeItem } from '../rules/inventory';

const MARGIN = 60;
const LAYOUT = HAS_MOUSE
  ? { panelTop: 60, titleY: 92, introY: 132, rowTop: 172, rowHeight: 84, button: { width: 170, height: 44, fontSize: 19 } }
  : { panelTop: 100, titleY: 140, introY: 186, rowTop: 230, rowHeight: 118, button: { width: 190, height: 60, fontSize: 22 } };
const PER_PAGE = Math.floor((GAME_HEIGHT - 70 - LAYOUT.rowTop) / LAYOUT.rowHeight);

/** The Champignon-Mémoire (src/data/items.json) eaten on purpose. */
export const MUSHROOM = 'champignon-memoire-frais';

/**
 * Oublier un Récit (feuille de route, chantier 1 ; docs/gdd/memoire.md) : past the cap, the hero must choose which story
 * to let go, knowing what each is good for (`plein`) ; or, with a Champignon-Mémoire, chooses to forget one, and the
 * Échos' hold goes with it (`champignon`, which can be put off). Opened over the paused map, or over the inventory.
 */
export class OubliScene extends Phaser.Scene {
  private state!: GameState;
  private mode: 'plein' | 'champignon' = 'plein';
  private from = 'Map';
  private layer!: Phaser.GameObjects.Container;
  private page = 0;
  private choices: (() => void)[] = [];
  private pageTurn?: (step: number) => void;

  constructor() {
    super('Oubli');
  }

  create(data: { mode?: 'plein' | 'champignon'; from?: string }): void {
    this.state = this.registry.get('game') as GameState;
    this.mode = data.mode ?? 'plein';
    this.from = data.from ?? 'Map';
    this.page = 0;
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.ink, 0.6).setOrigin(0, 0).setInteractive();
    const L = LAYOUT;
    this.add.rectangle(0, L.panelTop, GAME_WIDTH, GAME_HEIGHT - L.panelTop, COLORS.ink, 0.97).setOrigin(0, 0).setStrokeStyle(2, COLORS.copper, 0.7);
    const title = this.mode === 'plein' ? 'Ta mémoire est pleine' : 'Le Champignon-Mémoire';
    this.add.text(MARGIN, L.titleY, title, { fontFamily: FONT_SERIF, fontSize: fontPx(28), color: CSS.copper }).setOrigin(0, 0.5);
    const intro =
      this.mode === 'plein'
        ? 'Une histoire de trop. Laquelle laisses-tu partir ? Celle-là, tu ne pourras plus la raconter.'
        : 'Pâle et tiède, il emporte un souvenir quand on le mâche, et avec lui l’emprise des Échos. Lequel lui donnes-tu ?';
    this.add.text(MARGIN, L.introY, intro, { fontFamily: FONT_SERIF, fontSize: fontPx(21), color: CSS.parchment, wordWrap: { width: GAME_WIDTH - 2 * MARGIN } }).setOrigin(0, 0.5);
    if (this.mode === 'champignon') {
      addTextButton(this, GAME_WIDTH - MARGIN - 110, L.titleY, withKeyHint('Plus tard', 'Échap'), () => this.close(), { width: 220, height: L.button.height, fontSize: L.button.fontSize });
      onKeys(this, ['ESC'], () => this.close());
    }
    DIGIT_KEYS.forEach((keys, i) => onKeys(this, keys, () => this.choices[i]?.()));
    onKeys(this, ['RIGHT'], () => this.pageTurn?.(1));
    onKeys(this, ['LEFT'], () => this.pageTurn?.(-1));
    this.layer = this.add.container(0, 0);
    this.redraw();
  }

  private redraw(): void {
    this.layer.removeAll(true);
    this.choices = [];
    const L = LAYOUT;
    const ids = forgettable(this.state);
    const pages = Math.max(1, Math.ceil(ids.length / PER_PAGE));
    this.page = Math.min(this.page, pages - 1);
    ids.slice(this.page * PER_PAGE, (this.page + 1) * PER_PAGE).forEach((id, i) => {
      const y = L.rowTop + i * L.rowHeight;
      const recit = findRecit(id);
      this.layer.add(
        this.add.rectangle(GAME_WIDTH / 2, y + L.rowHeight / 2 - 4, GAME_WIDTH - 2 * MARGIN, L.rowHeight - 10, 0x2a211c, 0.6).setStrokeStyle(1, COLORS.copper, 0.3),
      );
      this.layer.add(this.add.text(MARGIN + 14, y + 6, recit?.titre ?? id, { fontFamily: FONT_SERIF, fontSize: fontPx(22), color: CSS.copper }));
      this.layer.add(
        this.add.text(MARGIN + 14, y + 36, recitUses(id).join(' '), {
          fontFamily: FONT_SERIF,
          fontSize: fontPx(17),
          color: CSS.parchment,
          wordWrap: { width: GAME_WIDTH - 2 * MARGIN - L.button.width - 50 },
        }),
      );
      const choose = () => this.forget(id);
      this.choices.push(choose);
      const label = HAS_MOUSE ? `${i + 1}. Oublier` : 'Oublier';
      this.layer.add(addTextButton(this, GAME_WIDTH - MARGIN - 14 - L.button.width / 2, y + L.rowHeight / 2 - 4, label, choose, L.button).container);
    });
    if (pages > 1) {
      const y = GAME_HEIGHT - 36;
      const turn = (d: number) => {
        this.page = (this.page + d + pages) % pages;
        this.redraw();
      };
      this.layer.add(addTextButton(this, MARGIN + 60, y, '◀', () => turn(-1), { width: 100, height: 44, fontSize: 20 }).container);
      this.layer.add(this.add.text(GAME_WIDTH / 2, y, `Page ${this.page + 1} / ${pages}`, { fontFamily: FONT_SERIF, fontSize: fontPx(19), color: CSS.muted }).setOrigin(0.5));
      this.layer.add(addTextButton(this, GAME_WIDTH - MARGIN - 60, y, '▶', () => turn(1), { width: 100, height: 44, fontSize: 20 }).container);
      this.pageTurn = turn;
    } else this.pageTurn = undefined;
  }

  private forget(id: string): void {
    const mushroom = this.mode === 'champignon';
    const notices = letGo(this.state, id, mushroom);
    if (!notices.length) return;
    if (mushroom && this.state.character) removeItem(this.state.character, MUSHROOM, 1);
    this.registry.set('oubli-notices', notices);
    // Still too many (several Récits learned at once): another choice.
    if (!mushroom && recitsToForget(this.state) > 0) return this.redraw();
    this.close();
  }

  private close(): void {
    this.scene.stop();
    this.scene.resume(this.from);
  }
}
