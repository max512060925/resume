import sequelize from '../db/mysql'
export default defineNitroPlugin(() => {
  sequelize
    .authenticate()
    .then(() => {
      console.log('数据库连接成功')
    })
    .catch(err => {
      console.log(`连接数据库错误: ${err}`)
    })
})
