import {
  defineConfig,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import extractorPug from '@unocss/extractor-pug'

export default defineConfig({
  rules: [[/^bg-image-(.*)$/, ([, s]) => ({ 'background-image': `${s}` })]],
  extractors: [extractorPug()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
