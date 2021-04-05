import { useMemo, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useUserState } from '../atoms/authState'
import {
  useBacktestAuthorValue,
  useLabDataValue,
  useLabSettingSync,
} from '../atoms/labSettingState'
import { useReportValue } from '../atoms/reportState'
import { createBacktest } from '../lib/api/backtests/createBacktest'
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

  /*
    TODO:
    1. SAVE NEW PROJECT
    2. SAVE PROJECT
    3. CLONE PROJECT
  */

  // generate
  const name = useMemo(() => {
    if (id === undefined) {
      return 'SAVE NEW PROJECT'
    }
    if (user?.id === backtestAuthor?.id) {
      return 'UPDATE PROJECT'
    }
    return 'CLONE PROJECT'
  }, [id, user, backtestAuthor])

  const onSave = async () => {
    setLoading(true)
    const returns = report.map((r) =>
      r.returns.map((item) => ({ x: item.x.toString(), y: item.y }))
    )
    const backtest = await createBacktest({
      ...data,
      returns,
      indicators: report.map((r) => ({
        id: r.id,
        cagr: r.indicator.cagr,
        sharpe: r.indicator.sharpeRatio,
      })),
    })
    sync(backtest)
    history.replace(`/backtests/${backtest.id}`)
    setLoading(false)
  }

  return {
    onSave,
    name,
    loading,
  }
}
