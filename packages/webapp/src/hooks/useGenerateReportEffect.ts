import { useEffect, useMemo } from 'react'
import {
  useHistoricalPricesState,
  useTB3HistoricalPricesState,
} from '../atoms/historicalPricesState'
import {
  Cashflows,
  Portfolio,
  useCashflowState,
  useDateRangeValue,
  useInitialAmountState,
  usePortfoliosState,
} from '../atoms/labSettingState'
import { Indicator, PortfolioResult, useSetReport } from '../atoms/reportState'
import { HistoricalPrice } from '../lib/api/assets/types'
import useUnfetchedTickers from './useUnfetchedTickers'
import useFirstHistoricalDate from './useFirstHistoricalDate'
import { periodToMonthsMap } from '../lib/constants'
import {
  cagr,
  maxDrawdown,
  sharpeRatio,
  sortinoRatio,
  stdev,
} from '../lib/utils/calculateIndicators'
import useDateRangeHook from './useDateRangeHook'

type GenerateReportDataParams = {
  initialAmount: number
  portfolios: Portfolio[]
  pricesByTicker: Record<string, HistoricalPrice[]>
  startDate: Date
  lastDate: Date
  cashflows: Cashflows
  tb3HistoricalPrices: HistoricalPrice[]
}

const initialIndicator: Indicator = {
  finalBalance: 0,
  cagr: 0,
  stdev: 0,
  mdd: 0,
  sharpeRatio: 0,
  sortinoRatio: null,
  best: { year: 0, month: 0 },
  worst: { year: 0, month: 0 },
}

type IndicatorRecord = Record<number, Indicator>

function generateReportData({
  initialAmount,
  portfolios,
  pricesByTicker,
  startDate,
  lastDate,
  cashflows,
  tb3HistoricalPrices,
}: GenerateReportDataParams): PortfolioResult[] {
  // 1. filter prices that contains date bigger than given start date

  const startTime = new Date(startDate).getTime()
  const lastTime = lastDate.getTime()

  const filterByTime = (hp: HistoricalPrice) => {
    const d = new Date(hp.date)
    return d.getTime() >= startTime && d.getTime() < lastTime
  }

  const filteredPricesByTicker = Object.entries(pricesByTicker).reduce(
    (acc, [ticker, prices]) => {
      acc[ticker] = prices.filter(filterByTime)
      return acc
    },
    {} as typeof pricesByTicker
  )
  /* day - 1 since each historical price is the rate of the first day of the month
        2020-01-01 -> 2019-12-31
     filter startDate
  */
  const processedTB3HistoricalPrices = tb3HistoricalPrices
    .map((hp) => {
      const d = new Date(hp.date)
      d.setDate(0)
      return {
        ...hp,
        date: d.toISOString(),
      }
    })
    .filter(filterByTime)

  // 1.5. calculate risk free rate
  const riskFreeRates = processedTB3HistoricalPrices.map(
    (hp) => hp.close / 3 / 100
  )

  // 2. generate report data based on portfolios
  const monthsCount = Object.values(filteredPricesByTicker)[0].length
  const months = Object.values(filteredPricesByTicker)[0].map((hp) => hp.date)
  if (riskFreeRates.length < months.length - 1) {
    riskFreeRates.push(riskFreeRates[riskFreeRates.length - 1])
  }

  return portfolios.map((portfolio) => {
    const yearlyBalance: { date: Date; balance: number }[] = []
    const yearlyBalanceWOC: { date: Date; balance: number }[] = []
    const yearlyBalances = [yearlyBalance, yearlyBalanceWOC]
    const fixedYearlyBalance: { date: Date; balance: number }[] = []
    const indicator: Indicator = { ...initialIndicator }

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

    fixedYearlyBalance.push({
      date: new Date(months[0]),
      balance: initialAmount,
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
        const monthsPeriod = periodToMonthsMap[cashflows.period] ?? null
        if (monthsPeriod && i % monthsPeriod === 0) {
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
        const monthsPeriod = periodToMonthsMap[portfolio.rebalancing] ?? null
        if (monthsPeriod && i % monthsPeriod === 0) {
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

      const d = new Date(months[i])
      if (d.getMonth() === 11 || i === monthsCount - 1) {
        fixedYearlyBalance.push({
          date: d,
          balance: totalAmountWOC,
        })
      }

      if (i % 12 === 0) {
        yearlyBalance.push({
          date: d,
          balance: totalAmount,
        })
        yearlyBalanceWOC.push({
          date: d,
          balance: totalAmountWOC,
        })
      }

      dataset.push(totalAmount)
      datasetWOC.push(totalAmountWOC)
    }

    /* this rate includes cashflow
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
    */

    const monthlyRateWOC = datasetWOC.reduce<number[]>(
      (acc, current, i, arr) => {
        if (i === 0) return acc
        const prev = arr[i - 1]
        const diff = current - prev
        const rate = diff / prev
        acc.push(rate)
        return acc
      },
      []
    )

    const yearlyRateWOC = yearlyBalanceWOC.reduce<number[]>(
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

    const fixedYearlyRate = fixedYearlyBalance.reduce<
      {
        year: number
        rate: number
      }[]
    >((acc, current, i, array) => {
      if (i === 0) return acc
      const prev = array[i - 1]
      const rate = current.balance / prev.balance - 1
      acc.push({
        year: new Date(current.date).getFullYear(),
        rate,
      })
      return acc
    }, [])

    const best = {
      year: Math.max(...yearlyRateWOC),
      month: Math.max(...monthlyRateWOC),
    }
    const worst = {
      year: Math.min(...yearlyRateWOC),
      month: Math.min(...monthlyRateWOC),
    }

    indicator.finalBalance = dataset[dataset.length - 1]
    indicator.cagr = cagr({
      beginningValue: initialAmount,
      endingValue: datasetWOC[datasetWOC.length - 1],
      yearsCount: monthsCount / 12,
    })
    indicator.mdd = maxDrawdown(datasetWOC)
    indicator.stdev = stdev(monthlyRateWOC) * Math.sqrt(12) // Annualized
    indicator.sharpeRatio = sharpeRatio(monthlyRateWOC, riskFreeRates)
    indicator.sortinoRatio = sortinoRatio(monthlyRateWOC, riskFreeRates)
    indicator.best = best
    indicator.worst = worst
    // indicator.sortinoRatio = sortinoRatio(monthlyRateWOC, riskFreeRates)

    return {
      id: portfolio.id,
      name: portfolio.name,
      returns: dataset.map((value, i) => ({
        x: new Date(months[i]),
        y: value,
      })),
      monthlyRate: monthlyRateWOC.map((rate, i) => ({
        x: new Date(months[i]),
        y: rate,
      })),
      yearlyRate: fixedYearlyRate.map((rate, i) => ({
        x: rate.year,
        y: rate.rate,
      })),
      indicator,
    }
  })
}

export default function useGenerateReportEffect() {
  const [initialAmount] = useInitialAmountState()
  const [{ pricesByTicker }] = useHistoricalPricesState()
  const firstHistoricalDate = useFirstHistoricalDate()
  const [cashflows] = useCashflowState()
  const dateRange = useDateRangeValue()

  const [portfolios] = usePortfoliosState()
  const unfetchedTickers = useUnfetchedTickers()
  const [{ prices: tb3HistoricalPrices }] = useTB3HistoricalPricesState()
  const setReport = useSetReport()

  const { setStartDate } = useDateRangeHook()

  const startDate = useMemo(() => {
    const { year, month } = dateRange.startDate
    if (!firstHistoricalDate) return null
    const configuredStartDate = new Date(year, month - 2)

    return firstHistoricalDate.date > configuredStartDate
      ? firstHistoricalDate.date
      : configuredStartDate
  }, [firstHistoricalDate, dateRange])

  useEffect(() => {
    if (!startDate) return
    const date = new Date(startDate.getFullYear(), startDate.getMonth() + 2)
    const startDateInfo = {
      year: date.getFullYear(),
      month: date.getMonth(),
    }

    // configured
    const { year: cYear, month: cMonth } = dateRange.startDate
    // managed
    const { year: mYear, month: mMonth } = startDateInfo

    if (cYear !== mYear || cMonth !== mMonth) {
      setStartDate({
        month: mMonth,
        year: mYear,
      })
    }
  }, [startDate, dateRange.startDate, setStartDate])

  useEffect(() => {
    if (unfetchedTickers.length > 0 || !startDate) {
      return
    }
    if (!tb3HistoricalPrices) return

    const validPortfolios = portfolios.filter((p) => p.assets.length !== 0)

    const report = generateReportData({
      initialAmount,
      portfolios: validPortfolios,
      pricesByTicker,
      startDate,
      cashflows,
      lastDate: new Date(dateRange.endDate.year, dateRange.endDate.month), // + 1month,
      tb3HistoricalPrices,
    })
    setReport(report)
  }, [
    initialAmount,
    pricesByTicker,
    startDate,
    portfolios,
    unfetchedTickers,
    cashflows,
    dateRange,
    tb3HistoricalPrices,
    setReport,
  ])
  // check unfetchedTickers is empty before fetch
}
