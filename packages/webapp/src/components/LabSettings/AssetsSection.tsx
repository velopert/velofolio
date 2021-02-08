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
        onBlur={(e) => {
          e.persist()
          const relatedTarget = e.relatedTarget as HTMLElement | null
          if (relatedTarget && relatedTarget.dataset.type === 'ticker-item') {
            return
          }
          onBlur()
        }}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <SymbolAutocomplete visible={open} keyword={keyword} />
    </LabSettingsSection>
  )
}

export default AssetsSection
