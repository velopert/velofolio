import { css } from '@emotion/react'
import palette from '../../lib/palette'
export type TickerListItemProps = {
  id: number
  ticker: string
  name: string
  image: string
}

function TickerListItem({ id, ticker, name, image }: TickerListItemProps) {
  return (
    <div css={item} tabIndex={0} data-type="ticker-item">
      <img src={image} alt={`${ticker} logo`} />
      <span css={tickerStyle}>{ticker}</span>
      <span css={nameStyle}>{name}</span>
    </div>
  )
}

const item = css`
  height: 2.25rem;
  padding-left: 1rem;
  padding-right: 1rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background: ${palette.grey[50]};
  }
  img {
    width: 1.5rem;
    height: 1.5rem;
    border: 0.0625rem solid ${palette.blueGrey[100]};
    border-radius: 0.75rem;
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
