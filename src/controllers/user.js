import models from '../models'

export const index = (req, res) => {
	models.User.findOne().then(result => {
		res.send(JSON.stringify(result.dataValues))
	})
}