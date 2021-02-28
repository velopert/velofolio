import { useEffect, useMemo } from 'react'
import { useHistoricalPricesState } from '../atoms/historicalPricesState'
import {
  Cashflows,
  Portfolio,
  useCashflowState,
  useDateRangeValue,
  useInitialAmountState,
  usePortfoliosState,
} from '../atoms/labSettingState'
import {
  useSetIndicatorById,
  useSetPortfolioReturns,
} from '../atoms/reportState'
import { HistoricalPrice } from '../lib/api/assets/types'
import chartColors from '../lib/chartColors'
import useUnfetchedTickers from './useUnfetchedTickers'
import { transparentize } from 'polished'
import useFirstHistoricalDate from './useFirstHistoricalDate'
import { periodToMonthsMap } from '../lib/constants'
import { cagr, maxDrawdown, stdev } from '../lib/utils/calculateIndicators'

type GenerateReportDataParams = {
  initialAmount: number
  portfolios: Portfolio[]
  pricesByTicker: Record<string, HistoricalPrice[]>
  startDate: Date
  lastDate: Date
  cashflows: Cashflows
}

interface Indicator {
  finalBalance: number
  cagr: number
  stdev: number
  mdd: number
  sharpeRatio: number
  sortinoRatio: number
}

const initialIndicator: Indicator = {
  finalBalance: 0,
  cagr: 0,
  stdev: 0,
  mdd: 0,
  sharpeRatio: 0,
  sortinoRatio: 9,
}

type IndicatorRecord = Record<number, Indicator>

function generateReportData({
  initialAmount,
  portfolios,
  pricesByTicker,
  startDate,
  lastDate,
  cashflows,
}: GenerateReportDataParams) {
  const indicatorById: IndicatorRecord = {}

  // 1. filter prices that contains date bigger than given start date

  const startTime = new Date(startDate).getTime()
  const lastTime = lastDate.getTime()

  const filteredPricesByTicker = Object.entries(pricesByTicker).reduce(
    (acc, [ticker, prices]) => {
      acc[ticker] = prices.filter((price) => {
        const d = new Date(price.date)
        return d.getTime() >= startTime && d.getTime() < lastTime
      })
      return acc
    },
    {} as typeof pricesByTicker
  )

  // 2. generate report data based on portfolios
  const monthsCount = Object.values(filteredPricesByTicker)[0].length
  const months = Object.values(filteredPricesByTicker)[0].map((hp) => hp.date)
  const portfolioChartData = portfolios.map((portfolio) => {
    const yearlyBalance: { date: Date; balance: number }[] = []
    const yearlyBalanceWOC: { date: Date; balance: number }[] = []
    const yearlyBalances = [yearlyBalance, yearlyBalanceWOC]
    const indicator: Indicator = { ...initialIndicator }
    indicatorById[portfolio.id] = indicator
    const dataset: number[] = [initialAmount]
    const datasetWOC: number[] = [initialAmount]
    const tickerValueMap = new Map<string, number>()
    const tickerValueMapWOC = new Map<string, number>() // without cashflow
    const tickerValueMaps = [tickerValueMap, tickerValueMapWOC]
    const weightSum = portfolio.assets.reduce(
      (acc, current) => acc + current.weight,
      0
    )

    // set initial amount for each tickers
    portfolio.assets.forEach((asset) => {
      tickerValueMaps.forEach((tvm) => {
        tvm.set(asset.ticker, (initialAmount * asset.weight) / weightSum)
      })
    })

    yearlyBalances.forEach((yb) => {
      yb.push({
        date: startDate,
        balance: initialAmount,
      })
    })

    for (let i = 1; i < monthsCount; i += 1) {
      portfolio.assets.forEach((asset) => {
        const prices = filteredPricesByTicker[asset.ticker]
        const pricePrev = prices[i - 1].close
        const priceCurrent = prices[i].close
        // const diffRatio = (priceCurrent - pricePrev) / pricePrev
        const ratio = priceCurrent / pricePrev
        tickerValueMaps.forEach((tvm) => {
          const currentAmount = tvm.get(asset.ticker)!
          const priceNext = ratio * currentAmount
          tvm.set(asset.ticker, priceNext)
        })
      })

      if (cashflows.enabled) {
        const months = periodToMonthsMap[cashflows.period] ?? null
        if (months && i % months === 0) {
          portfolio.assets.forEach((asset) => {
            const currentValue = tickerValueMap.get(asset.ticker)!
            tickerValueMap.set(
              asset.ticker,
              currentValue + (cashflows.amount * asset.weight) / weightSum
            )
          })
        }
      }

      let [totalAmount, totalAmountWOC] = tickerValueMaps.map((tvm) =>
        Array.from(tvm.values()).reduce(
          (acc: number, current: number) => acc + current,
          0
        )
      )

      if (portfolio.rebalancing !== 'No Rebalancing') {
        const months = periodToMonthsMap[portfolio.rebalancing] ?? null
        if (months && i % months === 0) {
          portfolio.assets.forEach((asset) => {
            tickerValueMap.set(
              asset.ticker,
              totalAmount * (asset.weight / weightSum)
            )
            tickerValueMapWOC.set(
              asset.ticker,
              totalAmountWOC * (asset.weight / weightSum)
            )
          })
        }
      }

      if (i % 12 === 0) {
        yearlyBalance.push({
          date: new Date(months[i]),
          balance: totalAmount,
        })
        yearlyBalanceWOC.push({
          date: new Date(months[i]),
          balance: totalAmountWOC,
        })
      }

      dataset.push(totalAmount)
      datasetWOC.push(totalAmountWOC)
    }

    const yearlyProfitRate = yearlyBalance.reduce<number[]>(
      (acc, current, i, array) => {
        if (i === 0) return acc
        const prev = array[i - 1]
        const diff = current.balance - prev.balance
        const rate = diff / prev.balance
        acc.push(rate)
        return acc
      },
      []
    )

    const yearlyProfitRateWOC = yearlyBalanceWOC.reduce<number[]>(
      (acc, current, i, array) => {
        if (i === 0) return acc
        const prev = array[i - 1]
        const diff = current.balance - prev.balance
        const rate = diff / prev.balance
        acc.push(rate)
        return acc
      },
      []
    )

    indicator.finalBalance = dataset[dataset.length - 1]
    indicator.cagr = cagr({
      beginningValue: initialAmount,
      endingValue: datasetWOC[datasetWOC.length - 1],
      yearsCount: monthsCount / 12,
    })
    indicator.mdd = maxDrawdown(datasetWOC)
    indicator.stdev = stdev(yearlyProfitRateWOC)

    return {
      dataset,
      name: portfolio.name,
    }
  })

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
    indicatorById,
  }
}

export default function useGenerateReportEffect() {
  const [initialAmount] = useInitialAmountState()
  const [{ pricesByTicker }] = useHistoricalPricesState()
  const firstHistoricalDate = useFirstHistoricalDate()
  const [cashflows, setCashflows] = useCashflowState()
  const dateRange = useDateRangeValue()

  const [portfolios] = usePortfoliosState()
  const unfetchedTickers = useUnfetchedTickers()
  const setPortfolioReturns = useSetPortfolioReturns()
  const setIndicatorById = useSetIndicatorById()

  const startDate = useMemo(() => {
    const { year, month } = dateRange.startDate
    if (!firstHistoricalDate) return null
    const configuredStartDate = new Date(year, month - 2)

    return firstHistoricalDate.date > configuredStartDate
      ? firstHistoricalDate.date
      : configuredStartDate
  }, [firstHistoricalDate, dateRange])

  useEffect(() => {
    if (unfetchedTickers.length > 0 || !startDate) {
      setPortfolioReturns(null)
      return
    }
    const { portfolioReturns, indicatorById } = generateReportData({
      initialAmount,
      portfolios,
      pricesByTicker,
      startDate,
      cashflows,
      lastDate: new Date(dateRange.endDate.year, dateRange.endDate.month), // + 1month,
    })
    setPortfolioReturns(portfolioReturns)
    setIndicatorById(indicatorById)
  }, [
    initialAmount,
    pricesByTicker,
    startDate,
    portfolios,
    unfetchedTickers,
    setPortfolioReturns,
    cashflows,
    setIndicatorById,
    dateRange,
  ])
  // check unfetchedTickers is empty before fetch
}
