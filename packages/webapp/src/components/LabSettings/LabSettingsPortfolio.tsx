import React from 'react'
import { css } from '@emotion/react'
import VeloIcon from '../VeloIcon'
import { resetButton } from '../../lib/styles/resetButton'
import palette from '../../lib/palette'
import { useLabSettingViewActions } from '../../atoms/labSettingViewState'
export type LabSettingsPortfolioProps = {}

function LabSettingsPortfolio({}: LabSettingsPortfolioProps) {
  const { closePortfolio } = useLabSettingViewActions()
  return (
    <div css={block}>
      <button css={backButton} onClick={closePortfolio}>
        <VeloIcon name="arrow_back" />
      </button>
    </div>
  )
}

const block = css``
const backButton = css`
  ${resetButton}
  color: ${palette.blueGrey[600]};
  cursor: pointer;
  &:hover {
    color: ${palette.blueGrey[800]};
  }
  :focus-visible {
    color: ${palette.blueGrey[800]};
  }
`

export default LabSettingsPortfolio
