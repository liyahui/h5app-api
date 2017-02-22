import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const server = app.listen(8888, (...args) => {
  let { address, port } = server.address()
  console.log('http://%s:%s', address, port)
})
