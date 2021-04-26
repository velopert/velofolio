import { css } from '@emotion/react'
import { match, NavLink } from 'react-router-dom'
import palette from '../../lib/palette'
import VeloIcon, { VeloIconType } from '../VeloIcon/VeloIcon'
import * as H from 'history'

export type MobilerFooterItemPropsp = {
  icon: VeloIconType
  text: string
  to: string
  isActive?<Params extends { [K in keyof Params]?: string }>(
    match: match<Params> | null,
    location: H.Location
  ): boolean
  ignore?: boolean
}

function MobileFooterItem({
  icon,
  text,
  to,
  isActive,
  ignore,
}: MobilerFooterItemPropsp) {
  return (
    <NavLink
      to={to}
      css={item}
      exact
      isActive={isActive}
      onClick={(e) => {
        if (ignore) {
          e.preventDefault()
        }
      }}
    >
      <VeloIcon name={icon} />
      <span>{text}</span>
    </NavLink>
  )
}

const item = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  svg {
    width: 1rem;
    height: 1rem;
  }
  text-decoration: none;
  span {
    font-size: 0.75rem;
  }

  color: ${palette.blueGrey[400]};

  &.active {
    color: ${palette.cyan[600]};
    border-radius: 0.25rem;
  }
`

export default MobileFooterItem
