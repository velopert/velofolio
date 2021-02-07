import React from 'react'
import { css } from '@emotion/react'
import useDateRangeHook from '../../hooks/useDateRangeHook'
import palette from '../../lib/palette'
import InputBase from '../InputBase'
import LabSettingsSection from './LabSettingsSection'
import MonthPickerInput from '../MonthPickerInput'
import TestPeriodSection from './TestPeriodSection'
import InitialAmountSection from './InitialAmountSection'
import CashflowsSection from './CashflowsSection'
import PortfoliosSection from './PortfoliosSection'
import { useRecoilValue } from 'recoil'
import { useLabSettingView } from '../../atoms/labSettingViewState'
import LabSettingsDefault from './LabSettingsDefault'
import LabSettingsPortfolio from './LabSettingsPortfolio'

export type LabSettingsProps = {}

function LabSettings({}: LabSettingsProps) {
  const { mode } = useLabSettingView()

  return (
    <div css={blockStyle}>
      {mode === 'default' && <LabSettingsDefault />}
      {mode === 'portfolio' && <LabSettingsPortfolio />}
    </div>
  )
}

const blockStyle = css`
  position: fixed;
  background: ${palette.grey[100]};
  border-radius: 2rem;
  width: 22.5rem;
  height: calc(100% - 6rem);
  padding: 2rem;
`

export default LabSettings
