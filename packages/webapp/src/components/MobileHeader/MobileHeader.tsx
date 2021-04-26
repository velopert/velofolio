import React, { useState } from 'react'
import { css } from '@emotion/react'
import { logo } from '../../assets/images'
import media from '../../lib/styles/media'
import { resetButton } from '../../lib/styles/resetButton'
import palette from '../../lib/palette'
import VeloIcon from '../VeloIcon'
import { Link, useRouteMatch } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import SiginInModal from '../SignInModal'
import { useUserState } from '../../atoms/authState'
import { useGlobalDialogActions } from '../../atoms/globalDialogState'
export type MobileHeaderProps = {}

function MobileHeader({}: MobileHeaderProps) {
  const match = useRouteMatch()
  const [signInModalVisible, setSignInModalVisible] = useState(false)
  const { logout } = useAuth()
  const [user] = useUserState()
  const { open } = useGlobalDialogActions()

  const askLogout = () => {
    open({
      title: 'Sign out',
      message: 'Do you want to sign out?',
      onConfirm: logout,
      showCancel: true,
      cancelText: 'No',
      confirmText: 'Yes',
    })
  }

  const onClickLogin = () => {
    setSignInModalVisible(true)
  }

  return (
    <>
      <header css={[common, headerStyle]}>
        <Link to="/">
          <img src={logo} className="logo" alt="logo" />
        </Link>
        <div css={headerRightWrapper}>
          <div css={headerRight}>
            {user ? (
              <img
                src={user.photo_url ?? ''}
                alt="user"
                onClick={askLogout}
                css={userImage}
              />
            ) : (
              <button css={loginButton} onClick={onClickLogin}>
                <VeloIcon name="user_circle" />
              </button>
            )}
          </div>
        </div>
      </header>
      <div css={[common, headerPlacer]}></div>
      {signInModalVisible && (
        <SiginInModal onClose={() => setSignInModalVisible(false)} />
      )}
    </>
  )
}

const common = css`
  display: none;
  ${media.small} {
    display: flex;
  }
  height: 4rem;
`

const headerStyle = css`
  position: fixed;

  align-items: center;
  justify-content: center;
  width: 100%;
  background: white;
  z-index: 30;
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.125);
  a {
    display: block;
  }
`

const headerPlacer = css`
  height: 4rem;
`

const headerRightWrapper = css`
  position: absolute;
  top: 0;
  right: 0;
`

const headerRight = css`
  display: flex;
  align-items: center;
  height: 4rem;
  padding-right: 1rem;
`

const loginButton = css`
  ${resetButton}
  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: ${palette.blueGrey[900]};
  }
`

const userImage = css`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
`

export default MobileHeader
