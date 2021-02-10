import { css } from '@emotion/react'
import { useEffect, useRef, useState } from 'react'
import useOnClickOutside from 'use-onclickoutside'
import useTickerAutocomplete from '../../hooks/useTickerAutocomplete'
import Input from '../Input'
import LabSettingsSection from './LabSettingsSection'
import SymbolAutocomplete from './SymbolAutocomplete'
import { useDebounce } from 'use-debounce'
import AssetsTable from './AssetsTable'
import {
  useAssetsActions,
  useResetAssetsUnmountEffect,
} from '../../atoms/assetsState'

export type AssetsSectionProps = {}

function AssetsSection({}: AssetsSectionProps) {
  const [keyword, setKeyword] = useState('')
  const [debouncedKeyword] = useDebounce(keyword, 400)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { append } = useAssetsActions()
  const { results, goUp, goDown, selectedIndex, reset } = useTickerAutocomplete(
    debouncedKeyword
  )
  useResetAssetsUnmountEffect()
  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

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
      const selectedTicker = results?.[selectedIndex]
      if (!selectedTicker) return
      const { id, image, ticker } = selectedTicker
      append({
        id,
        image,
        ticker,
        weight: 0,
      })
      setKeyword('')
      setOpen(false)
      if (results?.[selectedIndex]) console.log(results?.[selectedIndex])
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== '' && !open) {
      setOpen(true)
    }
    setKeyword(e.target.value)
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
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        <SymbolAutocomplete
          visible={open}
          results={results}
          onClose={onClose}
          selectedIndex={selectedIndex}
        />
      </div>
      <AssetsTable />
    </LabSettingsSection>
  )
}

export default AssetsSection
