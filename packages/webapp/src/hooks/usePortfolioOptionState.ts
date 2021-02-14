import { useMemo, useState } from 'react'
import { useNextPortfolioIdState } from '../atoms/labSettingState'
import { useLabSettingView } from '../atoms/labSettingViewState'
import { periodOptions } from '../lib/constants'

export default function usePortfolioOptionState() {
  const [nextId] = useNextPortfolioIdState()
  const { selectedPortfolio } = useLabSettingView()
  const [name, setValue] = useState(
    selectedPortfolio ? '' : `Portfolio ${nextId}`
  )
  const [rebalancing, setRebalancing] = useState('Anually')

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
