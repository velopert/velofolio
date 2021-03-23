import React from 'react'
import { css } from '@emotion/react'
import CashflowsSection from './CashflowsSection'
import InitialAmountSection from './InitialAmountSection'
import PortfoliosSection from './PortfoliosSection'
import TestPeriodSection from './TestPeriodSection'
import FooterButton from './FooterButton'
import ProjectTitleSection from './ProjectTitleSection'
import useSaveFooter from '../../hooks/useSaveFooter'
export type LabSettingsDefaultProps = {}

function LabSettingsDefault({}: LabSettingsDefaultProps) {
  const { name, onSave } = useSaveFooter()
  return (
    <div css={block}>
      <ProjectTitleSection />
      <TestPeriodSection />
      <InitialAmountSection />
      <CashflowsSection />
      <PortfoliosSection />
      <FooterButton name={name} onClick={onSave} />
    </div>
  )
}

const block = css`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export default LabSettingsDefault
