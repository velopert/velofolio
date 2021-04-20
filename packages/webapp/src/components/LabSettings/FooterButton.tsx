import { css } from '@emotion/react'
import palette from '../../lib/palette'
import { resetButton } from '../../lib/styles/resetButton'
import Spinner from '../Spinner'
export type FooterButtonProps = {
  loading?: boolean
  name: string
  onClick(): void
}

function FooterButton({ name, onClick, loading }: FooterButtonProps) {
  return (
    <button css={footerButton(!!loading)} onClick={onClick}>
      {loading ? <Spinner color="white" size="1.5rem" /> : name}
    </button>
  )
}

const block = css``

const footerButton = (loading: boolean) => css`
  ${resetButton}
  ${loading &&
  css`
    padding-top: 0.25rem;
  `}
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
