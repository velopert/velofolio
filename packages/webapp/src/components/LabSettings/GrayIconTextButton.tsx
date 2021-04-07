import { css } from '@emotion/react'

import palette from '../../lib/palette'
import VeloIcon from '../VeloIcon'
import { VeloIconType } from '../VeloIcon/VeloIcon'

export type GrayIconTextButtonProps = {
  icon: VeloIconType
  text: string
  onClick(): void
}

function GrayIconTextButton({ icon, text, onClick }: GrayIconTextButtonProps) {
  return (
    <button css={block} onClick={onClick}>
      <VeloIcon name={icon} />
      {text}
    </button>
  )
}

const block = css`
  background: none;
  outline: none;
  border: none;
  font-size: 0.875rem;
  color: #a6a6a6;
  display: flex;
  align-items: center;
  cursor: pointer;

  letter-spacing: -0.005rem;
  font-weight: bold;
  svg {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }
  &:hover {
    color: ${palette.grey[800]};
  }
`
export default GrayIconTextButton
