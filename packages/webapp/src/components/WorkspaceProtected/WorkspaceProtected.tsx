import { css } from '@emotion/react'
import { undrawAuthentication } from '../../assets/images'
import palette from '../../lib/palette'
import GoogleLoginButton from '../GoogleLoginButton'
export type WorkspaceProtectedProps = {}

function WorkspaceProtected({}: WorkspaceProtectedProps) {
  return (
    <div css={fullScreen}>
      <img src={undrawAuthentication} alt="need login vector image" />
      <h2>Please sign in to list your saved backtests</h2>
    </div>
  )
}

const fullScreen = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: absolute;
  top: 0;
  width: calc(100% - 16.25rem);
  flex-direction: column;
  img {
    width: 25rem;
    height: auto;
  }
  h2 {
    margin-top: 3rem;
    color: ${palette.blueGrey[700]};
    font-weight: normal;
    font-size: 2.5rem;
  }
`

export default WorkspaceProtected
