import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// base './' lets the build work on Cloudflare Pages AND GitHub Pages sub-folders
export default defineConfig({ plugins: [react()], base: './' })
