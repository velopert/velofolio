import { css } from '@emotion/react'
import { useEffect } from 'react'
import {
  useAssetsActions,
  useAssetsState,
  useAssetsWeightSum,
} from '../../atoms/assetsState'
import { usePortfoliosAction } from '../../atoms/labSettingState'
import { useLabSettingView } from '../../atoms/labSettingViewState'
import palette from '../../lib/palette'
import VeloIcon from '../VeloIcon'
export type AssetsTableProps = {
  focusInput(): void
}

function AssetsTable({ focusInput }: AssetsTableProps) {
  const { updateById } = usePortfoliosAction()
  const { selectedPortfolioId } = useLabSettingView()

  const [assets] = useAssetsState()
  const { updateWeight, remove } = useAssetsActions()
  const sum = useAssetsWeightSum()
  const calculatePercent = (value: number) => {
    if (sum === 0) return '0%'
    return ((value / sum) * 100).toFixed(2).concat('%')
  }

  useEffect(() => {
    if (!selectedPortfolioId) return
    updateById(selectedPortfolioId, assets)
  }, [selectedPortfolioId, assets, updateById])

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
            <div css={[columnTicker, leftAlign]}>
              <img
                src={
                  asset.image
                    ? `https://storage.googleapis.com/iexcloud-hl37opg/api/logos/${asset.ticker}.png`
                    : ''
                }
                alt={`${asset.ticker} logo`}
              />
              <span>{asset.ticker}</span>
              <div className="icon-wrapper" onClick={() => remove(asset.id)}>
                <VeloIcon name="trash" />
              </div>
            </div>
            <div css={columnWeight}>
              <input
                value={asset.weight}
                type="number"
                onChange={(e) => {
                  const value = parseInt(e.target.value)
                  updateWeight(asset.id, isNaN(value) ? 0 : value)
                }}
              />
            </div>
            <div css={columnPercent}>{calculatePercent(asset.weight)}</div>
          </div>
        ))}
        {assets.length < 4 ? (
          <div css={disabledRows(assets.length > 0)}>
            {Array.from({ length: 4 - assets.length }).map((_, i) => (
              <div key={i} css={row} onClick={focusInput}>
                <div css={columnTicker}></div>
                <div css={columnWeight}></div>
                <div css={columnPercent}></div>
              </div>
            ))}
          </div>
        ) : null}
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

const disabledRows = (hasBorderTop: boolean) => css`
  background: ${palette.blueGrey[50]};
  ${hasBorderTop &&
  css`
    border-top: 0.0625rem solid ${palette.blueGrey[100]};
  `}
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
  font-size: 0.875rem;
  color: ${palette.blueGrey[800]};
`

const columnTicker = css`
  ${column}
  flex: 2.5;
  display: flex;
  align-items: center;

  img {
    margin-left: 0.5rem;
    display: block;
    background: white;
    width: 1.5rem;
    height: 1.5rem;
    border: 0.0625rem solid ${palette.blueGrey[100]};
    border-radius: 0.75rem;
    margin-right: 0.4375rem;
  }
  span {
    line-height: 1;
    flex: 1;
  }
  .icon-wrapper {
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: ${palette.blueGrey[300]};
    &:hover {
      color: ${palette.red[500]};
    }

    svg {
      width: 1rem;
      height: 1rem;
      margin-right: 0.5rem;
    }
  }
`

const leftAlign = css`
  justify-content: flex-start;
`
const columnWeight = css`
  ${column}
  flex: 2;
  border-left: 0.0625rem solid ${palette.blueGrey[100]};
  border-right: 0.0625rem solid ${palette.blueGrey[100]};
  display: flex;
  input {
    width: 100%;
    height: 100%;
    outline: none;
    border: none;
    flex: 1;
    padding: 0;
    text-align: center;
    color: inherit;
    font-size: inherit;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
  }
`
const columnPercent = css`
  ${column}
  flex: 2;
`

export default AssetsTable
