import React from 'react'
import { css } from '@emotion/react'
import CashflowsSection from './CashflowsSection'
import InitialAmountSection from './InitialAmountSection'
import PortfoliosSection from './PortfoliosSection'
import TestPeriodSection from './TestPeriodSection'
import FooterButton from './FooterButton'
import ProjectTitleSection from './ProjectTitleSection'
import useSaveFooter from '../../hooks/useSaveFooter'
import GrayIconTextButton from './GrayIconTextButton'
import useResetLab from '../../hooks/useResetLab'
export type LabSettingsDefaultProps = {}

function LabSettingsDefault({}: LabSettingsDefaultProps) {
  const { name, onSave, loading } = useSaveFooter()
  const reset = useResetLab()

  return (
    <div css={block}>
      <div css={resetButtonWrapper}>
        <GrayIconTextButton onClick={reset} icon="undo" text="RESET" />
      </div>
      <ProjectTitleSection />
      <TestPeriodSection />
      <InitialAmountSection />
      <CashflowsSection />
      <PortfoliosSection />
      <FooterButton name={name} onClick={onSave} loading={loading} />
    </div>
  )
}

const block = css`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const resetButtonWrapper = css`
  display: flex;
  justify-content: flex-end;
`

export default LabSettingsDefault
