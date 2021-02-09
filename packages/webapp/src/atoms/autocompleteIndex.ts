import { atom, useRecoilState, useResetRecoilState } from 'recoil'

export const autocompleteIndex = atom<number>({
  key: 'autocompleteIndex',
  default: -1,
})

export function useAutocompleteIndex() {
  return useRecoilState(autocompleteIndex)
}

export function useResetAutocompleteIndex() {
  return useResetRecoilState(autocompleteIndex)
}
