import { css } from '@emotion/react'
import { useMemo } from 'react'
import chartColors from '../../lib/chartColors'
import palette from '../../lib/palette'
export type FallbackStockLogoProps = {
  name: string
}

function FallbackStockLogo({ name }: FallbackStockLogoProps) {
  const char = name.charAt(0)
  const charsum = useMemo(() => {
    return [...name]
      .map((char) => char.charCodeAt(0))
      .reduce((acc, current) => acc + current, 0)
  }, [name])

  const color = chartColors[charsum % chartColors.length]
  return <div css={style(color)}>{char.toLocaleUpperCase()}</div>
}

const style = (bgColor: string) => css`
  background: ${bgColor};
  width: 1.5rem;
  height: 1.5rem;
  border: 0.0625rem solid ${palette.blueGrey[100]};
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  line-height: 1;
  flex-shrink: 0;
`

export default FallbackStockLogo
