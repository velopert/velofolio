import { useEffect, useMemo } from 'react'
import { useHistoricalPricesState } from '../atoms/historicalPricesState'
import {
  Portfolio,
  useInitialAmountState,
  usePortfoliosState,
} from '../atoms/labSettingState'
import { useSetPortfolioReturns } from '../atoms/reportState'
import { HistoricalPrice } from '../lib/api/assets/types'
import chartColors from '../lib/chartColors'
import useUnfetchedTickers from './useUnfetchedTickers'
import { transparentize } from 'polished'
import useFirstHistoricalDate from './useFirstHistoricalDate'

type GenerateReportDataParams = {
  initialAmount: number
  portfolios: Portfolio[]
  pricesByTicker: Record<string, HistoricalPrice[]>
  startDate: Date
}

function generateReportData({
  initialAmount,
  portfolios,
  pricesByTicker,
  startDate,
}: GenerateReportDataParams) {
  // 1. filter prices that contains date bigger than given start date
  const startTime = new Date(startDate).getTime()
  const filteredPricesByTicker = Object.entries(pricesByTicker).reduce(
    (acc, [ticker, prices]) => {
      acc[ticker] = prices.filter(
        (price) => new Date(price.date).getTime() >= startTime
      )
      return acc
    },
    {} as typeof pricesByTicker
  )

  // 2. generate report data based on portfolios
  const monthsCount = Object.values(filteredPricesByTicker)[0].length
  const portfolioChartData = portfolios.map((portfolio) => {
    const dataset: number[] = [initialAmount]
    const tickerValueMap = new Map<string, number>()
    const weightSum = portfolio.assets.reduce(
      (acc, current) => acc + current.weight,
      0
    )

    // set initial amount for each tickers
    portfolio.assets.forEach((asset) => {
      tickerValueMap.set(
        asset.ticker,
        (initialAmount * asset.weight) / weightSum
      )
    })

    for (let i = 1; i < monthsCount; i += 1) {
      portfolio.assets.forEach((asset) => {
        const prices = pricesByTicker[asset.ticker]
        const pricePrev = prices[i - 1].close
        const priceCurrent = prices[i].close
        // const diffRatio = (priceCurrent - pricePrev) / pricePrev
        const currentAmount = tickerValueMap.get(asset.ticker)!
        const priceNext = (priceCurrent / pricePrev) * currentAmount

        tickerValueMap.set(asset.ticker, priceNext)
      })

      const totalAmount = Array.from(tickerValueMap.values()).reduce(
        (acc, current) => acc + current,
        0
      )
      dataset.push(totalAmount)
    }
    return {
      dataset,
      name: portfolio.name,
    }
  })

  const months = Object.values(filteredPricesByTicker)[0].map((hp) => hp.date)
  const portfolioReturns = portfolioChartData.map((chartData, i) => ({
    label: chartData.name,
    lineTension: 0,
    data: chartData.dataset.map((value, i) => ({
      x: new Date(months[i]),
      y: value,
    })),
    borderColor: chartColors[i],
    backgroundColor: transparentize(0.9, chartColors[i]),
  }))

  return {
    portfolioReturns,
  }
}

export default function useGenerateReportEffect() {
  const [initialAmount] = useInitialAmountState()
  const [{ pricesByTicker }] = useHistoricalPricesState()
  const firstHistoricalDate = useFirstHistoricalDate()

  const [portfolios] = usePortfoliosState()
  const unfetchedTickers = useUnfetchedTickers()
  const setPortfolioReturns = useSetPortfolioReturns()

  useEffect(() => {
    if (unfetchedTickers.length > 0 || !firstHistoricalDate) {
      setPortfolioReturns(null)
      return
    }
    const { portfolioReturns } = generateReportData({
      initialAmount,
      portfolios,
      pricesByTicker,
      startDate: firstHistoricalDate?.date,
    })
    setPortfolioReturns(portfolioReturns)
  }, [
    initialAmount,
    pricesByTicker,
    firstHistoricalDate,
    portfolios,
    unfetchedTickers,
    setPortfolioReturns,
  ])
  // check unfetchedTickers is empty before fetch
}
