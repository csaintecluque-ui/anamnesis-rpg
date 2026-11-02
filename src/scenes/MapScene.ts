import Phaser from 'phaser';
import { DIALOGUES } from '../data/dialogues';
import { MAPS } from '../data/maps';
import npcData from '../data/npcs.json';
import { TILE_HEIGHT, TILE_WIDTH, screenToTile, tileToScreen, type Tile } from '../engine/iso';
import { carveArena, farEdgeTiles, toArena } from '../engine/arena';
import { FACINGS, facingOf, type Facing } from '../engine/facing';
import { findPath } from '../engine/pathfinding';
import { bigBlock, findObject, isBigAnchor, isWalkable, parseTiledMap, tileKey, type GameMap, type MapObject } from '../engine/tiledMap';
import { DEFAULT_AVATAR } from '../rules/character';
import { ENCOUNTERS, findEnemy } from '../rules/combat';
import { hasStoryEntry, type Effect } from '../rules/dialogue';
import {
  ENCOUNTER_VICTORY_FLAG,
  WORLD_MAP_TARGET,
  encounterObjects,
  findRencontre,
  placeOfLocation,
  rencontreXp,
  type RencontreDef,
} from '../rules/world';
import { findLocation, type GameState } from '../state/gameState';
import { onKeys } from '../ui/keys';
import { COLORS, CSS, FONT_SERIF } from '../ui/theme';
import { MAP_ZOOM, RENDER_SCALE } from '../ui/viewport';
import type { CombatStartData } from './CombatScene';
import { FigurantLayer } from './Figurants';
import type { HudScene } from './HudScene';
import type { WorldMapStartData } from './WorldMapScene';

/** Delay before the enemies of a random encounter attack, so the arrival is seen first. */
const AMBUSH_DELAY_MS = 900;

/** Map objects drawn by an obstacle tile on the same cell, and touchable on that tile's image. */
const INTERACTIVE_OBSTACLES = new Set(['panneau', 'echo', 'golem', 'coffre', 'foreuse', 'porte', 'objet']);

/** Room above the top row for tall tiles (frames are 96 px high for a 32 px diamond). */
const TOP_MARGIN = 80;

const STEP_MS = 160;
/** Walk sheets: 64 px wide frames; a full cycle covers about two tiles. */
const WALK_FRAME_WIDTH = 64;
const WALK_FPS = 14;

/** Size of the piece of map a fight takes place on (docs/gdd/combat.md). */
const ARENA_COLS = 11;
const ARENA_ROWS = 9;

export class MapScene extends Phaser.Scene {
  private state!: GameState;
  private map!: GameMap;
  private originX = 0;
  private originY = 0;
  private hero!: Phaser.GameObjects.Sprite;
  /** Walk sheet of the hero (public/sprites/), or null to keep the still tile. */
  private walkSheet: string | null = null;
  private facing: Facing = 'se';
  private heroTile: Tile = { col: 0, row: 0 };
  private occupied = new Set<string>();
  private path: Tile[] = [];
  private moving = false;
  private pendingGoal: Tile | null = null;
  private arrival: (() => void) | null = null;
  private marker!: Phaser.GameObjects.Graphics;
  /** NPCs and signs, hit-tested on their whole image: a tap on a body lands on the tile behind its feet. */
  private interactables: { object: MapObject; image: Phaser.GameObjects.Image; label?: Phaser.GameObjects.Text }[] = [];
  /** Passers-by and townsfolk with a line or two (docs/gdd/figurants.md). */
  private figurants!: FigurantLayer;

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
    // A random encounter lays its enemies, people and objects on the map's spawn points (docs/gdd/carte-du-monde.md).
    const rencontre = location.encounter && state.encounter ? findRencontre(state.encounter.id) : undefined;
    if (rencontre) this.map.objects.push(...encounterObjects(rencontre, this.map.objects.filter((o) => o.type === 'apparition')));
    this.registry.set('tileFrames', this.map.frames);
    this.originX = this.map.height * (TILE_WIDTH / 2);
    this.originY = TOP_MARGIN;
    this.occupied = new Set(
      this.map.objects.filter((o) => (o.type === 'pnj' || o.properties.tuile || o.type === 'ennemi') && !this.gone(o)).map(tileKey),
    );
    this.path = [];
    this.moving = false;
    this.pendingGoal = null;
    this.arrival = null;
    this.interactables = [];

    this.drawGround();
    this.drawObstacles();
    this.drawNpcs();
    this.drawEnemies();
    this.drawPlacedObjects();
    this.figurants = new FigurantLayer(this, {
      frames: this.map.frames,
      feet: (t) => this.feet(t),
      walkable: (t) => this.walkable(t),
      heroTile: () => this.heroTile,
    });
    this.figurants.spawn(location.id);
    for (const tile of this.figurants.standingTiles()) this.occupied.add(tileKey(tile));
    this.marker = this.add.graphics().setDepth(1);

    this.heroTile = this.startTile(location.entrance);
    this.state.position = { ...this.heroTile };
    this.state.entrance = null;
    const start = this.feet(this.heroTile);
    this.hero = this.add.sprite(start.x, start.y, 'tiles', this.map.frames.heros).setOrigin(0.5, 1).setDepth(start.y);
    this.setUpWalk();

    const worldWidth = (this.map.width + this.map.height) * (TILE_WIDTH / 2);
    const worldHeight = (this.map.width + this.map.height) * (TILE_HEIGHT / 2) + TOP_MARGIN;
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight).setZoom(MAP_ZOOM * RENDER_SCALE).setBackgroundColor(COLORS.ink);
    this.cameras.main.startFollow(this.hero, true, 0.15, 0.15);
    this.cameras.main.centerOn(start.x, start.y);

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => this.onTap(pointer));
    // Only while the map runs: overlays pause it, so these keys cannot reopen anything over them.
    onKeys(this, ['ESC'], () => this.hud().openOverlay('Pause'));
    onKeys(this, ['I'], () => this.hud().openOverlay('Trade', {}));

    this.scene.launch('Hud', { locationName: location.name });
    if (rencontre) this.announceEncounter(rencontre);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.scene.stop('Hud'));
    // A dialogue or a fight may have picked a herb or sent enemies away. Scene events outlive a restart: unhook.
    const onResume = () => this.refreshGone();
    this.events.on(Phaser.Scenes.Events.RESUME, onResume);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.events.off(Phaser.Scenes.Events.RESUME, onResume));
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
    const bigGround: (Tile & { name: string })[] = [];
    for (let row = 0; row < this.map.height; row++) {
      for (let col = 0; col < this.map.width; col++) {
        const frame = this.map.ground[row * this.map.width + col];
        if (frame < 0) continue;
        const f = this.feet({ col, row });
        // A large ground decor (the bridge) still lays its own tile (the water below), then its image once, over
        // the whole block, after all the plain ground (second pass).
        rt.drawFrame('tiles', frame, f.x - TILE_WIDTH / 2, f.y - 96);
        const big = this.map.big[frame];
        if (big && isBigAnchor(this.map, { col, row }, this.map.ground)) bigGround.push({ col, row, name: big });
      }
    }
    // A block of w × h cells: its image is centred (w − h) half-cells left of the front cell (src/engine/tiledMap.ts).
    for (const tile of bigGround) {
      const { cols, rows } = bigBlock(this.map, tile, this.map.ground);
      const image = this.textures.get(`decor-${tile.name}`).getSourceImage();
      const f = this.feet(tile);
      rt.draw(`decor-${tile.name}`, f.x - ((cols - rows) * TILE_WIDTH) / 4 - image.width / 2, f.y - image.height);
    }
  }

  private drawObstacles(): void {
    for (let row = 0; row < this.map.height; row++) {
      for (let col = 0; col < this.map.width; col++) {
        const frame = this.map.obstacles[row * this.map.width + col];
        if (frame < 0) continue;
        const f = this.feet({ col, row });
        const big = this.map.big[frame];
        if (big && !isBigAnchor(this.map, { col, row })) continue;
        const image = (big ? this.add.image(f.x, f.y, `decor-${big}`) : this.add.image(f.x, f.y, 'tiles', frame))
          .setOrigin(0.5, 1)
          .setDepth(f.y);
        const marker = this.map.objects.find(
          (o) => INTERACTIVE_OBSTACLES.has(o.type) && o.col === col && o.row === row,
        );
        if (marker && this.gone(marker)) image.setVisible(false);
        else if (marker) this.interactables.push({ object: marker, image });
      }
    }
  }

  /**
   * Objects that leave the map once the story moves on (property `disparaitSi`: flags, comma-separated): a picked
   * herb, enemies chased away or beaten. Objects that wait for the story (`apparaitSi`: flags, one is enough) are
   * gone until then. Checked when the map is built and each time it resumes.
   */
  private gone(o: MapObject): boolean {
    const any = (list?: string) => (list ?? '').split(',').some((flag) => flag.trim() && this.state.flags[flag.trim()]);
    return any(o.properties.disparaitSi) || (!!o.properties.apparaitSi && !any(o.properties.apparaitSi));
  }

  private refreshGone(): void {
    this.interactables = this.interactables.filter(({ object, image, label }) => {
      if (!this.gone(object)) return true;
      image.setVisible(false);
      label?.setVisible(false);
      this.occupied.delete(tileKey(object));
      return false;
    });
  }

  /** Enemies standing on the map until their fight is won or avoided (src/data/encounters.json). */
  private drawEnemies(): void {
    for (const o of this.map.objects.filter((x) => x.type === 'ennemi' && !this.gone(x))) {
      const f = this.feet(o);
      const tile = findEnemy(o.properties.ennemi ?? '')?.tile ?? 'pnj';
      const image = this.add.image(f.x, f.y, 'tiles', this.map.frames[tile] ?? this.map.frames.pnj).setOrigin(0.5, 1).setDepth(f.y);
      this.interactables.push({ object: o, image });
    }
  }

  /** Objects of a random encounter drawn with their own tile (property `tuile`): objects to touch, and decor. */
  private drawPlacedObjects(): void {
    for (const o of this.map.objects.filter((x) => x.properties.tuile && x.type !== 'pnj')) {
      const f = this.feet(o);
      const image = this.add.image(f.x, f.y, 'tiles', this.map.frames[o.properties.tuile] ?? this.map.frames.pnj).setOrigin(0.5, 1).setDepth(f.y);
      if (o.type !== 'decor') this.interactables.push({ object: o, image });
    }
  }

  /** A fight started from a dialogue: the arena is carved around the encounter's centre object. */
  startEncounter(id: string): void {
    const encounter = ENCOUNTERS.find((e) => e.id === id);
    const center = encounter && findObject(this.map, encounter.center);
    if (!encounter || !center) return;
    const enemyObjects = encounter.enemies.map((e) => findObject(this.map, e.object)!);
    this.launchFight(center, encounter.enemies.map((e) => e.id), enemyObjects, encounter.victoryFlag, encounter.victoryEffects);
  }

  private launchFight(center: Tile, enemyIds: string[], enemyObjects: Tile[], victoryFlag: string, victoryEffects: Effect[]): void {
    const arena = carveArena(this.map, center, ARENA_COLS, ARENA_ROWS, enemyObjects);
    this.registry.set('tileFrames', this.map.frames);
    this.scene.pause();
    this.scene.pause('Hud');
    this.scene.launch('Combat', {
      enemyIds,
      victoryEffects,
      victoryFlag,
      arena,
      heroTile: toArena(arena, this.heroTile),
      enemyTiles: enemyObjects.map((o) => toArena(arena, o)),
    } satisfies CombatStartData);
  }

  // --- Random encounters (docs/gdd/carte-du-monde.md) ---------------------------------------------

  private announceEncounter(rencontre: RencontreDef): void {
    const hostile = this.encounterEnemies().length > 0;
    const hint = hostile ? '' : '   ·   Pour repartir, rejoins le bord de la carte, à l’est ou à l’ouest.';
    this.time.delayedCall(50, () => this.hud().toast(`${rencontre.intro}${hint}`));
    if (hostile) this.time.delayedCall(AMBUSH_DELAY_MS, () => this.fightEncounter());
  }

  /** Enemies of the random encounter still standing. */
  private encounterEnemies(): MapObject[] {
    return this.map.objects.filter((o) => o.type === 'ennemi' && o.properties.rencontre && !this.gone(o));
  }

  /** The encounter's enemies attack: the fight takes place right here, around the hero and them. */
  private fightEncounter(): void {
    const enemies = this.encounterEnemies();
    const rencontre = this.state.encounter && findRencontre(this.state.encounter.id);
    if (enemies.length === 0 || !rencontre) return;
    const all = [this.heroTile, ...enemies];
    const center = {
      col: Math.round(all.reduce((sum, t) => sum + t.col, 0) / all.length),
      row: Math.round(all.reduce((sum, t) => sum + t.row, 0) / all.length),
    };
    const xp = rencontreXp(rencontre);
    this.launchFight(center, enemies.map((o) => o.properties.ennemi), enemies, ENCOUNTER_VICTORY_FLAG, xp > 0 ? [{ giveXp: xp }] : []);
  }

  private drawNpcs(): void {
    for (const npc of this.map.objects.filter((o) => o.type === 'pnj' && !this.gone(o))) {
      const f = this.feet(npc);
      const frame = this.map.frames[npc.name] ?? this.map.frames.pnj;
      const image = this.add.image(f.x, f.y, 'tiles', frame).setOrigin(0.5, 1).setDepth(f.y);
      const label = this.add
        .text(f.x, f.y - 70, npcName(npc), { fontFamily: FONT_SERIF, fontSize: '13px', color: CSS.parchment, stroke: CSS.ink, strokeThickness: 3 })
        .setOrigin(0.5, 1)
        .setDepth(100000);
      this.interactables.push({ object: npc, image, label });
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
    const passerBy = this.figurants.hit(pointer.worldX, pointer.worldY);
    if (passerBy) {
      const dialogue = passerBy.def.dialogue && DIALOGUES[passerBy.def.dialogue];
      if (dialogue && hasStoryEntry(dialogue, this.state)) {
        this.figurants.hold(passerBy);
        this.scene.pause();
        this.scene.launch('Dialogue', { id: dialogue.id });
        return;
      }
      this.figurants.talk(passerBy);
      return;
    }
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
      this.standStill();
      this.marker.clear();
      const done = this.arrival;
      this.arrival = null;
      done?.();
      return;
    }
    this.moving = true;
    this.walk(facingOf(this.heroTile, next));
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

  // --- Hero walk animation (docs/gdd/animation.md) -------------------------

  /** Walk animations, one per facing; without the sheet the hero stays the still tile. */
  private setUpWalk(): void {
    const sheet = `marche-${this.state.character?.avatar ?? DEFAULT_AVATAR}`;
    this.walkSheet = this.textures.exists(sheet) ? sheet : null;
    if (!sheet) return;
    const columns = Math.floor(this.textures.get(sheet).getSourceImage().width / WALK_FRAME_WIDTH);
    FACINGS.forEach((facing, row) => {
      const key = `${sheet}-${facing}`;
      if (this.anims.exists(key)) return;
      const frames = this.anims.generateFrameNumbers(sheet, { start: row * columns, end: row * columns + columns - 1 });
      this.anims.create({ key, frames, frameRate: WALK_FPS, repeat: -1 });
    });
    this.standStill();
  }

  private walk(facing: Facing): void {
    if (!this.walkSheet) return;
    this.facing = facing;
    this.hero.play(`${this.walkSheet}-${facing}`, true);
  }

  private standStill(): void {
    if (!this.walkSheet) return;
    const anim = this.anims.get(`${this.walkSheet}-${this.facing}`);
    this.hero.stop().setTexture(this.walkSheet, anim.frames[0].frame.name);
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
      this.startGolemFight(target);
      return;
    }
    if (target.type === 'porte') {
      // A locked door (docs/gdd/villes.md): its dialogue (pick the lock…) sets the flag that opens it.
      const lock = target.properties.verrou;
      if (lock && !this.state.flags[lock] && target.properties.dialogue && DIALOGUES[target.properties.dialogue]) {
        this.scene.pause();
        this.scene.launch('Dialogue', { id: target.properties.dialogue });
        return;
      }
      this.enter(target.properties.cible, target.properties.arrivee, target.properties.libelle);
      return;
    }
    if (target.type === 'ennemi' && target.properties.rencontre) {
      this.fightEncounter();
      return;
    }
    if (target.type === 'ennemi') {
      this.hud().toast(target.properties.texte ?? 'Mieux vaut ne pas s’approcher sans plan.');
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

  private startGolemFight(golem: MapObject): void {
    if (this.state.flags['golem-vaincu']) {
      this.hud().toast('Le Golem de Ferraille gît immobile, silencieux.');
      return;
    }
    if (this.state.flags['chantier-arrete'] || this.state.quests['dernier-train'] !== 'active') {
      this.hud().toast('Le Golem de Ferraille ne bouge plus.');
      return;
    }
    // The fight takes place right here, on the map around the golem; the two Rôdeurs-Épine come out of the
    // undergrowth at the far edge (docs/gdd/combat.md).
    const arena = carveArena(this.map, golem, ARENA_COLS, ARENA_ROWS, [golem]);
    const heroTile = toArena(arena, this.heroTile);
    const golemTile = toArena(arena, golem);
    const [rodeur1, rodeur2] = farEdgeTiles(arena, heroTile, [heroTile, golemTile]);
    this.registry.set('tileFrames', this.map.frames);
    this.scene.pause();
    this.scene.pause('Hud');
    this.scene.launch('Combat', {
      enemyIds: ['golem-ferraille', 'rodeur-epine', 'rodeur-epine'],
      victoryEffects: [{ setFlag: 'chantier-arrete' }, { completeQuest: 'dernier-train' }, { giveXp: 40 }, { giveFers: 30 }],
      victoryFlag: 'golem-vaincu',
      arena,
      heroTile,
      enemyTiles: [golemTile, rodeur1, rodeur2],
    } satisfies CombatStartData);
  }

  private checkExit(): void {
    const exit = this.map.objects.find((o) => o.type === 'sortie' && o.col === this.heroTile.col && o.row === this.heroTile.row);
    if (!exit) return;
    this.enter(exit.properties.cible, exit.properties.arrivee, exit.properties.libelle);
  }

  /** A dialogue sends the hero elsewhere (a door just unlocked): src/rules/dialogue.ts, effect `goTo`. */
  goToLocation(location: string, arrival?: string): void {
    this.enter(location, arrival, undefined);
  }

  /** Goes to another map (a door, a road out), arriving on a named object or the map's own entrance. */
  private enter(target: string | undefined, arrival: string | undefined, label: string | undefined): void {
    if (target === WORLD_MAP_TARGET) {
      this.openWorldMap();
      return;
    }
    const destination = target ? findLocation(target) : undefined;
    if (!destination) {
      this.hud().toast(`${label ?? 'Sortie'} : cette carte arrive bientôt.`);
      return;
    }
    this.state.location = destination.id;
    this.state.entrance = arrival ?? destination.entrance;
    this.scene.start('Map');
  }

  /** Leaves a place (or an encounter) for the world map, where one stands at that place (docs/gdd/carte-du-monde.md). */
  private openWorldMap(): void {
    const encounter = this.state.encounter;
    const place = placeOfLocation(this.state.location);
    let start: WorldMapStartData;
    if (encounter) start = { x: encounter.x, y: encounter.y, destination: encounter.destination };
    else if (place) start = { x: place.x, y: place.y, destination: null, at: place.id };
    else {
      this.hud().toast('La carte du monde n’est pas accessible d’ici.');
      return;
    }
    this.state.encounter = null;
    this.scene.start('WorldMap', start);
  }
}

/** Frames are 64 × 96 with transparent margins; only the central part counts as the body. */

function hitsBody(image: Phaser.GameObjects.Image, x: number, y: number): boolean {
  const left = image.x - 18;
  const right = image.x + 18;
  const top = image.y - 68;
  const bottom = image.y - 4;
  return x >= left && x <= right && y >= top && y <= bottom;
}

function npcName(o: MapObject): string {
  return npcData.find((n) => n.id === o.name)?.name ?? o.name;
}
