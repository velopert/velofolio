import client from '../client'

export async function checkGoogleRegistered(accessToken: string) {
  const response = await client.post<CheckGoogleRegisteredResult>(
    '/api/auth/google/check',
    {
      access_token: accessToken,
    }
  )
  return response.data.exists
}

type CheckGoogleRegisteredResult = {
  exists: boolean
}
