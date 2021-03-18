import { atom, useRecoilState } from 'recoil'
import { User } from '../lib/api/types'

const googleTokenState = atom<string | null>({
  key: 'googleTokenState',
  default: null,
})

export const userState = atom<User | null>({
  key: 'userState',
  default: null,
})

export function useGoogleTokenState() {
  return useRecoilState(googleTokenState)
}

export function useUserState() {
  return useRecoilState(userState)
}
