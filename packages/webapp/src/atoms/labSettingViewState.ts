import { useCallback } from 'react'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import { useAssetsActions } from './assetsState'

export type LabSettingViewType = {
  mode: 'default' | 'portfolio'
  selectedPortfolioId: number | null
}

export const labSettingViewState = atom<LabSettingViewType>({
  key: 'labSettingModeState',
  default: {
    mode: 'default',
    selectedPortfolioId: null,
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

  const createPortfolio = useCallback(
    (portfoliodId: number) => {
      update((prevValue) => ({
        ...prevValue,
        mode: 'portfolio',
        selectedPortfolioId: portfoliodId,
      }))
    },
    [update]
  )

  const openPortfolio = useCallback(
    (portfolioId: number) => {
      update((prevValue) => ({
        ...prevValue,
        mode: 'portfolio',
        selectedPortfolioId: portfolioId,
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
