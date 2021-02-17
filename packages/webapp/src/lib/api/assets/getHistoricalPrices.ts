import client from '../client'
import { HistoricalPrice, RawHistoricalPrice } from './types'

const convert = ([
  date,
  high,
  low,
  open,
  close,
  adjustedClose,
]: RawHistoricalPrice): HistoricalPrice => ({
  date,
  high,
  low,
  open,
  close,
  adjustedClose,
})
export async function getHistoricalPrices(ticker: string) {
  const response = await client.get<RawHistoricalPrice[]>(
    `/api/assets/${ticker}/historical-prices`
  )

  return response.data.map(convert)
}
