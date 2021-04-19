import {
  atom,
  DefaultValue,
  selector,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil'
import { MonthYearValue } from '../types/MonthYearValue'
import produce from 'immer'
import { useCallback } from 'react'
import { AssetWeight } from './assetsState'
import { useReportValue } from './reportState'
import { Backtest } from '../lib/api/backtests/types'
import { convertIntervalToPeriod } from '../lib/constants'
import { UserSerialized } from '../lib/api/types'
import { useAssetDetailsActions } from './assetDetailsState'

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
  isTemp?: boolean
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

// TODO: separate into multiple atoms
export const labSettingState = atom({
  key: 'labSettingState',
  default: initialState,
})

export const projectTitleState = atom({
  key: 'projectTitleState',
  default: 'My Project',
})

export const labLoadingState = atom({
  key: 'labLoadingState',
  default: false,
})

export const isCreatingState = atom({
  key: 'isCreatingState',
  default: false,
})

export const backtestAuthorState = atom<UserSerialized | null>({
  key: 'backtestAuthorState',
  default: null,
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

export const portfolioNameState = selectorFamily<string, number>({
  key: 'portfolioNameState',
  get: (portfolioId: number) => ({ get }) => {
    return get(portfolioState(portfolioId))?.name ?? ''
  },
  set: (portfolioId) => ({ set }, newValue) => {
    set(portfolioState(portfolioId), (prevValue) => {
      if (newValue instanceof DefaultValue) return newValue
      if (!prevValue) return
      return {
        ...prevValue,
        name: newValue,
      }
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

export const hasPortfolio = selector({
  key: 'hasPortfolio',
  get: ({ get }) =>
    get(labSettingState).portfolios.filter((p) => p.assets.length > 0).length >
    0,
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
      isTemp: true,
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

  const remove = useCallback(
    (id: number) => {
      set((prev) => prev.filter((portfolio) => portfolio.id !== id))
    },
    [set]
  )

  return { append, updateById, cancelPortfolioCreate, remove }
}

export function useUniqueTickersValue() {
  return useRecoilValue(uniqueTickersState)
}

export function useRebalancingState(portfolioId: number) {
  return useRecoilState(rebalancingState(portfolioId))
}

export function usePortfolioNameState(portfolioId: number) {
  return useRecoilState(portfolioNameState(portfolioId))
}

export function useDateRangeValue() {
  return useRecoilValue(dateRangeState)
}

export function useProjectTitleState() {
  return useRecoilState(projectTitleState)
}

export function useLabDataValue() {
  const { nextPortfolioId, ...rest } = useRecoilValue(labSettingState)
  const projectTitle = useRecoilValue(projectTitleState)

  return {
    title: projectTitle,
    data: rest,
  }
}

export function useLabLoadingState() {
  return useRecoilState(labLoadingState)
}

export function useSetLabLoading() {
  return useSetRecoilState(labLoadingState)
}

export function useHasPortfolio() {
  return useRecoilValue(hasPortfolio)
}

/**
 * Sync remote backtest data to state
 */
export function useLabSettingSync() {
  const setLabSetting = useSetRecoilState(labSettingState)
  const setProjectTitle = useSetRecoilState(projectTitleState)
  const setBacktestAuthor = useSetRecoilState(backtestAuthorState)
  const { loadTicker } = useAssetDetailsActions()

  const sync = useCallback(
    (backtest: Backtest) => {
      const uniqueTickers = backtest.portfolios.flatMap((p) =>
        p.assets.map((a) => a.ticker)
      )

      uniqueTickers.forEach(loadTicker)
      setBacktestAuthor(backtest.user)
      setProjectTitle(backtest.title)
      setLabSetting({
        cashflows: {
          amount: backtest.cashflow_value || 1000,
          enabled: backtest.cashflow_value !== null,
          period: convertIntervalToPeriod(backtest.cashflow_interval || 12),
        },
        dateRange: {
          startDate: {
            year: new Date(backtest.start_date).getFullYear(),
            month: new Date(backtest.start_date).getMonth() + 1,
          },
          endDate: {
            year: new Date(backtest.end_date).getFullYear(),
            month: new Date(backtest.end_date).getMonth() + 1,
          },
        },
        initialAmount: backtest.initial_amount,
        nextPortfolioId: backtest.portfolios.length + 1,
        portfolios: backtest.portfolios.map((portfolio) => ({
          assets: portfolio.assets,
          id: portfolio.id,
          name: portfolio.name,
          rebalancing: portfolio.rebalancing
            ? convertIntervalToPeriod(portfolio.rebalancing)
            : 'No Rebalancing',
          isTemp: false,
        })),
      })
    },
    [setProjectTitle, setLabSetting, setBacktestAuthor]
  )

  return sync
}

export function useResetLabSetting() {
  const resetLabSetting = useResetRecoilState(labSettingState)
  const resetLoading = useResetRecoilState(labLoadingState)
  const resetProjectTitle = useResetRecoilState(projectTitleState)
  const resetBacktestAuthor = useResetRecoilState(backtestAuthorState)

  const reset = useCallback(() => {
    resetLabSetting()
    resetLoading()
    resetProjectTitle()
    resetBacktestAuthor()
  }, [resetLabSetting, resetLoading, resetProjectTitle, resetBacktestAuthor])

  return reset
}

export function useSetIsCreating() {
  return useSetRecoilState(isCreatingState)
}

export function useIsCreatingState() {
  return useRecoilState(isCreatingState)
}

export function useBacktestAuthorValue() {
  return useRecoilValue(backtestAuthorState)
}
