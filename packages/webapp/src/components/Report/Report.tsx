import { css } from '@emotion/react'
import { useReportValue } from '../../atoms/reportState'
import palette from '../../lib/palette'
import PortfolioReturnsSection from './PortfolioReturnsSection'

export type ReportProps = {}

function Report({}: ReportProps) {
  return (
    <div css={block}>
      <h1>Report</h1>
      <PortfolioReturnsSection />
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