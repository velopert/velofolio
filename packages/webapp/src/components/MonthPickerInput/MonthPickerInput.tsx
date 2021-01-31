import { css } from '@emotion/react'
import InputBase from '../InputBase'
import MonthPicker from '../MonthPicker'

export type MonthPickerInputProps = {}

function MonthPickerInput({}: MonthPickerInputProps) {
  return (
    <InputBase css={wrapper}>
      <MonthPicker
        onChange={() => {}}
        value={{
          month: 1,
          year: 2020,
        }}
      />
    </InputBase>
  )
}

const wrapper = css`
  position: relative;
`

export default MonthPickerInput
