import { waitTime } from '~/utils'
const connect = () => {
  sequelize
    .authenticate()
    .then(() => {
      console.log('数据库连接成功')
    })
    .catch(async err => {
      await waitTime(10 * 1000)
      console.error(`连接数据库错误: ${err},10秒后重连!`)
      connect()
    })
}

export default defineNitroPlugin(connect)
