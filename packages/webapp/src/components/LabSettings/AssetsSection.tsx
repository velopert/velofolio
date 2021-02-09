import { css } from '@emotion/react'
import { useRef, useState } from 'react'
import useOnClickOutside from 'use-onclickoutside'
import useTickerAutocomplete from '../../hooks/useTickerAutocomplete'
import Input from '../Input'
import LabSettingsSection from './LabSettingsSection'
import SymbolAutocomplete from './SymbolAutocomplete'
import { useDebounce } from 'use-debounce'

export type AssetsSectionProps = {}

function AssetsSection({}: AssetsSectionProps) {
  const [keyword, setKeyword] = useState('')
  const [debouncedKeyword] = useDebounce(keyword, 400)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const { results, goUp, goDown, selectedIndex } = useTickerAutocomplete(
    debouncedKeyword
  )

  const onFocus = () => setOpen(true)
  const onBlur = () => setOpen(false)
  const onClose: Parameters<typeof useOnClickOutside>[1] = (e) => {
    if (ref.current === e.target || ref.current?.contains(e.target as Node)) {
      return
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) return
    e.preventDefault()
    if (e.key === 'ArrowDown') {
      goDown()
    } else if (e.key === 'ArrowUp') {
      goUp()
    } else if (e.key === 'Enter') {
      console.log(results?.[selectedIndex])
    }
  }

  return (
    <LabSettingsSection title="Assets">
      <div ref={ref}>
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
          onKeyDown={onKeyDown}
        />
        <SymbolAutocomplete
          visible={open}
          results={results}
          onClose={onClose}
          selectedIndex={selectedIndex}
        />
      </div>
    </LabSettingsSection>
  )
}

export default AssetsSection
