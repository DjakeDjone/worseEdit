import tailwindcss from "@tailwindcss/vite";


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
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
    server: {
      allowedHosts: ["docs.fri3dl.dev"]
    }
  },
  nitro: {
    experimental: {
      websocket: true
    },
    // storage: {
    //   db: {
    //     driver: 'vercel-blob',

    //   }
    // },
    // devStorage: {
    //   db: {
    //     driver: 'fs',
    //     base: './data/kv',
    //   }
    // }
  },

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {}
    }
  }
})