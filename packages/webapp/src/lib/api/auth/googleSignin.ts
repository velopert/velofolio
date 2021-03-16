import client from '../client'
import { User } from '../types'

export async function googleSignin(accessToken: string) {
  const response = await client.post<GoogleSigninResult>(
    '/api/auth/google/signin',
    {
      access_token: accessToken,
    }
  )
  return response.data
}

type GoogleSigninResult = {
  user: User
  access_token: string
}
