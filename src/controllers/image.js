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
    if (allow) {
      cb(null, allow)
    } else {
      const error = new Error('不允许的图片类型')
      error.code = 'LIMIT_FILE_MIMETYPE'
      cb(error)
    }
  }
}).single('file'))

export const create = async (req, res) => {
  try {
    await upload(req, res)
  } catch(e) {
    return res.json({
      code: ERROR_CODE,
      message: UPLOAD_MESSAGE[e.code]
    })
  }

  const result = await qiniu.upload(req.file.buffer)
  const info = await imageInfo(result.url)
  const image = await models.Image.create({
    key: result.key,
    width: info.width,
    height: info.height
  })

  res.json({
    code: SUCCESS_CODE,
    message: '上传成功',
    image
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