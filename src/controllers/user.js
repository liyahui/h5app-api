import models from '../models'
import jwt from 'jsonwebtoken'
import md5 from 'md5'

export const index = (req, res) => {
  models.sequelize.sync({
    // force: true
  }).then(() => {
    return models.User.findOne()
  }).then(result => {
    res.json(result)
  })
}

export const login = (req, res) => {

  models.User.find({
    where: {
      username: req.query.username,
      password: md5(req.query.password)
    }
  }).then(result => {
    const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      userID: result.id
    }, 'test')

    jwt.verify(token, 'test', (err, decoded) => {
      res.send(decoded)
    })
  })
}