import Phaser from 'phaser';
import { FACINGS, facingOf, type Facing } from '../engine/facing';
import type { Tile } from '../engine/iso';
import { findPath } from '../engine/pathfinding';
import { tileKey } from '../engine/tiledMap';
import { figurantsAt, isStanding, walkSheetKey, type FigurantDef } from '../rules/figurants';
import { fontPx } from '../settings';
import { COLORS, CSS, FONT_SERIF } from '../ui/theme';

const STEP_MS = 430;
const TALK_MS = 3800;
const BUBBLE_WIDTH = 230;
/** Walk sheets: 64 px wide frames, one row per facing (docs/gdd/animation.md). */
const WALK_FRAME_WIDTH = 64;
const WALK_FPS = 12;

/** Passers-by on the map: walking, standing, talking (docs/gdd/figurants.md). */
interface Walker {
  def: FigurantDef;
  image: Phaser.GameObjects.Sprite;
  /** Painted walk sheet, or null: the provisional tile hops along. */
  sheet: string | null;
  facing: Facing;
  tile: Tile;
  /** Index of the waypoint walked to. */
  target: number;
  /** Talking: no step before this time (scene clock). */
  busyUntil: number;
  /** Next line to say. */
  line: number;
  bubble?: Phaser.GameObjects.Container;
}

export interface FigurantHost {
  frames: Record<string, number>;
  /** Bottom of a cell's diamond, where frames are anchored. */
  feet(tile: Tile): { x: number; y: number };
  /** Cells free of obstacles and NPCs. */
  walkable(tile: Tile): boolean;
  heroTile(): Tile;
}

export class FigurantLayer {
  private walkers: Walker[] = [];

  constructor(
    private scene: Phaser.Scene,
    private host: FigurantHost,
  ) {}

  spawn(location: string): void {
    for (const def of figurantsAt(location)) {
      const [col, row] = def.path[0];
      const tile = { col, row };
      const f = this.host.feet(tile);
      const image = this.scene.add
        .sprite(f.x, f.y, 'tiles', this.host.frames[def.tile] ?? this.host.frames.pnj)
        .setOrigin(0.5, 1)
        .setDepth(f.y);
      const sheet = this.setUpWalk(def);
      const walker: Walker = { def, image, sheet, facing: 's', tile, target: Math.min(1, def.path.length - 1), busyUntil: 0, line: 0 };
      this.walkers.push(walker);
      this.standStill(walker);
      if (!isStanding(def)) this.later(walker, Math.random() * 1500);
    }
  }

  /** The topmost passer-by under the pointer (on their whole body), if any. */
  hit(x: number, y: number): Walker | undefined {
    return this.walkers
      .filter(({ image }) => x >= image.x - 16 && x <= image.x + 16 && y >= image.y - 64 && y <= image.y - 2)
      .sort((a, b) => b.image.depth - a.image.depth)[0];
  }

  /** They stop and turn to the hero for a while (a dialogue opens instead of a bubble). */
  hold(w: Walker): void {
    if (w.sheet) {
      w.facing = facingOf(w.tile, this.host.heroTile());
      this.standStill(w);
    }
    w.busyUntil = this.scene.time.now + TALK_MS;
  }

  /** They stop, turn to the hero and say their next line. */
  talk(w: Walker): void {
    const hero = this.host.feet(this.host.heroTile());
    if (w.sheet) {
      w.facing = facingOf(w.tile, this.host.heroTile());
      this.standStill(w);
    } else w.image.setFlipX(hero.x < w.image.x);
    w.busyUntil = this.scene.time.now + TALK_MS;
    const line = w.def.lines[w.line % w.def.lines.length];
    w.line++;
    w.bubble?.destroy();
    const name = this.scene.add.text(0, 0, w.def.name, { fontFamily: FONT_SERIF, fontSize: fontPx(11), color: CSS.copper, fontStyle: 'italic' });
    const text = this.scene.add.text(0, name.height + 2, `« ${line} »`, {
      fontFamily: FONT_SERIF,
      fontSize: fontPx(12),
      color: CSS.parchment,
      wordWrap: { width: BUBBLE_WIDTH },
    });
    const width = Math.max(name.width, text.width) + 16;
    const height = name.height + text.height + 12;
    const frame = this.scene.add.rectangle(-8, -6, width, height, COLORS.ink, 0.9).setOrigin(0, 0).setStrokeStyle(1, COLORS.copper, 0.9);
    const bubble = this.scene.add.container(w.image.x - width / 2 + 8, w.image.y - 70 - height, [frame, name, text]).setDepth(100001);
    w.bubble = bubble;
    this.scene.time.delayedCall(TALK_MS, () => {
      if (w.bubble === bubble) {
        bubble.destroy();
        w.bubble = undefined;
      }
    });
  }

  /** Cells taken by people who stand still: the hero walks around them. */
  standingTiles(): Tile[] {
    return this.walkers.filter((w) => isStanding(w.def)).map((w) => w.tile);
  }

  /** Walk animations of a painted figurant, one per facing; null without a sheet. */
  private setUpWalk(def: FigurantDef): string | null {
    const key = walkSheetKey(def);
    if (!def.walk || !this.scene.textures.exists(key)) return null;
    const columns = Math.floor(this.scene.textures.get(key).getSourceImage().width / WALK_FRAME_WIDTH);
    FACINGS.forEach((facing, row) => {
      const anim = `${key}-${facing}`;
      if (this.scene.anims.exists(anim)) return;
      const frames = this.scene.anims.generateFrameNumbers(key, { start: row * columns, end: row * columns + columns - 1 });
      this.scene.anims.create({ key: anim, frames, frameRate: WALK_FPS, repeat: -1 });
    });
    return key;
  }

  private standStill(w: Walker): void {
    if (!w.sheet) return;
    const anim = this.scene.anims.get(`${w.sheet}-${w.facing}`);
    w.image.stop().setTexture(w.sheet, anim.frames[0].frame.name);
  }

  private later(w: Walker, delay: number): void {
    this.standStill(w);
    this.scene.time.delayedCall(delay, () => this.step(w));
  }

  private step(w: Walker): void {
    if (!w.image.active) return;
    const now = this.scene.time.now;
    if (now < w.busyUntil) {
      this.later(w, w.busyUntil - now + 50);
      return;
    }
    const [col, row] = w.def.path[w.target];
    if (w.tile.col === col && w.tile.row === row) {
      w.target = (w.target + 1) % w.def.path.length;
      this.later(w, 600 + Math.random() * 1600);
      return;
    }
    const taken = new Set([tileKey(this.host.heroTile()), ...this.walkers.filter((o) => o !== w).map((o) => tileKey(o.tile))]);
    const next = findPath(w.tile, { col, row }, (t) => this.host.walkable(t) && !taken.has(tileKey(t)))?.[0];
    if (!next) {
      this.later(w, 700);
      return;
    }
    const from = this.host.feet(w.tile);
    const to = this.host.feet(next);
    if (w.sheet) {
      w.facing = facingOf(w.tile, next);
      w.image.play(`${w.sheet}-${w.facing}`, true);
    } else if (to.x !== from.x) w.image.setFlipX(to.x < from.x);
    const diagonal = next.col !== w.tile.col && next.row !== w.tile.row;
    w.tile = next;
    this.scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: STEP_MS * (w.def.pace ?? 1) * (diagonal ? 1.4 : 1),
      onUpdate: (tween) => {
        const p = tween.getValue() ?? 0;
        // A small hop at each step for the provisional tiles, which have no walk animation.
        const hop = w.sheet ? 0 : Math.sin(p * Math.PI) * 3;
        w.image.setPosition(from.x + (to.x - from.x) * p, from.y + (to.y - from.y) * p - hop);
        w.image.setDepth(from.y + (to.y - from.y) * p);
      },
      onComplete: () => this.step(w),
    });
  }
}
