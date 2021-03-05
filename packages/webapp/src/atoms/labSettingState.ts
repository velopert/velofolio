import {
  atom,
  DefaultValue,
  selector,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil'
import { MonthYearValue } from '../types/MonthYearValue'
import produce from 'immer'
import { Asset } from '../lib/api/assets/types'
import { useCallback } from 'react'
import { AssetWeight } from './assetsState'

export type LabSettingState = {
  dateRange: {
    startDate: MonthYearValue
    endDate: MonthYearValue
  }
  initialAmount: number
  cashflows: Cashflows
  portfolios: Portfolio[]
  nextPortfolioId: number
}

export type Cashflows = {
  enabled: boolean
  amount: number
  period: string
}

export type Portfolio = {
  id: number
  name: string
  rebalancing: string
  assets: AssetWeight[]
}

const initialState: LabSettingState = {
  dateRange: {
    startDate: {
      year: 1985,
      month: 1,
    },
    endDate: (() => {
      const d = new Date()
      return {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
      }
    })(),
  },
  initialAmount: 10000,
  cashflows: {
    enabled: false,
    amount: 1000,
    period: 'Anually',
  },
  portfolios: [],
  nextPortfolioId: 1,
  /* ... */
}

export const labSettingState = atom({
  key: 'labSettingState',
  default: initialState,
})

export const dateRangeState = selector<LabSettingState['dateRange']>({
  key: 'dateRangeState',
  get: ({ get }) => {
    const labSetting = get(labSettingState)
    return labSetting.dateRange
  },
})

export const initialAmountState = selector<number>({
  key: 'initialAmountState',
  get: ({ get }) => get(labSettingState).initialAmount,
  set: ({ set }, newValue) =>
    set(labSettingState, (prevValue) =>
      newValue instanceof DefaultValue
        ? newValue
        : { ...prevValue, initialAmount: newValue }
    ),
})

export const cashflowsState = selector<LabSettingState['cashflows']>({
  key: 'cashflowsState',
  get: ({ get }) => get(labSettingState).cashflows,
  set: ({ set }, newValue) =>
    set(labSettingState, (prevValue) =>
      newValue instanceof DefaultValue
        ? newValue
        : {
            ...prevValue,
            cashflows: newValue,
          }
    ),
})

export const portfoliosState = selector<LabSettingState['portfolios']>({
  key: 'portfoliosState',
  get: ({ get }) => get(labSettingState).portfolios,
  set: ({ set }, newValue) =>
    set(labSettingState, (prevValue) =>
      newValue instanceof DefaultValue
        ? newValue
        : { ...prevValue, portfolios: newValue }
    ),
})

export const nextPortfolioIdState = selector<number>({
  key: 'nextPortfolioIdState',
  get: ({ get }) => get(labSettingState).nextPortfolioId,
  set: ({ set }, newValue) =>
    set(labSettingState, (prevValue) =>
      newValue instanceof DefaultValue
        ? newValue
        : { ...prevValue, nextPortfolioId: newValue }
    ),
})

export const uniqueTickersState = selector<string[]>({
  key: 'uniqueTickersState',
  get: ({ get }) => {
    const portfolios = get(labSettingState).portfolios
    const tickers = portfolios.flatMap((p) => p.assets.map((a) => a.ticker))
    return Array.from(new Set(tickers))
  },
})

export const portfolioState = selectorFamily<Portfolio | undefined, number>({
  key: 'portfolioState',
  get: (portfolioId) => ({ get }) => {
    const portfolios = get(portfoliosState)
    return portfolios.find((p) => p.id === portfolioId)
  },
  set: (portfolioId) => ({ set }, newValue) => {
    set(portfoliosState, (prevValue) => {
      if (newValue instanceof DefaultValue) return newValue
      return produce(prevValue, (draft) => {
        const portfolioIndex = draft.findIndex((p) => p.id === portfolioId)
        if (!newValue) return
        draft[portfolioIndex] = newValue
      })
    })
  },
})

export const rebalancingState = selectorFamily<string, number>({
  key: 'rebalancingState',
  get: (portfolioId: number) => ({ get }) => {
    return get(portfolioState(portfolioId))?.rebalancing ?? 'Anually'
  },
  set: (portfolioId) => ({ set }, newValue) => {
    set(portfolioState(portfolioId), (prevValue) => {
      if (newValue instanceof DefaultValue) return newValue
      if (!prevValue) return
      return {
        ...prevValue,
        rebalancing: newValue,
      }
    })
  },
})

export const updateDateRange = (
  state: LabSettingState,
  key: keyof LabSettingState['dateRange'],
  value: MonthYearValue
) =>
  produce(state, (draft) => {
    draft.dateRange[key] = value
  })

export function useCashflowState() {
  return useRecoilState(cashflowsState)
}

export function useInitialAmountState() {
  return useRecoilState(initialAmountState)
}

export function usePortfoliosState() {
  return useRecoilState(portfoliosState)
}

export function useNextPortfolioIdState() {
  return useRecoilState(nextPortfolioIdState)
}

export function usePortfoliosAction() {
  const set = useSetRecoilState(portfoliosState)
  const [nextId, setNextId] = useNextPortfolioIdState()

  const append = useCallback(() => {
    const processedPortfolio: Portfolio = {
      id: nextId,
      name: `Portfolio ${nextId}`,
      assets: [],
      rebalancing: 'Anually',
    }
    set((prev) => prev.concat(processedPortfolio))
    setNextId(nextId + 1)
    return processedPortfolio
  }, [set, nextId, setNextId])

  const updateById = useCallback(
    (id: number, assets: AssetWeight[]) => {
      set((prev) =>
        produce(prev, (draft) => {
          const selected = draft.find((p) => p.id === id)
          if (!selected) return
          selected.assets = assets
        })
      )
    },
    [set]
  )

  const cancelPortfolioCreate = useCallback(() => {
    set((prev) => prev.slice(0, prev.length - 1))
    setNextId((prevId) => prevId - 1)
  }, [set, setNextId])

  return { append, updateById, cancelPortfolioCreate }
}

export function useUniqueTickersValue() {
  return useRecoilValue(uniqueTickersState)
}

export function useRebalancingState(portfolioId: number) {
  return useRecoilState(rebalancingState(portfolioId))
}

export function useDateRangeValue() {
  return useRecoilValue(dateRangeState)
}
