import * as user from '../controllers/user'
import * as image from '../controllers/image'

export default app => {
  app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })

  app.get('/user', user.index)
  app.get('/user/login', user.login)

  app.get('/image', image.select)
  app.post('/image', image.create)
  app.delete('/image/:id', image.remove)
}
