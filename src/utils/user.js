import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../utils'

export const MESSAGE = {
  SequelizeUniqueConstraintError: '用户名已经存在'
}

export const acessToken = uid => {
  return jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    uid
  }, JWT_SECRET)
}