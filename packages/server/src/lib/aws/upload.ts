import fs from 'fs'
import AWS from 'aws-sdk'
import mimeTypes from 'mime-types'

const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: 'us-east-1' })

const { BUCKET_NAME } = process.env

export default function upload(fileDir: string, targetDir: string) {
  if (!BUCKET_NAME) {
    throw new Error('BUCKET_NAME Environment Variable not set')
  }

  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(fileDir)
    fileStream.on('error', (error) => {
      reject(error)
    })
    s3.upload(
      {
        Bucket: BUCKET_NAME,
        Key: targetDir,
        ContentType: mimeTypes.lookup(fileDir) || undefined,
        Body: fileStream,
      },
      (error, data) => {
        if (error) {
          reject(error)
          return
        }
        resolve(data)
      }
    )
  })

  // s3.upload({
  //   Body:
  // })
}

type UploadParams = {}
