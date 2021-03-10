import { useEffect, useMemo } from 'react'
import {
  usePortfolioNameState,
  useRebalancingState,
} from '../atoms/labSettingState'
import { useLabSettingView } from '../atoms/labSettingViewState'
import { periodOptions } from '../lib/constants'

export default function usePortfolioOptionState() {
  const { selectedPortfolioId } = useLabSettingView()
  const [name, setValue] = usePortfolioNameState(selectedPortfolioId!)

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

  useEffect(() => {}, [name])

  return {
    name,
    rebalancing,
    onChangeName,
    onChangeRebalancing,
    rebalancingOptions,
  }
}
