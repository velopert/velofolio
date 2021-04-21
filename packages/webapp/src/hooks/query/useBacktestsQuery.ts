import produce from 'immer'
import { useMemo } from 'react'
import {
  InfiniteData,
  QueryOptions,
  useInfiniteQuery,
  useQueryClient,
} from 'react-query'
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

export function useBacktestQueryUpdater() {
  const queryClient = useQueryClient()
  return useMemo(
    () => ({
      remove(backtestId: number, userId?: number) {
        queryClient.setQueryData<InfiniteData<Backtest[]> | undefined>(
          createKey(userId),
          (prevData) =>
            produce(prevData, (draft) => {
              const page = draft?.pages.find((page) =>
                page.find((backtest) => backtest.id === backtestId)
              )
              if (!page) return
              const index = page.findIndex(
                (backtest) => backtest.id === backtestId
              )
              page.splice(index)
            })
        )
      },
    }),
    [queryClient]
  )
}

const createKey = (userId?: number) => ['backtests', userId ?? 'public']
