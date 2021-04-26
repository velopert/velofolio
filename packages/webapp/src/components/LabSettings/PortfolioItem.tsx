import { css } from '@emotion/react'
import { AssetWeight } from '../../atoms/assetsState'
import palette from '../../lib/palette'
import { useEffect, useMemo, useRef } from 'react'
import chartColors from '../../lib/chartColors'
import { ECBasicOption } from 'echarts/types/dist/shared'
import echarts from '../../lib/echarts'

export type PortfolioItemProps = {
  id: number
  assets: AssetWeight[]
  name: string
  onOpen(id: number): void
}

function PortfolioItem({ id, assets, name, onOpen }: PortfolioItemProps) {
  const ref = useRef<HTMLDivElement>(null)

  const totalWeight = useMemo(
    () => assets.reduce((acc, current) => acc + current.weight, 0),
    [assets]
  )

  const pieChartOptions = useMemo(() => {
    const options: ECBasicOption = {
      color: chartColors,
      tooltip: {
        show: false,
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
          data: assets.map((asset) => ({
            value: asset.weight / totalWeight,
            name: asset.ticker,
          })),
          label: {
            show: false,
            position: 'center',
          },
          animation: false,
          silent: true,
        },
      ],
    }
    return options
  }, [assets, totalWeight])

  useEffect(() => {
    const pieElement = ref.current
    if (!pieElement || !pieChartOptions) return

    const pieChart = echarts.init(pieElement)
    pieChart.setOption(pieChartOptions)

    const handleResize = () => {
      pieChart.resize()
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [pieChartOptions])

  // useEffect(() => {
  //   const ctx = ref.current?.getContext('2d')
  //   const data = {
  //     datasets: [
  //       {
  //         data: assets.map((asset) => asset.weight),
  //         backgroundColor: chartColors.slice(0, assets.length),
  //       },
  //     ],
  //     labels: assets.map((asset) => asset.ticker),
  //   }

  //   if (!ctx) return
  //   if (!chartRef.current) {
  //     const chart = new Chart(ctx, {
  //       type: 'pie',
  //       data,
  //       options: {
  //         legend: {
  //           display: false,
  //         },
  //         animation: {
  //           duration: 0,
  //         },
  //       },
  //     })
  //     chartRef.current = chart
  //   } else {
  //     const chart = chartRef.current
  //     chart.data = data
  //     chart.update()
  //   }
  // }, [assets])

  return (
    <div css={gridItem} onClick={() => onOpen(id)}>
      <div css={pieBox} ref={ref}></div>
      <div css={nameStyle}>{name}</div>
    </div>
  )
}

const gridItem = css`
  height: 6rem;
  background: white;
  border-radius: 0.5rem;
  border: 0.0625rem solid ${palette.blueGrey[50]};
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0.5rem;
  cursor: pointer;
  transition: all ease-in 0.125s;
  transform: scale3d(1, 1, 1);
  &:hover {
    box-shadow: 0rem 0.25rem 0.5rem rgba(0, 0, 0, 0.05);
    transform: scale3d(1.025, 1.025, 1.025);
    border: 0.0625rem solid ${palette.cyan[500]};
  }
`

const pieBox = css`
  flex: 1;
  width: 100%;
  position: relative;
  canvas {
    width: 100%;
    height: 100%;
  }
`
const nameStyle = css`
  width: 7.625rem;
  color: ${palette.blueGrey[700]};
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
`

export default PortfolioItem
