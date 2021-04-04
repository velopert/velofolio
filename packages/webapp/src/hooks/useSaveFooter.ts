import { useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { useLabDataValue } from '../atoms/labSettingState'
import { useReportValue } from '../atoms/reportState'
import { createBacktest } from '../lib/api/backtests/createBacktest'

export default function useSaveFooter() {
  const data = useLabDataValue()
  const report = useReportValue()
  const history = useHistory()

  /*
    TODO:
    1. SAVE NEW PROJECT
    2. SAVE PROJECT
    3. CLONE PROJECT
  */

  // generate

  const name = 'SAVE NEW PROJECT'
  const onSave = async () => {
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
    history.replace(`/backtests/${backtest.id}`)
  }

  return {
    onSave,
    name,
  }
}
