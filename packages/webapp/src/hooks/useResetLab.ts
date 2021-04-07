import { useHistory } from 'react-router-dom'
import { useResetLabSetting } from '../atoms/labSettingState'

export default function useResetLab() {
  const history = useHistory()
  const reset = useResetLabSetting()

  return () => {
    history.replace('/')
    reset()
  }
}
