// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path' // 👈 1. Importa 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 👇 2. Agrega esta sección completa
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})