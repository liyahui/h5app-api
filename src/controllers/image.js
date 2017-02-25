import path from 'path'
import models from '../models'
import multer from 'multer'
import pify from 'pify'
import { SUCCESS_CODE, ERROR_CODE } from '../utils'
import { MAX_FIZE_SIZE, IMAGE_MIME_TYPE, UPLOAD_MESSAGE, imageInfo, qiniu } from '../utils/image'

const upload = pify(multer({
  limits: {
    fileSize: MAX_FIZE_SIZE
  },
  fileFilter(req, file, cb) {
    const allow = IMAGE_MIME_TYPE.test(file.mimetype)
    cb(null, allow)
  }
}).single('file'))

export const create = (req, res) => {
  upload(req, res).then(() => {
    return qiniu.upload(req.file.buffer)
  }).then(result => {
    return imageInfo(result)
  }).then(result => {
    return models.Image.create({
      key: result.key,
      width: result.info.width,
      height: result.info.height
    })
  }).then(image => {
    res.json({
      code: SUCCESS_CODE,
      message: '上传成功',
      image
    })
  }).catch(error => {
    res.json({
      code: ERROR_CODE,
      message: '上传失败'
    })
  })
}

export const select = async (req, res) => {
  const offset = Number(req.query.offset || 0)
  const limit = Number(req.query.limit || 10)

  const total = await models.Image.count()
  const list = await models.Image.findAll({
    order: [['id', 'DESC']],
    offset,
    limit
  })

  res.json({
    code: SUCCESS_CODE,
    message: '获取成功',
    list,
    total
  })
}