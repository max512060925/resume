import captcha from 'svg-captcha'
export default defineEventHandler(async event => {
  const { text, data } = captcha.create()
  await redisClient.set(event.context.session.id, text, {
    EX: 60 * 5, //5分钟过期
    NX: true,
  })
  event.node.res.setHeader('Content-Type', 'image/svg+xml')
  return data
})
