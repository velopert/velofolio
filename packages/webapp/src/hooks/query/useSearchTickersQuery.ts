import { useQuery } from 'react-query'
import { searchTickers } from '../../lib/api/assets/searchTickers'
import { QueryOptionsOf } from '../../lib/utils/types'

export default function useSearchTickersQuery(
  keyword: string,
  options: QueryOptionsOf<typeof searchTickers> = {}
) {
  return useQuery(
    useSearchTickersQuery.createKey(keyword),
    () => searchTickers(keyword),
    options
  )
}

useSearchTickersQuery.createKey = (keyword: string) => [
  'search_tickers',
  keyword,
]
