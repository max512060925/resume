import UserModel from '~/server/models/user'
import jwt from 'jsonwebtoken'
import { setCookie } from 'h3'
const { auth } = useRuntimeConfig()

export default defineEventHandler(async event => {
  try {
    const { code, password, ...parmas } = await readBody(event)
    const sessionId = event.context.session.id
    const redisCode = await redisClient.get(sessionId)
    if (!redisCode) {
      return failJsonBody(500, '验证码过期')
    }
    if (code.toLowerCase() !== redisCode.toLowerCase()) {
      return failJsonBody(500, '验证码错误')
    }
    redisClient.del(sessionId)
    const res = await UserModel.findOne({
      where: { ...parmas, password: passwordEncode(password) },
    })

    if (res) {
      const token = jwt.sign(
        {
          exp: Date.now() + 1000 * 60 * 60,
          uid: res.id,
        },
        auth.secret
      )
      setCookie(event, 'token', token)
      return resJsonBody({ ...res, token })
    } else {
      return failJsonBody(500, '用户名或密码错误')
    }
  } catch (e) {
    return failJsonBody(500, String(e), event)
  }
})
