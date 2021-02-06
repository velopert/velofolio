import { atom, DefaultValue, selector } from 'recoil'
import { MonthYearValue } from '../types/MonthYearValue'
import produce from 'immer'

export type LabSettingState = {
  dateRange: {
    startDate: MonthYearValue
    endDate: MonthYearValue
  }
  initialAmount: number
  cashflows: {
    enabled: boolean
    amount: number
    period: string
  }
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
    enabled: true,
    amount: 1000,
    period: 'Anually',
  },
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

export const updateDateRange = (
  state: LabSettingState,
  key: keyof LabSettingState['dateRange'],
  value: MonthYearValue
) =>
  produce(state, (draft) => {
    draft.dateRange[key] = value
  })
