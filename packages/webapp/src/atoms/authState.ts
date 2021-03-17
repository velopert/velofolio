import { atom, useRecoilState } from 'recoil'

const googleTokenState = atom<string | null>({
  key: 'googleTokenState',
  default: null,
})

export function useGoogleTokenState() {
  return useRecoilState(googleTokenState)
}
