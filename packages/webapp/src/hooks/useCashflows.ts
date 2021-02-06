import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { cashflowsState } from '../atoms/labSettingState'
import useFormattedNumber from './useFormattedNumber'

export function useCashflows() {
  const [cashflows, setCashflows] = useRecoilState(cashflowsState)
  const { enabled, amount, period } = cashflows
  const [value, onChangeAmount, setValue] = useFormattedNumber(1000)

  const onToggle = () => setCashflows({ ...cashflows, enabled: !enabled })
  const onChangePeriod = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCashflows({
      ...cashflows,
      period: e.target.value,
    })
  }

  useEffect(() => {
    setCashflows((cashflows) => ({
      ...cashflows,
      amount: parseInt(value.replace(/[^\d]+/g, ''), 10),
    }))
  }, [value])

  useEffect(() => {
    setValue(amount.toLocaleString())
  }, [amount])

  return {
    formattedAmount: value,
    onChangeAmount,
    period,
    onChangePeriod,
    onToggle,
    enabled,
  }
}
