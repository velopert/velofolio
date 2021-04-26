import { css } from '@emotion/react'
import { match, NavLink } from 'react-router-dom'
import palette from '../../lib/palette'
import VeloIcon, { VeloIconType } from '../VeloIcon/VeloIcon'
import * as H from 'history'

export type VerticalBarItemProps = {
  icon: VeloIconType
  text: string
  to: string
  isActive?<Params extends { [K in keyof Params]?: string }>(
    match: match<Params> | null,
    location: H.Location
  ): boolean
  ignore?: boolean
}

function VerticalBarItem({
  icon,
  text,
  to,
  isActive,
  ignore,
}: VerticalBarItemProps) {
  return (
    <NavLink to={to} css={item} exact>
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
  height: 5rem;
  svg {
    width: 1.75rem;
    height: 1.75rem;
  }
  text-decoration: none;
  span {
    font-size: 0.75rem;
    margin-top: 0.5rem;
  }

  color: ${palette.blueGrey[600]};

  &:hover {
    color: ${palette.blueGrey[500]};
  }

  &.active {
    background: ${palette.blueGrey[50]};
    color: ${palette.blueGrey[900]};
    border-radius: 0.25rem;
  }
`

export default VerticalBarItem
