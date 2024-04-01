// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Lapzy',
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
