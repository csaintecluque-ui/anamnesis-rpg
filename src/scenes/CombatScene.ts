import Phaser from 'phaser';
import { coverAt, isEdge, isOpen, type Arena } from '../engine/arena';
import { TILE_HEIGHT, TILE_WIDTH, screenToTile, tileToScreen, type Tile } from '../engine/iso';
import { FACINGS, facingOf, type Facing } from '../engine/facing';
import { findPath, reachable } from '../engine/pathfinding';
import { tileKey } from '../engine/tiledMap';
import { applyEffects, type Effect } from '../rules/dialogue';
import {
  ZONES,
  canAttack,
  coverBetween,
  distance,
  findEnemy,
  findZone,
  hitChance,
  isDefeat,
  isVictory,
  makeEnemyCombatant,
  makeHeroCombatant,
  moveAlong,
  numberDuplicateNames,
  resolveAttack,
  rollInitiative,
  startTurn,
  type AttackProfile,
  type Combatant,
  type Zone,
} from '../rules/combat';
import { DEFAULT_AVATAR } from '../rules/character';
import { findLocation, type GameState } from '../state/gameState';
import { addTextButton, type TextButton } from '../ui/button';
import { DIGIT_KEYS, SHOW_KEY_HINTS, onKeys } from '../ui/keys';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';
import { HAS_MOUSE } from '../ui/viewport';
import type { HudScene } from './HudScene';

const TOP = 70;

/** Finger-sized on touch screens, compact with a mouse (docs/gdd/interface.md). */
const LAYOUT = HAS_MOUSE
  ? { arenaScale: 1.25, bottomBar: 96, buttonHeight: 48, buttonFont: 20, labelFont: 18, move: [100, 150], attack: [260, 150, 160], zone: [590, 170], endTurn: [770, 170], flee: [GAME_WIDTH - 90, 140] }
  : { arenaScale: 1, bottomBar: 150, buttonHeight: 76, buttonFont: 26, labelFont: 22, move: [150, 200], attack: [370, 180, 190], zone: [760, 200], endTurn: [970, 220], flee: [GAME_WIDTH - 110, 180] };
const LOG_Y = GAME_HEIGHT - LAYOUT.bottomBar - 30;
/** Turn order panel, left of the arena: names live here, not above the tokens where they overlapped. */
const ROSTER_X = 24;
const ROSTER_Y = 90;
const ROSTER_LINE = 28;
const HP_BAR_WIDTH = 44;
/** Readable board (docs/gdd/combat.md, « Lisibilité ») : grid, reach, target and turn colours. */
const GRID = { line: 0xead9b8, reach: 0x5bc8d6, target: 0xd0583a, turn: 0xc9804f };
const STEP_ANIM_MS = 150;
const WALK_FPS = 14;

/** Moving, or attacking with the hero's attack at this index (one per weapon in hand). */
type Mode = 'move' | number;

export interface CombatStartData {
  /** Enemy ids from enemies.json, one combatant per entry. */
  enemyIds: string[];
  /** Applied to the live state on victory (same shape as a dialogue's effects). */
  victoryEffects: Effect[];
  /** Flag set on victory so the encounter cannot be re-triggered. */
  victoryFlag: string;
  /** The piece of map the fight takes place on (src/engine/arena.ts). */
  arena: Arena;
  /** Starting cells, in arena coordinates: the hero's, then one per enemy id. */
  heroTile: Tile;
  enemyTiles: Tile[];
}

/** Turn-based combat on a piece of the explored map, with cover from its obstacles (docs/gdd/combat.md). */
export class CombatScene extends Phaser.Scene {
  private state!: GameState;
  private config!: CombatStartData;
  private combatants: Combatant[] = [];
  /** Tile name drawn for each combatant, by combatant id. */
  private tileNames = new Map<string, string>();
  private order: Combatant[] = [];
  private turnIndex = 0;
  private arena!: Arena;
  private mode: Mode = 'move';
  private zone: Zone = 'corps';
  private originX = 0;
  private originY = 0;
  private ended = false;
  private awaitingHero = false;

  private banner!: Phaser.GameObjects.Text;
  private log!: Phaser.GameObjects.Text;
  /** Above each token: a PV bar; one name at a time, the hovered token's or the current one's (no overlap). */
  private tokens = new Map<string, { image: Phaser.GameObjects.Sprite; hpBar: Phaser.GameObjects.Graphics; name: Phaser.GameObjects.Text }>();
  private hovered: string | null = null;
  private roster!: Phaser.GameObjects.Text;
  private zoneButton?: TextButton;
  private moveButton?: TextButton;
  private attackButtons: TextButton[] = [];
  private marker!: Phaser.GameObjects.Graphics;
  /** Grid, reach and hover drawn on the ground, under obstacles and fighters. */
  private overlay!: Phaser.GameObjects.Graphics;
  private hint!: Phaser.GameObjects.Text;
  private costLabel!: Phaser.GameObjects.Text;
  /** Where the hero can walk this turn, with the path to each tile (key "col,row"). */
  private reach = new Map<string, Tile[]>();
  private hoverTile: Tile | null = null;
  /** A move or an attack is being shown: input waits. */
  private busy = false;
  /** Obstacles of the arena, faded when they hide a fighter or the hovered cell. */
  private obstacleImages: Phaser.GameObjects.Image[] = [];

  constructor() {
    super('Combat');
  }

  create(data: CombatStartData): void {
    this.state = this.registry.get('game') as GameState;
    this.config = data;
    this.ended = false;
    this.mode = 'move';
    this.zone = 'corps';
    this.tokens.clear();
    this.obstacleImages = [];
    this.reach = new Map();
    this.hoverTile = null;
    this.busy = false;
    this.order = [];
    this.turnIndex = -1;

    this.arena = data.arena;
    const tiles = [] as Tile[];
    for (let row = 0; row < this.arena.rows; row++) for (let col = 0; col < this.arena.cols; col++) tiles.push({ col, row });
    const xs = tiles.map((t) => tileToScreen(t).x * LAYOUT.arenaScale);
    const ys = tiles.map((t) => tileToScreen(t).y * LAYOUT.arenaScale);
    this.originX = GAME_WIDTH / 2 - (Math.min(...xs) + Math.max(...xs)) / 2;
    // Room above the top row for tall obstacles (trees rise 64 units above their diamond).
    this.originY = TOP + 64 * LAYOUT.arenaScale - Math.min(...ys);

    const hero = makeHeroCombatant(this.state.character!, data.heroTile);
    const enemyDefs = data.enemyIds.map((id) => findEnemy(id)!);
    const enemies = enemyDefs.map((def, i) => makeEnemyCombatant(def, `${def.id}-${i}`, data.enemyTiles[i]));
    this.combatants = [hero, ...enemies];
    this.tileNames = new Map([[hero.id, 'heros'], ...enemies.map((c, i): [string, string] => [c.id, enemyDefs[i].tile])]);
    numberDuplicateNames(this.combatants);
    this.hovered = null;
    const initiativeBonus = new Map<string, number>(enemies.map((c, i) => [c.id, enemyDefs[i].initiativeBonus]));

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.ink, 0.97).setInteractive();
    this.drawArena();
    this.banner = this.add
      .text(GAME_WIDTH / 2, 30, '', { fontFamily: FONT_SERIF, fontSize: '26px', color: CSS.copper })
      .setOrigin(0.5);
    this.log = this.add
      .text(GAME_WIDTH / 2, LOG_Y, '', { fontFamily: FONT_SERIF, fontSize: '20px', color: CSS.parchment, align: 'center', wordWrap: { width: 1100 } })
      .setOrigin(0.5);
    this.marker = this.add.graphics().setDepth(5000);
    this.overlay = this.add.graphics().setDepth(1);
    this.hint = this.add
      .text(GAME_WIDTH / 2, 62, '', { fontFamily: FONT_SERIF, fontSize: '18px', color: CSS.muted })
      .setOrigin(0.5);
    this.costLabel = this.add
      .text(0, 0, '', { fontFamily: FONT_SERIF, fontSize: '18px', color: CSS.parchment, stroke: CSS.ink, strokeThickness: 4 })
      .setOrigin(0.5, 1)
      .setDepth(7000)
      .setVisible(false);
    this.add.text(ROSTER_X, ROSTER_Y - 34, 'Ordre du tour', { fontFamily: FONT_SERIF, fontSize: '20px', color: CSS.copper });
    this.roster = this.add.text(ROSTER_X, ROSTER_Y, '', {
      fontFamily: FONT_SERIF,
      fontSize: '18px',
      color: CSS.parchment,
      lineSpacing: ROSTER_LINE - 22,
    });

    for (const c of this.combatants) this.addToken(c);
    this.buildActionBar();

    this.input.on('pointerup', (p: Phaser.Input.Pointer) => this.onTap(p));
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      const tile = this.tileAt(p);
      if (this.hoverTile && tile.col === this.hoverTile.col && tile.row === this.hoverTile.row) return;
      this.hoverTile = tile;
      this.drawBoard();
    });

    const bonuses = Object.fromEntries(
      this.combatants.map((c) => [c.id, c.side === 'heroes' ? this.state.character!.attributes.agility - 3 : initiativeBonus.get(c.id)!]),
    );
    this.order = rollInitiative(this.combatants, bonuses);
    this.turnIndex = -1;
    this.nextTurn();
  }

  // --- Arena ---------------------------------------------------------------

  private center(tile: Tile): { x: number; y: number } {
    const p = tileToScreen(tile);
    return { x: this.originX + p.x * LAYOUT.arenaScale, y: this.originY + p.y * LAYOUT.arenaScale };
  }

  private feet(tile: Tile): { x: number; y: number } {
    const c = this.center(tile);
    return { x: c.x, y: c.y + (TILE_HEIGHT / 2) * LAYOUT.arenaScale };
  }

  /** The map's own ground and obstacles: trees, crates and rocks block the way and give cover. */
  private drawArena(): void {
    const { cols, rows, ground, obstacles } = this.arena;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const f = this.feet({ col, row });
        const i = row * cols + col;
        // Ground below everything; obstacles sorted with the combatants by their feet.
        if (ground[i] >= 0) this.add.image(f.x, f.y, 'tiles', ground[i]).setOrigin(0.5, 1).setScale(LAYOUT.arenaScale).setDepth(0);
        if (obstacles[i] >= 0) {
          this.obstacleImages.push(this.add.image(f.x, f.y, 'tiles', obstacles[i]).setOrigin(0.5, 1).setScale(LAYOUT.arenaScale).setDepth(f.y));
        }
      }
    }
  }

  private tileAt(pointer: Phaser.Input.Pointer): Tile {
    return screenToTile({
      x: (pointer.worldX - this.originX) / LAYOUT.arenaScale,
      y: (pointer.worldY - this.originY) / LAYOUT.arenaScale,
    });
  }

  private diamond(tile: Tile, inset = 0): Phaser.Math.Vector2[] {
    const c = this.center(tile);
    const hw = (TILE_WIDTH / 2) * LAYOUT.arenaScale - inset * 2;
    const hh = (TILE_HEIGHT / 2) * LAYOUT.arenaScale - inset;
    return [
      new Phaser.Math.Vector2(c.x, c.y - hh),
      new Phaser.Math.Vector2(c.x + hw, c.y),
      new Phaser.Math.Vector2(c.x, c.y + hh),
      new Phaser.Math.Vector2(c.x - hw, c.y),
    ];
  }

  private fillTile(tile: Tile, color: number, alpha: number, lineAlpha = 0, inset = 1): void {
    const points = this.diamond(tile, inset);
    this.overlay.fillStyle(color, alpha).fillPoints(points, true);
    if (lineAlpha > 0) this.overlay.lineStyle(2, color, lineAlpha).strokePoints(points, true);
  }

  /**
   * The board, redrawn after every change: a grid on every open cell and the arena's outline (where one can flee);
   * the cell of whoever is acting; on the hero's turn, the cells within reach (moving) or within the weapon's range
   * (attacking), and for the hovered cell the path and its cost, or the chance to hit.
   */
  private drawBoard(): void {
    const g = this.overlay;
    g.clear();
    this.updateFades();
    this.costLabel.setVisible(false);
    const { cols, rows } = this.arena;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (isOpen(this.arena, { col, row })) g.lineStyle(1, GRID.line, 0.22).strokePoints(this.diamond({ col, row }), true);
      }
    }
    const corners = [{ col: 0, row: 0 }, { col: cols - 1, row: 0 }, { col: cols - 1, row: rows - 1 }, { col: 0, row: rows - 1 }];
    const [top, right, bottom, left] = corners.map((t, i) => this.diamond(t)[i]);
    g.lineStyle(2, GRID.turn, 0.55).strokePoints([top, right, bottom, left], true);

    if (this.turnIndex >= 0 && this.order.length > 0 && !this.ended) {
      const current = this.current();
      if (!current.defeated) this.fillTile(current.tile, GRID.turn, 0.35, 1);
    }
    if (!this.awaitingHero || this.busy || this.ended) return;

    const hero = this.hero();
    const hover = this.hoverTile;
    if (this.mode === 'move') {
      for (const path of this.reach.values()) this.fillTile(path[path.length - 1], GRID.reach, 0.2, 0.45);
      const path = hover ? this.reach.get(tileKey(hover)) : undefined;
      if (path && hover) {
        for (const step of path) {
          const c = this.center(step);
          g.fillStyle(GRID.reach, 0.95).fillCircle(c.x, c.y, 4 * LAYOUT.arenaScale);
        }
        this.fillTile(hover, GRID.reach, 0.45, 1);
        this.showCost(hover, `${path.length} PA`);
      }
      return;
    }
    const attack = hero.attacks[this.mode];
    for (const enemy of this.combatants) {
      if (enemy.side !== 'enemies' || enemy.defeated) continue;
      const inRange = distance(hero.tile, enemy.tile) <= attack.range;
      this.fillTile(enemy.tile, GRID.target, inRange ? 0.4 : 0.12, inRange ? 0.9 : 0.3);
    }
    const target = hover && this.combatants.find((c) => c.side === 'enemies' && !c.defeated && c.tile.col === hover.col && c.tile.row === hover.row);
    if (target) {
      if (distance(hero.tile, target.tile) > attack.range) this.showCost(target.tile, 'Hors de portée');
      else if (hero.actionPoints < attack.apCost) this.showCost(target.tile, 'Pas assez de PA');
      else {
        const cover = coverBetween(hero.tile, target.tile, (t) => coverAt(this.arena, t));
        const chance = Math.round(hitChance(attack, target, this.zone, cover) * 100);
        this.showCost(target.tile, `${chance} % · ${attack.apCost} PA${cover > 0 ? ' · à couvert' : ''}`);
      }
    }
  }

  /**
   * A tree in front of a fighter or of the hovered cell turns see-through, so the board stays readable
   * (docs/gdd/combat.md, « Lisibilité »).
   */
  private updateFades(): void {
    const covered: Phaser.Geom.Rectangle[] = [];
    for (const c of this.combatants) {
      const token = this.tokens.get(c.id);
      if (token && !c.defeated) covered.push(token.image.getBounds());
    }
    if (this.hoverTile && isOpen(this.arena, this.hoverTile)) {
      const f = this.feet(this.hoverTile);
      covered.push(new Phaser.Geom.Rectangle(f.x - 16, f.y - 40 * LAYOUT.arenaScale, 32, 40 * LAYOUT.arenaScale));
    }
    for (const image of this.obstacleImages) {
      const bounds = image.getBounds();
      const hides = covered.some((r) => r.bottom < image.y && Phaser.Geom.Intersects.RectangleToRectangle(bounds, r));
      image.setAlpha(hides ? 0.4 : 1);
    }
  }

  private showCost(tile: Tile, text: string): void {
    const f = this.feet(tile);
    this.costLabel.setText(text).setPosition(f.x, f.y - 84 * LAYOUT.arenaScale).setVisible(true);
  }

  /** The hero's reach and the hint line, after anything that changes position or PA. */
  private refreshBoard(): void {
    const hero = this.hero();
    const heroTurn = this.awaitingHero && !this.ended;
    this.reach = heroTurn && this.mode === 'move' ? reachable(hero.tile, hero.actionPoints, this.walkable) : new Map();
    if (!heroTurn) this.hint.setText('');
    else if (this.mode === 'move') {
      this.hint.setText(this.reach.size > 0 ? 'Choisis une case bleue pour t’y rendre (1 PA par case).' : 'Plus assez de PA pour te déplacer.');
    } else {
      const attack = hero.attacks[this.mode];
      this.hint.setText(`Choisis un ennemi en rouge vif à portée (${attack.label}, ${attack.apCost} PA).`);
    }
    this.drawBoard();
  }

  private get frames(): Record<string, number> {
    return (this.registry.get('tileFrames') as Record<string, number>) ?? {};
  }

  private get heroSheet(): string {
    return `marche-${this.state.character?.avatar ?? DEFAULT_AVATAR}`;
  }

  /** First frame of the hero's walk sheet in a facing: how the hero stands still. */
  private standingFrame(facing: Facing): number {
    const columns = Math.floor(this.textures.get(this.heroSheet).getSourceImage().width / 64);
    return FACINGS.indexOf(facing) * columns;
  }

  /** The hero is their walk sheet (animated when moving), facing down-right; enemies use their tile. */
  private tokenImage(c: Combatant, f: { x: number; y: number }): Phaser.GameObjects.Sprite {
    if (c.side === 'heroes' && this.textures.exists(this.heroSheet)) return this.add.sprite(f.x, f.y, this.heroSheet, this.standingFrame('se'));
    const frame = this.frames[this.tileNames.get(c.id) ?? 'pnj'] ?? this.frames.pnj;
    return this.add.sprite(f.x, f.y, 'tiles', frame);
  }

  /** Walks a token along the tiles it has just moved through, one step at a time (the rules already moved it). */
  private animateMove(c: Combatant, path: Tile[], from: Tile): Promise<void> {
    const token = this.tokens.get(c.id);
    if (!token || path.length === 0) return Promise.resolve();
    const sprite = token.image;
    token.hpBar.setVisible(false);
    token.name.setVisible(false);
    const isHero = c.side === 'heroes' && sprite.texture.key === this.heroSheet;
    return new Promise((resolve) => {
      let previous = from;
      const step = (i: number) => {
        if (i >= path.length) {
          if (isHero) sprite.stop().setFrame(this.standingFrame(facingOf(path.length > 1 ? path[path.length - 2] : from, path[path.length - 1])));
          token.hpBar.setVisible(true);
          resolve();
          return;
        }
        const next = path[i];
        const facing = facingOf(previous, next);
        if (isHero) {
          const key = `${this.heroSheet}-${facing}`;
          if (this.anims.exists(key)) sprite.play({ key, frameRate: WALK_FPS }, true);
        } else sprite.setFlipX(['w', 'sw', 'nw'].includes(facing));
        const f = this.feet(next);
        this.tweens.add({
          targets: sprite,
          x: f.x,
          y: f.y,
          duration: STEP_ANIM_MS,
          onUpdate: () => sprite.setDepth(sprite.y + 1),
          onComplete: () => {
            previous = next;
            step(i + 1);
          },
        });
      };
      step(0);
    });
  }

  /** A short line rising above a fighter: damage, a miss, an effect. */
  private float(c: Combatant, text: string, color: string): void {
    const f = this.feet(c.tile);
    const label = this.add
      .text(f.x, f.y - 70 * LAYOUT.arenaScale, text, { fontFamily: FONT_SERIF, fontSize: '24px', color, stroke: CSS.ink, strokeThickness: 4 })
      .setOrigin(0.5, 1)
      .setDepth(8000);
    this.tweens.add({ targets: label, y: label.y - 30, alpha: 0, delay: 500, duration: 700, onComplete: () => label.destroy() });
  }

  private addToken(c: Combatant): void {
    const f = this.feet(c.tile);
    const image = this.tokenImage(c, f).setOrigin(0.5, 1).setScale(LAYOUT.arenaScale).setDepth(f.y + 1);
    const hpBar = this.add.graphics().setDepth(6000);
    const name = this.add
      .text(f.x, f.y - 80 * LAYOUT.arenaScale, c.name, { fontFamily: FONT_SERIF, fontSize: '16px', color: CSS.parchment, stroke: CSS.ink, strokeThickness: 3 })
      .setOrigin(0.5, 1)
      .setDepth(6001)
      .setVisible(false);
    // Hover shows the name (with a mouse); taps still go to the arena's own handler.
    image.setInteractive({ pixelPerfect: false });
    image.on('pointerover', () => this.setHovered(c.id));
    image.on('pointerout', () => this.setHovered(null));
    this.tokens.set(c.id, { image, hpBar, name });
    this.refreshToken(c);
  }

  private setHovered(id: string | null): void {
    this.hovered = id;
    this.refreshAll();
  }

  private refreshToken(c: Combatant): void {
    const token = this.tokens.get(c.id);
    if (!token) return;
    const f = this.feet(c.tile);
    token.image.setPosition(f.x, f.y).setDepth(f.y + 1).setAlpha(c.defeated ? 0.25 : 1);

    const x = f.x - HP_BAR_WIDTH / 2;
    const y = f.y - 74 * LAYOUT.arenaScale;
    const ratio = c.maxHp > 0 ? c.hp / c.maxHp : 0;
    token.hpBar.clear();
    if (!c.defeated) {
      token.hpBar.fillStyle(COLORS.ink, 0.9).fillRect(x - 1, y - 1, HP_BAR_WIDTH + 2, 7);
      token.hpBar.fillStyle(c.side === 'heroes' ? COLORS.parchment : COLORS.copper, 1).fillRect(x, y, Math.round(HP_BAR_WIDTH * ratio), 5);
    }
    const isCurrent = this.order.length > 0 && this.turnIndex >= 0 && this.current() === c;
    // One name at a time: the hovered token's, otherwise the current combatant's.
    const named = this.hovered ? this.hovered === c.id : isCurrent;
    token.name.setPosition(f.x, y - 4).setVisible(!c.defeated && named);
    this.refreshRoster();
  }

  private refreshRoster(): void {
    if (!this.roster || this.order.length === 0) return;
    const current = this.turnIndex >= 0 ? this.current() : null;
    const lines = this.order.map((c) => {
      if (c.defeated) return `   ${c.name} · hors de combat`;
      return `${c === current ? '▶' : '   '} ${c.name} · PV ${c.hp}/${c.maxHp}`;
    });
    this.roster.setText(lines.join('\n'));
  }

  private walkable = (tile: Tile): boolean => {
    if (!isOpen(this.arena, tile)) return false;
    return !this.combatants.some((c) => !c.defeated && c.tile.col === tile.col && c.tile.row === tile.row);
  };

  // --- Turn loop -------------------------------------------------------------

  private current(): Combatant {
    return this.order[this.turnIndex];
  }

  private hero(): Combatant {
    return this.combatants[0];
  }

  private nextTurn(): void {
    if (this.checkOutcome()) return;
    do {
      this.turnIndex = (this.turnIndex + 1) % this.order.length;
    } while (this.current().defeated);
    const c = this.current();
    startTurn(c);
    this.banner.setText(`Tour de ${c.name}${c.status.stunned ? ' (étourdi·e)' : c.status.slowed ? ' (ralenti·e)' : ''}`);
    this.refreshAll();

    if (c.side === 'heroes') {
      this.mode = 'move';
      this.awaitingHero = true;
      this.updateActionBar();
      this.refreshBoard();
    } else {
      this.awaitingHero = false;
      this.updateActionBar();
      this.refreshBoard();
      this.time.delayedCall(400, () => void this.runEnemyTurn(c));
    }
  }

  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => this.time.delayedCall(ms, resolve));
  }

  /** The enemy walks toward the hero and strikes while it has PA, each step and blow shown in turn. */
  private async runEnemyTurn(enemy: Combatant): Promise<void> {
    let guard = 0;
    while (enemy.actionPoints > 0 && !enemy.defeated && !this.hero().defeated && guard++ < 10) {
      const attack = enemy.attacks[0];
      if (canAttack(enemy, attack, this.hero())) {
        this.performAttack(enemy, attack, this.hero(), 'corps', 0);
        if (this.checkOutcome()) return;
        await this.wait(550);
        continue;
      }
      const path = this.pathAdjacentTo(enemy.tile, this.hero().tile);
      if (!path || path.length === 0) break;
      const from = enemy.tile;
      const taken = moveAlong(enemy, path);
      await this.animateMove(enemy, taken, from);
      this.refreshToken(enemy);
      this.drawBoard();
    }
    await this.wait(300);
    this.nextTurn();
  }

  private pathAdjacentTo(from: Tile, target: Tile): Tile[] | null {
    const candidates = [-1, 0, 1]
      .flatMap((dc) => [-1, 0, 1].map((dr) => ({ col: target.col + dc, row: target.row + dr })))
      .filter((t) => (t.col !== target.col || t.row !== target.row) && this.walkable(t));
    let best: Tile[] | null = null;
    for (const tile of candidates) {
      if (tile.col === from.col && tile.row === from.row) return [];
      const p = findPath(from, tile, this.walkable);
      if (p && (!best || p.length < best.length)) best = p;
    }
    return best;
  }

  private checkOutcome(): boolean {
    if (this.ended) return true;
    if (isVictory(this.combatants)) {
      this.ended = true;
      this.onVictory();
      return true;
    }
    if (isDefeat(this.combatants)) {
      this.ended = true;
      this.onDefeat();
      return true;
    }
    return false;
  }

  // --- Hero actions ------------------------------------------------------

  private onTap(pointer: Phaser.Input.Pointer): void {
    if (!this.awaitingHero || this.busy || this.ended) return;
    const tile = this.tileAt(pointer);
    const target = this.combatants.find((c) => c.side === 'enemies' && !c.defeated && c.tile.col === tile.col && c.tile.row === tile.row);

    if (target && this.mode !== 'move') {
      this.tryAttack(target);
      return;
    }
    // Only the blue cells: the walk stays within this turn's PA (docs/gdd/combat.md, « Lisibilité »).
    const path = this.mode === 'move' ? this.reach.get(tileKey(tile)) : undefined;
    if (!path) return;
    void this.heroMove(path);
  }

  private async heroMove(path: Tile[]): Promise<void> {
    const hero = this.hero();
    const from = hero.tile;
    const taken = moveAlong(hero, path);
    this.busy = true;
    this.drawBoard();
    await this.animateMove(hero, taken, from);
    this.busy = false;
    this.refreshToken(hero);
    this.updateActionBar();
    this.refreshBoard();
  }

  private tryAttack(target: Combatant): void {
    const hero = this.hero();
    if (this.mode === 'move') return;
    const attack = hero.attacks[this.mode];
    if (!canAttack(hero, attack, target)) {
      this.appendLog(distance(hero.tile, target.tile) > attack.range ? 'Hors de portée.' : 'Pas assez de PA.');
      return;
    }
    this.performAttack(hero, attack, target, this.zone, coverBetween(hero.tile, target.tile, (t) => coverAt(this.arena, t)));
    this.updateActionBar();
    if (!this.checkOutcome()) this.refreshBoard();
  }

  private performAttack(attacker: Combatant, attack: AttackProfile, target: Combatant, zone: Zone, cover: number): void {
    const result = resolveAttack(attacker, attack, target, zone, cover);
    this.refreshToken(attacker);
    this.refreshToken(target);
    const zoneLabel = zone === 'corps' ? '' : ` [${findZone(zone).label}]`;
    const coverLabel = cover > 0 ? ` (à couvert, +${cover} en Défense)` : '';
    if (!result.hit) this.float(target, 'Raté', CSS.muted);
    else this.float(target, `−${result.damage}${result.critical ? ' !' : ''}`, result.critical ? CSS.copper : CSS.parchment);
    if (result.fumble) this.appendLog(`${attacker.name} rate son attaque (échec critique).`);
    else if (!result.hit) this.appendLog(`${attacker.name} attaque${zoneLabel} ${target.name}${coverLabel} : raté.`);
    else {
      const crit = result.critical ? ' (critique !)' : '';
      this.appendLog(`${attacker.name} touche${zoneLabel} ${target.name} : ${result.damage} dégâts${crit}.`);
      if (result.defeated) this.appendLog(target.defeatText);
      else if (result.zoneEffect === 'stunned') this.appendLog(`${target.name} est étourdi·e.`);
      else if (result.zoneEffect === 'disarmed') this.appendLog(`${target.name} est désarmé·e.`);
      else if (result.zoneEffect === 'slowed') this.appendLog(`${target.name} est ralenti·e.`);
    }
  }

  private appendLog(line: string): void {
    this.log.setText(line);
  }

  // --- UI ------------------------------------------------------------------

  private buildActionBar(): void {
    const L = LAYOUT;
    // Room under the buttons for the keyboard hint line, when it is shown.
    const y = GAME_HEIGHT - L.bottomBar / 2 - (SHOW_KEY_HINTS ? 10 : 0);
    const size = (width: number, fontSize = L.buttonFont) => ({ width, height: L.buttonHeight, fontSize });
    this.moveButton = addTextButton(this, L.move[0], y, 'Déplacer', () => this.setMode('move'), size(L.move[1]));
    // One button per weapon in hand (two at most), named after the weapon.
    const attacks = this.hero().attacks;
    const [attackX, attackWidth, attackStep] = L.attack;
    this.attackButtons = attacks.map((a, i) =>
      addTextButton(this, attackX + i * attackStep, y, a.label, () => this.setMode(i), size(attackWidth, L.labelFont)),
    );
    this.zoneButton = addTextButton(this, L.zone[0], y, '', () => this.cycleZone(), size(L.zone[1]));
    addTextButton(this, L.endTurn[0], y, 'Fin du tour', () => this.endHeroTurn(), size(L.endTurn[1]));
    addTextButton(this, L.flee[0], y, 'Fuir', () => this.flee(), size(L.flee[1]));
    this.updateActionBar();

    // No shortcut for Fuir: leaving a fight should never happen by a stray key press.
    onKeys(this, DIGIT_KEYS[0], () => this.setMode('move'));
    attacks.forEach((_a, i) => onKeys(this, DIGIT_KEYS[i + 1], () => this.setMode(i)));
    onKeys(this, ['Z'], () => this.cycleZone());
    onKeys(this, ['SPACE'], () => this.endHeroTurn());
    if (SHOW_KEY_HINTS) {
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT - 16, `Clavier : 1 Déplacer · ${attacks.map((a, i) => `${i + 2} ${a.label}`).join(' · ')} · Z zone visée · Espace fin du tour`, {
          fontFamily: FONT_SERIF,
          fontSize: '16px',
          color: CSS.muted,
        })
        .setOrigin(0.5);
    }
  }

  private setMode(mode: Mode): void {
    if (!this.awaitingHero || this.busy) return;
    this.mode = mode;
    this.updateActionBar();
    this.refreshBoard();
  }

  private cycleZone(): void {
    const i = ZONES.findIndex((z) => z.id === this.zone);
    this.zone = ZONES[(i + 1) % ZONES.length].id;
    this.updateActionBar();
    this.drawBoard();
  }

  private endHeroTurn(): void {
    if (!this.awaitingHero || this.busy) return;
    this.awaitingHero = false;
    this.marker.clear();
    this.refreshBoard();
    this.nextTurn();
  }

  private flee(): void {
    if (this.ended) return;
    // docs/gdd/combat.md: one flees by reaching the edge of the fight's zone.
    if (!isEdge(this.arena, this.hero().tile)) {
      this.appendLog('Pour fuir, rejoins le bord de la zone de combat.');
      return;
    }
    this.ended = true;
    this.appendLog('Tu te replies.');
    this.closeAfter(false, () => {});
  }

  private updateActionBar(): void {
    const hero = this.hero();
    this.zoneButton?.setLabel(`Zone : ${findZone(this.zone).label}`);
    this.moveButton?.setLabel(this.mode === 'move' ? '▶ Déplacer' : 'Déplacer');
    this.attackButtons.forEach((button, i) => {
      const label = hero.attacks[i].label;
      button.setLabel(this.mode === i ? `▶ ${label}` : label);
    });
    if (this.awaitingHero) this.banner.setText(`${hero.name} · PA ${hero.actionPoints}/${hero.maxActionPoints} · PV ${hero.hp}/${hero.maxHp}`);
  }

  private refreshAll(): void {
    for (const c of this.combatants) this.refreshToken(c);
  }

  // --- Outcome ---------------------------------------------------------------

  private onVictory(): void {
    this.appendLog('Combat gagné.');
    const notices = applyEffects(this.state, [...this.config.victoryEffects]);
    this.state.flags[this.config.victoryFlag] = true;
    this.closeAfter(false, (hud) => {
      if (notices.length) hud.toast(notices.join('   ·   '));
    });
  }

  private onDefeat(): void {
    this.appendLog(`${this.hero().name} est mis hors de combat.`);
    this.state.character!.hp = 1;
    this.state.location = findLocation('gardebois')!.id;
    this.state.entrance = 'entree';
    this.closeAfter(true, (hud) => hud.toast('Ilyane te ramène au Marché des Lisières le temps de reprendre des forces.'));
  }

  private closeAfter(restart: boolean, onHud: (hud: HudScene) => void): void {
    this.time.delayedCall(1400, () => {
      this.scene.stop();
      if (restart) {
        this.scene.stop('Hud');
        this.scene.stop('Map');
        this.scene.start('Map');
      } else {
        this.scene.resume('Map');
        this.scene.resume('Hud');
        onHud(this.scene.get('Hud') as HudScene);
      }
    });
  }
}
