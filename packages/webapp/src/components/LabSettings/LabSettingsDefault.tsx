import React from 'react'
import { css } from '@emotion/react'
import CashflowsSection from './CashflowsSection'
import InitialAmountSection from './InitialAmountSection'
import PortfoliosSection from './PortfoliosSection'
import TestPeriodSection from './TestPeriodSection'
export type LabSettingsDefaultProps = {}

function LabSettingsDefault({}: LabSettingsDefaultProps) {
  return (
    <>
      <TestPeriodSection />
      <InitialAmountSection />
      <CashflowsSection />
      <PortfoliosSection />
    </>
  )
}

export default LabSettingsDefault
