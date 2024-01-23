import { defineConfig, transformerDirectives, transformerVariantGroup } from 'unocss'
import extractorPug from '@unocss/extractor-pug'

export default defineConfig({
  rules: [[/^bg-image-(.*)$/, ([, s]) => ({ 'background-image': `${s.replace(/^\[|\]$/g, '').replace(/_/g, ' ')}` })]],
  extractors: [extractorPug()],
  transformers: [transformerDirectives(), transformerVariantGroup()]
})
