import { InfiniteData, QueryOptions, useInfiniteQuery } from 'react-query'
import { getBacktests } from '../../lib/api/backtests/getBacktests'
import { Backtest } from '../../lib/api/backtests/types'

export default function useBacktestsQuery(
  userId?: number,
  options: QueryOptions<Backtest[], unknown, InfiniteData<Backtest[]>> = {}
) {
  return useInfiniteQuery(
    createKey(userId),
    ({ pageParam = undefined }) =>
      getBacktests({
        userId,
        cursor: pageParam,
      }),
    {
      getNextPageParam: (lastPage) =>
        lastPage.length === 20 ? lastPage[19].id : undefined,
      ...options,
    }
  )
}

const createKey = (userId?: number) => ['backtests', userId ?? 'public']
