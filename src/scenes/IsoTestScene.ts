import Phaser from 'phaser';
import { TILE_HEIGHT, TILE_WIDTH, isInside, screenToTile, tileToScreen, type Tile } from '../engine/iso';
import { COLORS, CSS, FONT_SERIF, GAME_WIDTH } from '../ui/theme';

const COLS = 12;
const ROWS = 12;

/** Temporary test ground: proves isometric rendering and tap/click-to-move on every target device. */
export class IsoTestScene extends Phaser.Scene {
  private originX = 0;
  private originY = 0;
  private marker!: Phaser.GameObjects.Ellipse;
  private highlight!: Phaser.GameObjects.Graphics;
  private position: Tile = { col: 0, row: 0 };

  constructor() {
    super('IsoTest');
  }

  create(): void {
    this.originX = GAME_WIDTH / 2;
    this.originY = 160;

    const grid = this.add.graphics();
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        const shade = (col + row) % 2 === 0 ? 0x2a211c : 0x332822;
        this.drawDiamond(grid, { col, row }, shade, COLORS.copper, 0.25);
      }
    }

    this.highlight = this.add.graphics();
    const start = this.toWorld(this.position);
    this.marker = this.add.ellipse(start.x, start.y - 6, 26, 26, COLORS.parchment).setStrokeStyle(2, COLORS.copper);

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      const tile = screenToTile({ x: pointer.worldX - this.originX, y: pointer.worldY - this.originY });
      if (!isInside(tile, COLS, ROWS)) return;
      this.moveTo(tile);
    });

    this.add.text(24, 20, 'Terrain d’essai — touche ou clique une case', {
      fontFamily: FONT_SERIF,
      fontSize: '22px',
      color: CSS.parchment,
    });

    const back = this.add
      .text(24, 60, '← Titre', { fontFamily: FONT_SERIF, fontSize: '22px', color: CSS.copper })
      .setPadding(8, 8, 8, 8)
      .setInteractive({ useHandCursor: true });
    back.on('pointerup', (_p: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => {
      event.stopPropagation();
      this.scene.start('Title');
    });
  }

  private moveTo(tile: Tile): void {
    this.position = tile;
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
