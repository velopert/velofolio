import React from 'react'
import { css } from '@emotion/react'
import CashflowsSection from './CashflowsSection'
import InitialAmountSection from './InitialAmountSection'
import PortfoliosSection from './PortfoliosSection'
import TestPeriodSection from './TestPeriodSection'
import FooterButton from './FooterButton'
export type LabSettingsDefaultProps = {}

function LabSettingsDefault({}: LabSettingsDefaultProps) {
  return (
    <div css={block}>
      <TestPeriodSection />
      <InitialAmountSection />
      <CashflowsSection />
      <PortfoliosSection />
      <FooterButton name="SAVE TO WORKSPACE" onClick={() => {}} />
    </div>
  )
}

const block = css`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export default LabSettingsDefault
