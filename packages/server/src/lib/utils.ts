export const periodToMonthsMap: Record<string, number> = {
  monthly: 1,
  quaterly: 3, // TODO: remove me typo
  quarterly: 3,
  'semi-annually': 6,
  'semi-anually': 6, // TODO: remove me typo
  annually: 12, // TODO: remove me typo
  anually: 12, // TODO: remove me typo
}

export function convertPeriodToMonth(period: string) {
  const lowerCased = period.toLowerCase()
  return periodToMonthsMap[lowerCased] || null
}
