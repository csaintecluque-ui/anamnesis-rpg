import Phaser from 'phaser';
import { DIALOGUES } from '../data/dialogues';
import { MAPS } from '../data/maps';
import npcData from '../data/npcs.json';
import { TILE_HEIGHT, TILE_WIDTH, screenToTile, tileToScreen, type Tile } from '../engine/iso';
import { carveArena, farEdgeTiles, toArena } from '../engine/arena';
import { BIG_GROUND_ART, keepFront, type BigGroundArt } from '../engine/bigGround';
import { FACINGS, facingOf, type Facing } from '../engine/facing';
import { FADED_ALPHA, bodyBox, obstacleBox, overlaps, type Box } from '../engine/occlusion';
import { findPath } from '../engine/pathfinding';
import { bigBlock, findObject, isBigAnchor, isWalkable, parseTiledMap, tileKey, type GameMap, type MapObject } from '../engine/tiledMap';
import { DEFAULT_AVATAR } from '../rules/character';
import { ENCOUNTERS, GOLEM_FIGHT, GOLEM_QUEST_FIGHT, GOLEM_VICTORY_EFFECTS, VOIE_FIGHT, findEnemy, roadMenace } from '../rules/combat';
import { autoTalk, expireFlags, hasStoryEntry, type Effect } from '../rules/dialogue';
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
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';
import { HAS_MOUSE, MAP_ZOOM, RENDER_SCALE } from '../ui/viewport';
import { mapObjectHint } from '../rules/hints';
import { recitsToForget } from '../rules/oubli';
import { findCompanion } from '../rules/companions';
import type { CombatStartData } from './CombatScene';
import { FigurantLayer } from './Figurants';
import { PartyLayer } from './Party';
import { echoObjects, echoShows } from '../rules/echos';
import { mareeBasse } from '../rules/marees';
import { campDresse, chaleur, mapNow, sableDefile } from '../rules/marche';
import { froid, froidMessage } from '../rules/glace';
import { boardObjects } from '../rules/contrats';
import { carriesLamp, descend, groupDialogueId, groupFlag, groupNear, leaveVoie, lightTraps, sneakFlag, springTrap, trapSeenFlag, voieGroupXp, voieLevel, voiePlan } from '../rules/voies';
import { PENDING_NIGHT_ATTACK, PENDING_NOTICE, type HudScene } from './HudScene';
import { NIGHT_FLAG, nightXp } from '../rules/repos';
import { rngFor } from '../rules/graine';
import type { WorldMapStartData } from './WorldMapScene';
import { momentOf, type Moment } from '../rules/time';
import { findPlace, walkTheMarches } from '../rules/world';
import { playSfx, playStep } from '../audio/sfx';
import { MINI_MAP_SOURCE, type MiniMapSource, type MiniMarker } from '../ui/miniMap';
import { BUBBLE_MS, labelScaleFor, speechBubble } from './speech';
import { barkLines, findBarks } from '../rules/barks';
import { writeAuto } from '../save/autosave';

/** Top of the drawn part of each obstacle frame (`texture:frame`), measured once for the whole game. */
const DRAWN_TOPS = new Map<string, number>();

/** Delay before the enemies of a random encounter attack, so the arrival is seen first. */
const AMBUSH_DELAY_MS = 900;
/** A companion's talk that comes by itself waits this long after arriving, and for the hero to stand still (étude D4). */
const AUTO_TALK_DELAY_MS = 1200;
/** Registry key: the moment of the day when the map last looked for such a talk (nightfall brings one). */
const AUTO_TALK_MOMENT = 'autoTalkMoment';

/** Map objects drawn by an obstacle tile on the same cell, and touchable on that tile's image. */
const INTERACTIVE_OBSTACLES = new Set(['panneau', 'echo', 'golem', 'coffre', 'foreuse', 'porte', 'objet']);

/** Room above the top row for tall tiles (frames are 96 px high for a 32 px diamond). */
const TOP_MARGIN = 80;

const STEP_MS = 120;
/** Running (Maj held, or a double click): twice as fast (étude du 2026-11-03, A3). */
const RUN_STEP_MS = 80;
/** Two clicks this close make a double click: the hero runs there. */
const DOUBLE_CLICK_MS = 350;
/** The free camera (étude, A1): the wheel zooms between these (× the map's base zoom), a drag moves the view. */
/** Farther than before (Cyril, 2026-11-04 : « une vision plus reculée »), never farther than the whole place. */
const ZOOM_MIN = 0.6;
const ZOOM_MAX = MAP_ZOOM;
const DEFAULT_ZOOM = HAS_MOUSE ? 1 : 1.2;
/** People speak up on their own within this many cells of the hero, one at a time (docs/gdd/figurants.md). */
const BARK_RADIUS = 3;
const BARK_GAP_MS = 4500;
const NPC_BARK_COOLDOWN_MS = 45000;
const ZOOM_STEP = 0.1;
/** A press that moves farther than this (logical px) is a drag, not a click. */
const DRAG_THRESHOLD = 10;
/** Walk sheets: 64 px wide frames; a full cycle covers about two tiles. */
const WALK_FRAME_WIDTH = 64;
const WALK_FPS = 14;

/** Size of the piece of map a fight takes place on (docs/gdd/combat.md). */
const ARENA_COLS = 11;
const ARENA_ROWS = 9;

/** Above the map and its people, under their names (depth 100000). */
const MOMENT_VEIL_DEPTH = 99990;
const MOMENT_VEILS: Record<Moment, { color: number; alpha: number }> = {
  matin: { color: 0x000000, alpha: 0 },
  midi: { color: 0x000000, alpha: 0 },
  soir: { color: 0x5a2a08, alpha: 0.2 },
  nuit: { color: 0x0a1030, alpha: 0.5 },
};
/** Under the ground, the moment of the day does not matter: without a lamp, one sees badly (docs/gdd/voies.md). */
const VOIE_DARK = { color: 0x05070f, alpha: 0.42 };
const LIT_TRAP = 0xc0503a;

export class MapScene extends Phaser.Scene {
  private momentVeil!: Phaser.GameObjects.Rectangle;
  /** The sand that runs under the Marche while it walks (src/rules/marche.ts). */
  private sandFlow: Phaser.GameObjects.TileSprite | null = null;
  /** The snow that falls over the surface of Glacialis (src/rules/glace.ts). */
  private snowFall: Phaser.GameObjects.TileSprite | null = null;
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
  /** The companions following the hero (docs/gdd/jalon-3.md, étape 2), and who they were when the map was built. */
  private party!: PartyLayer;
  private partyIds = '';
  /** The moment of the day when the map was built: some Échos only show at night (docs/gdd/echos.md). */
  private builtAt = '';
  /** When to look for a companion's talk that comes by itself (étude D4); null: not on this map. */
  private autoTalkAt: number | null = null;
  /**
   * Groups of a sleeping line already fought here (docs/gdd/voies.md): after fleeing, they let the hero walk away;
   * they attack again only once the hero has been out of their sight. Touching them still starts the fight.
   */
  private fought = new Set<string>();
  /** How much higher the walkers stand on a cell (the arched deck of a bridge, src/engine/bigGround.ts). */
  private lifts = new Map<string, number>();
  /** Obstacle images, faded while they hide the hero or something to touch (src/engine/occlusion.ts). */
  private obstacleImages: Phaser.GameObjects.Image[] = [];
  private fadedForThings = new Set<Phaser.GameObjects.Image>();
  private fadedForHero = new Set<Phaser.GameObjects.Image>();
  /** The traps of a sleeping line seen in the lamp's light (docs/gdd/voies.md, « La lampe »). */
  private trapMarks!: Phaser.GameObjects.Graphics;
  /** The hero runs to the current goal (Maj + clic, or a double click). Walking is by the mouse only (Cyril, 2026-11-04). */
  private running = false;
  private lastTap = { at: 0, col: -1, row: -1 };
  /** The free camera (étude, A1): its zoom (× RENDER_SCALE), the press being dragged, and whether it follows the hero. */
  private zoom = DEFAULT_ZOOM;
  /** The farthest view of this place: the whole of it, at most ZOOM_MIN. */
  private minZoom = ZOOM_MIN;
  /** How much names and bubbles grow at this zoom (src/scenes/speech.ts). */
  private labelScale = 1;
  /** The names of the ways out, written beside their marks (drawExits). */
  private exitLabels: Phaser.GameObjects.Text[] = [];
  /** Speaking up on their own (Fallout-like): when the next one may, and when each named NPC may again. */
  private nextBarkAt = 0;
  private npcBarkAt = new Map<string, number>();
  /** The named NPC's bubble on screen, if any: one speaker at a time, whatever the frame rate. */
  private npcBubble: Phaser.GameObjects.Container | null = null;
  private drag: { x: number; y: number; scrollX: number; scrollY: number; moved: boolean } | null = null;
  private following = true;
  /** A red diamond where a click cannot lead (étude, A2). */
  private blockedMarker!: Phaser.GameObjects.Graphics;

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
    // A visitor's pass that has had its week (chantier 6): the lock closes again.
    expireFlags(state);
    // A sleeping line (docs/gdd/voies.md): the plan of this level, then what this visit's draw put on it.
    if (location.voie && !state.voie) {
      this.state.location = 'gardebois';
      this.state.entrance = 'entree';
      this.scene.restart();
      return;
    }
    this.map = parseTiledMap(MAPS[location.voie && state.voie ? voiePlan(state.voie) : mapNow(location, state.time)]);
    const level = location.voie && state.voie ? voieLevel(state, this.map) : null;
    if (level) {
      this.map.objects.push(...level.objects);
      Object.assign(DIALOGUES, level.dialogues);
    }
    // The contracts' board of a Gardiens' relay (docs/gdd/voies.md).
    this.map.objects.push(...boardObjects(location.id));
    // A random encounter lays its enemies, people and objects on the map's spawn points (docs/gdd/carte-du-monde.md).
    const rencontre = location.encounter && state.encounter ? findRencontre(state.encounter.id) : undefined;
    if (rencontre) this.map.objects.push(...encounterObjects(rencontre, this.map.objects.filter((o) => o.type === 'apparition')));
    // The Échos of this place (docs/gdd/echos.md, src/data/echos.json).
    this.map.objects.push(...echoObjects(location.id, state.character.attributes.memory));
    this.builtAt = momentOf(state.time);
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
    this.fought = new Set();
    this.lifts = new Map();
    this.obstacleImages = [];
    this.fadedForThings = new Set();
    this.fadedForHero = new Set();

    this.drawGround();
    this.drawObstacles();
    this.drawNpcs();
    this.drawEnemies();
    this.drawPlacedObjects();
    this.figurants = new FigurantLayer(this, {
      frames: this.map.frames,
      feet: (t) => this.walkerFeet(t),
      walkable: (t) => this.walkable(t),
      heroTile: () => this.heroTile,
      story: () => this.state,
      labelScale: () => this.labelScale,
    });
    this.figurants.spawn(location.id);
    for (const tile of this.figurants.standingTiles()) this.occupied.add(tileKey(tile));
    this.marker = this.add.graphics().setDepth(1);
    // Above the trees and walls (a click on one), under the veil of the moment and the names.
    this.blockedMarker = this.add.graphics().setDepth(MOMENT_VEIL_DEPTH - 1).setAlpha(0);
    this.trapMarks = this.add.graphics().setDepth(2);
    this.drawExits();

    // Arriving through a way in (not a map rebuilt where the hero stands).
    const arrived = !!this.state.entrance;
    this.heroTile = this.startTile(location.entrance);
    this.state.position = { ...this.heroTile };
    this.state.entrance = null;
    // Where one wakes up after a fall (src/rules/repos.ts): the last town walked in.
    if (location.place && findPlace(location.place)?.auberge) this.state.derniereVille = location.place;
    // A save at every place (docs/gdd/jalon-3.md): death sends the hero back to the last one, never far. A map rebuilt
    // just after a save was loaded leaves the auto save as it was (src/save/autosave.ts).
    writeAuto(this.registry, this.state, arrived ? 'progres' : 'rafraichir');
    const start = this.walkerFeet(this.heroTile);
    this.hero = this.add.sprite(start.x, start.y, 'tiles', this.map.frames.heros).setOrigin(0.5, 1).setDepth(start.y);
    this.revealThings();
    this.revealHero(this.heroTile);
    this.lightTraps(false);
    this.setUpWalk();
    this.party = new PartyLayer(this, { frames: this.map.frames, feet: (t) => this.walkerFeet(t), walkable: (t) => this.walkable(t) });
    this.partyIds = state.groupe.map((m) => m.id).join(',');
    this.party.spawn(state.groupe.map((m) => m.id), this.heroTile);

    const worldWidth = (this.map.width + this.map.height) * (TILE_WIDTH / 2);
    const worldHeight = (this.map.width + this.map.height) * (TILE_HEIGHT / 2) + TOP_MARGIN;
    const fit = Math.min(GAME_WIDTH / worldWidth, GAME_HEIGHT / worldHeight);
    this.minZoom = Phaser.Math.Clamp(fit, ZOOM_MIN, DEFAULT_ZOOM);
    this.zoom = Phaser.Math.Clamp(this.registry.get('mapZoom') ?? DEFAULT_ZOOM, this.minZoom, ZOOM_MAX);
    this.nextBarkAt = this.time.now + 1500;
    this.npcBarkAt = new Map();
    this.npcBubble = null;
    this.drag = null;
    this.running = false;
    this.cameras.main.setBackgroundColor(location.fond ?? COLORS.ink);
    this.sandFlow = sableDefile(location, state.time) ? this.makeSandFlow() : null;
    this.fitCamera();
    this.following = true;
    this.cameras.main.startFollow(this.hero, true, 0.15, 0.15);
    // The moment of the day (docs/gdd/temps.md): a veil over the map, under the names of the people.
    this.momentVeil = this.add
      .rectangle(worldWidth / 2, worldHeight / 2, (worldWidth + GAME_WIDTH) * 3, (worldHeight + GAME_HEIGHT) * 3, 0x000000, 0)
      .setDepth(MOMENT_VEIL_DEPTH);
    this.showMoment();
    this.snowFall = location.neige ? this.makeSnowFall() : null;
    this.cameras.main.centerOn(start.x, start.y);

    // A press then a release is a click; a press that moves drags the view (the free camera, étude A1).
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => this.startDrag(pointer));
    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      const dragged = this.drag?.moved;
      this.drag = null;
      if (dragged) this.input.setDefaultCursor('default');
      else this.onTap(pointer);
    });
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.dragView(pointer)) return;
      // With a mouse, what a click would do on what lies under it (docs/gdd/interface.md, « PC d'abord »).
      if (HAS_MOUSE) this.onHover(pointer);
    });
    this.input.on('wheel', (_p: Phaser.Input.Pointer, _o: unknown, _dx: number, dy: number) => this.zoomBy(dy > 0 ? -ZOOM_STEP : ZOOM_STEP));
    this.clearOnPause();
    onKeys(this, ['E', 'SPACE', 'ENTER'], () => this.interactNearest());
    onKeys(this, ['C', 'HOME'], () => this.recenter());
    // Only while the map runs: overlays pause it, so these keys cannot reopen anything over them.
    onKeys(this, ['ESC'], () => this.hud().openOverlay('Pause'));
    onKeys(this, ['I'], () => this.hud().openOverlay('Trade', {}));
    onKeys(this, ['J'], () => this.hud().openOverlay('Journal'));
    onKeys(this, ['M'], () => this.hud().toggleMiniMap());

    this.registry.set(MINI_MAP_SOURCE, this.miniMapSource());
    this.scene.launch('Hud', { locationName: level?.title ?? location.name });
    // A companion's talk that comes by itself (étude D4): on arriving somewhere, or when the moment of the day has
    // changed (nightfall rebuilds the map); never in a sleeping line, where the fights come first.
    const moment = momentOf(this.state.time);
    const lookForTalk = arrived || this.registry.get(AUTO_TALK_MOMENT) !== moment;
    this.registry.set(AUTO_TALK_MOMENT, moment);
    this.autoTalkAt = lookForTalk && !this.state.voie ? this.time.now + AUTO_TALK_DELAY_MS : null;
    if (level) {
      const light = carriesLamp(state) ? 'Ta lampe à cristal éclaire le passage : tu verras les pièges à deux pas.' : 'Il fait sombre : une lampe à cristal te montrerait les pièges.';
      this.time.delayedCall(50, () => this.hud().toast(`${level.title}. ${light} Pour remonter, reviens à l’entrée.`));
    }
    // The tides of Coralia (src/rules/marees.ts): said when the hero arrives in a place they change.
    if (arrived && location.maree) this.time.delayedCall(60, () => this.hud().toast(mareeBasse(state.time) ? 'Marée basse : la mer s’est retirée, et des passages se sont ouverts.' : 'Marée haute : la mer a recouvert les passages du reflux.'));
    // The Marche-Mère (src/rules/marche.ts): it walks by day and pitches camp at evening.
    if (arrived && location.camp) this.time.delayedCall(60, () => this.hud().toast(campDresse(state.time) ? 'Le soir : la Marche a dressé le camp.' : 'La Marche avance : le camp est plié dans les chariots, et le sable défile.'));
    // Off the Marche, the heat: water of the errance, or hit points.
    if (arrived && location.soif) this.time.delayedCall(70, () => this.sufferHeat());
    // The surface of Glacialis (src/rules/glace.ts): the cold, without a coat, costs hit points.
    if (arrived && location.froid && this.state.character) this.time.delayedCall(70, () => this.hud().toast(froidMessage(froid(this.state.character!))));
    // The Anneau (docs/univers/lieux/sept-portes.md): said once, on arriving at Sept-Portes.
    if (location.nexus && !state.flags['anneau-senti']) {
      state.flags['anneau-senti'] = true;
      this.time.delayedCall(50, () => this.hud().toast('Ici, aucune main ne se lèvera sur personne. Tu le sens dans tes poings : ils ne serreront plus.'));
    }
    if (rencontre) this.announceEncounter(rencontre);
    // The train one hears before seeing it, at the Gare Engloutie, until its Écho has been met (étude, J3).
    if (arrived && location.id === 'gare-engloutie' && !state.flags['echo-dernier-train-vu']) this.time.delayedCall(400, () => playSfx(this, 'train'));
    // An enemy that bars the way attacks whoever arrives (étude du 2026-11-03, C5: the first fight, on the way to the
    // Gare). Only on arriving: after fleeing, it waits on the path, and touching it starts the fight again.
    const ambush = arrived && !rencontre ? this.map.objects.find((o) => o.type === 'ennemi' && o.properties.embuscade && !this.gone(o)) : undefined;
    if (ambush) {
      this.time.delayedCall(50, () => this.hud().toast(ambush.properties.texte ?? ''));
      this.time.delayedCall(AMBUSH_DELAY_MS * 2, () => this.startEncounter(ambush.properties.embuscade));
    }
    // A word left by the screen that sent the hero here (a night's rest, waking up at the inn).
    const pending = this.registry.get(PENDING_NOTICE) as string | undefined;
    if (pending) {
      this.registry.remove(PENDING_NOTICE);
      this.time.delayedCall(60, () => this.hud().toast(pending));
    }
    // Something came in the night where the hero lay down (src/rules/repos.ts, test du 2026-11-06).
    const night = this.registry.get(PENDING_NIGHT_ATTACK) as string[] | undefined;
    if (night) {
      this.registry.remove(PENDING_NIGHT_ATTACK);
      this.time.delayedCall(AMBUSH_DELAY_MS * 2, () => this.fightNight(night));
    }
    this.time.delayedCall(120, () => this.checkOubli());
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.scene.stop('Hud'));
    // A dialogue or a fight may have picked a herb or sent enemies away. Scene events outlive a restart: unhook.
    const onResume = () => {
      // Someone joined or left the party (a dialogue): the map is rebuilt where the hero stands.
      if (this.state.groupe.map((m) => m.id).join(',') !== this.partyIds || momentOf(this.state.time) !== this.builtAt) {
        this.state.entrance = null;
        this.scene.restart();
        return;
      }
      this.refreshGone();
      this.showMoment();
      this.checkOubli();
    };
    this.events.on(Phaser.Scenes.Events.RESUME, onResume);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.events.off(Phaser.Scenes.Events.RESUME, onResume));
  }

  /** Dunes drawn once into a texture, and a tiled sheet of them under the whole view, that the update slides. */
  private makeSandFlow(): Phaser.GameObjects.TileSprite {
    if (!this.textures.exists('sable-defile')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0xc9a46a, 1).fillRect(0, 0, 256, 128);
      for (const [x, y, w, c] of [[20, 20, 90, 0xb88f58], [140, 54, 100, 0xd8b47a], [60, 92, 120, 0xb88f58], [190, 10, 60, 0xd8b47a], [0, 70, 50, 0xd8b47a]] as const) {
        g.fillStyle(c, 1).fillEllipse(x + w / 2, y + 8, w, 14);
      }
      g.lineStyle(1, 0x9a7444, 0.5);
      for (let i = 0; i < 6; i++) g.lineBetween(i * 46, 40 + (i % 3) * 22, i * 46 + 30, 34 + (i % 3) * 22);
      g.generateTexture('sable-defile', 256, 128);
      g.destroy();
    }
    return this.add
      .tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH * 4, GAME_HEIGHT * 4, 'sable-defile')
      .setScrollFactor(0)
      .setDepth(-1e6);
  }

  /** Flakes drawn once into a texture, and a sheet of them over the whole view, above the veil, that the update lets fall. */
  private makeSnowFall(): Phaser.GameObjects.TileSprite {
    if (!this.textures.exists('neige-tombe')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      const flakes = [[12, 20, 2], [70, 8, 1.5], [130, 40, 2.5], [200, 16, 1.5], [40, 90, 1.5], [100, 70, 2], [170, 100, 1.5], [230, 80, 2], [20, 150, 2.5], [90, 130, 1.5], [150, 170, 2], [220, 140, 1.5], [60, 210, 2], [120, 240, 1.5], [190, 220, 2.5], [240, 200, 1.5]];
      for (const [x, y, r] of flakes) g.fillStyle(0xffffff, 0.85).fillCircle(x, y, r);
      g.generateTexture('neige-tombe', 256, 256);
      g.destroy();
    }
    return this.add
      .tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH * 2, GAME_HEIGHT * 2, 'neige-tombe')
      .setScrollFactor(0)
      .setDepth(MOMENT_VEIL_DEPTH + 1);
  }

  /** The heat, off the Marche (src/rules/marche.ts): said, and paid in hit points without water. */
  private sufferHeat(): void {
    if (!this.state.character) return;
    const lost = chaleur(this.state.character);
    if (lost === null) this.hud().toast('La chaleur. Tu bois une gorgée de l’eau de l’errance, et tu repars.');
    else this.hud().toast(lost > 0 ? `La chaleur, et pas une goutte d’eau : tu perds ${lost} PV.` : 'La chaleur. Tu tiens debout, à peine.');
  }

  update(_time: number, delta: number): void {
    if (this.sandFlow) {
      this.sandFlow.tilePositionX += delta * 0.045;
      this.sandFlow.tilePositionY += delta * 0.0225;
    }
    if (this.snowFall) {
      this.snowFall.tilePositionX += delta * 0.02;
      this.snowFall.tilePositionY -= delta * 0.06;
    }
    if (this.state && this.time.now >= this.nextBarkAt) this.speakUp();
    if (this.autoTalkAt !== null && !this.moving && this.time.now >= this.autoTalkAt) {
      this.autoTalkAt = null;
      const talk = autoTalk(this.state, DIALOGUES);
      if (talk) {
        this.state.flags[talk.flag] = true;
        this.hud().tip(null);
        this.scene.pause();
        this.scene.launch('Dialogue', { id: talk.id });
      }
    }
  }

  /**
   * Fallout-like (Cyril, 2026-11-04 ; docs/gdd/figurants.md): the nearest passer-by or named NPC within BARK_RADIUS
   * cells who has not spoken for a while says a line above their head, without a click; one at a time.
   */
  private speakUp(): void {
    const now = this.time.now;
    this.nextBarkAt = now + 400;
    // One at a time: the timers that clear bubbles follow the frames, and slow frames must not pile them up.
    if (this.npcBubble || this.figurants.speaking()) return;
    const hero = this.heroTile;
    // Only someone on screen, below the HUD's band, speaks up.
    const view = this.cameras.main.worldView;
    const band = 70 / this.cameras.main.zoom;
    const visible = (x: number, y: number) => x > view.x && x < view.right && y - 90 > view.y + band && y < view.bottom;
    const passerBy = this.figurants.nearestReady(hero, BARK_RADIUS, now, visible);
    let npc: { object: MapObject; label: Phaser.GameObjects.Text; lines: string[]; distance: number } | null = null;
    for (const { object, image, label } of this.interactables) {
      if (object.type !== 'pnj' || !label || !image.visible || this.gone(object) || now < (this.npcBarkAt.get(object.name) ?? 0) || !visible(image.x, image.y)) continue;
      const def = findBarks(object.name);
      if (!def) continue;
      const distance = Math.max(Math.abs(object.col - hero.col), Math.abs(object.row - hero.row));
      if (distance <= BARK_RADIUS && (!npc || distance < npc.distance)) npc = { object, label, lines: barkLines(def, this.state), distance };
    }
    if (!passerBy && !npc) return;
    this.nextBarkAt = now + BARK_GAP_MS;
    if (passerBy && (!npc || passerBy.distance <= npc.distance)) {
      this.figurants.bark(passerBy.walker, now);
      return;
    }
    const { object, label, lines } = npc!;
    const said = this.npcBarkAt.has(object.name) ? 1 : 0;
    this.npcBarkAt.set(object.name, now + NPC_BARK_COOLDOWN_MS);
    const line = lines[(said + Math.floor(now / NPC_BARK_COOLDOWN_MS)) % lines.length];
    const bubble = speechBubble(this, label.x, label.y - label.displayHeight - 4, npcName(object), line, this.labelScale);
    this.npcBubble = bubble;
    label.setVisible(false);
    this.time.delayedCall(BUBBLE_MS, () => {
      bubble.destroy();
      if (this.npcBubble === bubble) this.npcBubble = null;
      if (label.active) label.setVisible(true);
    });
  }

  // --- Clavier et souris (feuille de route, chantier 0 : « PC d'abord ») ----------------------------

  /** An overlay opens (a dialogue, the inventory, a fight): no tooltip nor hand cursor left behind. */
  private clearOnPause(): void {
    const onPause = () => {
      this.input.setDefaultCursor('default');
      if (this.scene.isActive('Hud')) this.hud().tip(null);
    };
    this.events.on(Phaser.Scenes.Events.PAUSE, onPause);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.events.off(Phaser.Scenes.Events.PAUSE, onPause);
      this.input.setDefaultCursor('default');
    });
  }

  /** E, Space or Enter: the nearest person or thing within reach (a few steps at most), as a click would. */
  private interactNearest(): void {
    if (this.moving) return;
    const reach = (o: MapObject) => Math.max(Math.abs(o.col - this.heroTile.col), Math.abs(o.row - this.heroTile.row));
    const target = this.interactables
      .filter(({ object, image }) => image.visible && !this.gone(object) && reach(object) <= 3)
      .sort((a, b) => reach(a.object) - reach(b.object))[0]?.object;
    if (target) this.walkNextTo(target, () => this.interact(target));
  }

  /** The tooltip of what is under the mouse: a companion, a passer-by, a person or a thing, a way out. */
  private onHover(pointer: Phaser.Input.Pointer): void {
    let text: string | null = null;
    const companion = this.party.hit(pointer.worldX, pointer.worldY);
    const passerBy = companion ? undefined : this.figurants.hit(pointer.worldX, pointer.worldY);
    if (companion) text = `${findCompanion(companion)?.name ?? companion} — parler`;
    else if (passerBy) text = `${passerBy.def.name} — parler`;
    else {
      const tile = screenToTile({ x: pointer.worldX - this.originX, y: pointer.worldY - this.originY });
      const hit = this.interactables
        .filter(({ object, image, label }) => image.visible && ((object.col === tile.col && object.row === tile.row) || hitsBody(image, pointer.worldX, pointer.worldY, label)))
        .sort((a, b) => b.image.depth - a.image.depth)[0];
      const exit = this.map.objects.find((o) => o.type === 'sortie' && o.col === tile.col && o.row === tile.row);
      const target = hit?.object ?? exit;
      if (target) text = mapObjectHint(target, this.state);
    }
    this.input.setDefaultCursor(text ? 'pointer' : 'default');
    if (this.scene.isActive('Hud')) this.hud().tip(text, pointer.x / RENDER_SCALE, pointer.y / RENDER_SCALE);
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
    // A block of w × h cells: its image is centred (w − h) half-cells left of the front cell (src/engine/tiledMap.ts),
    // then moved so the bridge's ends meet the paths; the walkers climb onto its arched deck, and its front railing
    // goes over them (src/engine/bigGround.ts).
    for (const tile of bigGround) {
      const key = `decor-${tile.name}`;
      if (!this.textures.exists(key)) continue;
      const { cols, rows } = bigBlock(this.map, tile, this.map.ground);
      const image = this.textures.get(key).getSourceImage() as HTMLImageElement;
      const art = BIG_GROUND_ART[tile.name];
      const f = this.feet(tile);
      const x = f.x - ((cols - rows) * TILE_WIDTH) / 4 - image.width / 2 + (art?.shift.x ?? 0);
      const y = f.y - image.height + (art?.shift.y ?? 0);
      rt.draw(key, x, y);
      if (!art) continue;
      this.add.image(x, y, this.frontOf(key, image, art.front)).setOrigin(0, 0).setDepth(f.y + 1);
      for (let c = tile.col - cols + 1; c <= tile.col; c++) {
        for (let r = tile.row - rows + 1; r <= tile.row; r++) this.lifts.set(tileKey({ col: c, row: r }), art.lift);
      }
    }
  }

  /** Where a walker's feet go on a cell: its diamond's bottom, raised on a bridge's deck. */
  private walkerFeet(tile: Tile): { x: number; y: number } {
    const f = this.feet(tile);
    return { x: f.x, y: f.y - (this.lifts.get(tileKey(tile)) ?? 0) };
  }

  /** The front of a large ground decor (its railing), made once from its picture. */
  private frontOf(key: string, image: HTMLImageElement, front: BigGroundArt['front']): string {
    const frontKey = `${key}-devant`;
    if (this.textures.exists(frontKey)) return frontKey;
    const canvas = this.textures.createCanvas(frontKey, image.width, image.height);
    if (!canvas) return key;
    canvas.context.drawImage(image, 0, 0);
    const pixels = canvas.context.getImageData(0, 0, image.width, image.height);
    keepFront(pixels.data, image.width, image.height, front);
    canvas.context.putImageData(pixels, 0, 0);
    canvas.refresh();
    return frontKey;
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
        this.obstacleImages.push(image);
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
    // A companion travelling with the hero is not at home (docs/gdd/jalon-3.md, étape 2).
    if (o.type === 'pnj' && this.state.groupe.some((m) => m.id === o.name)) return true;
    // An Écho of the night is not there by day (docs/gdd/echos.md).
    if (!echoShows(o.properties.moment, this.state)) return true;
    return any(o.properties.disparaitSi) || (!!o.properties.apparaitSi && !any(o.properties.apparaitSi));
  }

  /** Evening light and night darkness over the map; nothing in the morning and at noon. */
  private showMoment(): void {
    const veil = this.state.voie ? (carriesLamp(this.state) ? MOMENT_VEILS.midi : VOIE_DARK) : MOMENT_VEILS[momentOf(this.state.time)];
    this.momentVeil.setFillStyle(veil.color, veil.alpha);
  }

  /**
   * L'oubli choisi (feuille de route, chantier 1) : a Récit too many (a dialogue, an Écho, a rank lost), and the hero must
   * choose which one to let go before walking on. What was forgotten is said on coming back.
   */
  private checkOubli(): void {
    const said = this.registry.get('oubli-notices') as string[] | undefined;
    if (said?.length && this.scene.isActive('Hud')) {
      this.registry.remove('oubli-notices');
      this.hud().toast(said.join('   ·   '));
    }
    if (recitsToForget(this.state) <= 0 || this.scene.isActive('Oubli') || this.scene.isPaused()) return;
    this.scene.pause();
    this.scene.launch('Oubli', { mode: 'plein', from: 'Map' });
  }

  /**
   * The ways out of a place, marked on the ground (test du 2026-11-06 : six minutes à chercher la sortie de Gardebois,
   * une case révélée seulement au survol) : a copper diamond and an arrow towards the outside, breathing slowly.
   */
  private drawExits(): void {
    // Above the trees of the edge, under the veil of the moment.
    const marks = this.add.graphics().setDepth(MOMENT_VEIL_DEPTH - 2);
    this.exitLabels = [];
    const [w, h] = [TILE_WIDTH / 2 - 8, TILE_HEIGHT / 2 - 4];
    for (const exit of this.map.objects.filter((o) => o.type === 'sortie' && !this.gone(o))) {
      const c = this.center(exit);
      marks.lineStyle(3, COLORS.copper, 0.85).strokePoints([{ x: c.x, y: c.y - h }, { x: c.x + w, y: c.y }, { x: c.x, y: c.y + h }, { x: c.x - w, y: c.y }], true);
      // Towards the edge it stands on (a door at the foot of a room: downwards).
      const dc = exit.col === 0 ? -1 : exit.col === this.map.width - 1 ? 1 : 0;
      const dr = exit.row === 0 ? -1 : exit.row === this.map.height - 1 || dc === 0 ? 1 : 0;
      const [vx, vy] = [((dc - dr) * TILE_WIDTH) / 2, ((dc + dr) * TILE_HEIGHT) / 2];
      const length = Math.hypot(vx, vy) || 1;
      const [ux, uy] = [vx / length, vy / length];
      const tip = { x: c.x + ux * 12, y: c.y + uy * 12 };
      const back = { x: c.x - ux * 4, y: c.y - uy * 4 };
      marks.lineStyle(3, COLORS.copper, 0.95).lineBetween(tip.x, tip.y, back.x - uy * 7, back.y + ux * 7).lineBetween(tip.x, tip.y, back.x + uy * 7, back.y - ux * 7);
      if (exit.properties.libelle) {
        const label = this.add
          .text(c.x, c.y - h - 4, exit.properties.libelle, { fontFamily: FONT_SERIF, fontSize: HAS_MOUSE ? '13px' : '17px', color: CSS.copper, stroke: CSS.ink, strokeThickness: 3 })
          .setOrigin(0.5, 1)
          .setDepth(100000)
          .setScale(this.labelScale);
        this.exitLabels.push(label);
      }
    }
    this.tweens.add({ targets: marks, alpha: 0.45, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  /** The lamp shows the traps two steps away; seen, they are marked, and the walk goes round them when it can. */
  private lightTraps(announce = true): void {
    if (!this.state.voie) return;
    const seen = lightTraps(this.state, this.map.objects, this.heroTile, (o) => this.gone(o));
    this.trapMarks.clear();
    for (const trap of this.map.objects.filter((o) => o.type === 'piege' && !this.gone(o) && this.state.flags[trapSeenFlag(o)])) {
      const c = this.center(trap);
      const [w, h] = [TILE_WIDTH / 2 - 6, TILE_HEIGHT / 2 - 3];
      this.trapMarks.lineStyle(3, LIT_TRAP, 0.9).strokePoints([{ x: c.x, y: c.y - h }, { x: c.x + w, y: c.y }, { x: c.x, y: c.y + h }, { x: c.x - w, y: c.y }], true);
      this.trapMarks.lineStyle(2, LIT_TRAP, 0.9).lineBetween(c.x - 8, c.y - 4, c.x + 8, c.y + 4).lineBetween(c.x - 8, c.y + 4, c.x + 8, c.y - 4);
    }
    if (seen.length === 0 || !announce) return;
    this.hud().toast(seen.length > 1 ? 'Ta lampe éclaire des pièges.' : 'Ta lampe éclaire un piège.');
    // A walk under way goes round what was just seen.
    if (this.moving && this.path.length) this.pendingGoal = this.path[this.path.length - 1];
  }

  private litTrapAt(tile: Tile): boolean {
    return this.map.objects.some((o) => o.type === 'piege' && o.col === tile.col && o.row === tile.row && !this.gone(o) && !!this.state.flags[trapSeenFlag(o)]);
  }

  /** The way to a cell, round the traps seen when there is one, straight through otherwise (they are then stepped over). */
  private route(from: Tile, to: Tile): Tile[] | null {
    return findPath(from, to, (t) => this.walkable(t) && !this.litTrapAt(t)) ?? findPath(from, to, this.walkable);
  }

  private refreshGone(): void {
    this.interactables = this.interactables.filter(({ object, image, label }) => {
      if (!this.gone(object)) return true;
      image.setVisible(false);
      label?.setVisible(false);
      this.occupied.delete(tileKey(object));
      return false;
    });
    this.revealThings();
  }

  // --- Walls that hide (src/engine/occlusion.ts) ----------------------------------------------

  /** Visible obstacles drawn over a box whose feet are at `depth`. */
  private hiding(box: Box, depth: number, except?: Phaser.GameObjects.Image): Phaser.GameObjects.Image[] {
    return this.obstacleImages.filter(
      (o) => o !== except && o.visible && o.depth > depth && overlaps(obstacleBox(o.x, o.y, o.displayWidth, this.drawnHeight(o)), box),
    );
  }

  /** How high an obstacle's picture rises above its feet: its transparent top skipped, measured once per frame. */
  private drawnHeight(image: Phaser.GameObjects.Image): number {
    const key = image.texture.key;
    const frame = image.frame;
    const id = `${key}:${frame.name}`;
    let top = DRAWN_TOPS.get(id);
    if (top === undefined) {
      top = frame.height;
      const middle = Math.floor(frame.width / 2);
      scan: for (let y = 0; y < frame.height; y += 2) {
        for (const x of [middle - 10, middle, middle + 10]) {
          if ((this.textures.getPixelAlpha(x, y, key, frame.name) ?? 0) > 0) {
            top = y;
            break scan;
          }
        }
      }
      DRAWN_TOPS.set(id, top);
    }
    return (frame.height - top) * (image.displayHeight / frame.height);
  }

  private applyFades(): void {
    for (const o of this.obstacleImages) o.setAlpha(this.fadedForThings.has(o) || this.fadedForHero.has(o) ? FADED_ALPHA : 1);
  }

  /** People and things to touch stay in sight: what stands in front of them is faded. */
  private revealThings(): void {
    this.fadedForThings = new Set();
    for (const { object, image } of this.interactables) {
      if (!image.visible) continue;
      const kind = object.type === 'pnj' || object.type === 'ennemi' ? 'person' : 'thing';
      for (const o of this.hiding(bodyBox(image.x, image.y, kind), image.depth, image)) this.fadedForThings.add(o);
    }
    this.applyFades();
  }

  /** The hero, on the cell they are stepping onto. */
  private revealHero(tile: Tile): void {
    const f = this.feet(tile);
    this.fadedForHero = new Set(this.hiding(bodyBox(f.x, f.y, 'person'), f.y));
    this.applyFades();
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
    // Not the objects gone, or not there yet (apparaitSi), nor the Échos of another moment.
    for (const o of this.map.objects.filter((x) => x.properties.tuile && x.type !== 'pnj' && !this.gone(x))) {
      const f = this.feet(o);
      const image = this.add.image(f.x, f.y, 'tiles', this.map.frames[o.properties.tuile] ?? this.map.frames.pnj).setOrigin(0.5, 1).setDepth(f.y);
      // An Écho is only half there.
      if (o.properties.echo) image.setAlpha(0.55);
      // Something carried by the wind (a voile at Aetherhaven): it rises and sinks a little, never quite still.
      if (o.properties.flotte) this.tweens.add({ targets: image, y: f.y - 8, duration: 1500 + (o.col * 37 + o.row * 53) % 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      // Something to search (a crate of a sleeping line): a copper glow at its foot, among the crates of the decor.
      if (o.properties.lueur) {
        const glow = this.add.ellipse(f.x, f.y - TILE_HEIGHT / 2, TILE_WIDTH * 1.1, TILE_HEIGHT * 1.1, COLORS.copper, 0.7).setDepth(f.y - 1);
        this.tweens.add({ targets: glow, alpha: 0.3, duration: 900, yoyo: true, repeat: -1 });
        image.setTint(0xffbf8a);
      }
      if (o.type !== 'decor') this.interactables.push({ object: o, image });
    }
  }

  /** A fight started from a dialogue: the arena is carved around the encounter's centre object. */
  startEncounter(id: string): void {
    // A group of a sleeping line, attacked from its dialogue (chantier 3).
    if (id.startsWith(VOIE_FIGHT)) return this.fightVoieGroup(id.slice(VOIE_FIGHT.length));
    // The Golem, struck after the yard was stopped (étude, E11).
    if (id === GOLEM_FIGHT || id === GOLEM_QUEST_FIGHT) {
      const golem = this.map.objects.find((o) => o.type === 'golem');
      if (golem) this.golemFight(golem, id === GOLEM_FIGHT);
      return;
    }
    const encounter = ENCOUNTERS.find((e) => e.id === id);
    const center = encounter && findObject(this.map, encounter.center);
    if (!encounter || !center) return;
    const enemyObjects = encounter.enemies.map((e) => findObject(this.map, e.object)!);
    this.launchFight(center, encounter.enemies.map((e) => e.id), enemyObjects, encounter.victoryFlag, encounter.victoryEffects, undefined, encounter.intro);
  }

  /**
   * `menace`: the story's chapter, for the beasts of the road and of the sleeping lines (chantier 3, strengthen).
   * `nuit`: a fight in the night of a rest, which goes on until the morning once won.
   */
  private launchFight(center: Tile, enemyIds: string[], enemyObjects: Tile[], victoryFlag: string, victoryEffects: Effect[], menace?: number, intro?: string, nuit?: boolean): void {
    const arena = carveArena(this.map, center, ARENA_COLS, ARENA_ROWS, enemyObjects);
    this.registry.set('tileFrames', this.map.frames);
    this.hud().hideToast();
    this.scene.pause();
    this.scene.pause('Hud');
    this.scene.launch('Combat', {
      enemyIds,
      victoryEffects,
      victoryFlag,
      arena,
      heroTile: toArena(arena, this.heroTile),
      enemyTiles: enemyObjects.map((o) => toArena(arena, o)),
      menace,
      intro,
      nuit,
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
    this.launchFight(center, enemies.map((o) => o.properties.ennemi), enemies, ENCOUNTER_VICTORY_FLAG, xp > 0 ? [{ giveXp: xp }] : [], this.menace());
  }

  // --- Sleeping lines (docs/gdd/voies.md) ---------------------------------------------------------

  /**
   * After each step in a sleeping line: a hidden trap underfoot, or beasts close enough to see the hero. Returns true
   * when the walk stops there (hurt by a trap, or a fight starts).
   */
  private voieStep(): boolean {
    if (!this.state.voie) return false;
    const trap = this.map.objects.find((o) => o.type === 'piege' && o.col === this.heroTile.col && o.row === this.heroTile.row && !this.gone(o));
    if (trap) {
      const outcome = springTrap(this.state, trap);
      this.hud().toast([outcome.text, ...outcome.notices].join('   ·   '));
      this.lightTraps();
      if (!outcome.spotted) {
        this.haltWalk();
        return true;
      }
    }
    this.lightTraps();
    // Out of sight of a group fled from: it may attack again later.
    for (const g of [...this.fought]) if (groupNear(this.map.objects.filter((o) => o.properties.voie === g), this.heroTile, (o) => this.gone(o)) === null) this.fought.delete(g);
    const group = groupNear(this.map.objects, this.heroTile, (o) => this.gone(o) || this.fought.has(o.properties.voie) || !!this.state.flags[sneakFlag(o.properties.voie)]);
    if (group) {
      this.haltWalk();
      // Not a fight straight away: slip past, flee, soothe, or attack (chantier 3, the voie pacifiste).
      this.fought.add(group);
      if (DIALOGUES[groupDialogueId(group)]) {
        this.scene.pause();
        this.scene.launch('Dialogue', { id: groupDialogueId(group) });
      } else this.fightVoieGroup(group);
      return true;
    }
    return false;
  }

  /** Stops the walk where the hero stands, forgetting where they were going. */
  private haltWalk(): void {
    this.path = [];
    this.pendingGoal = null;
    this.arrival = null;
    this.moving = false;
    this.standStill();
    this.marker.clear();
  }

  /**
   * The beasts of the night come at the hero lying there (src/rules/repos.ts): they appear three or four steps away,
   * where one can walk to them, and the fight takes place right here.
   */
  private fightNight(enemyIds: string[]): void {
    const hero = this.heroTile;
    const near: Tile[] = [];
    for (let dr = -3; dr <= 3; dr++) {
      for (let dc = -4; dc <= 4; dc++) {
        const tile = { col: hero.col + dc, row: hero.row + dr };
        if (Math.max(Math.abs(dc), Math.abs(dr)) < 3 || !this.walkable(tile)) continue;
        if (findPath(hero, tile, this.walkable)) near.push(tile);
      }
    }
    const rng = rngFor('nuit-places', this.state.time.day, this.state.location);
    const spots: Tile[] = [];
    while (spots.length < enemyIds.length && near.length > 0) spots.push(near.splice(Math.floor(rng() * near.length), 1)[0]);
    const ids = enemyIds.slice(0, spots.length);
    if (ids.length === 0) return;
    const all = [hero, ...spots];
    const center = {
      col: Math.round(all.reduce((sum, t) => sum + t.col, 0) / all.length),
      row: Math.round(all.reduce((sum, t) => sum + t.row, 0) / all.length),
    };
    this.launchFight(center, ids, spots, NIGHT_FLAG, [{ giveXp: nightXp(ids) }], this.menace(), undefined, true);
  }

  /** The strength of the beasts of the road, of the night and of the sleeping lines (src/rules/combat.ts). */
  private menace(): number {
    return roadMenace(this.state.quests, this.state.character?.level ?? 1);
  }

  /** A group of a sleeping line attacks: the fight takes place right here. */
  private fightVoieGroup(group: string): void {
    const enemies = this.map.objects.filter((o) => o.type === 'ennemi' && o.properties.voie === group && !this.gone(o));
    if (enemies.length === 0) return;
    const all = [this.heroTile, ...enemies];
    const center = {
      col: Math.round(all.reduce((sum, t) => sum + t.col, 0) / all.length),
      row: Math.round(all.reduce((sum, t) => sum + t.row, 0) / all.length),
    };
    this.fought.add(group);
    const ids = enemies.map((o) => o.properties.ennemi);
    const effects: Effect[] = [{ giveXp: voieGroupXp(this.state, ids) }, ...(enemies[0].properties.contrat ? [{ contrat: 'fait' as const }] : [])];
    this.launchFight(center, ids, enemies, groupFlag(group), effects, this.menace());
  }

  private drawNpcs(): void {
    for (const npc of this.map.objects.filter((o) => o.type === 'pnj' && !this.gone(o))) {
      const f = this.feet(npc);
      const frame = this.map.frames[npc.name] ?? this.map.frames.pnj;
      const image = this.add.image(f.x, f.y, 'tiles', frame).setOrigin(0.5, 1).setDepth(f.y);
      const label = this.add
        .text(f.x, f.y - 70, npcName(npc), { fontFamily: FONT_SERIF, fontSize: HAS_MOUSE ? '13px' : '17px', color: CSS.parchment, stroke: CSS.ink, strokeThickness: 3 })
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
    // Maj held, or a second click on the same cell: the hero runs (étude, A3).
    const now = this.time.now;
    const double = now - this.lastTap.at < DOUBLE_CLICK_MS && this.lastTap.col === tile.col && this.lastTap.row === tile.row;
    this.lastTap = { at: now, col: tile.col, row: tile.row };
    this.running = double || !!(pointer.event as MouseEvent | undefined)?.shiftKey;
    // A new click is a new intent: what the hero meant to do on arriving (enter a door…) is forgotten (test du
    // 2026-11-06 : un clic sur Tobias, pendant la marche vers la Réserve, faisait entrer dans la Réserve).
    this.arrival = null;
    const companion = this.party.hit(pointer.worldX, pointer.worldY);
    if (companion && DIALOGUES[`compagnon-${companion}`]) {
      this.scene.pause();
      this.scene.launch('Dialogue', { id: `compagnon-${companion}` });
      return;
    }
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
      .filter(({ object, image, label }) => (object.col === tile.col && object.row === tile.row) || hitsBody(image, pointer.worldX, pointer.worldY, label))
      .sort((a, b) => b.image.depth - a.image.depth)[0];
    if (hit) {
      const target = hit.object;
      this.walkNextTo(target, () => this.interact(target));
      return;
    }
    if (!this.walkable(tile)) {
      this.showBlocked(tile, pointer);
      return;
    }
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
    const path = this.route(this.heroTile, goal);
    if (!path) return;
    this.path = path;
    this.stepAlong();
  }

  private stepAlong(): void {
    if (this.pendingGoal) {
      const goal = this.pendingGoal;
      this.pendingGoal = null;
      this.path = this.route(this.heroTile, goal) ?? [];
    }
    const next = this.path.shift();
    if (!next) {
      this.moving = false;
      this.running = false;
      this.standStill();
      this.marker.clear();
      const done = this.arrival;
      this.arrival = null;
      done?.();
      return;
    }
    this.moving = true;
    playStep(this);
    // The camera comes back to the hero as soon as he walks (étude, A1).
    if (!this.following) this.recenter();
    this.walk(facingOf(this.heroTile, next));
    const diagonal = next.col !== this.heroTile.col && next.row !== this.heroTile.row;
    const target = this.walkerFeet(next);
    this.revealHero(next);
    this.tweens.add({
      targets: this.hero,
      x: target.x,
      y: target.y,
      duration: diagonal ? this.stepMs() * 1.4 : this.stepMs(),
      onUpdate: () => this.hero.setDepth(this.hero.y),
      onComplete: () => {
        this.party.heroStepped(this.heroTile, this.stepMs());
        this.heroTile = next;
        this.state.position = { ...next };
        if (this.voieStep()) return;
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
    this.hero.anims.timeScale = this.running ? STEP_MS / RUN_STEP_MS : 1;
  }

  private standStill(): void {
    if (!this.walkSheet) return;
    const anim = this.anims.get(`${this.walkSheet}-${this.facing}`);
    this.hero.stop().setTexture(this.walkSheet, anim.frames[0].frame.name);
  }

  private stepMs(): number {
    return this.running ? RUN_STEP_MS : STEP_MS;
  }

  // --- La caméra libre (étude du 2026-11-03, A1) ------------------------------------------------

  /** Bounds for the current zoom: a room smaller than the view is centred in it (Phaser pins small worlds top-left). */
  private fitCamera(): void {
    const worldWidth = (this.map.width + this.map.height) * (TILE_WIDTH / 2);
    const worldHeight = (this.map.width + this.map.height) * (TILE_HEIGHT / 2) + TOP_MARGIN;
    const boundsWidth = Math.max(worldWidth, GAME_WIDTH / this.zoom);
    const boundsHeight = Math.max(worldHeight, GAME_HEIGHT / this.zoom);
    this.cameras.main
      .setBounds((worldWidth - boundsWidth) / 2, (worldHeight - boundsHeight) / 2, boundsWidth, boundsHeight)
      .setZoom(this.zoom * RENDER_SCALE);
    this.labelScale = labelScaleFor(this.zoom);
    for (const { label } of this.interactables) label?.setScale(this.labelScale);
    for (const label of this.exitLabels) label.setScale(this.labelScale);
    this.party?.setLabelScale(this.labelScale);
  }

  /** The wheel: closer or farther, kept for the next places (registry, not the save). */
  private zoomBy(step: number): void {
    const zoom = Phaser.Math.Clamp(Math.round((this.zoom + step) * 10) / 10, this.minZoom, ZOOM_MAX);
    if (zoom === this.zoom) return;
    const camera = this.cameras.main;
    const center = { x: camera.midPoint.x, y: camera.midPoint.y };
    this.zoom = zoom;
    this.registry.set('mapZoom', zoom);
    this.fitCamera();
    if (!this.following) camera.centerOn(center.x, center.y);
  }

  private startDrag(pointer: Phaser.Input.Pointer): void {
    const camera = this.cameras.main;
    this.drag = { x: pointer.x, y: pointer.y, scrollX: camera.scrollX, scrollY: camera.scrollY, moved: false };
  }

  /** While pressed, the view follows the mouse or the finger; true while dragging. */
  private dragView(pointer: Phaser.Input.Pointer): boolean {
    const drag = this.drag;
    if (!drag || !pointer.isDown) return false;
    const dx = pointer.x - drag.x;
    const dy = pointer.y - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD * RENDER_SCALE) return false;
    if (!drag.moved) {
      drag.moved = true;
      // The scroll the follow had reached, so the view does not jump.
      const camera = this.cameras.main;
      camera.stopFollow();
      drag.scrollX = camera.scrollX;
      drag.scrollY = camera.scrollY;
      drag.x = pointer.x;
      drag.y = pointer.y;
      this.following = false;
      this.input.setDefaultCursor('grabbing');
      if (this.scene.isActive('Hud')) {
        this.hud().tip(null);
        this.hud().showRecenter(() => this.recenter());
      }
      return true;
    }
    const camera = this.cameras.main;
    camera.setScroll(drag.scrollX - dx / camera.zoom, drag.scrollY - dy / camera.zoom);
    return true;
  }

  /** C, Origine, the button, or the hero's first step: the view follows the hero again. */
  private recenter(): void {
    this.following = true;
    this.cameras.main.startFollow(this.hero, true, 0.15, 0.15);
    this.input.setDefaultCursor('default');
    if (this.scene.isActive('Hud')) this.hud().showRecenter(null);
  }

  /** A click where one cannot go: a red diamond that fades, and why (étude, A2). */
  private showBlocked(tile: Tile, pointer?: Phaser.Input.Pointer): void {
    const inside = tile.col >= 0 && tile.row >= 0 && tile.col < this.map.width && tile.row < this.map.height;
    if (inside) {
      const c = this.center(tile);
      this.blockedMarker.clear().lineStyle(2, COLORS.blocked, 1);
      this.blockedMarker.strokePoints(
        [
          new Phaser.Math.Vector2(c.x, c.y - TILE_HEIGHT / 2),
          new Phaser.Math.Vector2(c.x + TILE_WIDTH / 2, c.y),
          new Phaser.Math.Vector2(c.x, c.y + TILE_HEIGHT / 2),
          new Phaser.Math.Vector2(c.x - TILE_WIDTH / 2, c.y),
        ],
        true,
      );
      this.blockedMarker.lineBetween(c.x - 8, c.y - 4, c.x + 8, c.y + 4).lineBetween(c.x - 8, c.y + 4, c.x + 8, c.y - 4);
      this.tweens.killTweensOf(this.blockedMarker);
      this.blockedMarker.setAlpha(1);
      this.tweens.add({ targets: this.blockedMarker, alpha: 0, delay: 350, duration: 450 });
    }
    if (pointer && this.scene.isActive('Hud')) {
      const hud = this.hud();
      hud.tip(inside ? 'On ne passe pas par là.' : 'Rien par là.', pointer.x / RENDER_SCALE, pointer.y / RENDER_SCALE);
      this.time.delayedCall(1200, () => {
        if (this.scene.isActive('Hud')) hud.tip(null);
      });
    }
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

  /** What the HUD's small map shows of this place (étude A7, src/ui/miniMap.ts). */
  private miniMapSource(): MiniMapSource {
    const fromCellZero = (x: number, y: number) => ({ x: x - this.originX, y: y - this.originY });
    return {
      map: this.map,
      hero: () => fromCellZero(this.hero.x, this.hero.y - TILE_HEIGHT / 2),
      markers: () => {
        const marks: MiniMarker[] = this.map.objects
          .filter((o) => (o.type === 'sortie' || o.type === 'porte') && !this.gone(o))
          .map((o) => ({ col: o.col, row: o.row, kind: 'exit' }));
        for (const { object, image } of this.interactables) {
          if (!image.visible || this.gone(object)) continue;
          const kind = object.type === 'pnj' || object.type === 'golem' ? 'person' : object.type === 'ennemi' ? 'enemy' : object.properties.echo || object.type === 'echo' ? 'echo' : null;
          if (kind) marks.push({ col: object.col, row: object.row, kind });
        }
        return marks;
      },
      view: () => {
        const v = this.cameras.main.worldView;
        return { ...fromCellZero(v.x, v.y), width: v.width, height: v.height };
      },
      lookAt: (tile) => {
        const c = this.center(tile);
        this.cameras.main.stopFollow();
        this.cameras.main.centerOn(c.x, c.y);
        this.following = false;
        if (this.scene.isActive('Hud')) this.hud().showRecenter(() => this.recenter());
      },
    };
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
    // An enemy with its own scene (the Ours-Mousse asleep on Malo's satchel): its choices, not a mere warning.
    if (target.type === 'ennemi' && target.properties.dialogue && DIALOGUES[target.properties.dialogue]) {
      this.scene.pause();
      this.scene.launch('Dialogue', { id: target.properties.dialogue });
      return;
    }
    // An enemy that bars the way (étude, C5): touching it starts its fight.
    if (target.type === 'ennemi' && target.properties.embuscade) {
      this.startEncounter(target.properties.embuscade);
      return;
    }
    if (target.type === 'ennemi' && target.properties.voie) {
      this.fightVoieGroup(target.properties.voie);
      return;
    }
    if (target.type === 'descente') {
      if (descend(this.state)) this.scene.restart();
      return;
    }
    if (target.properties.contrats) {
      this.scene.pause();
      this.scene.launch('Contrats', { board: target.properties.contrats });
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

  private startGolemFight(): void {
    if (this.state.flags['golem-vaincu']) {
      this.hud().toast('Le Golem de Ferraille gît immobile, silencieux.');
      return;
    }
    // The yard stopped by other means, the Golem still stands: one may strike it, warned (décision de Cyril,
    // 2026-11-03 ; étude, E11). Its warning dialogue starts the fight (GOLEM_FIGHT).
    if (this.state.flags['chantier-arrete'] || this.state.quests['dernier-train'] === 'done') {
      this.scene.pause();
      this.scene.launch('Dialogue', { id: GOLEM_FIGHT });
      return;
    }
    if (this.state.quests['dernier-train'] !== 'active') {
      this.hud().toast('Le Golem de Ferraille ne bouge plus.');
      return;
    }
    // During the quest: a warning first, then the fight if one insists (test du 2026-11-06).
    this.scene.pause();
    this.scene.launch('Dialogue', { id: GOLEM_FIGHT });
  }

  /**
   * The fight takes place right here, on the map around the golem; the two Rôdeurs-Épine come out of the undergrowth
   * at the far edge (docs/gdd/combat.md). In the story, it stops the yard and ends « Le Dernier Train » ; after, it
   * only gives its heart and the experience.
   */
  private golemFight(golem: MapObject, after: boolean): void {
    const arena = carveArena(this.map, golem, ARENA_COLS, ARENA_ROWS, [golem]);
    const heroTile = toArena(arena, this.heroTile);
    const golemTile = toArena(arena, golem);
    const [rodeur1, rodeur2] = farEdgeTiles(arena, heroTile, [heroTile, golemTile]);
    this.registry.set('tileFrames', this.map.frames);
    this.hud().hideToast();
    this.scene.pause();
    this.scene.pause('Hud');
    this.scene.launch('Combat', {
      enemyIds: ['golem-ferraille', 'rodeur-epine', 'rodeur-epine'],
      victoryEffects: after ? [{ giveXp: 50 }] : GOLEM_VICTORY_EFFECTS,
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
    walkTheMarches(this.state.time.day);
    const place = this.state.voie ? leaveVoie(this.state) : placeOfLocation(this.state.location);
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

/**
 * Frames are 64 × 96 with transparent margins; only the central part counts as the body, half as wide again under a
 * finger. A person's name above the head counts too (étude du 2026-11-03, A5 : « taper sur Ingrid Brisefer ne fait rien »).
 */
function hitsBody(image: Phaser.GameObjects.Image, x: number, y: number, label?: Phaser.GameObjects.Text): boolean {
  const half = HAS_MOUSE ? 18 : 27;
  const left = image.x - half;
  const right = image.x + half;
  const top = image.y - (HAS_MOUSE ? 68 : 78);
  const bottom = image.y - 4;
  if (x >= left && x <= right && y >= top && y <= bottom) return true;
  return !!label?.visible && label.getBounds().contains(x, y);
}

function npcName(o: MapObject): string {
  return npcData.find((n) => n.id === o.name)?.name ?? o.name;
}
