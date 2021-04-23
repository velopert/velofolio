import { css } from '@emotion/react'
import {
  usePortfoliosAction,
  usePortfoliosState,
} from '../../atoms/labSettingState'
import { useLabSettingViewActions } from '../../atoms/labSettingViewState'
import useOpenPortfolio from '../../hooks/useOpenPortfolio'
import logger from '../../lib/logger'
import CircularIconButton from '../CircularIconButton'
import LabSettingsSection from './LabSettingsSection'
import PortfolioItem from './PortfolioItem'
export type PortfoliosSectionProps = {}

function PortfoliosSection({}: PortfoliosSectionProps) {
  const { createPortfolio } = useLabSettingViewActions()
  const open = useOpenPortfolio()
  const [portfolios] = usePortfoliosState()
  const { append } = usePortfoliosAction()

  const onClick = () => {
    const portfolio = append()
    logger.createPortfolio()
    createPortfolio(portfolio.id)
  }

  return (
    <LabSettingsSection title="Portfolios" extendedSectionStyle={sectionStyle}>
      <div css={buttonPositioner}>
        <CircularIconButton icon="plus" onClick={onClick} />
      </div>
      <div css={grid}>
        {portfolios.map((p) => (
          <PortfolioItem
            key={p.id}
            assets={p.assets}
            name={p.name}
            id={p.id}
            onOpen={open}
          />
        ))}
      </div>
    </LabSettingsSection>
  )
}

const sectionStyle = css`
  flex: 1;
  overflow-y: scroll;
`

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
