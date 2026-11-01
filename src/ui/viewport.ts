import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from './theme';

/**
 * Layout stays in 1280 × 720 logical units, but the canvas is drawn RENDER_SCALE times larger, close to the screen's
 * real pixel count (1.5 on a 1080p PC, 2 on 1440p, high-density laptops and phones). Each scene's camera zooms by
 * the same factor and text is rasterised at that resolution, so nothing is stretched up by the browser afterwards.
 */
export const RENDER_SCALE = computeRenderScale();

/** The exploration map is shown closer than the 1:1 logical scale. */
export const MAP_ZOOM = 1.5;

function computeRenderScale(): number {
  const physicalWidth = Math.max(window.screen.width, window.screen.height) * (window.devicePixelRatio || 1);
  // Steps of 0.5 between 1 and 2: above 2, the gain is invisible and the memory cost is not (phones, 4K screens).
  return Math.min(2, Math.max(1, Math.ceil((physicalWidth / GAME_WIDTH) * 2) / 2));
}

/** Gives every scene the render-scale camera and crisp text; the Map scene manages its own following camera. */
export function applyRenderScale(game: Phaser.Game): void {
  for (const scene of game.scene.scenes) {
    const isMap = scene.sys.settings.key === 'Map';
    scene.sys.events.on(Phaser.Scenes.Events.CREATE, () => {
      if (!isMap) scene.cameras.main.setZoom(RENDER_SCALE).centerOn(GAME_WIDTH / 2, GAME_HEIGHT / 2);
    });
    scene.sys.events.on(Phaser.Scenes.Events.ADDED_TO_SCENE, (gameObject: Phaser.GameObjects.GameObject) => {
      if (gameObject instanceof Phaser.GameObjects.Text) gameObject.setResolution(RENDER_SCALE * (isMap ? MAP_ZOOM : 1));
    });
  }
}
