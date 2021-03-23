export const periodToMonthsMap: Record<string, number> = {
  monthly: 1,
  quaterly: 3,
  'semi-anually': 6,
  anually: 12,
}

export function convertPeriodToMonth(period: string) {
  const lowerCased = period.toLowerCase()
  return periodToMonthsMap[lowerCased] || null
}
