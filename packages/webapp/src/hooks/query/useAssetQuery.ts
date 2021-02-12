import { useCallback } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { getAsset } from '../../lib/api/assets/getAsset'
import { Asset } from '../../lib/api/assets/types'
import { QueryOptionsOf } from '../../lib/utils/types'

export default function useAssetQuery(
  ticker: string,
  options: QueryOptionsOf<typeof getAsset>
) {
  return useQuery(createKey(ticker), () => getAsset(ticker), options)
}

const createKey = (ticker: string) => ['asset', ticker]

export function useAssetQuerySetter() {
  const queryClient = useQueryClient()
  const set = useCallback(
    (ticker: string, asset: Asset) => {
      queryClient.setQueryData(createKey(ticker), asset)
    },
    [queryClient]
  )
  return set
}
useAssetQuery.createKey = createKey
