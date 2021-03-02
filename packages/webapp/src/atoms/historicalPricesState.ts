import { useCallback, useMemo } from 'react'
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil'
import { getHistoricalPrices } from '../lib/api/assets/getHistoricalPrices'
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

export type TB3PricesState = {
  prices: HistoricalPrice[] | null
  loading: boolean
}

export const tb3PricesState = atom<TB3PricesState>({
  key: 'tb3PricesState',
  default: {
    loading: false,
    prices: null,
  },
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

export function usePricesByTickerValue() {
  return useRecoilValue(pricesByTicker)
}

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

export function useTB3HistoricalPricesState() {
  return useRecoilState(tb3PricesState)
}

export function useTB3HistoricalPricesActions() {
  const set = useSetRecoilState(tb3PricesState)
  return useMemo(
    () => ({
      startLoading() {
        set((prev) => ({ ...prev, loading: true }))
      },
      success(prices: HistoricalPrice[]) {
        set((prev) => ({ loading: true, prices: prices }))
      },
      error() {
        set((prev) => ({ ...prev, loading: false }))
      },
    }),
    [set]
  )
}

export function useFetchTB3HistoricalPrices() {
  const { startLoading, success, error } = useTB3HistoricalPricesActions()
  return useCallback(async () => {
    startLoading()
    try {
      const historicalPrices = await getHistoricalPrices('DTB3')
      success(historicalPrices)
    } catch (e) {
      error()
    }
  }, [startLoading, success, error])
}
