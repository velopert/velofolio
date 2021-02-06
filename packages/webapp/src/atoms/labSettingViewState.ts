import { atom, useRecoilValue, useSetRecoilState } from 'recoil'

export type LabSettingViewType = {
  mode: 'default' | 'portfolio'
  selectedPortfolio: number | null
}

export const labSettingViewState = atom<LabSettingViewType>({
  key: 'labSettingModeState',
  default: {
    mode: 'default',
    selectedPortfolio: null,
  },
})

export function useLabSettingView() {
  return useRecoilValue(labSettingViewState)
}

export function useLabSettingViewUpdate() {
  return useSetRecoilState(labSettingViewState)
}
