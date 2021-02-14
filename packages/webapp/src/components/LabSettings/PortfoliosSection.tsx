import { css } from '@emotion/react'
import { usePortfoliosState } from '../../atoms/labSettingState'
import {
  useLabSettingViewActions,
  useLabSettingViewUpdate,
} from '../../atoms/labSettingViewState'
import palette from '../../lib/palette'
import CircularIconButton from '../CircularIconButton'
import LabSettingsSection from './LabSettingsSection'
import PortfolioItem from './PortfolioItem'
export type PortfoliosSectionProps = {}

function PortfoliosSection({}: PortfoliosSectionProps) {
  const { createPortfolio } = useLabSettingViewActions()
  const [portfolios] = usePortfoliosState()
  return (
    <LabSettingsSection title="Portfolios">
      <div css={buttonPositioner}>
        <CircularIconButton icon="plus" onClick={createPortfolio} />
      </div>
      <div css={grid}>
        {portfolios.map((p) => (
          <PortfolioItem key={p.id} assets={p.assets} name={p.name} id={p.id} />
        ))}
      </div>
    </LabSettingsSection>
  )
}

const buttonPositioner = css`
  position: absolute;
  right: 0;
  top: -2rem;
`

const grid = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 1rem;
  row-gap: 1rem;
`

export default PortfoliosSection
