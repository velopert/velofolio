import { useRecoilCallback } from 'recoil'
import { useAssetsActions } from '../atoms/assetsState'
import { labSettingState } from '../atoms/labSettingState'
import { useLabSettingViewActions } from '../atoms/labSettingViewState'

export default function useOpenPortfolio() {
  const { openPortfolio } = useLabSettingViewActions()
  const { set } = useAssetsActions()
  return useRecoilCallback(({ snapshot }) => async (portfolioId: number) => {
    const { portfolios } = await snapshot.getPromise(labSettingState)
    const selected = portfolios.find((p) => p.id === portfolioId)
    if (!selected) return
    openPortfolio(portfolioId)
    set(selected.assets)
  })
}
