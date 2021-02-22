import { useMemo, useState } from 'react'
import {
  useNextPortfolioIdState,
  usePortfoliosState,
  useRebalancingState,
} from '../atoms/labSettingState'
import { useLabSettingView } from '../atoms/labSettingViewState'
import { periodOptions } from '../lib/constants'

export default function usePortfolioOptionState() {
  const [nextId] = useNextPortfolioIdState()
  const [portfolios] = usePortfoliosState()
  const { selectedPortfolioId } = useLabSettingView()
  const selectedPortfolio = useMemo(() => {
    return portfolios.find((p) => p.id === selectedPortfolioId)
  }, [portfolios, selectedPortfolioId])

  const [name, setValue] = useState(
    selectedPortfolio?.name ?? `Portfolio ${nextId}`
  )

  const [rebalancing, setRebalancing] = useRebalancingState(
    selectedPortfolioId!
  )

  const rebalancingOptions = useMemo(
    () => ['No Rebalancing', ...periodOptions],
    []
  )

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const onChangeRebalancing = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRebalancing(e.target.value)
  }

  return {
    name,
    rebalancing,
    onChangeName,
    onChangeRebalancing,
    rebalancingOptions,
  }
}
