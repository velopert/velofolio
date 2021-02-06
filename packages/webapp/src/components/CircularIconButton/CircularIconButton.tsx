import { css } from '@emotion/react'
import palette from '../../lib/palette'
import { resetButton } from '../../lib/styles/resetButton'
import VeloIcon, { VeloIconType } from '../VeloIcon/VeloIcon'

export type CircularIconButtonProps = {
  color?: string
  hoverColor?: string
  icon: VeloIconType
} & React.ButtonHTMLAttributes<HTMLButtonElement>

function CircularIconButton({
  color = palette.cyan[500],
  hoverColor = palette.cyan[400],
  icon,
  ...rest
}: CircularIconButtonProps) {
  return (
    <button css={style(color, hoverColor)} {...rest}>
      <VeloIcon name={icon} />
    </button>
  )
}

const style = (color: string, hoverColor: string) => css`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.75rem;
  ${resetButton}
  background-color: ${color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
  &:hover,
  &:focus-visible {
    background: ${hoverColor};
  }
  &:focus-visible {
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  }
`

export default CircularIconButton
