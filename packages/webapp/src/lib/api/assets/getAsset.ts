import client from '../client'
import { Asset } from './types'

export async function getAsset(keyword: string) {
  const response = await client.get<Asset>(`/api/assets/${keyword}`)
  return response.data
}
