/// <reference types="vitest" />

import { defineConfig } from 'vite'

/**
 * @example https://github.com/vitest-dev/vitest/blob/main/examples/react/package.json
 * @docs https://www.nowcoder.com/discuss/516863863606743040
 */
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
})
