import express from 'express'
import routes from './config/routes'

const app = express()

routes(app)

app.listen(8888)

