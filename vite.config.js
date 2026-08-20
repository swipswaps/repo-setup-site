import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // CRITICAL FIX: Use the repo name as base path for GitHub Pages
  // Without this, assets load from /assets/ instead of /repo-setup-site/assets/
  base: '/repo-setup-site/',
})
