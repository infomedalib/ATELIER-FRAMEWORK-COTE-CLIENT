import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command }) => ({
  base: command === 'build'
    ? '/ATELIER-FRAMEWORK-COTE-CLIENT/tp2-tickets-maintenance-dali/'
    : '/',
  plugins: [vue()]
}))
