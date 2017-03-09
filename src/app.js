import path from 'path'
import express from 'express'
import routes from './config/routes'
import bodyParser from 'body-parser'

const app = express()

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
})

app.use(bodyParser.json({limit: '1mb'}))

routes(app)

app.listen(8888)
