import type { H3Event } from 'h3'
import { createHash } from 'node:crypto'

export const resJsonBody = (data?: any) => ({
  code: 0,
  data,
  msg: '成功',
})

export const failJsonBody = (code: number, msg: string, event?: H3Event) => {
  if (event) {
    setResponseStatus(event, code)
  }
  return {
    code,
    msg,
  }
}

export const passwordEncode = password =>
  createHash('sha256').update(password).digest('hex')
