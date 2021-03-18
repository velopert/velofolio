import { css } from '@emotion/react'
import { useUserState } from '../../atoms/authState'
import useAuth from '../../hooks/useAuth'
import palette from '../../lib/palette'
export type CurrentUserInfoProps = {}

function CurrentUserInfo({}: CurrentUserInfoProps) {
  const [user] = useUserState()
  const { logout } = useAuth()
  if (!user) return null
  return (
    <div css={block}>
      <img src={user.photo_url || ''} alt="" />
      <div className="info">
        <div className="name">{user.display_name}</div>
        <div className="logout" tabIndex={0} onClick={logout}>
          Sign out
        </div>
      </div>
    </div>
  )
}

const block = css`
  display: flex;
  align-items: center;
  img {
    display: block;
    width: 3rem;
    height: 3rem;
    margin-right: 0.75rem;
    background: ${palette.blueGrey[200]};
    border-radius: 1.5rem;
  }
  .info {
    .name {
      font-size: 1rem;
      font-weight: 600;
      color: ${palette.blueGrey[800]};
    }
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
  }
`

export default CurrentUserInfo
