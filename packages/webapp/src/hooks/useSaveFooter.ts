import { useLabDataValue } from '../atoms/labSettingState'
import { createBacktest } from '../lib/api/backtests/createBacktest'

export default function useSaveFooter() {
  const data = useLabDataValue()
  /*
    TODO:
    1. SAVE NEW PROJECT
    2. SAVE PROJECT
    3. CLONE PROJECT
  */

  const name = 'SAVE NEW PROJECT'
  const onSave = () => {
    createBacktest(data)
  }

  return {
    onSave,
    name,
  }
}
