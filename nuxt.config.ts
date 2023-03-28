import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import glsl from 'vite-plugin-glsl'
import { resolve } from 'path'
import ReactivityTransform from '@vue-macros/reactivity-transform/vite'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
    rootId: 'root',
    rootTag: 'section',
  },
  css: ['@/assets/style/tailwind.css', '@/assets/style/index.scss'],
  modules: ['@element-plus/nuxt', '@vueuse/nuxt', '@nuxtjs/tailwindcss'],
  elementPlus: {
    importStyle: 'scss',
  },
  runtimeConfig: {
    openaiApiKey: '',
  },
  vite: {
    plugins: [
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'assets/icon')],
        // Specify symbolId format
        symbolId: 'icon-[dir]-[name]',
        inject: 'body-last',
      }),
      ReactivityTransform(),
      glsl(),
    ],
  },
})
