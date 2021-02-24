import { css } from '@emotion/react'
import { useEffect } from 'react'
import { useIndicatorByIdState } from '../../atoms/reportState'
import ReportSection from './ReportSection'
export interface IndicatorsSectionProps {}

function IndicatorsSection({}: IndicatorsSectionProps) {
  const [indicatorById] = useIndicatorByIdState()
  useEffect(() => {
    console.log(indicatorById)
  }, [indicatorById])
  return <ReportSection title="Indiators">Hello World</ReportSection>
}

export default IndicatorsSection
