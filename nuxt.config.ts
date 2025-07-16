// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css: ['~/assets/css/main.css'],
  imports: {
    dirs: [
      'composables/**',
      'utils/**'
    ]
  },
  nitro: {
    preset: 'vercel',
    experimental: {
      wasm: true
    },
    rollupConfig: {
      external: ['@prisma/client']
    }
  },
  vite: {
    define: {
      global: 'globalThis'
    },
    optimizeDeps: {
      exclude: ['@prisma/client']
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/variables.scss" as *;'
        }
      }
    },
    ssr: {
      noExternal: ['vuetify']
    }
  },
  runtimeConfig: {
    // Server-side only config
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    
    // Public config exposed to client
    public: {
      apiBase: '/api'
    }
  }
})
