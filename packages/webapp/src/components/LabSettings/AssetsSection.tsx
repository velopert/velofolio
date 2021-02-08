import { css } from '@emotion/react'
import { useState } from 'react'
import Input from '../Input'
import LabSettingsSection from './LabSettingsSection'
import SymbolAutocomplete from './SymbolAutocomplete'
export type AssetsSectionProps = {}

function AssetsSection({}: AssetsSectionProps) {
  const [keyword, setKeyword] = useState('')
  const [open, setOpen] = useState(false)

  const onFocus = () => setOpen(true)
  const onBlur = () => setOpen(false)

  return (
    <LabSettingsSection title="Assets">
      <Input
        placeholder="Ticker Symbol  e.g. AAPL"
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {keyword !== '' && <SymbolAutocomplete visible={open} />}
    </LabSettingsSection>
  )
}

export default AssetsSection
