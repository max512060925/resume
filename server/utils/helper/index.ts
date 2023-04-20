import type { H3Event } from 'h3'
export const resJsonBody = (data: any) => ({
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
