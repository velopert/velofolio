import { css } from '@emotion/react'
import { NavLink } from 'react-router-dom'
import palette from '../../lib/palette'
import VeloIcon, { VeloIconType } from '../VeloIcon/VeloIcon'

export type SidebarItemProps = {
  icon: VeloIconType
  text: string
  to: string
}

function SidebarItem({ icon, text, to }: SidebarItemProps) {
  return (
    <li css={itemStyle}>
      <NavLink to={to} css={linkStyle} exact>
        <VeloIcon name={icon} />
        <span>{text}</span>
      </NavLink>
    </li>
  )
}

const itemStyle = css``

const linkStyle = css`
  border-radius: 0.5rem;
  height: 3.75rem;
  display: flex;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
  color: ${palette.blueGrey[600]};
  text-decoration: none;

  &:hover {
    background: ${palette.blueGrey[50]};
  }
  svg {
    width: 1.75rem;
    height: 1.75rem;
  }
  span {
    font-size: 1.125rem;
    margin-left: 1rem;
  }

  &.active {
    background: ${palette.blueGrey[50]};
    color: ${palette.blueGrey[900]};
    span {
      font-weight: bold;
    }
  }
`

export default SidebarItem
