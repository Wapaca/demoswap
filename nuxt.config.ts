// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  title: 'Waxel Ninjas claim helper',
  css: ['~/assets/css/main.scss'],

  devtools: { enabled: true },
  devServer: { host: '0.0.0.0' },

  modules: ['@pinia/nuxt', "@nuxt/ui"],
  ui: {
    primary: 'green',
    gray: 'cool'
  }
})