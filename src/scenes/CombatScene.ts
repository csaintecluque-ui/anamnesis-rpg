import Phaser from 'phaser';
import { coverAt, isEdge, isOpen, type Arena } from '../engine/arena';
import { TILE_HEIGHT, TILE_WIDTH, screenToTile, tileToScreen, type Tile } from '../engine/iso';
import { FACINGS, facingOf, type Facing } from '../engine/facing';
import { findPath, reachable } from '../engine/pathfinding';
import { tileKey } from '../engine/tiledMap';
import { applyEffects, type Effect } from '../rules/dialogue';
import {
  ENEMIES,
  ZONES,
  LINGERING,
  canAttack,
  canHeal,
  lingeringDamage,
  nextPhase,
  resolveHeal,
  rollLoot,
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
  endTurn,
  startTurn,
  type AttackProfile,
  type Combatant,
  type Zone,
} from '../rules/combat';
import { DEFAULT_AVATAR } from '../rules/character';
import { canCast, combatPower, healAmount, payCast, powerAttack, resonanceMax, type PowerDef } from '../rules/magic';
import { companionsAfterFight, findCompanion, makeCompanionCombatant } from '../rules/companions';
import { recordDefeated, recordMet } from '../rules/bestiary';
import { findLocation, type GameState } from '../state/gameState';
import { addTextButton, type TextButton } from '../ui/button';
import { DIGIT_KEYS, SHOW_KEY_HINTS, onKeys } from '../ui/keys';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';
import { HAS_MOUSE } from '../ui/viewport';
import type { HudScene } from './HudScene';

const TOP = 70;

/** Finger-sized on touch screens, compact with a mouse (docs/gdd/interface.md). */
const LAYOUT = HAS_MOUSE
  ? { arenaScale: 1.25, text: 1, bottomBar: 96, buttonHeight: 48, buttonFont: 20, labelFont: 18, move: [100, 150], attack: [260, 150, 160], zone: [590, 170], endTurn: [770, 170], flee: [GAME_WIDTH - 90, 140] }
  : { arenaScale: 1.2, text: 1.3, bottomBar: 150, buttonHeight: 76, buttonFont: 24, labelFont: 22, move: [130, 180], attack: [330, 170, 185], zone: [720, 190], endTurn: [935, 200], flee: [GAME_WIDTH - 120, 170] };
const LOG_Y = GAME_HEIGHT - LAYOUT.bottomBar - 30;
/** Turn order panel, left of the arena: names live here, not above the tokens where they overlapped. */
/** Text size on this layout: larger on a phone, where the 1280 × 720 screen is drawn at about half size. */
const fs = (px: number): string => `${Math.round(px * LAYOUT.text)}px`;
const ROSTER_X = 24;
const ROSTER_Y = 90;
const ROSTER_LINE = Math.round(28 * LAYOUT.text);
const HP_BAR_WIDTH = 44;
/** Readable board (docs/gdd/combat.md, « Lisibilité ») : grid, reach, target and turn colours. */
const GRID = { line: 0xead9b8, reach: 0x5bc8d6, target: 0xd0583a, turn: 0xc9804f };
const STEP_ANIM_MS = 150;
const WALK_FPS = 14;

/**
 * Moving, attacking with the acting hero's attack at this index (one per weapon in hand), with the crystal's power,
 * or tending an ally (a companion who heals).
 */
type Mode = 'move' | number | 'pouvoir' | 'soin';
const HEAL_COLOR = 0x7fe08a;

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
  /** The worn crystal's power for fights (docs/gdd/magie.md), its button and its Points de Résonance. */
  private power?: PowerDef;
  private powerProfile?: AttackProfile;
  private powerButton?: TextButton;
  private powerPoints?: Phaser.GameObjects.Text;
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
    this.power = combatPower(this.state.character!);
    this.powerProfile = this.power?.combat === 'attaque' ? powerAttack(this.state.character!, this.power) : undefined;
    this.powerButton = undefined;
    this.powerPoints = undefined;
    const enemyDefs = data.enemyIds.map((id) => findEnemy(id)!);
    const enemies = enemyDefs.map((def, i) => makeEnemyCombatant(def, `${def.id}-${i}`, data.enemyTiles[i]));
    // The companions start next to the hero (docs/gdd/jalon-3.md).
    const party = this.state.groupe.map((m) => ({ m, def: findCompanion(m.id) })).filter((x) => !!x.def);
    const allyTiles = this.freeTilesNear(data.heroTile, [data.heroTile, ...data.enemyTiles], party.length);
    const allies = party.slice(0, allyTiles.length).map((x, i) => makeCompanionCombatant(x.def!, x.m.hp, allyTiles[i]));
    this.combatants = [hero, ...allies, ...enemies];
    this.tileNames = new Map([
      [hero.id, 'heros'],
      ...allies.map((c): [string, string] => [c.id, findCompanion(c.kind!)!.tile]),
      ...enemies.map((c, i): [string, string] => [c.id, enemyDefs[i].tile]),
    ]);
    numberDuplicateNames(this.combatants);
    this.hovered = null;
    const initiativeBonus = new Map<string, number>([
      ...enemies.map((c, i): [string, number] => [c.id, enemyDefs[i].initiativeBonus]),
      ...allies.map((c): [string, number] => [c.id, findCompanion(c.kind!)!.initiativeBonus]),
    ]);
    recordMet(this.state, enemyDefs.map((d) => d.id));

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.ink, 0.97).setInteractive();
    this.drawArena();
    this.banner = this.add
      .text(GAME_WIDTH / 2, 30, '', { fontFamily: FONT_SERIF, fontSize: fs(26), color: CSS.copper })
      .setOrigin(0.5);
    this.log = this.add
      .text(GAME_WIDTH / 2, LOG_Y, '', { fontFamily: FONT_SERIF, fontSize: fs(20), color: CSS.parchment, align: 'center', wordWrap: { width: 1100 } })
      .setOrigin(0.5);
    this.marker = this.add.graphics().setDepth(5000);
    this.overlay = this.add.graphics().setDepth(1);
    this.hint = this.add
      .text(GAME_WIDTH / 2, 62, '', { fontFamily: FONT_SERIF, fontSize: fs(18), color: CSS.muted })
      .setOrigin(0.5);
    this.costLabel = this.add
      .text(0, 0, '', { fontFamily: FONT_SERIF, fontSize: fs(18), color: CSS.parchment, stroke: CSS.ink, strokeThickness: 4 })
      .setOrigin(0.5, 1)
      .setDepth(7000)
      .setVisible(false);
    this.add.text(ROSTER_X, ROSTER_Y - 34, 'Ordre du tour', { fontFamily: FONT_SERIF, fontSize: fs(20), color: CSS.copper });
    // Above the arena's trees: with companions, the list runs down beside the board.
    this.roster = this.add
      .text(ROSTER_X, ROSTER_Y, '', {
        fontFamily: FONT_SERIF,
        fontSize: fs(18),
        color: CSS.parchment,
        lineSpacing: ROSTER_LINE - Math.round(22 * LAYOUT.text),
        stroke: CSS.ink,
        strokeThickness: 4,
      })
      .setDepth(9000);

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
      this.combatants.map((c) => [c.id, c === hero ? this.state.character!.attributes.agility - 3 : initiativeBonus.get(c.id)!]),
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

    const hero = this.actor();
    const hover = this.hoverTile;
    if (this.mode === 'soin') {
      for (const ally of this.combatants) {
        if (ally.side !== 'heroes' || ally.defeated) continue;
        const ok = canHeal(hero, ally);
        this.fillTile(ally.tile, HEAL_COLOR, ok ? 0.4 : 0.1, ok ? 0.9 : 0.3);
      }
      const ally = hover && this.combatants.find((c) => c.side === 'heroes' && !c.defeated && c.tile.col === hover.col && c.tile.row === hover.row);
      if (ally) this.showCost(ally.tile, ally.hp >= ally.maxHp ? 'Aucune blessure' : canHeal(hero, ally) ? `${ally.hp}/${ally.maxHp} PV · 3 PA` : 'Hors de portée');
      return;
    }
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
    const attack = this.currentAttack();
    if (!attack) return;
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
        const pr = this.mode === 'pouvoir' && this.power ? ` · ${this.power.cost} PR` : '';
        this.showCost(target.tile, `${chance} % · ${attack.apCost} PA${pr}${cover > 0 ? ' · à couvert' : ''}`);
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
    const hero = this.actor();
    const heroTurn = this.awaitingHero && !this.ended;
    this.reach = heroTurn && this.mode === 'move' ? reachable(hero.tile, hero.actionPoints, this.walkable) : new Map();
    if (!heroTurn) this.hint.setText('');
    else if (this.mode === 'soin') this.hint.setText('Choisis un allié en vert à soigner (3 PA).');
    else if (this.mode === 'move') {
      this.hint.setText(this.reach.size > 0 ? 'Choisis une case bleue pour t’y rendre (1 PA par case).' : 'Plus assez de PA pour te déplacer.');
    } else {
      const attack = this.currentAttack()!;
      const pr = this.mode === 'pouvoir' && this.power ? `, ${this.power.cost} PR` : '';
      this.hint.setText(`Choisis un ennemi en rouge vif à portée (${attack.label}, ${attack.apCost} PA${pr}).`);
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
      .text(f.x, f.y - 70 * LAYOUT.arenaScale, text, { fontFamily: FONT_SERIF, fontSize: fs(24), color, stroke: CSS.ink, strokeThickness: 4 })
      .setOrigin(0.5, 1)
      .setDepth(8000);
    this.tweens.add({ targets: label, y: label.y - 30, alpha: 0, delay: 500, duration: 700, onComplete: () => label.destroy() });
  }

  private addToken(c: Combatant): void {
    const f = this.feet(c.tile);
    const image = this.tokenImage(c, f).setOrigin(0.5, 1).setScale(LAYOUT.arenaScale).setDepth(f.y + 1);
    const hpBar = this.add.graphics().setDepth(6000);
    const name = this.add
      .text(f.x, f.y - 80 * LAYOUT.arenaScale, c.name, { fontFamily: FONT_SERIF, fontSize: fs(16), color: CSS.parchment, stroke: CSS.ink, strokeThickness: 3 })
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
      if (c.defeated) return `   ${c.name} · ${c.side === 'heroes' ? 'à terre' : 'vaincu·e'}`;
      const effects = [c.status.burning > 0 ? 'brûle' : '', c.status.bleeding > 0 ? 'saigne' : ''].filter(Boolean).join(', ');
      return `${c === current ? '▶' : '   '} ${c.name} · PV ${c.hp}/${c.maxHp}${effects ? ` · ${effects}` : ''}`;
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

  /** The main hero: the one whose death ends the game. */
  private hero(): Combatant {
    return this.combatants[0];
  }

  /** Who the player is moving now: the hero or a companion, on their turn. */
  private actor(): Combatant {
    const current = this.order.length > 0 && this.turnIndex >= 0 ? this.current() : null;
    return current && current.side === 'heroes' && !current.defeated ? current : this.hero();
  }

  /** Free open cells around a cell, nearest first (the companions' starting cells). */
  private freeTilesNear(center: Tile, taken: Tile[], count: number): Tile[] {
    const out: Tile[] = [];
    const used = new Set(taken.map(tileKey));
    for (let r = 1; r <= 4 && out.length < count; r++) {
      for (let dc = -r; dc <= r && out.length < count; dc++) {
        for (let dr = -r; dr <= r && out.length < count; dr++) {
          if (Math.max(Math.abs(dc), Math.abs(dr)) !== r) continue;
          const t = { col: center.col + dc, row: center.row + dr };
          if (!isOpen(this.arena, t) || used.has(tileKey(t))) continue;
          used.add(tileKey(t));
          out.push(t);
        }
      }
    }
    return out;
  }

  private nextTurn(): void {
    if (this.checkOutcome()) return;
    if (this.turnIndex >= 0) endTurn(this.current());
    do {
      this.turnIndex = (this.turnIndex + 1) % this.order.length;
    } while (this.current().defeated);
    const c = this.current();
    // Burning and bleeding hurt at the start of the turn (docs/gdd/combat.md, « Effets »).
    const taken = lingeringDamage(c);
    if (taken.brulure + taken.saignement > 0) {
      this.float(c, `−${taken.brulure + taken.saignement}`, CSS.copper);
      const what = [taken.brulure ? `brûle (${taken.brulure})` : '', taken.saignement ? `saigne (${taken.saignement})` : ''].filter(Boolean).join(' et ');
      this.appendLog(`${c.name} ${what}.${c.defeated ? ` ${c.defeatText}` : ''}`);
      this.refreshToken(c);
      if (c.defeated) {
        if (this.checkOutcome()) return;
        this.time.delayedCall(500, () => this.nextTurn());
        return;
      }
    }
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

  /** Heroes still standing: what enemies aim at. */
  private standingHeroes(): Combatant[] {
    return this.combatants.filter((c) => c.side === 'heroes' && !c.defeated);
  }

  /**
   * The enemy's turn, each step and blow shown in turn: a healer first tends a badly hurt ally; then the enemy
   * strikes the nearest hero within reach, or walks toward the nearest one (a shooter stops once in range).
   */
  private async runEnemyTurn(enemy: Combatant): Promise<void> {
    let guard = 0;
    while (enemy.actionPoints > 0 && !enemy.defeated && !this.hero().defeated && guard++ < 12) {
      const hurt = this.combatants.find((a) => a !== enemy && canHeal(enemy, a) && a.hp <= a.maxHp * 0.6);
      if (hurt) {
        const healed = resolveHeal(enemy, hurt);
        this.float(hurt, `+${healed}`, '#9fe0a0');
        this.appendLog(`${enemy.name} soigne ${hurt.name} : +${healed} PV.`);
        this.refreshToken(hurt);
        await this.wait(550);
        continue;
      }
      const attack = enemy.attacks[0];
      const targets = this.standingHeroes().sort((a, b) => distance(enemy.tile, a.tile) - distance(enemy.tile, b.tile));
      if (targets.length === 0) break;
      const inReach = targets.find((t) => canAttack(enemy, attack, t));
      if (inReach) {
        this.performAttack(enemy, attack, inReach, 'corps', coverBetween(enemy.tile, inReach.tile, (t) => coverAt(this.arena, t)));
        if (this.checkOutcome()) return;
        await this.wait(550);
        continue;
      }
      if (enemy.actionPoints < 1) break;
      const path = this.pathAdjacentTo(enemy.tile, targets[0].tile);
      if (!path || path.length === 0) break;
      // A shooter walks only until it has the target in range.
      const stop = attack.range > 1 ? path.findIndex((t) => distance(t, targets[0].tile) <= attack.range) : -1;
      const steps = stop >= 0 ? path.slice(0, stop + 1) : path;
      const from = enemy.tile;
      const taken = moveAlong(enemy, steps);
      if (taken.length === 0) break;
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
    // The hero's death ends the fight, whatever the companions (docs/gdd/jalon-3.md).
    if (this.hero().defeated || isDefeat(this.combatants)) {
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
    if (this.mode === 'soin') {
      const ally = this.combatants.find((c) => c.side === 'heroes' && !c.defeated && c.tile.col === tile.col && c.tile.row === tile.row);
      if (ally) this.tryHeal(ally);
      return;
    }
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
    const hero = this.actor();
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

  /** The attack of the current mode: a weapon in hand (the acting hero's), or the Flammes forgées. */
  private currentAttack(): AttackProfile | undefined {
    if (this.mode === 'move' || this.mode === 'soin') return undefined;
    if (this.mode === 'pouvoir') return this.actor() === this.hero() ? this.powerProfile : undefined;
    return this.actor().attacks[this.mode];
  }

  /** A companion who heals tends an ally (docs/gdd/jalon-3.md). */
  private tryHeal(ally: Combatant): void {
    const healer = this.actor();
    if (ally.hp >= ally.maxHp) return this.appendLog(`${ally.name} n’a aucune blessure.`);
    if (!canHeal(healer, ally)) return this.appendLog(healer.actionPoints < 3 ? 'Pas assez de PA.' : 'Hors de portée.');
    const healed = resolveHeal(healer, ally);
    this.float(ally, `+${healed}`, '#9fe0a0');
    this.appendLog(`${healer.name} soigne ${ally.name === healer.name ? 'ses propres plaies' : ally.name} : +${healed} PV.`);
    this.refreshToken(ally);
    this.refreshToken(healer);
    this.updateActionBar();
    this.refreshBoard();
  }

  private tryAttack(target: Combatant): void {
    const hero = this.actor();
    const attack = this.currentAttack();
    if (!attack) return;
    if (!canAttack(hero, attack, target)) {
      this.appendLog(distance(hero.tile, target.tile) > attack.range ? 'Hors de portée.' : 'Pas assez de PA.');
      return;
    }
    let bled = 0;
    let prix: string[] = [];
    if (this.mode === 'pouvoir' && this.power && hero === this.hero()) {
      // Forcing the crystal costs PV (docs/gdd/magie.md); never the last one.
      if (!canCast(this.state.character!, this.power.id, hero.hp)) {
        this.appendLog('Tu n’as plus assez de forces pour le cristal.');
        return;
      }
      ({ hp: bled, prix } = payCast(this.state.character!, this.power));
      hero.hp -= bled;
    }
    this.performAttack(hero, attack, target, this.zone, coverBetween(hero.tile, target.tile, (t) => coverAt(this.arena, t)));
    const split = this.loseSplitCrystal();
    if (bled > 0) {
      this.float(hero, `−${bled}`, CSS.muted);
      this.log.setText(`${this.log.text} Ton nez saigne (−${bled} PV).${prixLine(prix)}`);
    }
    if (split) this.mode = 'move';
    this.updateActionBar();
    if (!this.checkOutcome()) this.refreshBoard();
  }

  /** A crystal split by the price of forcing (src/rules/marques.ts) takes its power with it. */
  private loseSplitCrystal(): boolean {
    if (!this.power || this.state.character!.equipment.cristal) return false;
    this.power = undefined;
    this.powerProfile = undefined;
    return true;
  }

  private performAttack(attacker: Combatant, attack: AttackProfile, target: Combatant, zone: Zone, cover: number): void {
    const result = resolveAttack(attacker, attack, target, zone, cover);
    this.refreshToken(attacker);
    this.refreshToken(target);
    const zoneLabel = zone === 'corps' ? '' : ` [${findZone(zone).label}]`;
    const coverLabel = cover > 0 ? ` (à couvert, +${cover} en Défense)` : '';
    if (!result.hit) this.float(target, 'Raté', CSS.muted);
    else this.float(target, `−${result.damage}${result.critical ? ' !' : ''}`, result.critical ? CSS.copper : CSS.parchment);
    // The crystal's fire has its own words (docs/gdd/magie.md).
    const spell = attack.weaponId === this.power?.id ? attack.label : null;
    if (result.fumble) this.appendLog(spell ? `Les ${spell} s’éteignent avant de partir (échec critique).` : `${attacker.name} rate son attaque (échec critique).`);
    else if (!result.hit) this.appendLog(spell ? `Les ${spell} manquent${zoneLabel} ${target.name}${coverLabel}.` : `${attacker.name} attaque${zoneLabel} ${target.name}${coverLabel} : raté.`);
    else {
      const crit = result.critical ? ' (critique !)' : '';
      this.appendLog(spell ? `Les ${spell} touchent${zoneLabel} ${target.name} : ${result.damage} dégâts${crit}.` : `${attacker.name} touche${zoneLabel} ${target.name} : ${result.damage} dégâts${crit}.`);
      if (result.defeated) this.appendLog(target.defeatText);
      else {
        const effects: string[] = [];
        if (result.zoneEffect === 'stunned' || result.inflicted === 'etourdi') effects.push('étourdi·e');
        if (result.zoneEffect === 'disarmed') effects.push('désarmé·e');
        if (result.zoneEffect === 'slowed' || result.inflicted === 'ralenti') effects.push('ralenti·e');
        if (result.inflicted === 'brulure') effects.push(LINGERING.brulure.label);
        if (result.inflicted === 'saignement') effects.push(LINGERING.saignement.label);
        if (effects.length) this.log.setText(`${this.log.text} ${target.name} est ${effects.join(' et ')}.`);
        // A boss hurt enough enters its next phase (docs/gdd/combat.md, « Boss à phases »).
        const phase = nextPhase(target);
        if (phase) {
          this.log.setText(`${this.log.text}\n${phase.texte}`);
          this.float(target, '!', CSS.copper);
        }
      }
    }
  }

  /** Guérison naturelle, on the hero: PA and PR spent, PV back at once (docs/gdd/magie.md). */
  private castHeal(): void {
    if (!this.awaitingHero || this.busy || this.ended || !this.power || this.actor() !== this.hero()) return;
    const hero = this.hero();
    const c = this.state.character!;
    const apCost = this.power.apCost ?? 3;
    if (hero.actionPoints < apCost) return this.appendLog('Pas assez de PA.');
    if (hero.hp >= hero.maxHp) return this.appendLog('Tu n’as aucune blessure à soigner.');
    if (!canCast(c, this.power.id, hero.hp)) return this.appendLog('Tu n’as plus assez de forces pour le cristal.');
    hero.actionPoints -= apCost;
    const { hp: bled, prix } = payCast(c, this.power);
    hero.hp -= bled;
    this.loseSplitCrystal();
    const healed = Math.min(hero.maxHp - hero.hp, healAmount(c));
    hero.hp += healed;
    this.float(hero, `+${healed}`, '#9fe0a0');
    this.appendLog(`Le cristal de Vie verdit : +${healed} PV.${bled > 0 ? ` Ton nez saigne (−${bled} PV).` : ''}${prixLine(prix)}`);
    this.refreshToken(hero);
    this.updateActionBar();
    this.refreshBoard();
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
    // One button per weapon in the acting hero's hands (two at most), named after the weapon; a companion has its own.
    const [attackX, attackWidth, attackStep] = L.attack;
    this.attackButtons = [0, 1].map((i) =>
      addTextButton(this, attackX + i * attackStep, y, '', () => i < this.actor().attacks.length && this.setMode(i), size(attackWidth, L.labelFont)),
    );
    this.zoneButton = addTextButton(this, L.zone[0], y, '', () => this.cycleZone(), size(L.zone[1]));
    // Top right, where the arena leaves room: the crystal's power for the hero (docs/gdd/magie.md), the care of a
    // companion who heals (docs/gdd/jalon-3.md).
    const power = this.power;
    const healers = this.combatants.some((c) => c.side === 'heroes' && !!c.heal);
    if (power || healers) {
      const width = HAS_MOUSE ? 270 : 330;
      const px = GAME_WIDTH - 24 - width / 2;
      const py = HAS_MOUSE ? 112 : 128;
      const act = () => {
        const actor = this.actor();
        if (actor === this.hero() && power) return power.combat === 'soin' ? this.castHeal() : this.setMode('pouvoir');
        if (actor.heal) this.setMode('soin');
      };
      this.powerButton = addTextButton(this, px, py, '', act, size(width, L.labelFont));
      this.powerPoints = this.add
        .text(px, py + L.buttonHeight / 2 + 6, '', { fontFamily: FONT_SERIF, fontSize: fs(17), color: CSS.muted })
        .setOrigin(0.5, 0);
      onKeys(this, DIGIT_KEYS[3], act);
    }
    addTextButton(this, L.endTurn[0], y, 'Fin du tour', () => this.endHeroTurn(), size(L.endTurn[1]));
    addTextButton(this, L.flee[0], y, 'Fuir', () => this.flee(), size(L.flee[1]));
    this.updateActionBar();

    // No shortcut for Fuir: leaving a fight should never happen by a stray key press.
    onKeys(this, DIGIT_KEYS[0], () => this.setMode('move'));
    [0, 1].forEach((i) => onKeys(this, DIGIT_KEYS[i + 1], () => i < this.actor().attacks.length && this.setMode(i)));
    onKeys(this, ['Z'], () => this.cycleZone());
    onKeys(this, ['SPACE'], () => this.endHeroTurn());
    if (SHOW_KEY_HINTS) {
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT - 16, `Clavier : 1 Déplacer · 2 et 3 attaques${power || healers ? ' · 4 pouvoir ou soin' : ''} · Z zone visée · Espace fin du tour`, {
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
    const hurt = this.keepWounds();
    this.closeAfter(false, (hud) => {
      if (hurt.length) hud.toast(hurt.join('   ·   '));
    });
  }

  private updateActionBar(): void {
    const actor = this.actor();
    const isHero = actor === this.hero();
    this.zoneButton?.setLabel(`Zone : ${findZone(this.zone).label}`);
    this.moveButton?.setLabel(this.mode === 'move' ? '▶ Déplacer' : 'Déplacer');
    this.attackButtons.forEach((button, i) => {
      const attack = actor.attacks[i];
      button.container.setVisible(!!attack);
      if (attack) button.setLabel(this.mode === i ? `▶ ${attack.label}` : attack.label);
    });
    const c = this.state.character!;
    const resonance = this.power && isHero ? ` · PR ${c.resonance}/${resonanceMax(c)}` : '';
    if (this.powerButton) {
      let label = '';
      if (isHero && this.power) label = `${this.mode === 'pouvoir' ? '▶ ' : ''}${this.power.name} · ${this.power.cost} PR`;
      else if (actor.heal) label = `${this.mode === 'soin' ? '▶ ' : ''}Soigner · 3 PA`;
      this.powerButton.container.setVisible(!!label);
      if (label) this.powerButton.setLabel(label);
      this.powerPoints?.setVisible(isHero && !!this.power).setText(`Résonance ${c.resonance} / ${resonanceMax(c)} PR`);
    }
    if (this.awaitingHero) this.banner.setText(`${actor.name} · PA ${actor.actionPoints}/${actor.maxActionPoints} · PV ${actor.hp}/${actor.maxHp}${resonance}`);
  }

  private refreshAll(): void {
    for (const c of this.combatants) this.refreshToken(c);
  }

  // --- Outcome ---------------------------------------------------------------

  /** The hit points lost stay lost after a fight won or fled: care, rest and soup matter (docs/gdd/combat.md). */
  private keepWounds(): string[] {
    // The hero's PV as the fight leaves them: wounds stay, and so does a Guérison naturelle.
    this.state.character!.hp = Math.max(1, this.hero().hp);
    // A companion who fell gets up hurt, with 1 PV.
    return companionsAfterFight(this.state, this.combatants).map((name) => `${name} est blessé·e, mais en vie`);
  }

  private onVictory(): void {
    this.appendLog('Combat gagné.');
    const hurt = this.keepWounds();
    // The bestiary counts the beaten; the beaten leave their loot (docs/gdd/combat.md, « Butin », « Bestiaire »).
    const beaten = this.combatants.filter((c) => c.side === 'enemies' && c.defeated && c.kind).map((c) => c.kind!);
    recordDefeated(this.state, beaten);
    const loot = rollLoot(beaten.map((k) => ENEMIES.find((e) => e.id === k)!).filter(Boolean));
    const lootEffects: Effect[] = [...loot.items.map((item): Effect => ({ giveItem: item })), ...(loot.fers > 0 ? [{ giveFers: loot.fers }] : [])];
    const notices = [...hurt, ...applyEffects(this.state, [...this.config.victoryEffects, ...lootEffects])];
    this.state.flags[this.config.victoryFlag] = true;
    this.closeAfter(false, (hud) => {
      if (notices.length) hud.toast(notices.join('   ·   '));
    });
  }

  /** The hero dies (décision de Cyril, 2026-11-02 ; docs/univers/ton.md): the game resumes from the last save. */
  private onDefeat(): void {
    const hero = this.hero();
    this.appendLog(`${hero.name} tombe, et ne se relève pas.`);
    const killer = this.combatants.find((c) => c.side === 'enemies' && !c.defeated);
    const cause = `Tombé·e au combat${placeName(this.state.location)}.${killer ? ` Dernier adversaire : ${killer.name}.` : ''}`;
    this.time.delayedCall(1600, () => {
      this.scene.stop('Hud');
      this.scene.stop('Map');
      this.scene.stop();
      this.scene.start('Death', { name: this.state.character!.name, cause });
    });
  }

  private closeAfter(restart: boolean, onHud: (hud: HudScene) => void): void {
    this.time.delayedCall(1400, () => {
      this.scene.stop();
      if (restart) {
        const hud = this.scene.get('Hud') as HudScene;
        hud.events.once(Phaser.Scenes.Events.CREATE, () => onHud(hud));
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

/** « , à Ironheart — Les Forges-Basses », « , sur la route », for the death screen. */
/** The lasting price of a forced cast, after the nosebleed (src/rules/marques.ts). */
function prixLine(prix: string[]): string {
  return prix.length ? `\n${prix.join(' ')}` : '';
}

function placeName(location: string): string {
  const place = findLocation(location);
  if (!place) return '';
  return place.encounter ? ', sur la route' : `, à ${place.name}`;
}
