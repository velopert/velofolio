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
import media from '../../lib/styles/media'

export type PortfolioAllocationProps = {
  portfolio: Portfolio
}

function PortfolioAllocation({ portfolio }: PortfolioAllocationProps) {
  const pieChartRef = useRef<echarts.ECharts | null>(null)
  const barChartRef = useRef<echarts.ECharts | null>(null)
  const totalWeight = useMemo(
    () => portfolio.assets.reduce((acc, current) => acc + current.weight, 0),
    [portfolio]
  )

  const assetDetailsReady = useAssetDetailsReadyValue()
  const assetDetails = useAssetDetailsValue()

  const divRef = useRef<HTMLDivElement>(null)
  const sectorChartDivRef = useRef<HTMLDivElement>(null)

  const seriesData = useMemo(
    () =>
      portfolio.assets.map((asset) => ({
        value: asset.weight / totalWeight,
        name: asset.ticker,
      })),
    [portfolio, totalWeight]
  )

  const pieChartOptions = useMemo(() => {
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

  const sectorWeightingsEntries = useMemo(() => {
    if (!assetDetailsReady) return null
    const sectorWeightingsRecord: Record<string, number> = {}

    portfolio.assets.forEach((asset) => {
      const assetDetail = assetDetails[asset.ticker]?.data
      if (!assetDetail) return

      if (assetDetail.sector_weightings.length > 0) {
        assetDetail.sector_weightings.forEach((weighting) => {
          const currentValue = sectorWeightingsRecord[weighting.sector] ?? 0
          const calculatedWeight = asset.weight * (weighting.percentage / 100)
          sectorWeightingsRecord[weighting.sector] =
            currentValue + calculatedWeight
        })
        return
      }

      const sector = assetDetail.sector || 'N/A'

      const currentValue = sectorWeightingsRecord[sector] ?? 0
      sectorWeightingsRecord[sector] = currentValue + asset.weight
      return
    })

    return Object.entries(sectorWeightingsRecord)
  }, [assetDetailsReady, assetDetails, portfolio.assets])

  const barChartOptions = useMemo(() => {
    if (!sectorWeightingsEntries) return null
    const weightingSum = sectorWeightingsEntries.reduce(
      (acc, current) => acc + current[1],
      0
    )
    const categoryData = sectorWeightingsEntries.map(([sector]) => sector)
    const seriesData = [
      {
        name: 'Sector Weightings',
        type: 'bar',
        data: sectorWeightingsEntries.map(
          ([, weighting]) => weighting / weightingSum
        ),
      },
    ]

    const leftMargin =
      Math.max(...categoryData.map((category) => category.length)) * 6 + 24

    const options: ECBasicOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const data = params
            .map(
              (param: any) => `
          <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center;">
                  <div style="border-radius: 6px; width: 12px; height: 12px; margin-right: 8px; background-color: ${
                    param.color
                  }"></div>
                  <b style="margin-right: 48px;">${param.seriesName}</b>
              </div>
              ${convertToPercentage(param.data)}
          </div>
      `
            )
            .join('')
          return `<div>${params[0].axisValueLabel}</div>`.concat(data)
        },
      },
      yAxis: {
        type: 'category',
        data: categoryData,
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => {
            return convertToPercentage(value, 2)
          },
        },
      },
      series: seriesData,
      grid: {
        left: leftMargin,
        top: 0,
        right: 32,
        bottom: 32,
      },
    }

    return options
  }, [sectorWeightingsEntries])

  // TODO: check associated asset details ready only
  useEffect(() => {
    const pieElement = divRef.current
    if (!pieElement || !pieChartOptions) return

    const pieChart = echarts.init(pieElement)
    if (!pieChartRef.current) {
      pieChartRef.current = pieChart
    }
    pieChart.setOption(pieChartOptions)

    const handleResize = () => {
      pieChart.resize()
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [pieChartOptions, portfolio.name, assetDetailsReady])

  useEffect(() => {
    const sectorChartElement = sectorChartDivRef.current
    if (!sectorChartElement || !barChartOptions || !sectorWeightingsEntries)
      return

    if (sectorWeightingsEntries.length === 0) {
      return
    }

    const barChart = echarts.init(sectorChartElement)

    barChart.setOption(barChartOptions)
    barChart.resize()

    const fn = () => {
      barChart.resize()
    }

    window.addEventListener('resize', () => fn)
    return () => {
      window.removeEventListener('resize', fn)
    }
  }, [barChartOptions, sectorWeightingsEntries, assetDetailsReady])

  if (!assetDetailsReady || !sectorWeightingsEntries) return null

  return (
    <div css={wrapper}>
      <h4>{portfolio.name}</h4>
      <h5>Sector Weightings</h5>
      <div
        css={sectorChartStyle(sectorWeightingsEntries.length)}
        ref={sectorChartDivRef}
      ></div>

      <h5>Asset Weightings</h5>
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
              {portfolio.assets.map((asset, i) => (
                <tr key={asset.id}>
                  <td>
                    <div css={tickerWrapper}>
                      <div
                        css={circle}
                        style={{ background: chartColors[i] }}
                      ></div>
                      {asset.ticker}
                    </div>
                  </td>
                  <td>{assetDetails[asset.ticker]?.data?.name ?? ''}</td>
                  <td>{convertToPercentage(asset.weight / totalWeight)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div css={pane}>
          <div css={pieChartStyle} ref={divRef}></div>
        </div>
      </div>
    </div>
  )
}

const wrapper = css`
  padding-top: 0.5rem;
  h4,
  h5 {
    color: ${palette.blueGrey[800]};
  }

  h4 {
    margin-bottom: 0;
  }
  h5 {
    margin-top: 1rem;
  }
`

const block = css`
  display: flex;
  min-height: 20rem;
  ${media.xlarge} {
    flex-direction: column;
  }
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

  td:nth-of-type(3) {
    width: 6rem;
  }

  tr:nth-of-type(even) {
    background: ${palette.grey[100]};
  }

  tr td:first-of-type {
    width: 6.5rem;
  }

  thead th {
    color: ${palette.blueGrey[800]};
  }
`

const tickerWrapper = css`
  display: flex;
  align-items: center;
`

const circle = css`
  width: 0.75rem;
  height: 0.75rem;
  margin-right: 0.5rem;
  border-radius: 50%;
`

const pieChartStyle = css`
  width: 100%;
  height: 20rem;
`

const sectorChartStyle = (sectorCount: number) => css`
  width: 100%;
  height: auto;
  height: ${Math.max(sectorCount * 2.5, 5)}rem;
`

export default PortfolioAllocation
