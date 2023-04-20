import { DataTypes, Model, Optional } from 'sequelize'
import { createHash } from 'node:crypto'

interface UserAttributes {
  id: number
  openid?: string
  nickName?: string
  avatarUrl?: string
  username: string
  password: string
  email?: string
  role: number
  unionid?: string
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}
interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {}

const hash = createHash('sha256')
const UserModel = sequelize.define<UserInstance>('user', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  // 属性
  openid: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  nickName: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  avatarUrl: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: '请输入密码',
      },
    },
    set(password: string) {
      hash.update(password)
      this.setDataValue('password', hash.digest('hex'))
    },
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: '请输入用户名',
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true,
    },
  },
  // 1: 普通用户 0: 管理员
  role: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  // // 0: 没有vip 11：普通月VIP 12：普通年VIP
  // vip: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   defaultValue: 0,
  // },
  unionid: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
})

;(async () => {
  await UserModel.sync() //表不存在，则创建该表
  UserModel.findOrCreate({
    where: { role: 0 },
    defaults: {
      username: 'admin',
      password: '123456',
      role: 0,
    },
  })
})()

export default UserModel
