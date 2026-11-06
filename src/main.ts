import Phaser from 'phaser';
import { setUpMobileAudio } from './audio/mobile';
import { BootScene } from './scenes/BootScene';
import { CombatScene } from './scenes/CombatScene';
import { CreationScene } from './scenes/CreationScene';
import { DeathScene } from './scenes/DeathScene';
import { DialogueScene } from './scenes/DialogueScene';
import { HudScene } from './scenes/HudScene';
import { JournalScene } from './scenes/JournalScene';
import { LevelUpScene } from './scenes/LevelUpScene';
import { MapScene } from './scenes/MapScene';
import { OptionsScene } from './scenes/OptionsScene';
import { PauseScene } from './scenes/PauseScene';
import { SlotsScene } from './scenes/SlotsScene';
import { TitleScene } from './scenes/TitleScene';
import { TradeScene } from './scenes/TradeScene';
import { VeilleeScene } from './scenes/VeilleeScene';
import { ContratsScene } from './scenes/ContratsScene';
import { OubliScene } from './scenes/OubliScene';
import { AtelierScene } from './scenes/AtelierScene';
import { WorldMapScene } from './scenes/WorldMapScene';
import { getSettings } from './settings';
import type { GameState } from './state/gameState';
import { playTimeStep } from './state/playTime';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from './ui/theme';
import { RENDER_SCALE, applyRenderScale } from './ui/viewport';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  // HTML elements (the name field) are needed to bring up the phone keyboard.
  dom: { createContainer: true },
  backgroundColor: COLORS.ink,
  // Drawn at the screen's real resolution; scenes still lay out in 1280 × 720 (see ui/viewport.ts).
  width: GAME_WIDTH * RENDER_SCALE,
  height: GAME_HEIGHT * RENDER_SCALE,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    // Our own container: otherwise Phaser wraps the canvas in a new element on the first attempt, and a refused
    // attempt leaves it there so the next one throws. It also keeps the HTML layer (name field) in full screen.
    fullscreenTarget: 'game',
  },
  // Order matters: later scenes draw on top and receive input first (overlays above the HUD above the map;
  // Options above Pause and Title, which both open it).
  scene: [
    BootScene,
    TitleScene,
    CreationScene,
    MapScene,
    DeathScene,
    WorldMapScene,
    HudScene,
    DialogueScene,
    TradeScene,
    VeilleeScene,
    ContratsScene,
    AtelierScene,
    JournalScene,
    OubliScene,
    LevelUpScene,
    CombatScene,
    PauseScene,
    OptionsScene,
    SlotsScene,
  ],
});

game.sound.volume = getSettings().volume / 100;
// Phones: the iPhone's silent switch, an audio left asleep until a touch (src/audio/mobile.ts).
setUpMobileAudio(game);
game.events.once(Phaser.Core.Events.READY, () => applyRenderScale(game));

// The play time (src/state/playTime.ts): one clock on the game loop, whatever scene is running, that stops in the
// menus and when nobody touches anything.
let lastInput = performance.now();
for (const type of ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart']) {
  window.addEventListener(type, () => (lastInput = performance.now()), { passive: true });
}
// The frame's own timestamp, not Phaser's delta: that one is smoothed, and fell short of the real time.
let lastFrame = 0;
game.events.on(Phaser.Core.Events.STEP, (time: number) => {
  const delta = lastFrame ? time - lastFrame : 0;
  lastFrame = time;
  const state = game.registry.get('game') as GameState | undefined;
  if (!state?.character) return;
  const active = game.scene.getScenes(true).map((s) => s.scene.key);
  state.playTimeSeconds += playTimeStep(delta, active, performance.now() - lastInput);
});

// Development only: lets browser checks locate things on screen. Never present in the published build.
if (import.meta.env.DEV) (window as unknown as { __anamnesis: Phaser.Game }).__anamnesis = game;

// Phaser's FIT mode re-centres on resize but keeps the old display size (seen on rotation); force a full refresh.
let pendingRefresh = 0;
const refreshScale = (): void => {
  cancelAnimationFrame(pendingRefresh);
  pendingRefresh = requestAnimationFrame(() => game.scale.refresh());
};
window.addEventListener('resize', refreshScale);
window.addEventListener('orientationchange', refreshScale);
window.visualViewport?.addEventListener('resize', refreshScale);

// A new version takes control in the background; without a reload the player would run the old code until the
// next launch. Only reload on the title screen, so unsaved progress is never lost mid-game.
if ('serviceWorker' in navigator) {
  const hadController = navigator.serviceWorker.controller !== null;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    const onTitle = game.scene.isActive('Title') || game.scene.isActive('Boot');
    if (hadController && onTitle) window.location.reload();
  });
}
