export const periodToMonthsMap: Record<string, number> = {
  monthly: 1,
  quarterly: 3,
  'semi-annually': 6,
  annually: 12,
}

export function convertPeriodToMonth(period: string) {
  const lowerCased = period.toLowerCase()
  return periodToMonthsMap[lowerCased] || null
}
