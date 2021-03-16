import { atom, useRecoilState } from 'recoil'

const hasCreatedAccount = atom<boolean>({
  key: 'hasCreatedAccount',
  default: false,
})

export function useHasCreatedAccountState() {
  return useRecoilState(hasCreatedAccount)
}
