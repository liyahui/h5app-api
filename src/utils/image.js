import http from 'http'
import qn from 'qn'
import config from '../config/qiniu'

export const MAX_FIZE_SIZE = 500 * 1024

export const IMAGE_MIME_TYPE = ['image/jpg', 'image/png', 'image/gif']

export const UPLOAD_MESSAGE = {
  LIMIT_FILE_SIZE: `图片大小不能超过${MAX_FIZE_SIZE / 1024}k`
}

export const imageInfo = image => {
  return new Promise((resolve, reject) => {
    http.get(`${image.url}?imageInfo`, res => {
      let result = ''

      res.on('data', chunk => {
        result += chunk
      })

      res.on('end', () => {
        image.info = JSON.parse(result)
        resolve(image)
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