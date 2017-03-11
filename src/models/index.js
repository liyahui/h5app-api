import fs from 'fs'
import path from 'path'
import config from '../config/db'
import Sequelize from 'sequelize'

const options = config[process.env.NODE_ENV || 'production']

options.define = {
  underscored: true,
  underscoredAll: true,
  timestamps: true,
  paranoid: true
}

options.logging = () => {}

const sequelize = new Sequelize(options)

const db = {}

fs.readdirSync(__dirname).filter(file => {
  return !file.startsWith('.') && !file.startsWith('index')
}).forEach(file => {
  let model = sequelize.import(path.join(__dirname, file))
  db[model.name] = model
})

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
