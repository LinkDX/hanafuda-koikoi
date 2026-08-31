import { readFileSync } from 'node:fs';
import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8')) as { version: string };

export default defineConfig({
  base: '/hanafuda-koikoi/',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      workbox: {
        // 圖集卡面（public/wiki）也要離線可用
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'],
      },
      includeAssets: ['icons/*.png', 'favicon.svg'],
      manifest: {
        name: '花牌 こいこい',
        short_name: 'こいこい',
        description: '日本花牌こいこい網頁遊戲，與 AI 對戰，離線可玩',
        display: 'standalone',
        orientation: 'any',
        theme_color: '#1a3c2e',
        background_color: '#1a3c2e',
        icons: [
          { src: 'icons/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
