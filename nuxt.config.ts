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
      ],
      link: [
        {rel: 'icon', type: 'image/x-icon', href: '/favicon.svg'}
      ],
    },
  },
  css: [
    '~/assets/css/main.css',
    '~/assets/css/tailwind.css',
  ],
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxtjs/supabase',
    'dayjs-nuxt'
  ],
  shadcn: {
    componentDir: './components/ui'
  }
})
