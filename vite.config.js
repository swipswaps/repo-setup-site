import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // base: determines the public path when served
  // - For user pages (username.github.io): use '/'
  // - For project pages: set BASE_URL="/repo-name/"
  // REFERENCE: https://vite.dev/guide/static-deploy.html#github-pages
  base: process.env.BASE_URL || '/',
})
