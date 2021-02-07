import { css } from '@emotion/react'

export type SymbolAutocompleteProps = {
  visible: boolean
}

function SymbolAutocomplete({ visible }: SymbolAutocompleteProps) {
  if (!visible) return null
  return (
    <div css={wrapper}>
      <div css={block}></div>
    </div>
  )
}

const wrapper = css`
  position: relative;
`
const block = css`
  position: absolute;
  width: 100%;
  height: 14.25rem;
  background: white;
  box-shadow: 0rem 0.25rem 0.5rem rgba(0, 0, 0, 0.07);
  border-radius: 0.5rem;
`

export default SymbolAutocomplete
