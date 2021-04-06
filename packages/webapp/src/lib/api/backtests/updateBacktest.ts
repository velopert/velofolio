import client from '../client'
import { Backtest, BacktestPayload } from './types'

export async function updateBacktest({
  id,
  ...backtest
}: BacktestPayload & { id: number }) {
  const response = await client.put<Backtest>(`/api/backtests/${id}`, backtest)
  return response.data
}
