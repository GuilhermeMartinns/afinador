import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa' // <-- Importe aqui

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png'], // Os arquivos que devem ser cacheados
      manifest: {
        name: 'Afinador Cromático',
        short_name: 'Afinador',
        description: 'Seu afinador cromático simples e rápido.',
        theme_color: '#030612',
        background_color: '#000000',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    host: true, // Para acesso via IP
    port: 5173,
  }
})