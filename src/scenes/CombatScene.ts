import Phaser from 'phaser';
import { coverAt, isEdge, isOpen, type Arena } from '../engine/arena';
import { TILE_HEIGHT, screenToTile, tileToScreen, type Tile } from '../engine/iso';
import { findPath } from '../engine/pathfinding';
import { applyEffects, type Effect } from '../rules/dialogue';
import {
  ZONES,
  canAttack,
  coverBetween,
  distance,
  findEnemy,
  findZone,
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
  private tokens = new Map<string, { image: Phaser.GameObjects.Image; hpBar: Phaser.GameObjects.Graphics; name: Phaser.GameObjects.Text }>();
  private hovered: string | null = null;
  private roster!: Phaser.GameObjects.Text;
  private zoneButton?: TextButton;
  private moveButton?: TextButton;
  private attackButtons: TextButton[] = [];
  private marker!: Phaser.GameObjects.Graphics;

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
        if (obstacles[i] >= 0) this.add.image(f.x, f.y, 'tiles', obstacles[i]).setOrigin(0.5, 1).setScale(LAYOUT.arenaScale).setDepth(f.y);
      }
    }
  }

  private get frames(): Record<string, number> {
    return (this.registry.get('tileFrames') as Record<string, number>) ?? {};
  }

  private addToken(c: Combatant): void {
    const f = this.feet(c.tile);
    const frame = c.side === 'heroes' ? this.frames.heros : this.frames.pnj;
    const image = this.add.image(f.x, f.y, 'tiles', frame).setOrigin(0.5, 1).setScale(LAYOUT.arenaScale).setDepth(f.y + 1);
    if (c.side === 'enemies') image.setTint(c.id.startsWith('golem') ? 0x8a8276 : 0xb5653a);
    const hpBar = this.add.graphics().setDepth(6000);
    const name = this.add
      .text(f.x, f.y - 70 * LAYOUT.arenaScale, c.name, { fontFamily: FONT_SERIF, fontSize: '16px', color: CSS.parchment, stroke: CSS.ink, strokeThickness: 3 })
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
    const y = f.y - 64 * LAYOUT.arenaScale;
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
    } else {
      this.awaitingHero = false;
      this.updateActionBar();
      this.time.delayedCall(400, () => this.runEnemyTurn(c));
    }
  }

  private runEnemyTurn(enemy: Combatant): void {
    let guard = 0;
    while (enemy.actionPoints > 0 && !enemy.defeated && !this.hero().defeated && guard++ < 10) {
      const attack = enemy.attacks[0];
      if (canAttack(enemy, attack, this.hero())) {
        this.performAttack(enemy, attack, this.hero(), 'corps', 0);
        if (this.checkOutcome()) return;
        continue;
      }
      const path = this.pathAdjacentTo(enemy.tile, this.hero().tile);
      if (!path || path.length === 0) break;
      moveAlong(enemy, path);
      this.refreshToken(enemy);
    }
    this.time.delayedCall(300, () => this.nextTurn());
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
    if (!this.awaitingHero || this.ended) return;
    const tile = screenToTile({
      x: (pointer.worldX - this.originX) / LAYOUT.arenaScale,
      y: (pointer.worldY - this.originY) / LAYOUT.arenaScale,
    });
    const target = this.combatants.find((c) => c.side === 'enemies' && !c.defeated && c.tile.col === tile.col && c.tile.row === tile.row);

    if (target && this.mode !== 'move') {
      this.tryAttack(target);
      return;
    }
    if (this.mode === 'move' && this.walkable(tile)) {
      const hero = this.hero();
      const path = findPath(hero.tile, tile, this.walkable);
      if (!path) return;
      moveAlong(hero, path);
      this.refreshToken(hero);
      this.marker.clear();
      this.updateActionBar();
    }
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
    this.checkOutcome();
  }

  private performAttack(attacker: Combatant, attack: AttackProfile, target: Combatant, zone: Zone, cover: number): void {
    const result = resolveAttack(attacker, attack, target, zone, cover);
    this.refreshToken(attacker);
    this.refreshToken(target);
    const zoneLabel = zone === 'corps' ? '' : ` [${findZone(zone).label}]`;
    const coverLabel = cover > 0 ? ` (à couvert, +${cover} en Défense)` : '';
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
    if (!this.awaitingHero) return;
    this.mode = mode;
    this.updateActionBar();
  }

  private cycleZone(): void {
    const i = ZONES.findIndex((z) => z.id === this.zone);
    this.zone = ZONES[(i + 1) % ZONES.length].id;
    this.updateActionBar();
  }

  private endHeroTurn(): void {
    if (!this.awaitingHero) return;
    this.awaitingHero = false;
    this.marker.clear();
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
