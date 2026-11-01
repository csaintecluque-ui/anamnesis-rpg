import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Relative base so the build works under the GitHub Pages sub-path.
  base: './',
  build: {
    target: 'es2022',
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
});
