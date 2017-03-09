import fs from 'fs'
import { SUCCESS_CODE, ERROR_CODE, DATA_PATH } from '../utils'

export const index = (req, res) => {
	const file = `${DATA_PATH}/${req.params.id}.json`
	const exists = fs.existsSync(file)
	
	if (exists) {
		const data = fs.readFileSync(file)
		res.json(JSON.parse(data.toString()))
	} else {
		res.json({
      code: ERROR_CODE,
      message: '项目未创建或保存'
    })
	}
}