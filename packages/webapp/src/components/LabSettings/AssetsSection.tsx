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
import useAssetQuery, {
  useAssetQuerySetter,
} from '../../hooks/query/useAssetQuery'
import { getAsset } from '../../lib/api/assets/getAsset'
import { useAssetDetailsActions } from '../../atoms/assetDetailsState'

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
  const set = useAssetQuerySetter()
  const inputRef = useRef<HTMLInputElement>(null)
  const { loadTicker } = useAssetDetailsActions()

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

  const appendWhenTickerExists = async () => {
    try {
      setOpen(false)
      setKeyword('')
      const asset = await loadTicker(keyword.toLocaleUpperCase())
      set(keyword, asset)
      const { id, image, ticker } = asset
      append({
        id,
        image,
        ticker,
        weight: 1,
      })
    } catch (e) {}
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
      if (selectedIndex === -1) {
        appendWhenTickerExists()
        return
      }
      if (!selectedTicker) return
      const { id, image, ticker } = selectedTicker
      loadTicker(ticker)
      append({
        id,
        image,
        ticker,
        weight: 1,
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

  const focusInput = () => {
    inputRef.current?.focus()
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
          ref={inputRef}
        />
        <SymbolAutocomplete
          visible={open}
          results={results}
          onClose={onClose}
          selectedIndex={selectedIndex}
        />
      </div>
      <AssetsTable focusInput={focusInput} />
    </LabSettingsSection>
  )
}

export default AssetsSection
