import http from 'http'
import qn from 'qn'
import config from '../config/qiniu'

export const TYPE_IMAGE = 1
export const TYPE_MUSIC = 2

export const resourceMap = {
	image: {
		type: TYPE_IMAGE,
		mime: /(png|gif|jpe?g)$/,
		size: 512 * 1024
	},
	music: {
		type: TYPE_MUSIC,
		mime: /mp3$/,
		size: 1024 * 1024
	}
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