import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@atoms": path.resolve(__dirname, "./src/ui/atoms"),
      "@molecules": path.resolve(__dirname, "./src/ui/molecules"),
      "@organisms": path.resolve(__dirname, "./src/ui/organisms"),
      "@templates": path.resolve(__dirname, "./src/ui/templates"),
      "@pages": path.resolve(__dirname, "./src/ui/pages"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@typing": path.resolve(__dirname, "./src/shared/utils/types"),
      "@constants": path.resolve(__dirname, "./src/shared/utils/constants"),
    },
  },
  plugins: [
    react(),
  ],
})
