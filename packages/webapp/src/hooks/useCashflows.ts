import { useEffect } from 'react'
import { useCashflowState } from '../atoms/labSettingState'
import useFormattedNumber from './useFormattedNumber'

export function useCashflows() {
  const [cashflows, setCashflows] = useCashflowState()
  const { enabled, amount, period } = cashflows
  const [value, onChangeAmount, setValue] = useFormattedNumber(amount)

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
  }, [value, setCashflows])

  useEffect(() => {
    setValue(amount.toLocaleString())
  }, [amount, setValue])

  return {
    formattedAmount: value,
    onChangeAmount,
    period,
    onChangePeriod,
    onToggle,
    enabled,
  }
}
