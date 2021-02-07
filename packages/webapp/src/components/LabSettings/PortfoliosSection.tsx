import { css } from '@emotion/react'
import {
  useLabSettingViewActions,
  useLabSettingViewUpdate,
} from '../../atoms/labSettingViewState'
import CircularIconButton from '../CircularIconButton'
import LabSettingsSection from './LabSettingsSection'
export type PortfoliosSectionProps = {}

function PortfoliosSection({}: PortfoliosSectionProps) {
  const { createPortfolio } = useLabSettingViewActions()
  return (
    <LabSettingsSection title="Portfolios">
      <div css={buttonPositioner}>
        <CircularIconButton icon="plus" onClick={createPortfolio} />
      </div>
    </LabSettingsSection>
  )
}

const buttonPositioner = css`
  position: absolute;
  right: 0;
  top: -2rem;
`

export default PortfoliosSection
