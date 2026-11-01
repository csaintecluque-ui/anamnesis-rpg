import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { IsoTestScene } from './scenes/IsoTestScene';
import { SlotsScene } from './scenes/SlotsScene';
import { TitleScene } from './scenes/TitleScene';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from './ui/theme';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: COLORS.ink,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, TitleScene, IsoTestScene, SlotsScene],
});

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
