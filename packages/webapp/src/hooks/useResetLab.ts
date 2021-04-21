import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useResetLabSetting } from '../atoms/labSettingState'
import { useResetLabSettingView } from '../atoms/labSettingViewState'
import { useResetReport } from '../atoms/reportState'

export default function useResetLab() {
  const history = useHistory()
  const reset = useResetLabSetting()
  const resetReport = useResetReport()
  const resetLabSettingView = useResetLabSettingView()

  return useCallback(() => {
    history.replace('/')
    reset()
    resetReport()
    resetLabSettingView()
  }, [history, reset, resetReport, resetLabSettingView])
}
