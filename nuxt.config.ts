import tailwindcss from "@tailwindcss/vite";


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  // devtools: { enabled: true },
  modules: [
    // '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@formkit/auto-animate',
    '@primevue/nuxt-module',
    'nuxt-tiptap-editor',
    '@nuxt/icon'
  ],
  css: ['~/assets/main.css'],
  primevue: {
    importTheme: { from: '@/themes/maintheme.ts' },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  nitro: {
    experimental: {
      websocket: true
    },
    storage: {
      db: {
        driver: 'vercel-kv',
      }
    },
    devStorage: {
      db: {
        driver: 'fs',
        base: './data/kv',
      }
    }
  },

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {}
    }
  }
})