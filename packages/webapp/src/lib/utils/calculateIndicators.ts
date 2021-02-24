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
