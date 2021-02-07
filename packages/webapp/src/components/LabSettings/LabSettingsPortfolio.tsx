import React, { useMemo } from 'react'
import { css } from '@emotion/react'
import VeloIcon from '../VeloIcon'
import { resetButton } from '../../lib/styles/resetButton'
import palette from '../../lib/palette'
import { useLabSettingViewActions } from '../../atoms/labSettingViewState'
import LabSettingsSection from './LabSettingsSection'
import Input from '../Input'
import Selector from '../Selector'
import { periodOptions } from '../../lib/constants'
export type LabSettingsPortfolioProps = {}

function LabSettingsPortfolio({}: LabSettingsPortfolioProps) {
  const { closePortfolio } = useLabSettingViewActions()

  const rebalancingOptions = useMemo(
    () => ['No Rebalancing', ...periodOptions],
    []
  )
  return (
    <div css={block}>
      <button css={backButton} onClick={closePortfolio}>
        <VeloIcon name="arrow_back" />
      </button>
      <LabSettingsSection title="Portfolio Name">
        <Input placeholder="Portfolio Name" />
      </LabSettingsSection>
      <LabSettingsSection title="Rebalancing">
        <Selector
          options={rebalancingOptions}
          value={'Anually'}
          onChange={() => {}}
        />
      </LabSettingsSection>
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
  margin-bottom: 1.5rem;
`

export default LabSettingsPortfolio
