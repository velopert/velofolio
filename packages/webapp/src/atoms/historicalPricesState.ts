import { useCallback } from 'react'
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil'
import getMultiHistoricalPrices from '../lib/api/assets/getMultiHistoricalPrices'
import { HistoricalPrice } from '../lib/api/assets/types'

type PricesByTicker = Record<string, HistoricalPrice[]>

export type HistoricalPricesState = {
  loading: boolean
  pricesByTicker: PricesByTicker
}

const initialState: HistoricalPricesState = {
  loading: false,
  pricesByTicker: {},
}

export const historicalPricesState = atom({
  key: 'historicalPricesState',
  default: initialState,
})

export const pricesByTicker = selector({
  key: 'pricesByTicker',
  get: ({ get }) => get(historicalPricesState).pricesByTicker,
})

export const firstHistoricalDate = selector({
  key: 'firstHistoricalDate',
  get: ({ get }) => {
    const info = Object.entries(get(pricesByTicker))
      .map(([ticker, prices]) => {
        return {
          ticker,
          date: new Date(prices[0].date).getTime(),
        }
      })
      .sort((a, b) => b.date - a.date)[0]

    if (!info) return null
    return {
      ticker: info.ticker,
      date: new Date(info.date),
    }
  },
})

export function useHistoricalPricesState() {
  return useRecoilState(historicalPricesState)
}

export function useHistoricalPriceActions() {
  const set = useSetRecoilState(historicalPricesState)

  const startLoading = useCallback(() => {
    set((prev) => ({ ...prev, loading: true }))
  }, [set])

  const endLoading = useCallback(() => {
    set((prev) => ({ ...prev, loading: false }))
  }, [set])

  const mergePricesByTicker = useCallback(
    (pricesByTicker: PricesByTicker) => {
      set((prev) => ({
        ...prev,
        pricesByTicker: {
          ...prev.pricesByTicker,
          ...pricesByTicker,
        },
      }))
    },
    [set]
  )

  return {
    startLoading,
    endLoading,
    mergePricesByTicker,
  }
}

export function useFetchHistoricalPrices() {
  const {
    startLoading,
    endLoading,
    mergePricesByTicker,
  } = useHistoricalPriceActions()
  const fetch = useCallback(
    async (tickers: string[]) => {
      startLoading()
      const multiHistoricalPrices = await getMultiHistoricalPrices(tickers)
      const pricesByTicker = multiHistoricalPrices.reduce((acc, current, i) => {
        const key = tickers[i]
        acc[key] = current
        return acc
      }, {} as PricesByTicker)
      mergePricesByTicker(pricesByTicker)

      endLoading()
    },
    [startLoading, endLoading, mergePricesByTicker]
  )

  return fetch
}

export function useFirstHistoricalDate() {
  return useRecoilValue(firstHistoricalDate)
}
