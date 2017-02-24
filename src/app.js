import express from 'express'
import routes from './config/routes'
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser.json())

routes(app)

app.listen(8888)

