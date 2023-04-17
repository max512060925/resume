import { Sequelize } from 'sequelize'
const { mysql } = useRuntimeConfig()
const sequelize = new Sequelize(
  mysql.database,
  mysql.username,
  mysql.password,
  {
    host: mysql.host,
    dialect: 'mysql',
  }
)

export default sequelize
