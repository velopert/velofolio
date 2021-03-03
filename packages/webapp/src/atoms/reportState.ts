import { useMemo } from 'react'
import { atom, useRecoilState, useSetRecoilState } from 'recoil'

type PortfolioReturns = {
  label: string
  lineTension: number
  data: {
    x: Date
    y: number
  }[]
}[]

const portfolioReturnsState = atom<PortfolioReturns | null>({
  key: 'portfolioReturnsState',
  default: null,
  dangerouslyAllowMutability: true,
})

export interface Indicator {
  finalBalance: number
  cagr: number
  stdev: number
  mdd: number
  sharpeRatio: number
  sortinoRatio: number | null
}
export type IndicatorRecord = Record<number, Indicator>

const indicatorByIdState = atom<IndicatorRecord>({
  key: 'indicatorByIdState',
  default: {},
})

export function usePortfolioReturnsState() {
  return useRecoilState(portfolioReturnsState)
}

export function useSetPortfolioReturns() {
  return useSetRecoilState(portfolioReturnsState)
}

export function useIndicatorByIdState() {
  return useRecoilState(indicatorByIdState)
}

export function useSetIndicatorById() {
  return useSetRecoilState(indicatorByIdState)
}

export function useReportValue() {
  const [portfolioReturns] = usePortfolioReturnsState()
  return useMemo(() => {
    return portfolioReturns
  }, [portfolioReturns])
}

// type ReportState = {
//   portfolioReturns:
//     | {
//         label: string
//         lineTension: number
//         data: {
//           x: Date
//           y: number
//         }[]
//       }[]
//     | null
// }

// const reportState = atom<ReportState>({
//   key: 'reportState',
//   default: {
//     portfolioReturns: null,
//   },
// })

// export function useReportState() {
//   return useRecoilState(reportState)
// }
