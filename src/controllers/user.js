import models from '../models'
import md5 from 'md5'
import jwt from 'jsonwebtoken'
import { SUCCESS_CODE, ERROR_CODE, JWT_SECRET, PASS_ROUTES } from '../utils'
import { MESSAGE, acessToken } from '../utils/user'

/**
 * 登录验证
 */
export const auth = (req, res, next) => {
  if (req.method === 'OPTIONS') return next()

  const token = req.headers.authorization

  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET)
      req.uid = payload.uid
    } catch (e) {

    }
  }

  req.uid || PASS_ROUTES.includes(req.path) ? next() : res.json({
    code: ERROR_CODE,
    message: '未登录'
  })
}

/**
 * 用户登录
 */
export const login = async(req, res) => {
  const { username, password } = req.body
  const user = await models.User.find({
    where: {
      username: username,
      password: md5(password)
    }
  })

  if (user) {
    res.json({
      code: SUCCESS_CODE,
      message: '登录成功',
      token: acessToken(user.id),
      user
    })
  } else {
    res.json({
      code: ERROR_CODE,
      message: '用户名或者密码错误'
    })
  }
}

/**
 * 用户注册
 */
export const register = async(req, res) => {
  const { username, password } = req.body

  try {
    const user = await models.User.create({
      username,
      password
    })

    res.json({
      code: SUCCESS_CODE,
      message: '注册成功',
      token: acessToken(user.id),
      user
    })
  } catch (e) {
    res.json({
      code: ERROR_CODE,
      message: MESSAGE[e.name],
      field: e.errors[0].path
    })
  }
}

/**
 * 获取当前用户信息
 */
export const current = async(req, res) => {
  const user = await models.User.find({
    where: {
      id: req.uid
    }
  })

  if (user) {
    res.json({
      code: SUCCESS_CODE,
      message: '获取成功',
      user
    })
  } else {
    res.json({
      code: ERROR_CODE,
      message: '获取失败'
    })
  }
}
