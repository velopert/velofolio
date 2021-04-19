import { useEffect } from 'react'
import {
  useFetchTB3HistoricalPrices,
  usePricesByTickerValue,
  useTB3HistoricalPricesState,
} from '../atoms/historicalPricesState'

/**
 * fetch tb3 when user has registered at least 1 ticker
 */
export default function useTB3HistoricalPricesSync() {
  const pricesByTicker = usePricesByTickerValue()
  const [state] = useTB3HistoricalPricesState()
  const fetchData = useFetchTB3HistoricalPrices()

  useEffect(() => {
    if (state.loading || state.prices || state.error) return
    fetchData()
  }, [pricesByTicker, state, fetchData])
}
