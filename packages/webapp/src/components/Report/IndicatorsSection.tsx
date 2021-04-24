import { css } from '@emotion/react'
import { useEffect, useMemo } from 'react'
import { useInitialAmountState } from '../../atoms/labSettingState'
import { useMonthsCount, useReportValue } from '../../atoms/reportState'
import palette from '../../lib/palette'
import media from '../../lib/styles/media'
import {
  convertToPercentage,
  returnRate,
} from '../../lib/utils/calculateIndicators'
import ReportSection from './ReportSection'
export interface IndicatorsSectionProps {}

function IndicatorsSection({}: IndicatorsSectionProps) {
  const [initialAmount] = useInitialAmountState()
  const monthsCount = useMonthsCount()
  const report = useReportValue()

  const moreThanOneYear = useMemo(() => monthsCount && monthsCount >= 12, [
    monthsCount,
  ])

  const moreThanTwoYears = useMemo(() => monthsCount && monthsCount >= 24, [
    monthsCount,
  ])

  const indicators = useMemo(() => {
    return report.map(
      ({
        id,
        indicator: {
          finalBalance,
          cagr,
          stdev,
          mdd,
          sharpeRatio,
          sortinoRatio,
          best,
          worst,
        },
        name,
      }) => ({
        id,
        name,
        finalBalance: `$${Math.floor(finalBalance).toLocaleString()} (
          ${convertToPercentage(returnRate(initialAmount, finalBalance))})`,
        cagr: convertToPercentage(cagr),
        stdev: convertToPercentage(stdev),
        mdd: convertToPercentage(mdd),
        best: convertToPercentage(moreThanTwoYears ? best.year : best.month),
        worst: convertToPercentage(moreThanTwoYears ? worst.year : worst.month),
        sharpe: sharpeRatio.toFixed(2),
        sortino: sortinoRatio ? sortinoRatio.toFixed(2) : 'N/A',
      })
    )
  }, [initialAmount, moreThanTwoYears, report])

  if (report.length === 0) return null

  return (
    <ReportSection title="Indicators">
      <table css={tableStyle}>
        <thead>
          <tr>
            <th>Portfolio Name</th>
            <th>Final Balance</th>
            {moreThanOneYear && <th>CAGR</th>}
            <th>Stdev</th>
            <th>Max Drawdown</th>
            <th>Best {moreThanTwoYears ? 'Year' : 'Month'}</th>
            <th>Worst {moreThanTwoYears ? 'Year' : 'Month'}</th>
            <th>Sharpe Ratio</th>
            <th>Sortino Ratio</th>
          </tr>
        </thead>
        <tbody>
          {indicators.map(
            ({
              id,
              name,
              best,
              cagr,
              finalBalance,
              mdd,
              sharpe,
              sortino,
              stdev,
              worst,
            }) => (
              <tr key={id}>
                <td>{name}</td>
                <td>{finalBalance}</td>
                {moreThanOneYear && <td>{cagr}</td>}
                <td>{stdev}</td>
                <td>{mdd}</td>
                <td>{best}</td>
                <td>{worst}</td>
                <td>{sharpe}</td>
                <td>{sortino}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
      <div css={mobileView}>
        {indicators.map(
          ({
            id,
            name,
            best,
            cagr,
            finalBalance,
            mdd,
            sharpe,
            sortino,
            stdev,
            worst,
          }) => (
            <div key={id} className="item">
              <div className="row">
                <div className="name">Portfolio Name</div>
                <div className="value">{name}</div>
              </div>
              <div className="row">
                <div className="name">Final Balance</div>
                <div className="value">{finalBalance}</div>
              </div>
              {moreThanOneYear && (
                <div className="row">
                  <div className="name">CAGR</div>
                  <div className="value">{cagr}</div>
                </div>
              )}
              <div className="row">
                <div className="name">Stdev</div>
                <div className="value">{stdev}</div>
              </div>
              <div className="row">
                <div className="name">Max Drawdown</div>
                <div className="value">{mdd}</div>
              </div>
              <div className="row">
                <div className="name">
                  Best {moreThanTwoYears ? 'Year' : 'Month'}
                </div>
                <div className="value">{best}</div>
              </div>
              <div className="row">
                <div className="name">
                  Worst {moreThanTwoYears ? 'Year' : 'Month'}
                </div>
                <div className="value">{worst}</div>
              </div>
              <div className="row">
                <div className="name">Sharpe Ratio</div>
                <div className="value">{sharpe}</div>
              </div>
              <div className="row">
                <div className="name">Sortino Ratio</div>
                <div className="value">{sortino}</div>
              </div>
            </div>
          )
        )}
      </div>
    </ReportSection>
  )
}

const tableStyle = css`
  ${media.xlarge} {
    display: none;
  }
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

  tr td:first-of-type {
    width: 20rem;
  }

  thead th {
    color: ${palette.blueGrey[800]};
  }
`

const mobileView = css`
  font-size: 0.875rem;
  display: none;
  ${media.xlarge} {
    display: block;
  }

  .item {
    .row {
      .name {
        color: ${palette.blueGrey[800]};
        font-weight: bold;
      }
      .value {
        color: ${palette.blueGrey[600]};
        margin-top: 0.5rem;
      }
    }
    .row + .row {
      margin-top: 1rem;
    }
  }
  .item + .item {
    margin-top: 2rem;
  }
`

export default IndicatorsSection

/*
.bordered th:first-of-type {
  -moz-border-radius: 6px 0 0 0;
  -webkit-border-radius: 6px 0 0 0;
  border-radius: 6px 0 0 0;
}

.bordered th:last-child {
  -moz-border-radius: 0 6px 0 0;
  -webkit-border-radius: 0 6px 0 0;
  border-radius: 0 6px 0 0;
}

.bordered th:only-child{
  -moz-border-radius: 6px 6px 0 0;
  -webkit-border-radius: 6px 6px 0 0;
  border-radius: 6px 6px 0 0;
}

.bordered tr:last-child td:first-of-type {
  -moz-border-radius: 0 0 0 6px;
  -webkit-border-radius: 0 0 0 6px;
  border-radius: 0 0 0 6px;
}

.bordered tr:last-child td:last-child {
  -moz-border-radius: 0 0 6px 0;
  -webkit-border-radius: 0 0 6px 0;
  border-radius: 0 0 6px 0;
}
*/
