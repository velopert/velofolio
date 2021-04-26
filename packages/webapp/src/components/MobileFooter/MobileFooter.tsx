import React from 'react'
import { css } from '@emotion/react'
import media from '../../lib/styles/media'
import { resetButton } from '../../lib/styles/resetButton'
import MobileFooterItem from './MobileFooterItem'
import { useRouteMatch } from 'react-router-dom'
export type MobileFooterProps = {}

function MobileFooter({}: MobileFooterProps) {
  const match = useRouteMatch()

  return (
    <>
      <footer css={[common, footerStyle]}>
        <MobileFooterItem
          icon="flask"
          text="Lab"
          to="/"
          isActive={() => {
            return ['/backtests/:id', '/'].includes(match.path)
          }}
          ignore={['/backtests/:id', '/'].includes(match.path)}
        />
        <MobileFooterItem icon="workspace" text="Workspace" to="/workspace" />
        <MobileFooterItem icon="globe" text="Explore" to="/explore" />
      </footer>
      <div css={[common]}></div>
    </>
  )
}

const common = css`
  display: none;
  ${media.small} {
    display: flex;
  }
  height: 4rem;
  width: 100%;
`
const footerStyle = css`
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 30;
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.125);
  background: white;
`

export default MobileFooter
