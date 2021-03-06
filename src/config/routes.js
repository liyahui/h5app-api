import * as data from '../controllers/data'
import * as user from '../controllers/user'
import * as resource from '../controllers/resource'
import * as project from '../controllers/project'

export default app => {
  app.get('/data/:id.json', data.index)

  app.post('/user/login', user.login)
  app.post('/user/register', user.register)

  app.get('/projects/show', project.list)

  app.use(user.auth)

  app.get('/user/current', user.current)

  app.get('/projects/user', project.list)
  app.get('/projects/:id', project.item)
  app.post('/projects', project.create)
  app.put('/projects/:id', project.isOwn, project.update)
  app.delete('/projects/:id', project.isOwn, project.remove)

  app.get('/resources/:type', resource.list)
  app.post('/resources/:type', resource.create)
  app.delete('/resources/:type/:id', resource.isOwn, resource.remove)
}
