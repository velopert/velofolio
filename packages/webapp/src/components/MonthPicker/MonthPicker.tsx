import { css } from '@emotion/react'

export type MonthPickerProps = {
  minimum?: Value
  maximum?: Value
  value: Value
  onChange(value: Value): void
}

type Value = {
  month: number
  year: number
}

function MonthPicker({}: MonthPickerProps) {
  return <div css={block}></div>
}

const block = css`
  bottom: -0.0625rem;
  width: 16rem;
  height: 12rem;
  position: absolute;
  background: white;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.07);
  border-radius: 0.5rem;
  transform: translate3d(0, 100%, 0);
  z-index: 5;
`

export default MonthPicker
