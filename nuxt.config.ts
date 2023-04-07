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
  css: ['@/assets/style/tailwind.css', '@/assets/style/index.scss'],
  modules: ['@element-plus/nuxt', '@vueuse/nuxt', '@nuxtjs/tailwindcss'],
  elementPlus: {
    importStyle: 'scss',
  },
  runtimeConfig: {
    openaiApiKey: process.env.OPENAIKEY || '',
    chatModel: 'gpt-3.5-turbo',
  },
  experimental: {
    reactivityTransform: true,
  },
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
