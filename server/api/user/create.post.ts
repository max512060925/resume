import UserModel from '~/server/models/user'
export default defineEventHandler(async event => {
  try {
    const req: {
      username: string
      password: string
    } = await readBody(event)
    const res = await UserModel.findOne({ where: { username: req.username } })
    console.log(res)
  } catch (error) {
    return {
      code: 500,
      msg: error,
    }
  }
})
