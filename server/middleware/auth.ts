import { getCookie } from 'h3'
import jwt from 'jsonwebtoken'
const { auth } = useRuntimeConfig()
export default defineEventHandler(async event => {
  const token = getCookie(event, 'token')
  if (token) {
    try {
      const { exp, uid } = await jwt.verify(token, auth.secret)
      if (Date.now() > exp) {
        throw new Error('已过期')
      }
      event.context.uid = uid
    } catch (e) {
      event.context.uid = null
    }
  }
})
