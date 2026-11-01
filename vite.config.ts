import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';

const INK = '#1B1512';

function appVersion(): string {
  const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string };
  let sha = process.env.GITHUB_SHA?.slice(0, 7);
  if (!sha) {
    try {
      sha = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    } catch {
      sha = 'dev';
    }
  }
  return `v${version} · ${sha}`;
}

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(appVersion()),
  },
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
