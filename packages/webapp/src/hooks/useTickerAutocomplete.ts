import { useEffect, useState } from 'react'
import {
  useAutocompleteIndex,
  useResetAutocompleteIndex,
} from '../atoms/autocompleteIndex'
import { SearchTickerResult } from '../lib/api/assets/searchTickers'
import useSearchTickersQuery from './query/useSearchTickersQuery'

export default function useTickerAutocomplete(keyword: string) {
  const [prevData, setPrevData] = useState<SearchTickerResult[] | null>(null)
  const { data } = useSearchTickersQuery(keyword, {
    enabled: keyword !== '',
  })
  const [selectedIndex, setSelectedIndex] = useAutocompleteIndex()
  const reset = useResetAutocompleteIndex()

  // reset autocomplete index on unmount
  useEffect(() => {
    return reset
  }, [reset])

  useEffect(() => {
    if (data) {
      setPrevData(data)
    }
  }, [data])

  useEffect(() => {
    if (keyword === '') {
      setPrevData(null)
    }
    setSelectedIndex(-1)
  }, [keyword, setSelectedIndex])

  const goUp = () => {
    if (!data || data.length === 0) return // cancel
    if (selectedIndex === -1) {
      // select last
      setSelectedIndex(data.length - 1)
      return
    }
    // select up
    setSelectedIndex(selectedIndex - 1)
  }
  const goDown = () => {
    if (!data || data.length === 0) return
    if (selectedIndex === data.length - 1) {
      // unselect
      setSelectedIndex(-1)
      return
    }
    setSelectedIndex(selectedIndex + 1)
  }

  return {
    results: data || prevData,
    selectedIndex,
    goUp,
    goDown,
    reset,
  }
}
