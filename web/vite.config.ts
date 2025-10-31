/// <reference types="vitest" />

import analog from '@analogjs/platform';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
    alias: {
      'node-fetch': 'isomorphic-fetch',
    },
  },
  ssr: {
    noExternal: ['@analogjs/trpc', '@trpc/server', '@analog-tools/auth'],
  },
  plugins: [
    analog({
      nitro: {
        preset: 'vercel',
      },
    }),
    tailwindcss() /*viteStaticCopy({
      targets: [
        {
          src: "./src/app/generated/prisma/*.node",
          dest: "./",
        },
        {
          src: "./src/server/generated/prisma/*.node",
          dest: "./",
        }
      ]
    })*/,
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
  },
  define: {
    'import.meta.vitest': mode !== 'production',
    global: {},
  },
  server: {
    allowedHosts: ['9b3dar-46-191-177-220.ru.tuna.am', 'localhost'],
  },
}));
// fake changes 6