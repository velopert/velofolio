import React from 'react'
import * as svg from './svg'

export type VeloIconType = keyof typeof svg
export type VeloIconProps = {
  name: VeloIconType
  className?: string
  style?: React.CSSProperties
}

function VeloIcon({ name, className, style }: VeloIconProps) {
  return React.createElement(svg[name], {
    className,
    style,
  })
}

export default VeloIcon
