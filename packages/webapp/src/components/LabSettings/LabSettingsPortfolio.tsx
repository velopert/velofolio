import React, { useMemo } from 'react'
import { css } from '@emotion/react'
import VeloIcon from '../VeloIcon'
import { resetButton } from '../../lib/styles/resetButton'
import palette from '../../lib/palette'
import {
  useLabSettingView,
  useLabSettingViewActions,
} from '../../atoms/labSettingViewState'
import LabSettingsSection from './LabSettingsSection'
import Input from '../Input'
import Selector from '../Selector'
import { periodOptions } from '../../lib/constants'
import usePortfolioOptionState from '../../hooks/usePortfolioOptionState'
import AssetsSection from './AssetsSection'
import FooterButton from './FooterButton'
import { useAssetsState } from '../../atoms/assetsState'
import {
  usePortfoliosAction,
  usePortfoliosState,
} from '../../atoms/labSettingState'
export type LabSettingsPortfolioProps = {}

function LabSettingsPortfolio({}: LabSettingsPortfolioProps) {
  const { closePortfolio } = useLabSettingViewActions()
  const { isCreating } = useLabSettingView()
  const {
    name,
    rebalancing,
    onChangeName,
    onChangeRebalancing,
    rebalancingOptions,
  } = usePortfolioOptionState()
  const { cancelPortfolioCreate } = usePortfoliosAction()

  const [assets] = useAssetsState()

  const onSubmit = () => {
    if (assets.length === 0) {
      // TODO: empty assets
      return
    }
    if (name === '') {
      // TODO: empty name
      return
    }

    closePortfolio()
  }

  const onCancel = () => {
    if (isCreating) {
      cancelPortfolioCreate()
    }
    closePortfolio()
  }

  return (
    <div css={block}>
      <button css={backButton} onClick={onCancel}>
        <VeloIcon name="arrow_back" />
      </button>
      <LabSettingsSection title="Portfolio Name">
        <Input
          placeholder="Portfolio Name"
          value={name}
          onChange={onChangeName}
        />
      </LabSettingsSection>
      <LabSettingsSection title="Rebalancing">
        <Selector
          options={rebalancingOptions}
          value={rebalancing}
          onChange={onChangeRebalancing}
        />
      </LabSettingsSection>
      <AssetsSection />
      <FooterButton name="OK" onClick={onSubmit} />
    </div>
  )
}

const block = css`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const backButton = css`
  align-self: flex-start;
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
