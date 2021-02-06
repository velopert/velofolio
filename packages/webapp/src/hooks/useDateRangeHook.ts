import { useMemo, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  dateRangeState,
  labSettingState,
  updateDateRange,
} from '../atoms/labSettingState'
import { MonthYearValue } from '../types/MonthYearValue'

export default function useDateRangeHook() {
  const dateRange = useRecoilValue(dateRangeState)
  const setLabSettingState = useSetRecoilState(labSettingState)

  const firstMonth = useMemo(
    () => ({
      year: 1985,
      month: 1,
    }),
    []
  )
  const today = useMemo(() => {
    const d = new Date()
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
    }
  }, [])

  const { startDate, endDate } = dateRange
  const setStartDate = (value: MonthYearValue) =>
    setLabSettingState((state) => updateDateRange(state, 'startDate', value))
  const setEndDate = (value: MonthYearValue) =>
    setLabSettingState((state) => updateDateRange(state, 'endDate', value))

  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    maxDate: today,
    minDate: firstMonth,
  }
}
