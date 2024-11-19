import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  clearScreen: false,
  server: { 
    host: "192.168.31.8",
    proxy: {
      "/api": {
        target: "http://192.168.31.8:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/"),
      },
    },
    port: 3000
  },
  base: "/DIA_2024_Front", 
  plugins: [react()],
})