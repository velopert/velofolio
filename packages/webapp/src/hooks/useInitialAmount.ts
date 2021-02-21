import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { initialAmountState } from '../atoms/labSettingState'
import useFormattedNumber from './useFormattedNumber'

export default function useInitialAmount() {
  const [initialAmount, setInitialAmount] = useRecoilState(initialAmountState)
  const [value, onChange, setValue] = useFormattedNumber(initialAmount)

  useEffect(() => {
    setInitialAmount(parseInt(value.replace(/[^\d]+/g, ''), 10))
  }, [value])

  useEffect(() => {
    setValue(initialAmount.toLocaleString())
  }, [initialAmount])

  return [value, onChange] as const
}
