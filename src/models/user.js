import md5 from 'md5'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../utils'

export default (sequelize, DataTypes) => {
  return sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(32),
      allowNull: false,
      set(val) {
        this.setDataValue('password', md5(val))
      },
      get() {
        return null
      }
    }
  })
}