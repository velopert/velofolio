import { css, keyframes } from '@emotion/react'
import palette from '../../lib/palette'
import VeloIcon from '../VeloIcon'

export type SpinnerProps = {
  size?: string
  color?: string
}

function Spinner({ size = '1rem', color = palette.cyan[500] }: SpinnerProps) {
  return <VeloIcon name="spinner" css={spinner(size, color)} />
}

const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
}
`

const spinner = (size: string, color: string) => css`
  width: ${size};
  height: ${size};
  color: ${color};
  animation: ${rotateAnimation} 1.25s ease-in-out infinite;
`

export default Spinner
