import jwt, { SignOptions } from 'jsonwebtoken'

const { JWT_SECRET } = process.env

export async function generateToken(
  payload: string | object | Buffer,
  options: SignOptions = {}
) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET Environment Variable is not set')
  }
  const promise = new Promise<string>((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, options, (error, token) => {
      if (error) {
        reject(error)
        return
      }
      if (!token) {
        reject(new Error('Failed to generate token'))
        return
      }
      resolve(token)
    })
  })
  return promise
}

export async function decodeToken<T>(token: string) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET Environment Variable is not set')
  }

  const promise = new Promise<T>((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (error, decoded) => {
      if (error) {
        reject(error)
        return
      }
      if (!decoded) {
        reject(new Error('Token is empty'))
        return
      }
      resolve(decoded as any)
    })
  })

  return promise
}
