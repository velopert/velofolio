import client from './client'

export async function getSectorWeightings(ticker: string) {
  const response = await client.get<SectorWeighting[]>(
    `/api/v3/etf-sector-weightings/${ticker}`
  )
  return response.data
}

export interface SectorWeighting {
  sector: string
  weightPercentage: string
}
