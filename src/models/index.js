import fs from 'fs'
import path from 'path'
import config from '../config/mysql'
import Sequelize from 'sequelize'

const sequelize = new Sequelize(config)
const db = {}

fs.readdirSync(__dirname).filter(file => {
	return !file.startsWith('.') && !file.startsWith('index')
}).forEach(file => {
	let model = sequelize.import(path.join(__dirname, file))
	db[model.name] = model
})

sequelize.sync()

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db