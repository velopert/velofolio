import { css } from '@emotion/react'
import { useRef, forwardRef } from 'react'
import palette from '../../lib/palette'
import InputBase from '../InputBase'
import useMergedRef from '@react-hook/merged-ref'

export type InputProps = {
  prefix?: string
} & React.InputHTMLAttributes<HTMLInputElement>

function Input(
  { prefix, className, disabled, ...rest }: InputProps,
  ref: React.Ref<HTMLDivElement>
) {
  const innerRef = useRef<HTMLInputElement>(null)
  const mergedRef = useMergedRef(innerRef, ref)

  return (
    <InputBase
      css={wrapper(disabled)}
      onClick={() => innerRef.current?.focus()}
      className={className}
      disabled={disabled}
    >
      {prefix !== undefined && <span>{prefix}</span>}
      <input css={style} ref={mergedRef} disabled={disabled} {...rest} />
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

export default forwardRef<HTMLInputElement, InputProps>(Input)
