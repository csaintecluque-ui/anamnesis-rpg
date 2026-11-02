import Phaser from 'phaser';
import type { Tile } from '../engine/iso';
import { findCompanion } from '../rules/companions';
import { CSS, FONT_SERIF } from '../ui/theme';
import { HAS_MOUSE } from '../ui/viewport';

interface Follower {
  id: string;
  tile: Tile;
  image: Phaser.GameObjects.Image;
  label: Phaser.GameObjects.Text;
}

export interface PartyHost {
  frames: Record<string, number>;
  feet: (tile: Tile) => { x: number; y: number };
  walkable: (tile: Tile) => boolean;
}

/**
 * The companions on the map (docs/gdd/jalon-3.md, étape 2): they follow the hero one step behind, in single file,
 * and a tap on one opens their dialogue (`compagnon-<id>`). They never block the way.
 */
export class PartyLayer {
  private followers: Follower[] = [];
  /** The hero's last cells, most recent first: where the followers go. */
  private trail: Tile[] = [];

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly host: PartyHost,
  ) {}

  /** Places the party around the hero's starting cell. */
  spawn(ids: string[], start: Tile): void {
    for (const f of this.followers) {
      f.image.destroy();
      f.label.destroy();
    }
    this.followers = [];
    this.trail = [];
    const free = this.freeAround(start, ids.length);
    ids.forEach((id, i) => {
      const def = findCompanion(id);
      if (!def) return;
      const tile = free[i] ?? start;
      const f = this.host.feet(tile);
      const image = this.scene.add
        .image(f.x, f.y, 'tiles', this.host.frames[def.tile] ?? this.host.frames.pnj)
        .setOrigin(0.5, 1)
        .setDepth(f.y);
      const label = this.scene.add
        .text(f.x, f.y - 70, def.name.split(' ')[0], {
          fontFamily: FONT_SERIF,
          fontSize: HAS_MOUSE ? '13px' : '17px',
          color: CSS.copper,
          stroke: CSS.ink,
          strokeThickness: 3,
        })
        .setOrigin(0.5, 1)
        .setDepth(100000);
      this.followers.push({ id, tile, image, label });
    });
  }

  /** The hero leaves `from`: each follower moves to the cell the one before it (or the hero) just left. */
  heroStepped(from: Tile, durationMs: number): void {
    this.trail.unshift(from);
    this.trail.length = Math.min(this.trail.length, this.followers.length);
    this.followers.forEach((follower, i) => {
      const goal = this.trail[i];
      if (!goal || (goal.col === follower.tile.col && goal.row === follower.tile.row)) return;
      follower.tile = goal;
      const f = this.host.feet(goal);
      this.scene.tweens.add({
        targets: follower.image,
        x: f.x,
        y: f.y,
        duration: durationMs,
        onUpdate: () => {
          follower.image.setDepth(follower.image.y);
          follower.label.setPosition(follower.image.x, follower.image.y - 70);
        },
      });
    });
  }

  /** The companion under the pointer, if any. */
  hit(x: number, y: number): string | null {
    const hit = this.followers.find((f) => f.image.getBounds().contains(x, y));
    return hit ? hit.id : null;
  }

  private freeAround(center: Tile, count: number): Tile[] {
    const out: Tile[] = [];
    for (let r = 1; r <= 3 && out.length < count; r++) {
      for (let dc = -r; dc <= r && out.length < count; dc++) {
        for (let dr = -r; dr <= r && out.length < count; dr++) {
          if (Math.max(Math.abs(dc), Math.abs(dr)) !== r) continue;
          const t = { col: center.col + dc, row: center.row + dr };
          if (this.host.walkable(t)) out.push(t);
        }
      }
    }
    return out;
  }
}
