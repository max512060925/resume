import captcha from 'svg-captcha'
import { setCookie } from 'h3'
import { createHash } from 'node:crypto'
const md5 = createHash('md5')
export default defineEventHandler(async event => {
  const { text, data } = captcha.create()
  const abc = await useStorage().getItem('redis:code')
  console.log(abc)
  setCookie(event, 'code', text)

  return data
})
