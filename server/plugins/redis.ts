export default defineNitroPlugin(() => {
  redisClient
    .connect()
    .then(() => {
      console.log('redis连接成功')
    })
    .catch(err => {
      console.log(`连接redis错误: ${err}`)
    })
})
