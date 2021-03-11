import { css } from '@emotion/react'
import { ECBasicOption } from 'echarts/types/dist/shared'
import { useEffect, useMemo, useRef } from 'react'
import {
  useAssetDetailsReadyValue,
  useAssetDetailsValue,
} from '../../atoms/assetDetailsState'
import { Portfolio } from '../../atoms/labSettingState'
import palette from '../../lib/palette'
import { convertToPercentage } from '../../lib/utils/calculateIndicators'
import echarts from '../../lib/echarts'
import chartColors from '../../lib/chartColors'

export type PortfolioAllocationProps = {
  portfolio: Portfolio
}

function PortfolioAllocation({ portfolio }: PortfolioAllocationProps) {
  const totalWeight = useMemo(
    () => portfolio.assets.reduce((acc, current) => acc + current.weight, 0),
    [portfolio]
  )

  const assetDetailsReady = useAssetDetailsReadyValue()
  const assetDetails = useAssetDetailsValue()

  const divRef = useRef<HTMLDivElement>(null)

  const seriesData = useMemo(
    () =>
      portfolio.assets.map((asset) => ({
        value: asset.weight / totalWeight,
        name: asset.ticker,
      })),
    [portfolio, totalWeight]
  )

  const chartOptions = useMemo(() => {
    if (!seriesData) return null
    const options: ECBasicOption = {
      color: chartColors,
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          return `<div>Allocations</div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center;">
              <div style="border-radius: 6px; width: 12px; height: 12px; margin-right: 8px; background-color: ${params.color}"></div>
              <b style="margin-right: 48px;">${params.name}</b>
            </div>
            <div>${params.percent}%</div>
          </div>`
        },
      },
      label: {
        show: false,
        position: 'center',
      },
      legend: {
        top: 'bottom',
      },
      series: [
        {
          name: 'Asset Allocation',
          type: 'pie',
          radius: '75%',
          center: ['50%', '50%'],
          data: seriesData,
          label: {
            show: false,
            position: 'center',
          },
        },
      ],
    }
    return options
  }, [seriesData])

  useEffect(() => {
    const element = divRef.current
    if (!element || !chartOptions) return

    const chart = echarts.init(element)
    chart.setOption(chartOptions)

    const handleResize = () => {
      chart.resize()
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [chartOptions])

  if (!assetDetailsReady) return null

  return (
    <div css={block}>
      <div css={pane}>
        <table css={tableStyle}>
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Stock Name</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.assets.map((asset) => (
              <tr key={asset.id}>
                <td>{asset.ticker}</td>
                <td>{assetDetails[asset.ticker]?.data?.name ?? ''}</td>
                <td>{convertToPercentage(asset.weight / totalWeight)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div css={pane}>
        <div css={chartStyle} ref={divRef}></div>
      </div>
    </div>
  )
}

const block = css`
  display: flex;
  min-height: 20rem;
`

const pane = css`
  flex: 1;
  & + & {
    margin-left: 2rem;
  }
`

const tableStyle = css`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  td,
  th {
    padding: 0.75rem;
    border: 1px solid ${palette.blueGrey[200]};
  }

  td:nth-child(3) {
    width: 6rem;
  }

  tr:nth-of-type(even) {
    background: ${palette.grey[100]};
  }

  tr td:first-child {
    width: 20rem;
  }

  thead th {
    color: ${palette.blueGrey[800]};
  }
`

const chartStyle = css`
  width: 100%auto;
  height: 20rem;
`

export default PortfolioAllocation
