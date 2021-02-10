import { useCallback } from 'react'
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

export function useLabSettingViewActions() {
  const update = useLabSettingViewUpdate()

  const createPortfolio = useCallback(() => {
    update((prevValue) => ({
      ...prevValue,
      mode: 'portfolio',
      selectedPortfolio: null,
    }))
  }, [update])

  const openPortfolio = useCallback(
    (portfolioId: number) => {
      update((prevValue) => ({
        ...prevValue,
        mode: 'portfolio',
        selectedPortfolio: portfolioId,
      }))
    },
    [update]
  )

  const closePortfolio = useCallback(() => {
    update((prevValue) => ({ ...prevValue, mode: 'default' }))
  }, [update])

  return {
    createPortfolio,
    openPortfolio,
    closePortfolio,
  }
}
