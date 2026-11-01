import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';

const INK = '#1B1512';

export default defineConfig({
  // Relative base so the build works under the GitHub Pages sub-path.
  base: './',
  build: {
    target: 'es2022',
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'Anamnesis',
        short_name: 'Anamnesis',
        description: 'RPG isométrique au tour par tour dans l’univers d’Anamnesis.',
        lang: 'fr',
        start_url: './',
        scope: './',
        display: 'fullscreen',
        orientation: 'landscape',
        background_color: INK,
        theme_color: INK,
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json,woff2,mp3,ogg}'],
        // Phaser alone weighs ~1.2 MB; leave room for game data and audio.
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
      },
    }),
  ],
  test: {
    include: ['src/**/*.test.ts'],
  },
});
