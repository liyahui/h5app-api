import * as user from '../controllers/user'
import * as image from '../controllers/image'
import * as project from '../controllers/project'

export default app => {
  app.use(user.auth)
  
  app.post('/user/login', user.login)
  app.post('/user/register', user.register)
  app.get('/user/current', user.current)

  app.get('/projects', project.list)
  app.get('/projects/:id', project.item)
  app.post('/projects', project.create)
  app.put('/projects/:id', project.isOwn, project.update)
  app.delete('/projects/:id', project.isOwn, project.remove)

  app.get('/image', image.list)
  app.post('/image', image.create)
  app.delete('/image/:id', image.isOwn, image.remove)
}
