export default defineEventHandler(async event => {
  if (event.context.uid) {
    return resJsonBody([])
  }
  //
  return failJsonBody(403, '账号未登录！')
})
