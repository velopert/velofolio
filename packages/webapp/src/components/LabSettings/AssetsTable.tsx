import { css } from '@emotion/react'
import { useAssetsState } from '../../atoms/assetsState'
import palette from '../../lib/palette'
export type AssetsTableProps = {}

function AssetsTable({}: AssetsTableProps) {
  const [assets] = useAssetsState()
  return (
    <div css={block}>
      <div css={headerRow}>
        <div css={columnTicker}>
          <div css={headerRowTitle}>Ticker</div>
        </div>
        <div css={columnWeight}>
          <div css={headerRowTitle}>Weight</div>
        </div>
        <div css={columnPercent}>
          <div css={headerRowTitle}>%</div>
        </div>
      </div>
      <div css={rowContents}>
        {/* <div css={row}>
          <div css={columnTicker}></div>
          <div css={columnWeight}></div>
          <div css={columnPercent}></div>
        </div> */}
        {assets.map((asset) => (
          <div key={asset.id} css={row}>
            <div css={columnTicker}>{asset.ticker}</div>
            <div css={columnWeight}>{asset.weight}</div>
            <div css={columnPercent}>0%</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const block = css`
  margin-top: 0.5rem;
  border-radius: 0.5rem;
  background: white;
  border: 0.0625rem solid ${palette.blueGrey[50]};
  position: relative;
`

const row = css`
  height: 2rem;
  display: flex;
  & + & {
    border-top: 0.0625rem solid ${palette.blueGrey[100]};
  }
`

const headerRow = css`
  border-bottom: 0.0625rem solid ${palette.blueGrey[300]};
  ${row}
`

const headerRowTitle = css`
  font-size: 1rem;
  line-height: 1.5;
  font-weight: bold;
  color: ${palette.blueGrey[700]};
`

const rowContents = css`
  max-height: 11rem;
  overflow-y: auto;
`

const column = css`
  display: flex;
  align-items: center;
  justify-content: center;
`

const columnTicker = css`
  ${column}
  flex: 2.5;
`
const columnWeight = css`
  ${column}
  flex: 2;
  border-left: 0.0625rem solid ${palette.blueGrey[100]};
  border-right: 0.0625rem solid ${palette.blueGrey[100]};
`
const columnPercent = css`
  ${column}
  flex: 2;
`

export default AssetsTable
