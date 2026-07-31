import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    modulePreload: false, // Disables Vite modulepreload links to fix Chrome DevTools preloaded resource warnings
    sourcemap: false
  }
})
