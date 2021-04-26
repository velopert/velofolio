import { css } from '@emotion/react'
import { useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { circleLogo } from '../../assets/images'
import { useUserState } from '../../atoms/authState'
import useAuth from '../../hooks/useAuth'
import palette from '../../lib/palette'
import media from '../../lib/styles/media'
import { resetButton } from '../../lib/styles/resetButton'
import RootPortal from '../RootPortal'
import SiginInModal from '../SignInModal'
import VeloIcon from '../VeloIcon'
import VerticalBarItem from './VerticalBarItem'
export type VerticalBarProps = {}

function VerticalBar({}: VerticalBarProps) {
  const match = useRouteMatch()
  const [signInModalVisible, setSignInModalVisible] = useState(false)
  const { logout } = useAuth()

  const onClickLogin = () => {
    setSignInModalVisible(true)
  }

  const [user] = useUserState()

  return (
    <div css={bar}>
      <div css={endBlock('top')}>
        <img src={circleLogo} alt="small logo" className="logo" />
      </div>
      <div css={links}>
        <VerticalBarItem
          icon="flask"
          text="Lab"
          to="/"
          isActive={() => {
            return ['/backtests/:id', '/'].includes(match.path)
          }}
          ignore={['/backtests/:id', '/'].includes(match.path)}
        />
        <VerticalBarItem icon="workspace" text="Workspace" to="/workspace" />
        <VerticalBarItem icon="globe" text="Explore" to="/explore" />
      </div>
      <div css={endBlock('bottom')}>
        {user ? (
          <div css={userInfo}>
            <img src={user.photo_url ?? ''} alt="user" />
            <div className="logout" tabIndex={0} onClick={logout}>
              Sign out
            </div>
          </div>
        ) : (
          <button css={loginButton} onClick={onClickLogin}>
            <VeloIcon name="user_circle" />
            <span>Sign in</span>
          </button>
        )}
      </div>
      {signInModalVisible && (
        <RootPortal>
          <SiginInModal onClose={() => setSignInModalVisible(false)} />
        </RootPortal>
      )}
    </div>
  )
}

const bar = css`
  display: none;
  ${media.xlarge} {
    display: flex;
  }
  flex-direction: column;

  padding-top: 2rem;
  padding-bottom: 2rem;
  flex: 1;
  align-items: center;
  .logo {
    width: 2.5rem;
    height: 2.5rem;
  }
`

const links = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 100%;
`

const endBlock = (position: 'top' | 'bottom') => css`
  height: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${position === 'top' ? 'flex-start' : 'flex-end'};
`

const loginButton = css`
  ${resetButton}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  svg {
    width: 1.75rem;
    height: 1.75rem;
  }
  span {
    font-size: 0.75rem;
    margin-top: 0.5rem;
  }
  color: ${palette.blueGrey[900]};
  &:hover {
    color: ${palette.blueGrey[800]};
  }
`

const userInfo = css`
  img {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    display: block;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .logout {
    display: inline-block;
    text-decoration: underline;
    margin-top: 0.25rem;
    font-size: 0.75rem;
    color: ${palette.blueGrey[400]};
    cursor: pointer;
    outline: none;
    &:hover,
    &:focus-visible {
      color: ${palette.blueGrey[300]};
    }
    &:focus-visible {
      outline: 1px solid ${palette.cyan[600]};
    }
  }
`

export default VerticalBar
