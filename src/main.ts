import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { CombatScene } from './scenes/CombatScene';
import { CreationScene } from './scenes/CreationScene';
import { DialogueScene } from './scenes/DialogueScene';
import { HudScene } from './scenes/HudScene';
import { LevelUpScene } from './scenes/LevelUpScene';
import { MapScene } from './scenes/MapScene';
import { SlotsScene } from './scenes/SlotsScene';
import { TitleScene } from './scenes/TitleScene';
import { TradeScene } from './scenes/TradeScene';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from './ui/theme';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  // HTML elements (the name field) are needed to bring up the phone keyboard.
  dom: { createContainer: true },
  backgroundColor: COLORS.ink,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  // Order matters: later scenes draw on top and receive input first (Combat, Trade, LevelUp and Dialogue above the HUD above the map).
  scene: [BootScene, TitleScene, CreationScene, MapScene, HudScene, DialogueScene, TradeScene, LevelUpScene, CombatScene, SlotsScene],
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
