import { useQuery } from 'react-query'
import { searchTickers } from '../../lib/api/assets/searchTickers'
import { QueryOptionsOf } from '../../lib/utils/types'

export default function useSearchTickersQuery(
  keyword: string,
  options: QueryOptionsOf<typeof searchTickers> = {}
) {
  return useQuery(createKey(keyword), () => searchTickers(keyword), options)
}

const createKey = (keyword: string) => ['search_tickers', keyword]
useSearchTickersQuery.createKey = createKey
