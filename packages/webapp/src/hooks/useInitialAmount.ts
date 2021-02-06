import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { initialAmountState } from '../atoms/labSettingState'
import useFormattedNumber from './useFormattedNumber'

export default function useInitialAmount() {
  const [value, onChange, setValue] = useFormattedNumber(10000)
  const [initialAmount, setInitialAmount] = useRecoilState(initialAmountState)

  useEffect(() => {
    setInitialAmount(parseInt(value.replace(/[^\d]+/g, ''), 10))
  }, [value])

  useEffect(() => {
    setValue(initialAmount.toLocaleString())
  }, [initialAmount])

  return [value, onChange] as const
}
