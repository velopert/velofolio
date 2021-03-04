import { useMemo } from 'react'
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil'

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
export type IndicatorRecord = Record<number, Indicator | undefined>

const indicatorByIdState = atom<IndicatorRecord>({
  key: 'indicatorByIdState',
  default: {},
})

const monthsCount = selector({
  key: 'monthsCount',
  get: ({ get }) => get(portfolioReturnsState)?.[0]?.data.length,
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

export function useMonthsCountValue() {
  return useRecoilValue(monthsCount)
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
