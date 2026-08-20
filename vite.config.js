import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // FIXED: Use the repo name as base path for GitHub Pages
  base: '/repo-setup-site/',
})
