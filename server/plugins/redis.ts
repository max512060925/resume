import { waitTime } from '~/utils'
const connect = () =>
  redisClient
    .connect()
    .then(() => {
      console.log('redis连接成功')
    })
    .catch(async err => {
      await waitTime(10 * 1000)
      console.log(`连接redis错误: ${err},10秒后重连!`)
      connect()
    })

export default defineNitroPlugin(connect)
