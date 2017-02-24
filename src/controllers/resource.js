import path from 'path'
import models from '../models'
import multer from 'multer'
import qn from 'qn'
import config from '../config/qiniu'
import pify from 'pify'

const upload = pify(multer().single('file'))
const client = qn.create(config)

export const put = (req, res) => {
  upload(req, res).then(() => {
    client.upload(req.file.buffer, (err, result) => {
      res.json(result)
    })
  })
}
