// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Lapzy - Jouw MX performance platform',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'og:title', content: 'Lapzy - Jouw MX performance platform' },
        { name: 'description', content: 'Check, deel en verbeter je rondetijden op elke crossbaan.' },
        { name: 'og:description', content: 'Check, deel en verbeter je rondetijden op elke crossbaan.' },
        {name: 'msapplication-TileColor', content: '#ffffff'},
        {name: 'theme-color', content: '#ffffff'},
      ],
      link: [
        {rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.svg'},
        {rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png'},
        {rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png'},
        {rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png'},
        {rel: 'mask-icon', href: '/favicon/safari-pinned-tab.svg', color: '#1e5fde'},
      ],
    },
  },
  css: [
    '~/assets/css/main.css',
    '~/assets/css/tailwind.css',
  ],
  runtimeConfig:{
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxtjs/supabase',
    'dayjs-nuxt',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt'
  ],
  supabase: {
    redirect: false
  },
  shadcn: {
    componentDir: './components/ui'
  },
  pwa: {
    manifest: {
      name: 'Lapzy',
      short_name: 'Lapzy',
      theme_color: '#1e5ddc',
      background_color: '#ffffff',
      icons: [
        {
          src: '/favicon/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/favicon/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    devOptions: {
      enabled: true,
      navigateFallback: '/',
      type: 'module'
    }
  }
})