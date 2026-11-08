import Phaser from 'phaser';
import type { Tile } from '../engine/iso';
import { cellKinds, miniLayout, miniLength, miniPoint, miniTile, type CellKind, type MiniLayout } from '../engine/miniMap';
import type { GameMap } from '../engine/tiledMap';
import tileColors from '../data/tile-colors.json';
import { COLORS } from './theme';

/**
 * La mini-carte du lieu (étude du 2026-11-03, A7), drawn in the HUD: the place's cells, its exits, the people and the
 * enemies on it, the hero, and the frame of what the view shows. A click (or a drag) on it moves the view there, as
 * dragging the map does; M or the options hide it (docs/gdd/interface.md).
 */

export type MiniMarkerKind = 'person' | 'enemy' | 'exit' | 'echo';

export interface MiniMarker extends Tile {
  kind: MiniMarkerKind;
}

/** What the map gives the HUD (src/scenes/MapScene.ts, through the registry). */
export interface MiniMapSource {
  map: GameMap;
  /** The hero's feet, in the map's pixels from the centre of cell (0, 0). */
  hero(): { x: number; y: number };
  markers(): MiniMarker[];
  /** What the view shows, in the map's pixels from the centre of cell (0, 0). */
  view(): { x: number; y: number; width: number; height: number };
  lookAt(tile: Tile): void;
}

/** Registry key of the current place's MiniMapSource. */
export const MINI_MAP_SOURCE = 'miniMapSource';

const CELL_COLORS: Record<Exclude<CellKind, 'void'>, { color: number; alpha: number }> = {
  ground: { color: 0x4a5a34, alpha: 0.9 },
  path: { color: 0xb59b74, alpha: 0.95 },
  water: { color: 0x2c4a55, alpha: 1 },
  blocked: { color: 0x2a3220, alpha: 0.9 },
};
const MARKER_COLORS: Record<MiniMarkerKind, number> = { person: COLORS.copper, enemy: COLORS.blocked, exit: COLORS.parchment, echo: 0x7fe3e0 };

export class MiniMap {
  private readonly frame: Phaser.GameObjects.Rectangle;
  private readonly cells: Phaser.GameObjects.Graphics;
  private readonly marks: Phaser.GameObjects.Graphics;
  private readonly layout: MiniLayout;
  private readonly inner: { x: number; y: number; width: number; height: number };
  private drawn = '';

  constructor(
    scene: Phaser.Scene,
    private readonly source: MiniMapSource,
    box: { x: number; y: number; width: number; height: number },
    onHover: (inside: boolean, x: number, y: number) => void,
  ) {
    const pad = 6;
    this.inner = { x: box.x + pad, y: box.y + pad, width: box.width - 2 * pad, height: box.height - 2 * pad };
    const { map } = source;
    this.layout = miniLayout(map.width, map.height, this.inner);
    // Interactive: a click here moves the view and does not walk the hero on the map below.
    this.frame = scene.add
      .rectangle(box.x, box.y, box.width, box.height, COLORS.ink, 0.88)
      .setOrigin(0, 0)
      .setStrokeStyle(1, COLORS.copper, 0.8)
      .setInteractive();
    this.cells = scene.add.graphics();
    this.marks = scene.add.graphics();
    this.drawCells(cellKinds(map));
    const look = (pointer: Phaser.Input.Pointer) => {
      const tile = miniTile(this.layout, pointer.worldX - this.inner.x, pointer.worldY - this.inner.y);
      source.lookAt({ col: Phaser.Math.Clamp(tile.col, 0, map.width - 1), row: Phaser.Math.Clamp(tile.row, 0, map.height - 1) });
    };
    this.frame.on('pointerdown', look);
    this.frame.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) look(pointer);
      onHover(true, pointer.worldX, pointer.worldY);
    });
    this.frame.on('pointerout', () => onHover(false, 0, 0));
  }

  setVisible(visible: boolean): void {
    this.frame.setVisible(visible);
    this.cells.setVisible(visible);
    this.marks.setVisible(visible);
    if (visible) this.frame.setInteractive();
    else this.frame.disableInteractive();
  }

  get visible(): boolean {
    return this.frame.visible;
  }

  /** Redraws the hero, the markers and the view's frame when one of them has moved. */
  update(): void {
    if (!this.frame.visible) return;
    let hero: { x: number; y: number };
    let view: ReturnType<MiniMapSource['view']>;
    let markers: MiniMarker[];
    try {
      hero = this.toMini(this.source.hero());
      view = this.source.view();
      markers = this.source.markers();
    } catch {
      // The map is being rebuilt (another place): the HUD restarts with it.
      return;
    }
    const key = [hero.x, hero.y, view.x, view.y, view.width].map((v) => Math.round(v)).join(',') + markers.map((m) => `${m.kind}${m.col},${m.row}`).join(';');
    if (key === this.drawn) return;
    this.drawn = key;
    const g = this.marks.clear();
    const s = this.layout.scale;
    const dot = Math.max(2, s * 0.8);
    for (const m of markers) {
      const p = this.at(miniPoint(this.layout, m));
      if (m.kind === 'exit') {
        g.lineStyle(1.5, MARKER_COLORS.exit, 1);
        g.strokePoints([{ x: p.x, y: p.y - dot * 1.4 }, { x: p.x + dot * 1.8, y: p.y }, { x: p.x, y: p.y + dot * 1.4 }, { x: p.x - dot * 1.8, y: p.y }], true);
      } else g.fillStyle(MARKER_COLORS[m.kind], 1).fillCircle(p.x, p.y, dot);
    }
    // The frame of the view, clipped to the box.
    const topLeft = this.toMini({ x: view.x, y: view.y });
    const left = Math.max(this.inner.x, topLeft.x);
    const top = Math.max(this.inner.y, topLeft.y);
    const right = Math.min(this.inner.x + this.inner.width, topLeft.x + miniLength(this.layout, view.width));
    const bottom = Math.min(this.inner.y + this.inner.height, topLeft.y + miniLength(this.layout, view.height));
    if (right > left && bottom > top) g.lineStyle(1, COLORS.parchment, 0.55).strokeRect(left, top, right - left, bottom - top);
    // The hero last, above everything: a bright dot ringed in ink.
    g.fillStyle(COLORS.ink, 1).fillCircle(hero.x, hero.y, dot + 2);
    g.fillStyle(COLORS.parchment, 1).fillCircle(hero.x, hero.y, dot + 0.5);
  }

  /** True when (x, y), in the HUD's coordinates, lies on the mini-map. */
  contains(x: number, y: number): boolean {
    return this.frame.visible && this.frame.getBounds().contains(x, y);
  }

  private drawCells(kinds: CellKind[]): void {
    const { map } = this.source;
    const s = this.layout.scale;
    const g = this.cells;
    const painted = tileColors as (string | null)[];
    const colorOf = (frame: number): number | null => {
      const hex = frame >= 0 ? painted[frame] : null;
      return hex ? Number.parseInt(hex.slice(1), 16) : null;
    };
    kinds.forEach((kind, i) => {
      if (kind === 'void') return;
      const p = this.at(miniPoint(this.layout, { col: i % map.width, row: Math.floor(i / map.width) }));
      // The cell's own colours (mise en beauté, 2026-11-08): what stands on it, else its ground; the four kinds of
      // the first mini-map only when a frame has no colour.
      const standing = map.obstacles[i] >= 0 ? colorOf(map.obstacles[i]) : null;
      const ground = colorOf(map.ground[i]);
      const color = standing ?? ground ?? CELL_COLORS[kind].color;
      const diamond = [{ x: p.x, y: p.y - s / 2 - 0.3 }, { x: p.x + s + 0.4, y: p.y }, { x: p.x, y: p.y + s / 2 + 0.3 }, { x: p.x - s - 0.4, y: p.y }];
      // A hair larger than the cell, so that no seam shows between neighbours; what stands is a shade darker.
      g.fillStyle(standing !== null ? Phaser.Display.Color.ValueToColor(color).darken(18).color : color, 1).fillPoints(diamond, true);
    });
  }

  /** A point of the inner box, in the HUD's coordinates. */
  private at(p: { x: number; y: number }): { x: number; y: number } {
    return { x: this.inner.x + p.x, y: this.inner.y + p.y };
  }

  /** A point of the big map (pixels from the centre of cell (0, 0)), in the HUD's coordinates. */
  private toMini(p: { x: number; y: number }): { x: number; y: number } {
    return this.at({ x: this.layout.x + miniLength(this.layout, p.x), y: this.layout.y + miniLength(this.layout, p.y) });
  }
}
