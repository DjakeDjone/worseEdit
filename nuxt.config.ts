import tailwindcss from "@tailwindcss/vite";


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  // app: {
  //   pageTransition: { name: 'page', mode: 'out-in' }
  // },
  modules: [// '@nuxtjs/tailwindcss',
  '@vueuse/nuxt', '@formkit/auto-animate', '@primevue/nuxt-module', 'nuxt-tiptap-editor', '@nuxt/icon', 'nuxt-time', '@nuxtjs/color-mode'],
  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode'
  },
  css: ['~/assets/main.css'], // Make sure Tailwind CSS is included
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