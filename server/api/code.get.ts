import captcha from 'svg-captcha'
export default defineEventHandler(event => {
  const { text, data } = captcha.create()
  const sessionId = event.context.session.id
  redisClient.set(sessionId, text, {
    EX: 60 * 5, //5分钟过期
  })
  event.node.res.setHeader('Content-Type', 'image/svg+xml')
  return data
})
