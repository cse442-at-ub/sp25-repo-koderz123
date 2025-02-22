import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/CSE442/2025-Spring/cse-442p/",
  plugins: [react()],
})
