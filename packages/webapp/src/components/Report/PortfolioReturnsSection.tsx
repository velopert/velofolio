import { css } from '@emotion/react'
import { useEffect, useRef } from 'react'
import { usePortfolioReturnsState } from '../../atoms/reportState'
import ReportSection from './ReportSection'
import Chart from 'chart.js'
// import 'chartjs-adapter-date-fns'
// import { enUS } from 'date-fns/locale'

export type PortfolioReturnsSectionProps = {}

function PortfolioReturnsSection({}: PortfolioReturnsSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)
  const [portfolioReturns] = usePortfolioReturnsState()

  useEffect(() => {
    if (!portfolioReturns || portfolioReturns.length === 0) {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
      return
    }

    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    if (!chartRef.current) {
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: portfolioReturns,
        },
        options: {
          animation: {
            duration: 0,
          },
          scales: {
            xAxes: [
              {
                type: 'time',
                time: {
                  unit: 'month',
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  callback: function (value, index, values) {
                    return '$' + value.toLocaleString()
                  },
                },
              },
            ],
          },
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                const label =
                  data.datasets![tooltipItem.datasetIndex!].label ?? ''
                const value = Math.round(
                  tooltipItem.yLabel as number
                ).toLocaleString()
                return `${label} - $${value}`
              },
            },
          },
        },
      })
      chartRef.current = chart
    } else {
      const chart = chartRef.current
      chart.data = {
        datasets: portfolioReturns,
      }
      chart.update()
    }
  }, [portfolioReturns])

  return (
    <ReportSection title="Portfolio Returns">
      <div css={chartWrapper}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </ReportSection>
  )
}

const chartWrapper = css`
  width: 100%;
  height: 25rem;
  position: relative;
  canvas {
    width: 100%;
    height: 100%;
  }
`

export default PortfolioReturnsSection
