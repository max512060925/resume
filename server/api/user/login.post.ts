import UserModel from '~/server/models/user'
export default defineEventHandler(async event => {
  const res = await UserModel.findOne(await readBody(event))
  console.log(res)
  return {
    code: 0,
  }
})
