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
    openaiApiKey: '',
    chatModel: '',
    mysql: {
      host: process.env.MYSQL_HOST || 'maxwinnie.xyz',
      port: process.env.MYSQL_PORT || '3306',
      database: process.env.MYSQL_DATABASE || 'myDB',
      username: process.env.MYSQL_USERNAME || 'root',
      password: process.env.MYSQL_MASSWORD || '941722Zxc!',
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
