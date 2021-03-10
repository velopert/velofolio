import { css } from '@emotion/react'
import palette from '../../lib/palette'
import AnnualReturnsSection from './AnnualReturnsSection'
import DoubleSections from './DoubleSections'
import IndicatorsSection from './IndicatorsSection'
import MonthlyReturnsSection from './MonthlyReturnsSection'
import PortfolioAllocationsSection from './PortfolioAllocationsSection'
import PortfolioReturnsSection from './PortfolioReturnsSection'

export type ReportProps = {}

function Report({}: ReportProps) {
  return (
    <div css={block}>
      <h1>Report</h1>
      <IndicatorsSection />
      <PortfolioReturnsSection />
      <DoubleSections>
        <AnnualReturnsSection />
        <MonthlyReturnsSection />
      </DoubleSections>
      <PortfolioAllocationsSection />
    </div>
  )
}

const block = css`
  padding-right: 2rem;
  padding-left: 2rem;
  h1 {
    font-weight: 500;
    color: ${palette.blueGrey[800]};
    font-size: 2.5rem;
    margin-top: 0;
    margin-bottom: 2rem;
  }
`

export default Report
