import glsl from 'vite-plugin-glsl'
import IconsResolver from 'unplugin-icons/resolver'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Components from 'unplugin-vue-components/vite'
import { fileURLToPath } from 'url'
console.log(fileURLToPath(new URL('./assets/img', import.meta.url)))
// import ReactivityTransform from '@vue-macros/reactivity-transform/vite'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        {
          rel: 'icon',
          href: '/favicon.ico',
        },
      ],
    },
    rootId: 'root',
    rootTag: 'section',
  },
  alias: {
    //配置别名
    img: fileURLToPath(new URL('./assets/img', import.meta.url)),
    icon: fileURLToPath(new URL('./assets/icon', import.meta.url)),
  },

  routeRules: {
    '/api/**': { cors: true },
  },
  css: ['@unocss/reset/tailwind-compat.css', '@/assets/style/index.scss'],
  modules: [
    '@element-plus/nuxt',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@sidebase/nuxt-session',
    [
      'unplugin-icons/nuxt',
      {
        compiler: 'vue3',
        defaultClass: 'svg-icon',
        customCollections: {
          icon: FileSystemIconLoader('./assets/icon'),
        },
      },
    ],
  ],
  elementPlus: {
    importStyle: 'scss',
  },
  session: {
    api: {
      isEnabled: false,
    },
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
    redis: {
      port: '',
      password: '',
    },
    public: {
      cesium: {
        token: process.env.NUXT_CESIUM_TOKEN,
      },
    },
    disk: {
      path: '',
    },
  },

  experimental: {
    reactivityTransform: true,
  },
  vite: {
    plugins: [
      // ReactivityTransform(),
      Components({
        resolvers: [
          IconsResolver({
            prefix: false, // 自动引入的Icon组件统一前缀，默认为 i，设置false为不需要前缀
            // {prefix}-{collection}-{icon} 使用组件解析器时，您必须遵循名称转换才能正确推断图标。
            enabledCollections: ['icon'],
          }),
        ],
      }),

      glsl(),
    ],
  },
})
