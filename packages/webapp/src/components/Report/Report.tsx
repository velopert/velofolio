import { css } from '@emotion/react'
import { undrawCreativeExperiment } from '../../assets/images'
import { useHasPortfolio } from '../../atoms/labSettingState'
import { useIsReportReady } from '../../atoms/reportState'
import palette from '../../lib/palette'
import media from '../../lib/styles/media'
import ImageWithDescription from '../ImageWithDescription'
import AnnualReturnsSection from './AnnualReturnsSection'
import DescriptionSection from './DescriptionSection'
import DoubleSections from './DoubleSections'
import IndicatorsSection from './IndicatorsSection'
import MonthlyReturnsSection from './MonthlyReturnsSection'
import PortfolioAllocationsSection from './PortfolioAllocationsSection'
import PortfolioReturnsSection from './PortfolioReturnsSection'

export type ReportProps = {}

function Report({}: ReportProps) {
  const isReportReady = useIsReportReady()
  const hasPortfolio = useHasPortfolio()

  if (!hasPortfolio) {
    return (
      <div css={emptyWrapper}>
        <ImageWithDescription
          image={undrawCreativeExperiment}
          description="Add a new portfolio to generate report"
        />
      </div>
    )
  }

  if (!isReportReady) return null

  return (
    <div css={block}>
      <h1>Report</h1>
      <IndicatorsSection />
      <PortfolioReturnsSection />
      <DescriptionSection />
      <DoubleSections>
        <AnnualReturnsSection />
        <MonthlyReturnsSection />
      </DoubleSections>
      <PortfolioAllocationsSection />
    </div>
  )
}

const emptyWrapper = css`
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: calc(100% - 40.75rem);
  ${media.xlarge} {
    width: 10rem;
    width: calc(100% - 29.5rem);
  }
`

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
