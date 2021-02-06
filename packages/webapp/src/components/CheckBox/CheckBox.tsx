import { css } from '@emotion/react'
import palette from '../../lib/palette'
import VeloIcon from '../VeloIcon'

export type CheckBoxProps = { value: boolean; onToggle(): void }

function CheckBox({ value, onToggle }: CheckBoxProps) {
  return (
    <div
      css={style}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if ([' ', 'Enter'].includes(e.key)) {
          onToggle()
        }
      }}
    >
      {value && <VeloIcon name="check" />}
    </div>
  )
}

const style = css`
  border: ${palette.blueGrey[50]} 1px solid;
  border-radius: 0.5rem;
  background: white;
  height: 2rem;
  width: 2rem;
  align-items: center;
  justify-content: center;
  display: flex;
  cursor: pointer;

  svg {
    width: 1rem;
    height: 1rem;
    color: ${palette.cyan[400]};
  }
  outline: none;
  &:focus-visible {
    border: ${palette.cyan[400]} 1px solid;
  }
`

export default CheckBox
