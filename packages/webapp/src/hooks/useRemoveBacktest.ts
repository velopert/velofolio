import { useState } from 'react'
import { useMutation } from 'react-query'
import { useParams } from 'react-router-dom'
import { useUserState } from '../atoms/authState'
import { useBacktestAuthorValue } from '../atoms/labSettingState'
import { deleteBacktest } from '../lib/api/backtests/deleteBacktest'
import { LabRouteParams } from '../types/routeParams'
import { useBacktestQueryUpdater } from './query/useBacktestsQuery'
import useResetLab from './useResetLab'

export default function useRemoveBacktest() {
  const backtestAuthor = useBacktestAuthorValue()
  const [user] = useUserState()
  const reset = useResetLab()
  const { id = '' } = useParams<LabRouteParams>()
  const { remove } = useBacktestQueryUpdater()
  const parsedId = parseInt(id, 10)

  const { mutate } = useMutation(deleteBacktest, {
    onSuccess() {
      reset()
      remove(parsedId)
      remove(parsedId, backtestAuthor?.id)
    },
  })

  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const askRemove = () => {
    setIsDialogVisible(true)
  }
  const cancel = () => {
    setIsDialogVisible(false)
  }
  const confirm = () => {
    setIsDialogVisible(false)
    mutate(parseInt(id, 10))
  }

  return {
    isAuthor: user?.id !== undefined && user.id === backtestAuthor?.id,
    askRemove,
    cancel,
    confirm,
    isDialogVisible,
  }
}
