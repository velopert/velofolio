import { css } from '@emotion/react'
import palette from '../../lib/palette'
import { resetButton } from '../../lib/styles/resetButton'
export type FooterButtonProps = {
  name: string
}

function FooterButton({ name }: FooterButtonProps) {
  return (
    <div css={block}>
      <button css={footerButton}>{name}</button>
    </div>
  )
}

const block = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`

const footerButton = css`
  ${resetButton}
  margin-left: -2rem;
  margin-right: -2rem;
  margin-bottom: -2rem;
  background: ${palette.cyan[500]};
  display: block;
  height: 3.375rem;
  border-bottom-left-radius: 2rem;
  border-bottom-right-radius: 2rem;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  &:hover,
  &:focus-visible {
    background: ${palette.cyan[400]};
  }
  &:active {
    background: ${palette.cyan[600]};
  }
  font-weight: bold;
`

export default FooterButton
