// uno.config.ts
import {
  defineConfig,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import extractorPug from '@unocss/extractor-pug'

export default defineConfig({
  theme: {
    colors: {
      // ...
    },
  },
  extractors: [extractorPug()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
