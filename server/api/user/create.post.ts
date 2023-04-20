export default defineEventHandler(async event => {
  try {
    const req: {
      username: string
      password: string
    } = await readBody(event)
    const res = await UserModel.findOne({ where: { username: req.username } })
    console.log(res)
  } catch (error) {
    setResponseStatus(event, 500)
    return {
      code: 500,
      msg: error,
    }
  }
})
