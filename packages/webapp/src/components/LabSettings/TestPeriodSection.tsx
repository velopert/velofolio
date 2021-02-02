import { css } from '@emotion/react'
import useDateRangeHook from '../../hooks/useDateRangeHook'
import palette from '../../lib/palette'
import LabSettingsSection from '../LabSettingsSection'
import MonthPickerInput from '../MonthPickerInput'
export type TestPeriodSectionProps = {}

function TestPeriodSection({}: TestPeriodSectionProps) {
  const {
    endDate,
    setEndDate,
    setStartDate,
    startDate,
    maxDate,
    minDate,
  } = useDateRangeHook()

  return (
    <LabSettingsSection title="Test Period" contentStyle={testPeriods}>
      {/* TODO: 
    use endDate (-1 month, if month === 0: year - 1) as maxValue
    use startDate (+1 month, if month === 13: year + 1) as minValue
  */}
      <MonthPickerInput
        onChange={setStartDate}
        value={startDate}
        maximum={maxDate}
        minimum={minDate}
        css={monthPickerInput}
      />
      <div css={tilde}>~</div>
      <MonthPickerInput
        onChange={setEndDate}
        value={endDate}
        maximum={maxDate}
        minimum={minDate}
        css={monthPickerInput}
      />
    </LabSettingsSection>
  )
}

const testPeriods = css`
  display: flex;
  width: 100%;
  align-items: center;
`

const monthPickerInput = css`
  flex: 1;
`

const tilde = css`
  color: ${palette.blueGrey[500]};
  font-size: 1.5rem;
  margin-left: 1rem;
  margin-right: 1rem;
`

export default TestPeriodSection
