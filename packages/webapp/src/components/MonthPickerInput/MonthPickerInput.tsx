import { css } from '@emotion/react'
import { useRef, useState } from 'react'
import useOnClickOutside from 'use-onclickoutside'
import InputBase from '../InputBase'
import MonthPicker from '../MonthPicker'
import { months, MonthYearValue } from '../MonthPicker/MonthPicker'

export type MonthPickerInputProps = {}

const formatDate = ({ month, year }: MonthYearValue) =>
  `${months[month - 1]} · ${year}`

function MonthPickerInput({}: MonthPickerInputProps) {
  const [localValue, setLocalValue] = useState<MonthYearValue>({
    year: 2021,
    month: 1,
  })
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const onClose: Parameters<typeof useOnClickOutside>[1] = (e) => {
    if (ref.current === e.target || ref.current?.contains(e.target as Node)) {
      return
    }
    setOpen(false)
    console.log('vau')
  }

  const onChange = (value: MonthYearValue) => {
    setLocalValue(value)
    setOpen(false)
  }

  return (
    <InputBase
      css={wrapper}
      onClick={() => {
        setOpen(true)
      }}
      ref={ref}
    >
      <div css={textStyle}>{formatDate(localValue)}</div>
      <MonthPicker
        onChange={onChange}
        value={localValue}
        visible={open}
        onClose={onClose}
      />
    </InputBase>
  )
}

const wrapper = css`
  position: relative;
`

const textStyle = css`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default MonthPickerInput
