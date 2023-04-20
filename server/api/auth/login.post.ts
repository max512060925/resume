import UserModel from '~/server/models/user'
import jwt from 'jsonwebtoken'
import { setCookie } from 'h3'
const { auth } = useRuntimeConfig()

export default defineEventHandler(async event => {
  try {
    const res = await UserModel.findOne(await readBody(event))
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
