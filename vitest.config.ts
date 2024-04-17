import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      exclude: ['src/test/**/*'],
    },
  },
});
