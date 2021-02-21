import { useMemo } from 'react'
import { useHistoricalPricesState } from '../atoms/historicalPricesState'
import { useUniqueTickersValue } from '../atoms/labSettingState'

export default function useFirstHistoricalDate() {
  const [{ pricesByTicker }] = useHistoricalPricesState()
  const uniqueTickers = useUniqueTickersValue()

  return useMemo(() => {
    if (uniqueTickers.length === 0) return null
    const info =
      Object.entries(pricesByTicker)
        .filter(([ticker]) => uniqueTickers.includes(ticker))
        .map(([ticker, prices]) => ({
          ticker,
          date: new Date(prices[0].date).getTime(),
        }))
        .sort((a, b) => b.date - a.date)[0] ?? null

    if (!info) return null
    return {
      ticker: info.ticker,
      date: new Date(info.date),
    }
  }, [pricesByTicker, uniqueTickers])
}
