import { css } from '@emotion/react'
import { useMemo } from 'react'
import { Portfolio } from '../../atoms/labSettingState'
import palette from '../../lib/palette'
import { convertToPercentage } from '../../lib/utils/calculateIndicators'

export type PortfolioAllocationProps = {
  portfolio: Portfolio
}

function PortfolioAllocation({ portfolio }: PortfolioAllocationProps) {
  const totalWeight = useMemo(
    () => portfolio.assets.reduce((acc, current) => acc + current.weight, 0),
    [portfolio]
  )

  return (
    <div css={block}>
      <div css={pane}>
        <table css={tableStyle}>
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Stock Name</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.assets.map((asset) => (
              <tr key={asset.id}>
                <td>{asset.ticker}</td>
                <td>몰러유</td>
                <td>{convertToPercentage(asset.weight / totalWeight)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div css={pane}></div>
    </div>
  )
}

const block = css`
  display: flex;
`

const pane = css`
  flex: 1;
  & + & {
    margin-left: 2rem;
  }
`

const tableStyle = css`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  td,
  th {
    padding: 0.75rem;
    border: 1px solid ${palette.blueGrey[200]};
  }

  tr:nth-of-type(even) {
    background: ${palette.grey[100]};
  }

  tr td:first-child {
    width: 20rem;
  }

  thead th {
    color: ${palette.blueGrey[800]};
  }
`

export default PortfolioAllocation
