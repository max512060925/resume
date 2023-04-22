import UserModel from '~/server/models/user'
import jwt from 'jsonwebtoken'
import { setCookie } from 'h3'
const { auth } = useRuntimeConfig()

export default defineEventHandler(async event => {
  try {
    const { code, ...parmas } = await readBody(event)
    const redisCode = await redisClient.get(event.context.session.id)
    if (!redisCode) {
      return failJsonBody(500, '验证码过期')
    }
    if (code.toLowerCase() !== redisCode.toLowerCase()) {
      return failJsonBody(500, '验证码错误')
    }
    redisClient.del(event.context.session.id)
    const res = await UserModel.findOne(parmas)
    if (res) {
      const { password, ...data } = res
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) * 60 * 60,
          data: data.id,
        },
        auth.secret
      )
      setCookie(event, 'token', token)
      return resJsonBody(data)
    } else {
      return failJsonBody(500, '用户名或密码错误')
    }
  } catch (e) {
    return failJsonBody(500, String(e), event)
  }
})
