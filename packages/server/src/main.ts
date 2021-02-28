const numbers = [1, 1, 1, 1, 1, 1]

function maxDrawdown(array: number[]) {
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

console.log(maxDrawdown(numbers))
