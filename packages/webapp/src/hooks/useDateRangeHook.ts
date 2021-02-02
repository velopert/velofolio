import { useMemo, useState } from 'react'
import { MonthYearValue } from '../types/MonthYearValue'

export default function useDateRangeHook() {
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

  const [startDate, setStartDate] = useState<MonthYearValue>({
    year: 1985,
    month: 1,
  })
  const [endDate, setEndDate] = useState<MonthYearValue>(today)
  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    maxDate: today,
    minDate: firstMonth,
  }
}
