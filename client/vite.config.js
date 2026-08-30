import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  server: {
    port: 5180,
    proxy: {
      '/api': { target: 'http://localhost:4100', changeOrigin: true },
      '/ws/simulator': { target: 'ws://localhost:4100', ws: true },
    },
  },
})
