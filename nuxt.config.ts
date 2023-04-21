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
    auth: {
      secret: '',
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
  nitro: {
    storage: {
      redis: {
        driver: 'redis',
        /* redis connector options */
        port: 6379, // Redis port
        host: 'maxwinnie.xyz', // Redis host
        username: 'max', // needs Redis >= 6
        password: '941722Zxc!',
        db: 0, // Defaults to 0
        tls: {}, // tls/ssl
      },
    },
  },
  vite: {
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
