import { css } from '@emotion/react'
import { usePortfoliosState } from '../../atoms/labSettingState'
import palette from '../../lib/palette'
import PortfolioAllocation from './PortfolioAllocation'
import ReportSection from './ReportSection'
export type PortfolioAllocationsSectionProps = {}

function PortfolioAllocationsSection({}: PortfolioAllocationsSectionProps) {
  const [portfolios] = usePortfoliosState()

  return (
    <ReportSection title="Portfolio Allocation">
      {portfolios.map((portfolio) => (
        <PortfolioAllocation portfolio={portfolio} key={portfolio.id} />
      ))}
    </ReportSection>
  )
}

export default PortfolioAllocationsSection
