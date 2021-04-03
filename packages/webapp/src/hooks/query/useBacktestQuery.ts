import { useQuery, UseQueryOptions } from 'react-query'
import { getBacktest } from '../../lib/api/backtests/getBacktest'
import { Backtest } from '../../lib/api/backtests/types'

export default function useBacktestQuery(
  id: number,
  options: UseQueryOptions<Backtest, unknown, Backtest> = {}
) {
  return useQuery(createKey(id), () => getBacktest(id), { ...options })
}

const createKey = (id: number) => ['backtest', id]
useBacktestQuery.createKey = createKey
