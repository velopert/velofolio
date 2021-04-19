import { css } from '@emotion/react'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import {
  useProjectTitleState,
  useResetLabSetting,
} from '../../atoms/labSettingState'
import { useResetLabSettingView } from '../../atoms/labSettingViewState'
import { useResetReport } from '../../atoms/reportState'
import LabSettings from '../../components/LabSettings'
import Report from '../../components/Report/Report'
import Spinner from '../../components/Spinner'
import useBacktestLoad from '../../hooks/useBacktestLoad'
import useGenerateReportEffect from '../../hooks/useGenerateReportEffect'
import useTB3HistoricalPricesSync from '../../hooks/useTB3HistoricalPricesSync'
import useTickerSync from '../../hooks/useTickerSync'
import palette from '../../lib/palette'

export type LabProps = {}

type LabParams = {
  id?: string
}

function Lab({}: LabProps) {
  const { id } = useParams<LabParams>()
  const reset = useResetLabSetting()
  const resetReport = useResetReport()
  const resetLabSettingView = useResetLabSettingView()

  const [title] = useProjectTitleState()
  useGenerateReportEffect()
  useTickerSync()
  useTB3HistoricalPricesSync()

  useEffect(() => {
    return () => {
      reset()
      resetReport()
      resetLabSettingView()
    }
  }, [reset, resetReport, resetLabSettingView])

  const { loading } = useBacktestLoad(id ? parseInt(id) : 0)
  if (loading)
    return (
      <div css={fullPageSpinner}>
        <Spinner color={palette.cyan[600]} size="4rem" />
      </div>
    )

  return (
    <div css={pageStyle}>
      <Helmet>
        <title>
          {id
            ? `${title} – Velofolio`
            : 'Velofolio – Backtest your financial portfolio'}
        </title>
      </Helmet>
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

const fullPageSpinner = css`
  width: calc(100% - 16.25rem);
  height: 100%;
  position: fixed;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`
export default Lab
