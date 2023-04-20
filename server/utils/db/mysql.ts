import { Sequelize } from 'sequelize'
const { mysql } = useRuntimeConfig()
export const sequelize = new Sequelize(
  mysql.database,
  mysql.username,
  mysql.password,
  {
    host: mysql.host,
    dialect: 'mysql',
  }
)
