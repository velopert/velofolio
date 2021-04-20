import { useState } from 'react'
import { useUserState } from '../atoms/authState'
import { useBacktestAuthorValue } from '../atoms/labSettingState'

export default function useRemoveBacktest() {
  const backtestAuthor = useBacktestAuthorValue()
  const [user] = useUserState()

  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const askRemove = () => {
    setIsDialogVisible(true)
  }
  const cancel = () => {
    setIsDialogVisible(false)
  }
  const confirm = () => {
    setIsDialogVisible(false)
    // TODO: call mutation API
  }

  return {
    isAuthor: user?.id !== undefined && user.id === backtestAuthor?.id,
    askRemove,
    cancel,
    confirm,
    isDialogVisible,
  }
}
