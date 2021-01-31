import { css } from '@emotion/react'
import palette from '../../lib/palette'
export type InputBaseProps = {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

function InputBase({ className, style, children }: InputBaseProps) {
  return (
    <div css={wrapper} style={style} className={className}>
      {children}
    </div>
  )
}

const wrapper = css`
  border: ${palette.blueGrey[50]} 1px solid;
  border-radius: 0.5rem;
  height: 2.5rem;
  background: white;
  color: ${palette.blueGrey[700]};
  font-size: 1rem;
  display: flex;
`

export default InputBase
