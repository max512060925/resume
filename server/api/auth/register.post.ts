import Joi from 'joi'
import UserModel from '~/server/models/user'
export default defineEventHandler(async event => {
  try {
    const req: {
      username?: string
      password?: string
    } = (await readBody(event)) || {}

    const schema = Joi.object({
      username: Joi.string().required().error(new Error('用户名格式错误')),
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{6,20}$'))
        .required()
        .error(new Error('密码格式错误')),
    })
    await schema.validateAsync(req)
    const find = await UserModel.findOne({ where: { username: req?.username } })
    if (find) {
      return new Error('用户已存在')
    }
    const { password, ...data } = await UserModel.create({ ...req, role: 1 })
    return {
      code: 0,
      data,
    }
  } catch (error) {
    setResponseStatus(event, 500)
    return {
      code: 500,
      msg: String(error),
    }
  }
})
