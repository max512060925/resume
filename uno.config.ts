// uno.config.ts
import {
  defineConfig,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import extractorPug from '@unocss/extractor-pug'
import presetWind from '@unocss/preset-wind'

export default defineConfig({
  presets: [presetUno(), presetWind()],
  theme: {
    colors: {
      // ...
    },
  },
  rules: [[/^bg-image-(.*)$/, ([, s]) => ({ 'background-image': `${s}` })]],
  extractors: [extractorPug()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
