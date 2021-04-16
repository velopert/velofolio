import { css } from '@emotion/react'
import { useAutocompleteIndex } from '../../atoms/autocompleteIndex'
import palette from '../../lib/palette'
import FallbackStockLogo from './FallbackStockLogo'
export type TickerListItemProps = {
  id: number
  ticker: string
  name: string
  image: string | null
  selected: boolean
  index: number
}

function TickerListItem({
  id,
  ticker,
  name,
  image,
  selected,
  index,
}: TickerListItemProps) {
  const [, setSelectedIndex] = useAutocompleteIndex()
  const onMouseEnter = () => {
    setSelectedIndex(index)
  }
  return (
    <div
      css={item(selected)}
      data-type="ticker-item"
      onMouseEnter={onMouseEnter}
    >
      {image ? (
        <img src={image} alt={`${ticker} logo`} />
      ) : (
        <FallbackStockLogo name={ticker} />
      )}
      <span css={tickerStyle}>{ticker}</span>
      <span css={nameStyle}>{name}</span>
    </div>
  )
}

const item = (selected: boolean) => css`
  height: 2.25rem;
  padding-left: 1rem;
  padding-right: 1rem;
  display: flex;
  align-items: center;

  cursor: pointer;

  ${selected &&
  css`
    background: ${palette.cyan[100]};
  `}
  img {
    background: white;
    width: 1.5rem;
    height: 1.5rem;
    border: 0.0625rem solid ${palette.blueGrey[100]};
    border-radius: 0.75rem;
    flex-shrink: 0;
  }
  span {
    margin-left: 0.5rem;
  }
`

const tickerStyle = css`
  color: ${palette.blueGrey[800]};
  font-weight: bold;
  font-size: 1rem;
`
const nameStyle = css`
  font-size: 0.75rem;
  color: ${palette.blueGrey[500]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export default TickerListItem
