import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { resolve } from 'path'
import ReactivityTransform from '@vue-macros/reactivity-transform/vite'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],

      link: [
        // // <link rel="stylesheet" href="https://myawesome-lib.css">
        // { rel: 'stylesheet', href: 'https://awesome-lib.css' },
      ],
    },
  },
  modules: ['@vueuse/nuxt', '@nuxtjs/tailwindcss'],
  vite: {
    plugins: [
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'assets/icon')],
        // Specify symbolId format
        symbolId: 'icon-[dir]-[name]',
        inject: 'body-last',
      }),
      ReactivityTransform(),
    ],
  },
})
