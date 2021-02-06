import { css } from '@emotion/react'
import { useState } from 'react'
import { useCashflows } from '../../hooks/useCashflows'
import useFormattedNumber from '../../hooks/useFormattedNumber'
import CheckBox from '../CheckBox'
import Input from '../Input'
import Selector from '../Selector'
import LabSettingsSection from './LabSettingsSection'

export type CashflowsSectionProps = {}

function CashflowsSection({}: CashflowsSectionProps) {
  const {
    enabled,
    onToggle,
    formattedAmount,
    onChangeAmount,
    period,
    onChangePeriod,
  } = useCashflows()

  return (
    <LabSettingsSection title="Cashflows">
      <div css={block}>
        <CheckBox value={enabled} onToggle={onToggle} />
        <div css={group}>
          <Input
            css={input}
            prefix="$"
            size={3}
            value={formattedAmount}
            onChange={onChangeAmount}
            disabled={!enabled}
          />
          <Selector
            css={selector}
            options={['Monthly', 'Quaterly', 'Semi-anually', 'Anually']}
            value={period}
            onChange={onChangePeriod}
            disabled={!enabled}
          />
        </div>
      </div>
    </LabSettingsSection>
  )
}

const block = css`
  display: flex;
  align-items: center;
`

const group = css`
  flex: 1;
  display: flex;
  min-width: 0;
  margin-left: 0.5rem;
`

const input = css`
  width: 10.25rem;
`

const selector = css`
  margin-left: 0.5rem;
  width: 12rem;
`

export default CashflowsSection
