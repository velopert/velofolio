import { css } from '@emotion/react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useResetLabSetting } from '../../atoms/labSettingState'
import { useResetReport } from '../../atoms/reportState'
import LabSettings from '../../components/LabSettings'
import Report from '../../components/Report/Report'
import useBacktestLoad from '../../hooks/useBacktestLoad'
import useGenerateReportEffect from '../../hooks/useGenerateReportEffect'
import useTB3HistoricalPricesSync from '../../hooks/useTB3HistoricalPricesSync'
import useTickerSync from '../../hooks/useTickerSync'

export type LabProps = {}

type LabParams = {
  id?: string
}

function Lab({}: LabProps) {
  const { id } = useParams<LabParams>()
  const reset = useResetLabSetting()
  const resetReport = useResetReport()
  useGenerateReportEffect()
  useTickerSync()
  useTB3HistoricalPricesSync()

  useEffect(() => {
    return () => {
      reset()
      resetReport()
    }
  }, [reset, resetReport])

  const { loading } = useBacktestLoad(id ? parseInt(id) : 0)
  if (loading) return null

  return (
    <div css={pageStyle}>
      <LabSettings />
      <div css={contentStyle}>
        <Report />
      </div>
    </div>
  )
}

const pageStyle = css``

const contentStyle = css`
  padding-left: 22.5rem;
`

export default Lab
