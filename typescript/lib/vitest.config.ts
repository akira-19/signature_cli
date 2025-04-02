import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // it, expect などを global に使えるようにする
    include: ['test/**/*.test.ts'], // テストファイルの場所
  },
});
