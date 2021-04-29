import { css } from '@emotion/react'
import { useEffect, useMemo, useRef } from 'react'
import { useReportValue } from '../../atoms/reportState'
import ReportSection from './ReportSection'
import chartColors from '../../lib/chartColors'
import { ECBasicOption } from 'echarts/types/dist/shared'
import echarts from '../../lib/echarts'

export type PortfolioReturnsSectionProps = {}

function PortfolioReturnsSection({}: PortfolioReturnsSectionProps) {
  const report = useReportValue()
  const chartRef = useRef<echarts.ECharts | null>(null)

  // x-axis
  const categoryData = useMemo(() => {
    if (report.length === 0 || report[0].returns.length === 0) return null
    return report[0].returns.map((r) => r.x.toISOString().split('T')[0])
  }, [report])

  // y-axis
  const seriesData = useMemo(() => {
    if (report.length === 0 || report[0].returns.length === 0) return null
    return report.map((result) => ({
      name: result.name,
      type: 'line',
      data: result.returns.map((yr) => yr.y),
    }))
  }, [report])

  const chartOptions = useMemo(() => {
    if (!categoryData || !seriesData) return null
    const options: ECBasicOption = {
      tooltip: {
        trigger: 'axis',

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
              ${'$' + Math.round(param.data).toLocaleString()}
          </div>
      `
            )
            .join('')
          return `<div>${params[0].axisValueLabel}</div>`.concat(data)
        },
      },
      xAxis: {
        type: 'category',
        data: categoryData,
        boundaryGap: false,
      },
      yAxis: {
        type: 'log',
        // interval: 1000,
        min: Math.max(
          0,
          Math.min(...seriesData.flatMap((value) => value.data)) - 2000
        ),
        max: Math.max(...seriesData.flatMap((value) => value.data)),
        // type: 'value',
        axisLabel: {
          formatter: (value: number) => {
            return '$' + Math.round(value).toLocaleString()
          },
        },
        logBase: 2.71828,
      },
      series: seriesData,
      dataZoom:
        categoryData.length > 20
          ? [
              {
                type: 'inside',
              },
              {},
            ]
          : undefined,
      color: chartColors,
      grid: {
        left: 64,
        top: 32,
        right: 32,
        bottom: 32,
      },
    }

    return options
  }, [categoryData, seriesData])

  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = divRef.current
    if (!element || !chartOptions) return

    let c: echarts.ECharts | null = chartRef.current ?? null
    if (!c) {
      const chart = echarts.init(element)
      chartRef.current = chart
      c = chart
    }

    c.setOption(chartOptions as any)

    const handleResize = () => {
      c?.resize()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [chartOptions])

  return (
    <ReportSection title="Portfolio Returns">
      <div ref={divRef} css={chartStyle}></div>
    </ReportSection>
  )
}

const chartStyle = css`
  height: 25rem;
  width: 100%;
`

export default PortfolioReturnsSection
