import React from 'react'
import { css } from '@emotion/react'
import palette from '../../lib/palette'
import GoogleLoginButton from '../GoogleLoginButton'
import { undrawLogin } from '../../assets/images'
import VeloIcon from '../VeloIcon'
import { resetButton } from '../../lib/styles/resetButton'
export type SiginInModalProps = {
  onClose(): void
}

function SiginInModal({ onClose }: SiginInModalProps) {
  return (
    <>
      <div css={overlay}></div>
      <div css={centerWrapper}>
        <div css={whiteBox}>
          <button css={close} onClick={onClose}>
            <VeloIcon name="close" />
          </button>

          <h3>Hello,</h3>
          <img alt="login" src={undrawLogin} />
          <div className="button-wrapper" onClick={onClose}>
            <GoogleLoginButton />
          </div>
        </div>
      </div>
    </>
  )
}

const overlay = css`
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  left: 0;
  top: 0;
  z-index: 10;
`

const centerWrapper = css`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 20;
`

const whiteBox = css`
  position: relative;
  width: 380px;
  padding: 3rem 1.5rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0px 1rem 1rem rgba(67, 67, 67, 0.03);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${palette.blueGrey[900]};
  h3 {
    margin: 0;
    font-size: 1.5rem;
    text-align: center;
  }
  img {
    margin-top: 2rem;
    margin-bottom: 2rem;
    height: 9.625rem;
    object-fit: contain;
    width: 16rem;
  }
  .button-wrapper {
    width: 16rem;
  }
`

const close = css`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  cursor: pointer;
  width: 1rem;
  height: 1rem;
  svg {
    width: 1rem;
    height: 1rem;
  }
  color: ${palette.blueGrey[600]};
  ${resetButton}
`

export default SiginInModal
