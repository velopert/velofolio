import { css } from '@emotion/react'
import CircularIconButton from '../CircularIconButton'
import LabSettingsSection from './LabSettingsSection'
export type PortfoliosSectionProps = {}

function PortfoliosSection({}: PortfoliosSectionProps) {
  return (
    <LabSettingsSection title="Portfolios">
      <div css={buttonPositioner}>
        <CircularIconButton icon="plus" />
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
