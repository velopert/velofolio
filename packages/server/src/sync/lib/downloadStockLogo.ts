import https from 'https'
import fs from 'fs'
import axios from 'axios'
import crypto from 'crypto'
import stream from 'stream'

const DEFAULT_IMAGE_HASH = '64b13a165031c95f2de9aacb3b90057a'

function createHashFromStream(readStream: fs.ReadStream) {
  return new Promise((resolve) => {
    const md5 = crypto.createHash('md5')
    readStream.on('data', (buffer) => {
      md5.update(buffer)
    })
    readStream.on('end', () => {
      resolve(md5.digest('hex'))
    })
  })
}

export function downloadStockLogo(symbol: string, dir: string) {
  return new Promise(async (resolve, reject) => {
    setTimeout(reject, 8000)
    try {
      const response = await axios.get(
        `https://storage.googleapis.com/iexcloud-hl37opg/api/logos/${symbol}.png`,
        {
          responseType: 'stream',
        }
      )

      const hashStream = response.data.pipe(new stream.PassThrough())
      const fileStream = response.data.pipe(new stream.PassThrough())

      const hash = await createHashFromStream(hashStream)
      if (hash === DEFAULT_IMAGE_HASH) {
        const error = new Error('Logo image does not exist')
        error.name = 'LogoImageNotFoundError'
        reject(error)
        return
      }

      const file = fs.createWriteStream(dir)
      fileStream.pipe(file)
      file.on('error', (error) => {
        reject(error)
      })
      file.on('close', () => {
        resolve(true)
      })
    } catch (e) {
      reject(e)
    }
  })
}
