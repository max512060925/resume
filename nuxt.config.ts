import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import glsl from 'vite-plugin-glsl'
import { resolve } from 'path'
// import ReactivityTransform from '@vue-macros/reactivity-transform/vite'
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
  css: ['@unocss/reset/tailwind-compat.css', '@/assets/style/index.scss'],
  modules: ['@element-plus/nuxt', '@vueuse/nuxt', '@unocss/nuxt'],
  elementPlus: {
    importStyle: 'scss',
  },
  runtimeConfig: {
    openai: {
      key: '',
      model: '',
      organization: '',
    },
    mysql: {
      host: '',
      port: '',
      database: '',
      username: '',
      password: '',
    },
  },
  experimental: {
    reactivityTransform: true,
  },
  nitro: {},
  vite: {
    resolve: {
      alias: {
        '@': resolve(process.cwd()),
      },
    },
    plugins: [
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'public/icon')],
        // Specify symbolId format
        symbolId: 'icon-[dir]-[name]',
        inject: 'body-last',
      }),
      // ReactivityTransform(),
      glsl(),
    ],
  },
})
