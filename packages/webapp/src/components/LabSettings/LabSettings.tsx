import { css } from '@emotion/react'
import useDateRangeHook from '../../hooks/useDateRangeHook'
import palette from '../../lib/palette'
import InputBase from '../InputBase'
import LabSettingsSection from '../LabSettingsSection'
import MonthPickerInput from '../MonthPickerInput'
import TestPeriodSection from './TestPeriodSection'

export type LabSettingsProps = {}

function LabSettings({}: LabSettingsProps) {
  return (
    <div css={blockStyle}>
      <TestPeriodSection />
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
