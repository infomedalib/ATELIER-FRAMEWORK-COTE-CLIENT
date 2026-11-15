import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command }) => ({
  base: command === 'build'
    ? '/ATELIER-FRAMEWORK-COTE-CLIENT/TP2_Tickets_Maintenance/'
    : '/',
  plugins: [vue()],
  server: { port: 5173 }
}))
