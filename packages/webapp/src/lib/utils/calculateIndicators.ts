interface CagrParams {
  endingValue: number
  beginningValue: number
  yearsCount: number
}

/**
 * https://www.investopedia.com/terms/c/cagr.asp
 */
export const cagr = ({ endingValue, beginningValue, yearsCount }: CagrParams) =>
  Math.pow(endingValue / beginningValue, 1 / yearsCount) - 1

export const mean = (array: number[]) =>
  array.reduce((acc, current) => acc + current, 0) / array.length

// https://corporatefinanceinstitute.com/resources/knowledge/standard-deviation/
export const stdev = (array: number[]) => {
  const m = mean(array)
  return Math.sqrt(
    array.reduce(function (acc, current) {
      return acc + Math.pow(current - m, 2)
    }, 0) /
      (array.length - 1)
  )
}

/**
 * https://www.investopedia.com/terms/m/maximum-drawdown-mdd.asp
 * https://blogs.cfainstitute.org/investor/2013/02/12/sculpting-investment-portfolios-maximum-drawdown-and-optimal-portfolio-strategy/
 * https://support.heybit.io/ko/articles/2388132-mdd%EB%8A%94-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80%EC%9A%94
 */
export const maxDrawdown = (array: number[]) => {
  let currentMaxDrawdown = 0
  let maxValue = array[0]
  for (let i = 1; i < array.length; i++) {
    const current = array[i]
    const drawdown = (-1 * (maxValue - current)) / maxValue
    currentMaxDrawdown = Math.min(drawdown, currentMaxDrawdown)
    maxValue = Math.max(maxValue, current)
  }
  return currentMaxDrawdown
}

export const sharpeRatio = (
  monthlyRates: number[],
  monthlyRiskFreeRates: number[]
) => {
  const rateDiffs = monthlyRates.map(
    (rate, index) => rate - monthlyRiskFreeRates[index]
  )
  const monthlySharpeRatio = mean(rateDiffs) / stdev(rateDiffs)
  return monthlySharpeRatio * Math.sqrt(12)
}

export const sortinoRatio = (
  monthlyRates: number[],
  monthlyRiskFreeRates: number[]
) => {
  const rateDiffs = monthlyRates.map(
    (rate, index) => rate - monthlyRiskFreeRates[index]
  )
  const rateDiffsMean = mean(rateDiffs)
  const negativeMonthlyRates = monthlyRates.filter((r) => r < 0)
  if (negativeMonthlyRates.length === 0) return null
  return (rateDiffsMean / stdev(negativeMonthlyRates)) * Math.sqrt(12)
}
