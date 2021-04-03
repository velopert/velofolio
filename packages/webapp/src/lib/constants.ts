export const periodOptions: string[] = [
  'Monthly',
  'Quaterly',
  'Semi-anually',
  'Anually',
]
export const periodToMonthsMap: Record<string, number> = {
  Monthly: 1,
  Quaterly: 3,
  'Semi-anually': 6,
  Anually: 12,
}

export function convertIntervalToPeriod(monthsCount: number) {
  return (
    Object.entries(periodToMonthsMap).find(
      ([period, interval]) => interval === monthsCount
    )?.[0] ?? 'Anually'
  )
}
