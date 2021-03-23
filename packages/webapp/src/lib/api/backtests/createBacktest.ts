import client from '../client'
import { Backtest, BacktestPayload } from './types'

export async function createBacktest(backtest: BacktestPayload) {
  const response = await client.post<Backtest>('/api/backtests', backtest)
  return response.data
}
