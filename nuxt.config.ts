// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    head: {
      title: 'App',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'og:title', content: 'App' },
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
        {rel: 'manifest', href: '/favicon/site.webmanifest'},
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
  ],

  supabase: {
    redirect: false
  },

  shadcn: {
    componentDir: './components/ui'
  },

  compatibilityDate: '2024-12-16'
})