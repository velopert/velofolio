import { useMemo, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useUserState } from '../atoms/authState'
import { useGlobalDialogActions } from '../atoms/globalDialogState'
import {
  useBacktestAuthorValue,
  useLabDataValue,
  useLabSettingSync,
} from '../atoms/labSettingState'
import { useReportValue } from '../atoms/reportState'
import { createBacktest } from '../lib/api/backtests/createBacktest'
import { updateBacktest } from '../lib/api/backtests/updateBacktest'
import isAxiosError from '../lib/utils/isAxiosError'
import { LabRouteParams } from '../types/routeParams'

export default function useSaveFooter() {
  const data = useLabDataValue()
  const report = useReportValue()
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const { id } = useParams<LabRouteParams>()
  const [user] = useUserState()
  const backtestAuthor = useBacktestAuthorValue()
  const sync = useLabSettingSync()
  const { open } = useGlobalDialogActions()

  /*
    TODO:
    1. SAVE NEW PROJECT
    2. SAVE PROJECT
    3. CLONE PROJECT
  */

  const isMyBacktest = user?.id === backtestAuthor?.id

  // generate
  const name = useMemo(() => {
    if (id === undefined) {
      return 'SAVE NEW PROJECT'
    }
    if (isMyBacktest) {
      return 'UPDATE PROJECT'
    }
    return 'CLONE PROJECT'
  }, [id, user, backtestAuthor])

  const onSave = async () => {
    setLoading(true)
    const returns = report.map((r) =>
      r.returns.map((item) => ({ x: item.x.toString(), y: item.y }))
    )

    const payload = {
      ...data,
      returns,
      indicators: report.map((r) => ({
        id: r.id,
        cagr: r.indicator.cagr,
        sharpe: r.indicator.sharpeRatio,
      })),
    }
    if (!id || !isMyBacktest) {
      try {
        const backtest = await createBacktest(payload)
        sync(backtest)
        history.replace(`/backtests/${backtest.id}`)
      } catch (e) {
        if (isAxiosError(e)) {
          const statusCode = e.response?.status
          const message = (() => {
            if (statusCode === 401) {
              return 'Please sign in to save your project'
            }
            if (statusCode === 400) {
              return 'There is something wrong with your data'
            }
            return 'Failed to create project'
          })()
          console.log(message)
          open({
            title: 'Error',
            message,
          })
        }
      }
    } else {
      const backtest = await updateBacktest({
        id: parseInt(id, 10),
        ...payload,
      })
      sync(backtest)
    }
    setLoading(false)
  }

  return {
    onSave,
    name,
    loading,
  }
}
