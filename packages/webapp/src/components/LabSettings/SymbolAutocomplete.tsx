import { css } from '@emotion/react'
import { useEffect, useState } from 'react'
import useSearchTickersQuery from '../../hooks/query/useSearchTickersQuery'
import { SearchTickerResult } from '../../lib/api/assets/searchTickers'
import TickerListItem from './TickerListItem'

export type SymbolAutocompleteProps = {
  keyword: string
  visible: boolean
}

function SymbolAutocomplete({ visible, keyword }: SymbolAutocompleteProps) {
  const [prevData, setPrevData] = useState<SearchTickerResult[] | null>(null)
  const { data } = useSearchTickersQuery(keyword, {
    enabled: keyword !== '',
  })

  useEffect(() => {
    if (!data) {
      setPrevData(data || null)
    }
  }, [data])

  useEffect(() => {
    if (keyword === '') {
      setPrevData(null)
    }
  }, [keyword])

  const dataToShow = data || prevData

  if (!visible || !dataToShow || dataToShow.length === 0) return null

  return (
    <div css={wrapper}>
      <div css={block}>
        {dataToShow.map((result) => (
          <TickerListItem
            id={result.id}
            image={`https://storage.googleapis.com/iexcloud-hl37opg/api/logos/${result.ticker}.png`}
            name={result.name}
            ticker={result.ticker}
            key={result.id}
          />
        ))}
      </div>
    </div>
  )
}

const wrapper = css`
  position: relative;
`
const block = css`
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
  position: absolute;
  width: 100%;
  max-height: 14.25rem;
  background: white;
  box-shadow: 0rem 0.25rem 0.5rem rgba(0, 0, 0, 0.07);
  border-radius: 0.5rem;
  overflow-y: auto;
`

export default SymbolAutocomplete
