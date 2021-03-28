import client from '../client'
import { Backtest } from './types'

export async function getBacktests(
  params: GetBacktestsParams = { userId: undefined, cursor: undefined }
) {
  const { userId, cursor } = params
  const response = await client.get<Backtest[]>('/api/backtests', {
    params: {
      user_id: userId,
      cursor,
    },
  })
  return response.data
}

export type GetBacktestsParams = {
  userId?: number
  cursor?: number
}
