import { useEffect, useMemo } from 'react'
import {
  useFetchHistoricalPrices,
  useHistoricalPricesState,
} from '../atoms/historicalPricesState'
import useUnfetchedTickers from './useUnfetchedTickers'

export default function useTickerSync() {
  const unfetchedTickers = useUnfetchedTickers()

  const [{ loading }] = useHistoricalPricesState()

  const fetchData = useFetchHistoricalPrices()

  useEffect(() => {
    if (loading) return
    if (unfetchedTickers.length === 0) return
    fetchData(unfetchedTickers)
  }, [unfetchedTickers, loading, fetchData])
}
