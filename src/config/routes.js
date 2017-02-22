import * as user from '../controllers/user'

export default app => {
	app.get('/user', user.index)
}