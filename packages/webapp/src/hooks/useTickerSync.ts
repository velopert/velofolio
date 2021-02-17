import { useEffect, useMemo } from 'react'
import {
  useFetchHistoricalPrices,
  useFirstHistoricalDate,
  useHistoricalPricesState,
} from '../atoms/historicalPricesState'
import { useUniqueTickers } from '../atoms/labSettingState'
import { useLabSettingView } from '../atoms/labSettingViewState'

export default function useTickerSync() {
  const uniqueTickers = useUniqueTickers()
  const [{ pricesByTicker, loading }] = useHistoricalPricesState()
  const { mode } = useLabSettingView()
  const firstHistoricalDate = useFirstHistoricalDate()

  const unfetchedTickers = useMemo(
    () => uniqueTickers.filter((ticker) => !pricesByTicker[ticker]),
    [uniqueTickers, pricesByTicker]
  )

  const fetchData = useFetchHistoricalPrices()

  useEffect(() => {
    if (loading) return
    if (unfetchedTickers.length === 0) return
    if (mode !== 'default') return
    fetchData(unfetchedTickers)
  }, [unfetchedTickers, loading, fetchData, mode])

  useEffect(() => {
    // create report
    console.log(firstHistoricalDate)
  }, [pricesByTicker, firstHistoricalDate])
}
