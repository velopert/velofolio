import { css } from '@emotion/react'
import { useRouteMatch } from 'react-router-dom'
import { useUserState } from '../../atoms/authState'
import palette from '../../lib/palette'
import CurrentUserInfo from '../CurrentUserInfo'
import GoogleLoginButton from '../GoogleLoginButton/GoogleLoginButton'
import SidebarItem from '../SidebarItem'

export type SidebarProps = {}

function Sidebar({}: SidebarProps) {
  const [user] = useUserState()
  const match = useRouteMatch()

  return (
    <div css={sidebarStyle}>
      <div className="logo">velofolio</div>
      <ul css={menuStyle}>
        <SidebarItem
          icon="flask"
          text="Lab"
          to="/"
          isActive={() => {
            return ['/backtests/:id', '/'].includes(match.path)
          }}
          ignore={['/backtests/:id', '/'].includes(match.path)}
        />
        <SidebarItem icon="workspace" text="Workspace" to="/workspace" />
        <SidebarItem icon="globe" text="Explore" to="/explore" />
      </ul>
      {user ? <CurrentUserInfo /> : <GoogleLoginButton />}
    </div>
  )
}

const sidebarStyle = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  .logo {
    font-weight: bold;
    font-size: 1.5rem;
    color: ${palette.blueGrey[900]};
  }
`

const menuStyle = css`
  list-style: none;
  padding: 0;
  margin-top: 5.625rem;
  margin-left: -1rem;
  flex: 1;
`

export default Sidebar
