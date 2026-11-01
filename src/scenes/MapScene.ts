import Phaser from 'phaser';
import { DIALOGUES } from '../data/dialogues';
import gardeboisJson from '../data/maps/gardebois.json';
import gareEngloutieJson from '../data/maps/gare-engloutie.json';
import npcData from '../data/npcs.json';
import { TILE_HEIGHT, TILE_WIDTH, screenToTile, tileToScreen, type Tile } from '../engine/iso';
import { findPath } from '../engine/pathfinding';
import { findObject, isWalkable, parseTiledMap, tileKey, type GameMap, type MapObject, type TiledMapJson } from '../engine/tiledMap';
import { findLocation, type GameState } from '../state/gameState';
import { COLORS, CSS, FONT_SERIF } from '../ui/theme';
import type { CombatStartData } from './CombatScene';
import type { HudScene } from './HudScene';

/** Map objects drawn by an obstacle tile on the same cell, and touchable on that tile's image. */
const INTERACTIVE_OBSTACLES = new Set(['panneau', 'echo', 'golem', 'coffre']);

const MAPS: Record<string, TiledMapJson> = {
  gardebois: gardeboisJson as TiledMapJson,
  'gare-engloutie': gareEngloutieJson as TiledMapJson,
};

/** Room above the top row for tall tiles (frames are 96 px high for a 32 px diamond). */
const TOP_MARGIN = 80;
const ZOOM = 1.5;
const STEP_MS = 160;

export class MapScene extends Phaser.Scene {
  private state!: GameState;
  private map!: GameMap;
  private originX = 0;
  private originY = 0;
  private hero!: Phaser.GameObjects.Image;
  private heroTile: Tile = { col: 0, row: 0 };
  private occupied = new Set<string>();
  private path: Tile[] = [];
  private moving = false;
  private pendingGoal: Tile | null = null;
  private arrival: (() => void) | null = null;
  private marker!: Phaser.GameObjects.Graphics;
  /** NPCs and signs, hit-tested on their whole image: a tap on a body lands on the tile behind its feet. */
  private interactables: { object: MapObject; image: Phaser.GameObjects.Image }[] = [];

  constructor() {
    super('Map');
  }

  create(): void {
    const state = this.registry.get('game') as GameState | undefined;
    const location = state && findLocation(state.location);
    if (!state?.character || !location) {
      this.scene.start('Creation');
      return;
    }
    this.state = state;
    this.map = parseTiledMap(MAPS[location.map]);
    this.registry.set('tileFrames', this.map.frames);
    this.originX = this.map.height * (TILE_WIDTH / 2);
    this.originY = TOP_MARGIN;
    this.occupied = new Set(this.map.objects.filter((o) => o.type === 'pnj').map(tileKey));
    this.path = [];
    this.moving = false;
    this.pendingGoal = null;
    this.arrival = null;
    this.interactables = [];

    this.drawGround();
    this.drawObstacles();
    this.drawNpcs();
    this.marker = this.add.graphics().setDepth(1);

    this.heroTile = this.startTile(location.entrance);
    this.state.position = { ...this.heroTile };
    this.state.entrance = null;
    const start = this.feet(this.heroTile);
    this.hero = this.add.image(start.x, start.y, 'tiles', this.map.frames.heros).setOrigin(0.5, 1).setDepth(start.y);

    const worldWidth = (this.map.width + this.map.height) * (TILE_WIDTH / 2);
    const worldHeight = (this.map.width + this.map.height) * (TILE_HEIGHT / 2) + TOP_MARGIN;
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight).setZoom(ZOOM).setBackgroundColor(COLORS.ink);
    this.cameras.main.startFollow(this.hero, true, 0.15, 0.15);
    this.cameras.main.centerOn(start.x, start.y);

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => this.onTap(pointer));

    this.scene.launch('Hud', { locationName: location.name });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.scene.stop('Hud'));
  }

  update(_time: number, delta: number): void {
    if (this.state) this.state.playTimeSeconds += delta / 1000;
  }

  // --- Drawing ------------------------------------------------------------

  private center(tile: Tile): { x: number; y: number } {
    const p = tileToScreen(tile);
    return { x: this.originX + p.x, y: this.originY + p.y };
  }

  /** Bottom of a tile's diamond: where frames are anchored, and the depth used for sorting. */
  private feet(tile: Tile): { x: number; y: number } {
    const c = this.center(tile);
    return { x: c.x, y: c.y + TILE_HEIGHT / 2 };
  }

  private drawGround(): void {
    const width = (this.map.width + this.map.height) * (TILE_WIDTH / 2);
    const height = (this.map.width + this.map.height) * (TILE_HEIGHT / 2) + TOP_MARGIN;
    const rt = this.add.renderTexture(0, 0, width, height).setOrigin(0, 0).setDepth(0);
    for (let row = 0; row < this.map.height; row++) {
      for (let col = 0; col < this.map.width; col++) {
        const frame = this.map.ground[row * this.map.width + col];
        if (frame < 0) continue;
        const f = this.feet({ col, row });
        rt.drawFrame('tiles', frame, f.x - TILE_WIDTH / 2, f.y - 96);
      }
    }
  }

  private drawObstacles(): void {
    for (let row = 0; row < this.map.height; row++) {
      for (let col = 0; col < this.map.width; col++) {
        const frame = this.map.obstacles[row * this.map.width + col];
        if (frame < 0) continue;
        const f = this.feet({ col, row });
        const image = this.add.image(f.x, f.y, 'tiles', frame).setOrigin(0.5, 1).setDepth(f.y);
        const marker = this.map.objects.find(
          (o) => INTERACTIVE_OBSTACLES.has(o.type) && o.col === col && o.row === row,
        );
        if (marker) this.interactables.push({ object: marker, image });
      }
    }
  }

  private drawNpcs(): void {
    for (const npc of this.map.objects.filter((o) => o.type === 'pnj')) {
      const f = this.feet(npc);
      const image = this.add.image(f.x, f.y, 'tiles', this.map.frames.pnj).setOrigin(0.5, 1).setDepth(f.y);
      this.interactables.push({ object: npc, image });
      this.add
        .text(f.x, f.y - 62, npcName(npc), { fontFamily: FONT_SERIF, fontSize: '13px', color: CSS.parchment, stroke: CSS.ink, strokeThickness: 3 })
        .setOrigin(0.5, 1)
        .setDepth(100000);
    }
  }

  // --- Placement & movement ----------------------------------------------

  private walkable = (tile: Tile): boolean => isWalkable(this.map, tile, this.occupied);

  private startTile(defaultEntrance: string): Tile {
    const named = this.state.entrance ? findObject(this.map, this.state.entrance) : undefined;
    if (named && this.walkable(named)) return { col: named.col, row: named.row };
    if (!this.state.entrance && this.walkable(this.state.position)) return { ...this.state.position };
    const fallback = findObject(this.map, defaultEntrance);
    if (!fallback) throw new Error(`Map has no "${defaultEntrance}" entrance`);
    return { col: fallback.col, row: fallback.row };
  }

  private onTap(pointer: Phaser.Input.Pointer): void {
    const tile = screenToTile({ x: pointer.worldX - this.originX, y: pointer.worldY - this.originY });
    const hit = this.interactables
      .filter(({ object, image }) => (object.col === tile.col && object.row === tile.row) || hitsBody(image, pointer.worldX, pointer.worldY))
      .sort((a, b) => b.image.depth - a.image.depth)[0];
    if (hit) {
      const target = hit.object;
      this.walkNextTo(target, () => this.interact(target));
      return;
    }
    if (!this.walkable(tile)) return;
    this.goTo(tile, () => this.checkExit());
  }

  private walkNextTo(target: MapObject, then: () => void): void {
    const candidates = [-1, 0, 1]
      .flatMap((dc) => [-1, 0, 1].map((dr) => ({ col: target.col + dc, row: target.row + dr })))
      .filter((t) => (t.col !== target.col || t.row !== target.row) && this.walkable(t));
    const here = this.moving && this.path.length > 0 ? this.path[0] : this.heroTile;
    let best: { tile: Tile; length: number } | null = null;
    for (const tile of candidates) {
      if (tile.col === here.col && tile.row === here.row) {
        best = { tile, length: 0 };
        break;
      }
      const p = findPath(here, tile, this.walkable);
      if (p && (!best || p.length < best.length)) best = { tile, length: p.length };
    }
    if (best) this.goTo(best.tile, then);
  }

  private goTo(goal: Tile, onArrive: () => void): void {
    this.arrival = onArrive;
    this.showMarker(goal);
    if (this.moving) {
      this.pendingGoal = goal;
      return;
    }
    this.followPathTo(goal);
  }

  private followPathTo(goal: Tile): void {
    const path = findPath(this.heroTile, goal, this.walkable);
    if (!path) return;
    this.path = path;
    this.stepAlong();
  }

  private stepAlong(): void {
    if (this.pendingGoal) {
      const goal = this.pendingGoal;
      this.pendingGoal = null;
      this.path = findPath(this.heroTile, goal, this.walkable) ?? [];
    }
    const next = this.path.shift();
    if (!next) {
      this.moving = false;
      this.marker.clear();
      const done = this.arrival;
      this.arrival = null;
      done?.();
      return;
    }
    this.moving = true;
    const diagonal = next.col !== this.heroTile.col && next.row !== this.heroTile.row;
    const target = this.feet(next);
    this.tweens.add({
      targets: this.hero,
      x: target.x,
      y: target.y,
      duration: diagonal ? STEP_MS * 1.4 : STEP_MS,
      onUpdate: () => this.hero.setDepth(this.hero.y),
      onComplete: () => {
        this.heroTile = next;
        this.state.position = { ...next };
        this.stepAlong();
      },
    });
  }

  private showMarker(tile: Tile): void {
    const c = this.center(tile);
    this.marker.clear();
    this.marker.lineStyle(2, COLORS.copper, 0.9);
    this.marker.strokePoints(
      [
        new Phaser.Math.Vector2(c.x, c.y - TILE_HEIGHT / 2),
        new Phaser.Math.Vector2(c.x + TILE_WIDTH / 2, c.y),
        new Phaser.Math.Vector2(c.x, c.y + TILE_HEIGHT / 2),
        new Phaser.Math.Vector2(c.x - TILE_WIDTH / 2, c.y),
      ],
      true,
    );
  }

  // --- Interactions ------------------------------------------------------

  private hud(): HudScene {
    return this.scene.get('Hud') as HudScene;
  }

  private interact(target: MapObject): void {
    if (target.type === 'panneau') {
      this.hud().toast(target.properties.texte ?? '…');
      return;
    }
    if (target.type === 'golem') {
      this.startGolemFight();
      return;
    }
    if (DIALOGUES[target.name]) {
      this.scene.pause();
      this.scene.launch('Dialogue', { id: target.name });
      return;
    }
    const npc = npcData.find((n) => n.id === target.name);
    this.hud().toast(npc ? `${npc.name} — ${npc.role}.` : '…');
  }

  private startGolemFight(): void {
    if (this.state.flags['golem-vaincu']) {
      this.hud().toast('Le Golem de Ferraille gît immobile, silencieux.');
      return;
    }
    if (this.state.flags['chantier-arrete'] || this.state.quests['dernier-train'] !== 'active') {
      this.hud().toast('Le Golem de Ferraille ne bouge plus.');
      return;
    }
    this.registry.set('tileFrames', this.map.frames);
    this.scene.pause();
    this.scene.pause('Hud');
    this.scene.launch('Combat', {
      enemyIds: ['golem-ferraille', 'rodeur-epine', 'rodeur-epine'],
      victoryEffects: [{ setFlag: 'chantier-arrete' }, { completeQuest: 'dernier-train' }, { giveXp: 40 }, { giveFers: 30 }],
      victoryFlag: 'golem-vaincu',
      obstacles: [
        { col: 4, row: 0 },
        { col: 4, row: 6 },
      ],
    } satisfies CombatStartData);
  }

  private checkExit(): void {
    const exit = this.map.objects.find((o) => o.type === 'sortie' && o.col === this.heroTile.col && o.row === this.heroTile.row);
    if (!exit) return;
    const destination = exit.properties.cible ? findLocation(exit.properties.cible) : undefined;
    if (!destination) {
      this.hud().toast(`${exit.properties.libelle ?? 'Sortie'} : cette carte arrive bientôt.`);
      return;
    }
    this.state.location = destination.id;
    this.state.entrance = exit.properties.arrivee ?? destination.entrance;
    this.scene.start('Map');
  }
}

/** Frames are 64 × 96 with transparent margins; only the central part counts as the body. */
function hitsBody(image: Phaser.GameObjects.Image, x: number, y: number): boolean {
  const left = image.x - 18;
  const right = image.x + 18;
  const top = image.y - 62;
  const bottom = image.y - 4;
  return x >= left && x <= right && y >= top && y <= bottom;
}

function npcName(o: MapObject): string {
  return npcData.find((n) => n.id === o.name)?.name ?? o.name;
}
