import client from '../client'
import { User } from '../types'

export async function googleSignup(accessToken: string, username: string) {
  const response = await client.post<GoogleSignupResult>(
    '/api/auth/google/signup',
    {
      access_token: accessToken,
      username,
    }
  )
  return response.data
}

type GoogleSignupResult = {
  user: User
  access_token: string
}
