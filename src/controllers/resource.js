import models from '../models'
import qn from 'qn'
import path from 'path'

export const put = (req, res) => {
	const client = qn.create({
		accessKey: 'qlHoxhBgA-vqwA0oI9aTOOyr8aFA-Wgw3-vMJ03G',
		secretKey: 'x0VZUAYbY-BPfwOrxy5A8tAWFEH4cXAPO8uN3RSL',
		bucket: 'h5app',
		origin: 'http://olqeerf0y.bkt.clouddn.com'
	})

	const logo = path.join(__dirname, '../../public/logo.png')

	client.uploadFile(logo, (err, result) => {
		console.log(result)
	})
	res.send('123')
}