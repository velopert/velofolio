import os from 'os'
import path from 'path'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import fs from 'fs'
import { ChartConfiguration } from 'chart.js'
import { plus_v1 } from 'googleapis'

export async function generateBacktestChart(
  params: GenerateBacktestChartParams
) {
  const canvas = new ChartJSNodeCanvas({
    width: 600,
    height: 300,
    chartCallback: (ChartJS) => {
      ChartJS.plugins.register({
        beforeInit: (chart, options) => {
          const ctx = chart.ctx
          ctx.fillStyle = 'white'
          ctx.fillRect(0, 0, 600, 300)
        },
      })
    },
  })

  const values = params.flatMap((array) => array.map((item) => item.y))
  const min = Math.min(...values)
  const max = Math.max(...values, 20000)

  const configuration: ChartConfiguration = {
    type: 'line',
    data: {
      datasets: params.map((returns, i) => ({
        label: i.toString(),
        data: returns.map((r) => r.y),
        lineTension: 0,
        borderColor: chartColors[i],
        backgroundColor: 'transparent',
      })),
      labels: params[0].map((_, i) => i.toString()),
    },

    options: {
      layout: {
        padding: {
          top: 4,
          left: -10,
          bottom: 0,
        },
      },
      elements: {
        point: {
          radius: 0,
        },
      },
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            type: 'logarithmic',
            gridLines: {
              display: false,
            },
            ticks: {
              min,
              max,
              display: false,
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              display: false,
            },
            ticks: {
              display: false,
            },
          },
        ],
      },
    },
  }

  const image = await canvas.renderToBuffer(configuration)
  const dir = path.resolve(os.tmpdir(), `${new Date().getTime()}.png`)
  await fs.promises.writeFile(dir, image)

  return dir
}

type GenerateBacktestChartParams = {
  x: string
  y: number
}[][]

type D3Data = { key: number; value: number }[][] & {
  allKeys: number[]
}

const chartColors = [
  '#ef5350',
  '#ffa726',
  '#66bb6a',
  '#42a5f5',
  '#5c6bc0',
  '#ab47bc',
  '#8d6e63',
  '#78909c',
  '#9ccc65',
  '#7e57c2',
  '#ec407a',
  '#f44336',
  '#ff9800',
  '#4caf50',
  '#2196f3',
  '#3f51b5',
  '#9c27b0',
  '#795548',
  '#607d8b',
  '#8bc34a',
  '#673ab7',
  '#e91e63',
  '#e53935',
  '#fb8c00',
  '#fdd835',
  '#43a047',
  '#1e88e5',
  '#3949ab',
  '#8e24aa',
  '#6d4c41',
  '#546e7a',
  '#7cb342',
  '#5e35b1',
  '#d81b60',
  '#d32f2f',
  '#f57c00',
  '#fbc02d',
  '#388e3c',
  '#1976d2',
  '#303f9f',
  '#7b1fa2',
  '#5d4037',
  '#455a64',
  '#689f38',
  '#512da8',
  '#c2185b',
  '#c62828',
  '#ef6c00',
  '#f9a825',
  '#2e7d32',
  '#1565c0',
  '#283593',
  '#6a1b9a',
  '#4e342e',
  '#37474f',
  '#558b2f',
  '#4527a0',
  '#ad1457',
  '#b71c1c',
  '#e65100',
  '#f57f17',
  '#1b5e20',
  '#0d47a1',
  '#1a237e',
  '#4a148c',
  '#3e2723',
  '#263238',
  '#33691e',
  '#311b92',
  '#880e4f',
  '#e57373',
  '#ffb74d',
  '#fff176',
  '#81c784',
  '#64b5f6',
  '#7986cb',
  '#ba68c8',
  '#a1887f',
  '#90a4ae',
  '#aed581',
  '#9575cd',
  '#f06292',
  '#ef9a9a',
  '#ffcc80',
  '#fff59d',
  '#a5d6a7',
  '#90caf9',
  '#9fa8da',
  '#ce93d8',
  '#bcaaa4',
  '#b0bec5',
  '#c5e1a5',
  '#b39ddb',
  '#f48fb1',
]
