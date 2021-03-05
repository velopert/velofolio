import { useMemo } from 'react'
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil'
import PortfolioItem from '../components/LabSettings/PortfolioItem'
import { Portfolio } from './labSettingState'

export interface PortfolioResult {
  id: number
  name: string
  returns: {
    x: Date
    y: number
  }[]
  monthlyRate: {
    x: Date
    y: number
  }[]
  yearlyRate: {
    x: number
    y: number
  }[]
  indicator: Indicator
}

const portfolioResultsState = atom<PortfolioResult[]>({
  key: 'portfolioResultsState',
  default: [],
})

export function usePortfolioResultsValue() {
  return useRecoilValue(portfolioResultsState)
}

export function useSetPortfolioResults() {
  return useSetRecoilState(portfolioResultsState)
}

interface YearMonthRate {
  year: number
  month: number
}

export interface Indicator {
  finalBalance: number
  cagr: number
  stdev: number
  mdd: number
  sharpeRatio: number
  sortinoRatio: number | null
  best: YearMonthRate
  worst: YearMonthRate
}

const monthsCount = selector({
  key: 'monthsCount',
  get: ({ get }) => get(portfolioResultsState)?.[0]?.returns.length,
})

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
