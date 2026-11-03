import Phaser from 'phaser';
import { ATELIERS, craft, missing, recettesOf, type Recette } from '../rules/artisanat';
import { findItem, ownedCount } from '../rules/inventory';
import { fontPx } from '../settings';
import type { GameState } from '../state/gameState';
import { addTextButton } from '../ui/button';
import { DIGIT_KEYS, onKeys, withKeyHint } from '../ui/keys';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';
import { HAS_MOUSE } from '../ui/viewport';

const MARGIN = 60;
const TEXT_WIDTH = GAME_WIDTH - 2 * MARGIN;
const PAGER_Y = GAME_HEIGHT - 36;

/** Finger-sized on touch screens, compact with a mouse (docs/gdd/interface.md). */
const LAYOUT = HAS_MOUSE
  ? { panelTop: 60, titleY: 92, closeWidth: 200, closeHeight: 44, closeFont: 20, rowHeight: 86, button: { width: 170, height: 44, fontSize: 19 } }
  : { panelTop: 100, titleY: 142, closeWidth: 220, closeHeight: 64, closeFont: 24, rowHeight: 98, button: { width: 190, height: 60, fontSize: 22 } };

/**
 * Un atelier (docs/gdd/artisanat.md) : la forge d'Hedda ou les herbes de Sévane. Une ligne par recette : ce qu'elle
 * donne, ce qu'il faut (ce qu'on a), et le bouton pour la faire. Opened from the keeper's dialogue; the map is paused.
 */
export class AtelierScene extends Phaser.Scene {
  private state!: GameState;
  private atelier = 'forge';
  private layer!: Phaser.GameObjects.Container;
  private message = '';
  private page = 0;
  private choices: (() => void)[] = [];

  constructor() {
    super('Atelier');
  }

  create(data: { atelier: string }): void {
    this.state = this.registry.get('game') as GameState;
    this.atelier = data.atelier;
    this.message = '';
    this.page = 0;
    const L = LAYOUT;
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.ink, 0.45).setOrigin(0, 0).setInteractive();
    this.add.rectangle(0, L.panelTop, GAME_WIDTH, GAME_HEIGHT - L.panelTop, COLORS.ink, 0.96).setOrigin(0, 0).setStrokeStyle(2, COLORS.copper, 0.7);
    this.add.text(MARGIN, L.titleY, ATELIERS[this.atelier]?.nom ?? 'L’atelier', { fontFamily: FONT_SERIF, fontSize: fontPx(28), color: CSS.copper }).setOrigin(0, 0.5);
    addTextButton(this, GAME_WIDTH - MARGIN - L.closeWidth / 2, L.titleY, withKeyHint('Fermer', 'Échap'), () => this.close(), {
      width: L.closeWidth,
      height: L.closeHeight,
      fontSize: L.closeFont,
    });
    onKeys(this, ['ESC'], () => this.close());
    DIGIT_KEYS.forEach((keys, i) => onKeys(this, keys, () => this.choices[i]?.()));
    this.layer = this.add.container(0, 0);
    this.redraw();
  }

  private text(x: number, y: number, value: string, size: number, color: string, width?: number, italic = false): Phaser.GameObjects.Text {
    const t = this.add.text(x, y, value, { fontFamily: FONT_SERIF, fontSize: fontPx(size), color, fontStyle: italic ? 'italic' : 'normal', lineSpacing: 2, wordWrap: width ? { width } : undefined });
    this.layer.add(t);
    return t;
  }

  private redraw(): void {
    this.layer.removeAll(true);
    this.choices = [];
    const L = LAYOUT;
    let y = L.titleY + L.closeHeight / 2 + 12;
    const fers = this.state.character?.fers ?? 0;
    y = this.text(MARGIN, y, `Tu as ${fers} Fers. Les matières viennent du butin des bêtes ; chaque recette coûte aussi quelques Fers.`, 19, CSS.muted, TEXT_WIDTH, true).getBounds().bottom;
    if (this.message) y = this.text(MARGIN, y + 6, this.message, 19, CSS.copper, TEXT_WIDTH).getBounds().bottom;
    const top = y + 14;
    const list = recettesOf(this.atelier);
    const perPage = Math.max(1, Math.floor((PAGER_Y - 34 - top) / L.rowHeight));
    const pages = Math.ceil(list.length / perPage);
    this.page = Math.min(this.page, pages - 1);
    list.slice(this.page * perPage, (this.page + 1) * perPage).forEach((r, i) => this.drawRecipe(r, i, top + i * L.rowHeight));
    if (pages > 1) this.drawPager(pages);
  }

  private drawRecipe(r: Recette, index: number, top: number): void {
    const L = LAYOUT;
    const B = L.button;
    this.layer.add(this.add.rectangle(MARGIN, top, TEXT_WIDTH, L.rowHeight - 8, 0x2a211c, 0.6).setOrigin(0, 0).setStrokeStyle(1, COLORS.copper, 0.3));
    const c = this.state.character;
    const count = r.produit.count ?? 1;
    const name = `${index + 1}. ${findItem(r.produit.item)?.name ?? r.produit.item}${count > 1 ? ` ×${count}` : ''} — ${r.texte}`;
    const lacks = missing(this.state, r);
    const textWidth = TEXT_WIDTH - B.width - 40;
    const title = this.text(MARGIN + 14, top + 8, name, 20, lacks.length ? CSS.muted : CSS.parchment, textWidth);
    const needs = [
      ...r.ingredients.map((i) => `${findItem(i.item)?.name ?? i.item} ${c ? Math.min(ownedCount(c, i.item), i.count) : 0}/${i.count}`),
      `${r.fers} Fers`,
    ].join('  ·  ');
    this.text(MARGIN + 14, title.getBounds().bottom + 4, needs, 17, lacks.length ? CSS.muted : CSS.copper, textWidth, true);
    const make = () => {
      const notices = craft(this.state, r);
      this.message = notices.length ? notices.join('   ·   ') : `Il te manque : ${missing(this.state, r).join(', ')}.`;
      this.redraw();
    };
    const verb = ATELIERS[this.atelier]?.verbe ?? 'Faire';
    this.layer.add(addTextButton(this, GAME_WIDTH - MARGIN - 14 - B.width / 2, top + (L.rowHeight - 8) / 2, verb, make, { ...B, enabled: lacks.length === 0 }).container);
    if (!lacks.length) this.choices[index] = make;
  }

  private drawPager(pages: number): void {
    const button = { width: 220, height: LAYOUT.button.height, fontSize: LAYOUT.button.fontSize };
    const turn = (step: number) => {
      this.page = (this.page + step + pages) % pages;
      this.redraw();
    };
    this.layer.add(addTextButton(this, MARGIN + button.width / 2, PAGER_Y, '◀ Précédentes', () => turn(-1), button).container);
    this.text(GAME_WIDTH / 2, PAGER_Y - 12, `Page ${this.page + 1} / ${pages}`, 19, CSS.muted).setOrigin(0.5, 0);
    this.layer.add(addTextButton(this, GAME_WIDTH - MARGIN - button.width / 2, PAGER_Y, 'Suivantes ▶', () => turn(1), button).container);
  }

  private close(): void {
    this.scene.resume('Map');
    this.scene.stop();
  }
}
