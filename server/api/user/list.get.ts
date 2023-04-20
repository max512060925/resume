const { mysql } = useRuntimeConfig()
export default defineEventHandler(async event => {
  const res = await UserModel.findAll()
  console.log(res)
  return {
    code: 0,
    mysql,
  }
})
