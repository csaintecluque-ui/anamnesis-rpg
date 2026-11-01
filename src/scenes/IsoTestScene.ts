import Phaser from 'phaser';
import { TILE_HEIGHT, TILE_WIDTH, isInside, screenToTile, tileToScreen, type Tile } from '../engine/iso';
import { saveStore } from '../save/browser';
import { createNewGame, type GameState } from '../state/gameState';
import { addTextButton } from '../ui/button';
import { COLORS, CSS, FONT_SERIF, GAME_WIDTH } from '../ui/theme';

const COLS = 12;
const ROWS = 12;

/** Temporary test ground: proves isometric rendering, tap/click-to-move and saving on every target device. */
export class IsoTestScene extends Phaser.Scene {
  private originX = 0;
  private originY = 0;
  private marker!: Phaser.GameObjects.Ellipse;
  private highlight!: Phaser.GameObjects.Graphics;
  private state!: GameState;

  constructor() {
    super('IsoTest');
  }

  create(): void {
    this.state = (this.registry.get('game') as GameState | undefined) ?? createNewGame();
    this.registry.set('game', this.state);

    this.originX = GAME_WIDTH / 2;
    this.originY = 200;

    const grid = this.add.graphics();
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        const shade = (col + row) % 2 === 0 ? 0x2a211c : 0x332822;
        this.drawDiamond(grid, { col, row }, shade, COLORS.copper, 0.25);
      }
    }

    this.highlight = this.add.graphics();
    const start = this.toWorld(this.state.position);
    this.marker = this.add.ellipse(start.x, start.y - 6, 26, 26, COLORS.parchment).setStrokeStyle(2, COLORS.copper);

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      const tile = screenToTile({ x: pointer.worldX - this.originX, y: pointer.worldY - this.originY });
      if (!isInside(tile, COLS, ROWS)) return;
      this.moveTo(tile);
    });

    this.add
      .text(GAME_WIDTH / 2, 60, 'Terrain d’essai — touche ou clique une case', {
        fontFamily: FONT_SERIF,
        fontSize: '24px',
        color: CSS.parchment,
      })
      .setOrigin(0.5);

    addTextButton(this, 130, 60, '← Titre', () => this.backToTitle(), { width: 180, height: 76 });
    addTextButton(
      this,
      GAME_WIDTH - 140,
      60,
      'Sauvegarder',
      () => this.scene.start('Slots', { mode: 'save', returnTo: 'IsoTest' }),
      { width: 220, height: 76 },
    );
  }

  update(_time: number, delta: number): void {
    this.state.playTimeSeconds += delta / 1000;
  }

  private backToTitle(): void {
    const result = saveStore.write('auto', this.state);
    if (!result.ok) console.warn('Sauvegarde auto impossible :', result.error);
    this.scene.start('Title');
  }

  private moveTo(tile: Tile): void {
    this.state.position = { col: tile.col, row: tile.row };
    const target = this.toWorld(tile);
    this.highlight.clear();
    this.drawDiamond(this.highlight, tile, COLORS.copper, COLORS.parchment, 0.9, 0.35);
    this.tweens.add({ targets: this.marker, x: target.x, y: target.y - 6, duration: 180, ease: 'Sine.easeOut' });
  }

  private toWorld(tile: Tile): { x: number; y: number } {
    const p = tileToScreen(tile);
    return { x: this.originX + p.x, y: this.originY + p.y };
  }

  private drawDiamond(
    g: Phaser.GameObjects.Graphics,
    tile: Tile,
    fill: number,
    stroke: number,
    strokeAlpha: number,
    fillAlpha = 1,
  ): void {
    const { x, y } = this.toWorld(tile);
    const points = [
      new Phaser.Math.Vector2(x, y - TILE_HEIGHT / 2),
      new Phaser.Math.Vector2(x + TILE_WIDTH / 2, y),
      new Phaser.Math.Vector2(x, y + TILE_HEIGHT / 2),
      new Phaser.Math.Vector2(x - TILE_WIDTH / 2, y),
    ];
    g.fillStyle(fill, fillAlpha);
    g.fillPoints(points, true);
    g.lineStyle(1, stroke, strokeAlpha);
    g.strokePoints(points, true);
  }
}
