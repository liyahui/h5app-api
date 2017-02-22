import models from '../models'

export const index = async (req, res) => {
	let result = await models.User.findOne()
	res.json(result.dataValues)
}