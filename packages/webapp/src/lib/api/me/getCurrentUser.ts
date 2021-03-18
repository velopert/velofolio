import client from '../client'
import { User } from '../types'

export async function getCurrentUser() {
  const response = await client.get<User>('/api/me')
  return response.data
}
