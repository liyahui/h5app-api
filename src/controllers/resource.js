import path from 'path'
import models from '../models'
import multer from 'multer'
import pify from 'pify'
import { SUCCESS_CODE, ERROR_CODE } from '../utils'
import { TYPE_IMAGE, TYPE_MUSIC, resourceMap, imageInfo, qiniu } from '../utils/resource'

const uploadImage = pify(multer({
  limits: {
    fileSize: resourceMap.image.size
  },
  fileFilter(req, file, cb) {
    const allow = resourceMap.image.mime.test(file.mimetype)
    if (allow) {
      cb(null, allow)
    } else {
      cb(new Error('只能上传jpg,png,gif文件'))
    }
  }
}).single('file'))

const uploadMusic = pify(multer({
  limits: {
    fileSize: resourceMap.music.size
  },
  fileFilter(req, file, cb) {
    const allow = resourceMap.music.mime.test(file.mimetype)
    if (allow) {
      cb(null, allow)
    } else {
      cb(new Error('只能上传mp3文件'))
    }
  }
}).single('file'))

/**
 * 是否是自己的资源
 */
export const isOwn = async(req, res, next) => {
  const resource = await models.Resource.findById(req.params.id)

  if (resource && resource.uid === req.uid) {
    next()
  } else {
    res.json({
      code: ERROR_CODE,
      message: '非法操作'
    })
  }
}

/**
 * 上传资源
 */
export const create = async(req, res) => {
  const current = resourceMap[req.params.type]

  if (!current) {
    res.json({
      code: ERROR_CODE,
      message: '只能上传图片和音乐文件'
    })
  }

  try {
    if (current.type === TYPE_IMAGE) {
      await uploadImage(req, res)
    }

    if (current.type === TYPE_MUSIC) {
      await uploadMusic(req, res)
    }
  } catch (e) {
    return res.json({
      code: ERROR_CODE,
      message: '上传失败'
    })
  }

  const result = await qiniu.upload(req.file.buffer)

  let props = {}

  if (current.type === TYPE_IMAGE) {
    const info = await imageInfo(result.url)
    props.width = info.width
    props.height = info.height
  }

  const item = await models.Resource.create({
    uid: req.uid,
    type: current.type,
    name: req.file.originalname,
    key: result.key,
    props
  })

  res.json({
    code: SUCCESS_CODE,
    message: '上传成功',
    item
  })
}

/**
 * 资源列表
 */
export const list = async(req, res) => {
  const offset = Number(req.query.offset || 0)
  const limit = Number(req.query.limit || 10)
  const where = {
    uid: req.uid,
    type: resourceMap[req.params.type].type
  }

  const total = await models.Resource.count({ where })
  const list = await models.Resource.findAll({
    order: [
      ['id', 'DESC']
    ],
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
 * 删除资源
 */
export const remove = async(req, res) => {
  const result = await models.Resource.destroy({
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
