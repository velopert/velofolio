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
    if (!portfolioReturns) return
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
