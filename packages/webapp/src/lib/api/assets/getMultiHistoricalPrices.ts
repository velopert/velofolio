import PromisePool from '@supercharge/promise-pool'
import { getHistoricalPrices } from './getHistoricalPrices'
import { HistoricalPrice } from './types'

export default async function getMultiHistoricalPrices(tickers: string[]) {
  const { results } = await PromisePool.withConcurrency(6)
    .for(tickers)
    .process(async (ticker) => {
      const prices = await getHistoricalPrices(ticker)
      return {
        ticker,
        prices,
      }
    })

  const resultMap = results.reduce((acc, current) => {
    acc.set(current.ticker, current.prices)
    return acc
  }, new Map<string, HistoricalPrice[]>())

  const resultsInOrder = tickers.map((ticker) => resultMap.get(ticker)!)

  return resultsInOrder
}
