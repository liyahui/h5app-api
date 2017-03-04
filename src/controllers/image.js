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

/**
 * 是否是自己的图片
 */
export const isOwn = async(req, res, next) => {
  const image = await models.Image.findById(req.params.id)

  if (image && image.uid === req.uid) {
    next()
  } else {
    res.json({
      code: ERROR_CODE,
      message: '非法操作'
    })
  }
}

/**
 * 上传图片
 */
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
  const item = await models.Image.create({
    uid: req.uid,
    key: result.key,
    width: info.width,
    height: info.height
  })

  res.json({
    code: SUCCESS_CODE,
    message: '上传成功',
    item
  })
}

/**
 * 图片列表
 */
export const list = async (req, res) => {
  const offset = Number(req.query.offset || 0)
  const limit = Number(req.query.limit || 10)
  const where = { uid: req.uid }

  const total = await models.Image.count(where)
  const list = await models.Image.findAll({
    order: [['id', 'DESC']],
    where,
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

/**
 * 删除图片
 */
export const remove = async (req, res) => {
  const result = await models.Image.destroy({
    where: {
      id: req.params.id
    }
  })
  
  if (result) {
    res.json({
      code: SUCCESS_CODE,
      message: '删除成功'
    })
  } else {
    res.json({
      code: ERROR_CODE,
      message: '删除失败'
    })
  }
}