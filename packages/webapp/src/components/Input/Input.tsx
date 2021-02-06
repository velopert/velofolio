import { css } from '@emotion/react'
import { useRef } from 'react'
import palette from '../../lib/palette'
import InputBase from '../InputBase'
export type InputProps = {
  prefix?: string
} & React.InputHTMLAttributes<HTMLInputElement>

function Input({ prefix, className, disabled, ...rest }: InputProps) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <InputBase
      css={wrapper(disabled)}
      onClick={() => ref.current?.focus()}
      className={className}
      disabled={disabled}
    >
      {prefix !== undefined && <span>{prefix}</span>}
      <input css={style} ref={ref} disabled={disabled} {...rest} />
    </InputBase>
  )
}

const wrapper = (disabled?: boolean) => css`
  padding-left: 1rem;
  padding-right: 1rem;
  display: flex;
  align-items: center;
  cursor: text;

  span {
    color: ${palette.blueGrey[300]};
    margin-right: 0.5rem;
  }

  ${disabled &&
  css`
    span {
      color: ${palette.blueGrey[200]};
    }
    cursor: not-allowed;
  `}
`

const style = css`
  flex: 1;
  border: none;
  color: inherit;
  background: none;
  outline: none;
  padding: 0;

  font-size: inherit;
  &::placeholder {
    color: ${palette.blueGrey[200]};
  }
  &:disabled {
    cursor: not-allowed;
    color: inherit;
  }
`

export default Input
