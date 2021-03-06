import fs from 'fs'
import models from '../models'
import { SUCCESS_CODE, ERROR_CODE, DATA_PATH } from '../utils'
import { qiniu } from '../utils/resource'

/**
 * 是否是自己的项目
 */
export const isOwn = async(req, res, next) => {
  const project = await models.Project.findById(req.params.id)

  if (project && project.uid === req.uid) {
    req.project = project
    next()
  } else {
    res.json({
      code: ERROR_CODE,
      message: '非法操作'
    })
  }
}

/**
 * 获取项目列表
 */
export const list = async(req, res) => {
  const offset = Number(req.query.offset || 0)
  const limit = Number(req.query.limit || 10)

  let where = {
    cover: {
      not: null
    },
    title: {
      not: null
    }
  }

  if (req.uid) {
    where = {
      uid: req.uid
    }
  }

  const total = await models.Project.count({ where })
  const list = await models.Project.findAll({
    attributes: ['id', 'uid', 'title', 'cover'],
    where,
    order: [
      ['id', 'DESC']
    ],
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
 * 获取一个项目
 */
export const item = async(req, res) => {
  const project = await models.Project.findById(req.params.id)

  if (project) {
    res.json({
      code: SUCCESS_CODE,
      message: '获取成功',
      project
    })
  } else {
    res.json({
      code: ERROR_CODE,
      message: '项目不存在'
    })
  }
}

/**
 * 创建项目
 */
export const create = async(req, res) => {
  const fileds = {
    uid: req.uid,
    pages: req.body.pages,
    props: req.body.props
  }

  if (req.body.id) {
    const copy = await models.Project.findById(req.body.id)
    fileds.title = copy.title
    fileds.desc = copy.desc
    fileds.icon = copy.icon
    fileds.cover = copy.cover
    fileds.pages = copy.pages
    fileds.props = copy.props
  }

  const project = await models.Project.create(fileds)

  if (project) {
    const file = `${DATA_PATH}/${req.body.id}.json`
    const exists = fs.existsSync(file)

    if (exists) {
      const json = fs.readFileSync(file)
      fs.writeFileSync(`${DATA_PATH}/${project.id}.json`, json)
    }

    res.json({
      code: SUCCESS_CODE,
      message: '创建成功',
      project
    })
  } else {
    res.json({
      code: ERROR_CODE,
      message: '创建失败'
    })
  }
}

/**
 * 更新项目
 */
export const update = async(req, res) => {
  const { title, desc, icon, pages, props } = req.body
  const image = req.body.cover.replace(/^data:image\/\w+;base64,/, '')
  const result = await qiniu.upload(new Buffer(image, 'base64'))
  const cover = result.key

  const success = await models.Project.update({
    title,
    desc,
    icon,
    cover,
    pages,
    props
  }, {
    where: {
      id: req.params.id
    }
  })

  const optimizePages = pages.map(page => {
    page.widgets = page.widgets.map(widget => {
      delete widget.state
      return widget
    })
    return page
  })

  const data = {
    title,
    desc,
    icon,
    pages: optimizePages,
    props
  }

  fs.writeFileSync(`${DATA_PATH}/${req.params.id}.json`, JSON.stringify(data))

  if (success) {
    res.json({
      code: SUCCESS_CODE,
      message: '保存成功',
      cover: result.url
    })
  } else {
    res.json({
      code: ERROR_CODE,
      message: '保存失败'
    })
  }
}

/**
 * 删除项目
 */
export const remove = async(req, res) => {
  const result = await models.Project.destroy({
    where: {
      id: req.params.id
    }
  })

  if (result) {
    const file = `${DATA_PATH}/${req.params.id}.json`
    const exists = fs.existsSync(file)

    if (exists) {
      fs.unlinkSync(file)
    }

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
