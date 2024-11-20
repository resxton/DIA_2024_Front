import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  clearScreen: false,
  server: { 
    host: "172.20.10.2",
    proxy: {
      "/api": {
        target: "http://172.20.10.2:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/"),
      },
    },
    port: 3000
  },
  base: "/DIA_2024_Front", 
  plugins: [react()],
})