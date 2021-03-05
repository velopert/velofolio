import { css } from '@emotion/react'
import { useEffect, useMemo } from 'react'
import {
  useInitialAmountState,
  usePortfoliosState,
} from '../../atoms/labSettingState'
import {
  useIndicatorByIdState,
  useMonthsCountValue,
} from '../../atoms/reportState'
import palette from '../../lib/palette'
import { returnRate } from '../../lib/utils/calculateIndicators'
import ReportSection from './ReportSection'
export interface IndicatorsSectionProps {}

const convertToPercentage = (value: number, decimal: number = 2) =>
  `${(Math.round(value * Math.pow(10, decimal + 2)) / 100).toLocaleString()}%`

function IndicatorsSection({}: IndicatorsSectionProps) {
  const [indicatorById] = useIndicatorByIdState()
  const [initialAmount] = useInitialAmountState()
  const [portfolios] = usePortfoliosState()
  const monthsCount = useMonthsCountValue()

  const moreThanOneYear = useMemo(() => monthsCount && monthsCount >= 12, [
    monthsCount,
  ])

  const moreThanTwoYears = useMemo(() => monthsCount && monthsCount >= 24, [
    monthsCount,
  ])

  const portfolioIndicators = useMemo(() => {
    const results = portfolios.map((portfolio) => ({
      id: portfolio.id,
      name: portfolio.name,
      indicators: indicatorById[portfolio.id]!,
    }))

    if (results.find((result) => result.indicators === undefined)) {
      return null
    }

    return results
  }, [portfolios, indicatorById])

  if (!portfolioIndicators || portfolios.length === 0) return null

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
          {portfolioIndicators.map(
            ({
              id,
              indicators: {
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
            }) => (
              <tr key={id}>
                <td>{name}</td>
                <td>
                  ${Math.floor(finalBalance).toLocaleString()} (
                  {convertToPercentage(returnRate(initialAmount, finalBalance))}
                  )
                </td>
                {moreThanOneYear && <td>{convertToPercentage(cagr)}</td>}
                <td>{convertToPercentage(stdev)}</td>
                <td>{convertToPercentage(mdd)}</td>
                <td>
                  {convertToPercentage(
                    moreThanTwoYears ? best.year : best.month
                  )}
                </td>
                <td>
                  {convertToPercentage(
                    moreThanTwoYears ? worst.year : worst.month
                  )}
                </td>
                <td>{sharpeRatio.toFixed(2)}</td>
                <td>{sortinoRatio ? sortinoRatio.toFixed(2) : 'N/A'}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </ReportSection>
  )
}

const tableStyle = css`
  border-radius: 4px;
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

export default IndicatorsSection

/*
.bordered th:first-child {
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

.bordered tr:last-child td:first-child {
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
