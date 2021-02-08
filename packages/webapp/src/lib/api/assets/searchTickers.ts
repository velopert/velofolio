import client from '../client'

export async function searchTickers(keyword: string) {
  const response = await client.get<SearchTickerResult[]>('/api/assets', {
    params: {
      keyword,
    },
  })

  return response.data
}

export type SearchTickerResult = {
  id: number
  ticker: string
  name: string
  image: string
}
