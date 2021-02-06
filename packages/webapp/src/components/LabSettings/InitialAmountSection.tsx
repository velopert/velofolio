import { css } from '@emotion/react'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { initialAmountState } from '../../atoms/labSettingState'
import useFormattedNumber from '../../hooks/useFormattedNumber'
import useInitialAmount from '../../hooks/useInitialAmount'
import Input from '../Input'
import LabSettingsSection from './LabSettingsSection'
export type InitialAmountSectionProps = {}

function InitialAmountSection({}: InitialAmountSectionProps) {
  const [value, onChange] = useInitialAmount()

  return (
    <LabSettingsSection title="Initial Amount">
      <Input
        prefix="$"
        placeholder="10,000"
        onChange={onChange}
        value={value}
      />
    </LabSettingsSection>
  )
}

export default InitialAmountSection
