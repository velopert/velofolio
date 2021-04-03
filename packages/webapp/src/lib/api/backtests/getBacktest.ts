import client from '../client'
import { Backtest } from './types'

export async function getBacktest(id: number) {
  const response = await client.get<Backtest>(`/api/backtests/${id}`)
  return response.data
}
