import { css } from '@emotion/react'
import { useRef } from 'react'
import useOnClickOutside from 'use-onclickoutside'
import { SearchTickerResult } from '../../lib/api/assets/searchTickers'
import TickerListItem from './TickerListItem'

export type SymbolAutocompleteProps = {
  results: SearchTickerResult[] | null
  visible: boolean
  onClose: Parameters<typeof useOnClickOutside>[1]
  selectedIndex: number
  onSelect: (params: {
    id: number
    image: string | null
    ticker: string
  }) => void
}

function SymbolAutocomplete({
  visible,
  onClose,
  results,
  selectedIndex,
  onSelect,
}: SymbolAutocompleteProps) {
  const ref = useRef<HTMLDivElement>(null)

  useOnClickOutside(ref, onClose)

  if (!visible || !results || results.length === 0) return null

  return (
    <div css={wrapper} ref={ref}>
      <div css={block}>
        {results.map((result, i) => (
          <TickerListItem
            id={result.id}
            image={
              result.image
                ? `https://files.velofolio.net/logos/us_stocks/${result.ticker}.png`
                : null
            }
            name={result.name}
            ticker={result.ticker}
            key={result.id}
            selected={i === selectedIndex}
            index={i}
            onSelect={onSelect}
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
  z-index: 10;
`

export default SymbolAutocomplete
