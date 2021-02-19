import { useMemo } from 'react'
import { useHistoricalPricesState } from '../atoms/historicalPricesState'
import { useUniqueTickers } from '../atoms/labSettingState'

export default function useUnfetchedTickers() {
  const uniqueTickers = useUniqueTickers()
  const [{ pricesByTicker }] = useHistoricalPricesState()

  const unfetchedTickers = useMemo(
    () => uniqueTickers.filter((ticker) => !pricesByTicker[ticker]),
    [uniqueTickers, pricesByTicker]
  )

  return unfetchedTickers
}
