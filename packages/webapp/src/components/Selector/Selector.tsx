import { css } from '@emotion/react'
import palette from '../../lib/palette'
import InputBase from '../InputBase'
import VeloIcon from '../VeloIcon'

export type SelectorProps = {
  className?: string
  options: string[]
  value: string
  onChange(e: React.ChangeEvent<HTMLSelectElement>): void
  disabled?: boolean
}

function Selector({
  className,
  options,
  value,
  onChange,
  disabled,
}: SelectorProps) {
  return (
    <InputBase className={className} disabled={disabled}>
      <div css={block}>
        <select
          css={selector}
          value={value}
          onChange={onChange}
          disabled={disabled}
          tabIndex={0}
        >
          {options.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
        <VeloIcon name="arrow_drop_down" />
      </div>
    </InputBase>
  )
}

const block = css`
  flex: 1;
  display: flex;
  position: relative;
  svg {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 3;
  }
`

const selector = css`
  background: none;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: none;
  color: inherit;

  z-index: 5;
  padding-left: 1rem;
  &:focus {
    outline: none;
  }
  &:disabled {
    opacity: 1;
    color: inherit;
  }
  /* &::focus-visible {
    outline-color: rgb(0, 95, 204);
    outline-offset: 0px;
    outline-style: auto;
    outline-width: 1px;
  } */
`

export default Selector
