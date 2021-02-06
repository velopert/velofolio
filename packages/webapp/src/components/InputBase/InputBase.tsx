import { forwardRef } from 'react'

import { css } from '@emotion/react'
import palette from '../../lib/palette'
export type InputBaseProps = {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  disabled?: boolean
} & React.HTMLAttributes<HTMLDivElement>

function InputBase(
  { className, style, children, disabled, ...rest }: InputBaseProps,
  ref: React.Ref<HTMLDivElement>
) {
  return (
    <div
      css={wrapper(disabled)}
      {...rest}
      style={style}
      className={className}
      ref={ref}
    >
      {children}
    </div>
  )
}

const wrapper = (disabled: boolean = false) => css`
  border: ${palette.blueGrey[50]} 1px solid;
  border-radius: 0.5rem;
  background: white;
  height: 2.5rem;
  color: ${palette.blueGrey[700]};
  font-size: 1rem;
  display: flex;

  ${disabled &&
  css`
    background: ${palette.blueGrey[50]};
    cursor: not-allowed;
    color: ${palette.blueGrey[300]};
  `}
`

export default forwardRef<HTMLDivElement, InputBaseProps>(InputBase)
