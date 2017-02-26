import http from 'http'
import qn from 'qn'
import config from '../config/qiniu'

export const MAX_FIZE_SIZE = 500 * 1024

export const IMAGE_MIME_TYPE = /(png|gif|jpe?g)$/

export const UPLOAD_MESSAGE = {
  LIMIT_FILE_SIZE: `图片大小不能超过${MAX_FIZE_SIZE / 1024}k`,
  LIMIT_FILE_MIMETYPE: `只能上传图片文件`
}

export const imageInfo = url => {
  return new Promise((resolve, reject) => {
    http.get(`${url}?imageInfo`, res => {
      let result = ''

      res.on('data', chunk => {
        result += chunk
      })

      res.on('end', () => {
        resolve(JSON.parse(result))
      })
    }).on('error', e => {
      reject(e)
    })
  })
}

const client = qn.create(config)

const upload = buffer => {
  return new Promise((resolve, reject) => {
    client.upload(buffer, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}

export const qiniu = {
  client,
  upload
}