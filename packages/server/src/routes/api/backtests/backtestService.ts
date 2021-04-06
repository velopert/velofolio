import { Asset } from 'entity/Asset'
import { Backtest } from 'entity/Backtest'
import { Portfolio } from 'entity/Portfolio'
import { PortfolioAssetWeight } from 'entity/PortfolioAssetWeight'
import { User } from 'entity/User'
import upload from 'lib/aws/upload'
import { generateBacktestChart } from 'lib/chart/generateBacktestChart'
import CustomError from 'lib/CustomError'
import { convertPeriodToMonth } from 'lib/utils'
import { getManager, getRepository, LessThan } from 'typeorm'
import { BacktestDataBody } from 'types/backtests/backtestData/body'

export const backtestService = {
  async getBacktest(id: number) {
    const backtest = await getRepository(Backtest).findOne(id, {
      relations: [
        'user',
        'portfolios',
        'portfolios.asset_weights',
        'portfolios.asset_weights.asset',
      ],
    })
    if (!backtest) {
      const e = new CustomError({
        statusCode: 404,
        message: 'Backtest does not exist',
        name: 'NotFoundError',
      })
      throw e
    }
    return backtest.serialize()
  },
  async getBacktests({ userId, cursor }: { userId?: number; cursor?: number }) {
    const backtests = await getRepository(Backtest).find({
      where: {
        ...(cursor ? { id: LessThan(cursor) } : {}),
        ...(userId ? { user: { id: userId } } : {}),
      },
      relations: [
        'user',
        'portfolios',
        'portfolios.asset_weights',
        'portfolios.asset_weights.asset',
      ],
      take: 20,
      order: {
        id: 'DESC',
      },
    })
    return backtests.map((b) => b.serialize())
  },
  async createBacktest(backtestBody: BacktestDataBody, user: User) {
    const {
      indicators,
      returns,
      title,
      data: { cashflows, dateRange, initialAmount, portfolios },
    } = backtestBody

    const backtest = new Backtest()
    backtest.user = user
    backtest.title = title
    backtest.body = ''
    backtest.is_private = false
    backtest.initial_amount = initialAmount
    backtest.thumbnail = ''

    const fileDir = await generateBacktestChart(returns)
    await upload(fileDir, `backtest_chart/${backtest.id}.png`)
    backtest.thumbnail = `backtest_chart/${backtest.id}.png`

    const { startDate, endDate } = dateRange

    backtest.start_date = new Date(startDate.year, startDate.month - 1)
    backtest.end_date = new Date(endDate.year, endDate.month - 1)

    if (cashflows.enabled) {
      backtest.cashflow_interval =
        convertPeriodToMonth(cashflows.period) ?? undefined
      backtest.cashflow_value = cashflows.amount
    }

    const manager = getManager()

    const portfoliosPromise = portfolios.map(async (p, i) => {
      const portfolio = new Portfolio()
      portfolio.backtest = backtest
      portfolio.name = p.name
      portfolio.user = user
      portfolio.rebalancing = convertPeriodToMonth(p.rebalancing) ?? undefined
      portfolio.sharpe = indicators[i].sharpe ?? undefined
      portfolio.cagr = indicators[i].cagr ?? undefined
      portfolio.asset_weights = p.assets.map((a) => {
        const assetWeight = new PortfolioAssetWeight()
        assetWeight.asset = new Asset()
        assetWeight.asset.id = a.id
        assetWeight.asset.ticker = a.ticker
        assetWeight.asset.image = a.image
        assetWeight.weight = a.weight
        return assetWeight
      })
      await manager.save(portfolio.asset_weights)
      return portfolio
    })

    const portfoliosData = await Promise.all(portfoliosPromise)
    await manager.save(portfoliosData)

    backtest.portfolios = portfoliosData

    await manager.save(backtest)

    return backtest.serialize()
  },

  async updateBacktest(id: number, backtestBody: BacktestDataBody, user: User) {
    const backtest = await getRepository(Backtest).findOne(id, {
      relations: [
        'user',
        'portfolios',
        'portfolios.asset_weights',
        'portfolios.asset_weights.asset',
      ],
    })
    if (!backtest) {
      const e = new CustomError({
        statusCode: 404,
        message: 'Backtest does not exist',
        name: 'NotFoundError',
      })
      throw e
    }

    if (backtest.user.id !== user.id) {
      throw new CustomError({
        statusCode: 403,
        message: 'You have no permission to update this backtest',
        name: 'UnauthorizedError',
      })
    }

    const {
      indicators,
      returns,
      title,
      data: { cashflows, dateRange, initialAmount, portfolios },
    } = backtestBody

    backtest.title = title
    backtest.initial_amount = initialAmount

    const fileDir = await generateBacktestChart(returns)
    await upload(fileDir, `backtest_chart/${backtest.id}.png`)
    backtest.thumbnail = `backtest_chart/${backtest.id}.png`

    const { startDate, endDate } = dateRange

    backtest.start_date = new Date(startDate.year, startDate.month - 1)
    backtest.end_date = new Date(endDate.year, endDate.month - 1)

    if (cashflows.enabled) {
      backtest.cashflow_interval =
        convertPeriodToMonth(cashflows.period) ?? undefined
      backtest.cashflow_value = cashflows.amount
    }

    // create new portfolio
    const tempPortfolios = portfolios.filter((p) => p.isTemp)
    const manager = getManager()

    const tempPortfoliosPromise = tempPortfolios.map(async (p, i) => {
      const portfolio = new Portfolio()
      portfolio.backtest = backtest

      portfolio.name = p.name
      portfolio.user = user
      portfolio.rebalancing = convertPeriodToMonth(p.rebalancing) ?? undefined
      portfolio.sharpe = indicators[i].sharpe ?? undefined
      portfolio.cagr = indicators[i].cagr ?? undefined
      portfolio.asset_weights = p.assets.map((a) => {
        const assetWeight = new PortfolioAssetWeight()
        assetWeight.asset = new Asset()
        assetWeight.asset.id = a.id
        assetWeight.asset.ticker = a.ticker
        assetWeight.asset.image = a.image
        assetWeight.weight = a.weight
        return assetWeight
      })
      await manager.save(portfolio.asset_weights)
      return portfolio
    })

    const tempPortfoliosData = await Promise.all(tempPortfoliosPromise)
    await manager.save(tempPortfoliosData)

    // edit portfolios
    const savedPortfolios = portfolios.filter((p) => !p.isTemp)
    const savedPortfolioIds = savedPortfolios.map((sp) => sp.id)
    const savedPortfoliosData = backtest.portfolios.filter((p) =>
      savedPortfolioIds.includes(p.id)
    )

    // remove and recreate assets
    await Promise.all(
      savedPortfoliosData.map((p) =>
        getRepository(PortfolioAssetWeight).remove(p.asset_weights)
      )
    )
    const updatedPortfolios = await Promise.all(
      savedPortfoliosData.map(async (p) => {
        const raw = savedPortfolios.find((rp) => rp.id === p.id)
        if (!raw) return p
        p.asset_weights = raw?.assets.map((a) => {
          const assetWeight = new PortfolioAssetWeight()
          assetWeight.asset = new Asset()
          assetWeight.asset.id = a.id
          assetWeight.asset.ticker = a.ticker
          assetWeight.asset.image = a.image
          assetWeight.weight = a.weight
          assetWeight.portfolio = p
          return assetWeight
        })
        await manager.save(p.asset_weights)
        return p
      })
    )

    // remove portfolio
    const allRawId = portfolios.map((p) => p.id)
    const removedPortfolios = backtest.portfolios.filter(
      (p) => !allRawId.includes(p.id)
    )
    if (removedPortfolios.length > 0) {
      await getRepository(Portfolio).remove(removedPortfolios)
    }

    const portfoliosData = [...updatedPortfolios, ...tempPortfoliosData]
    backtest.portfolios = portfoliosData
    await manager.save(backtest)
    return backtest.serialize()
  },
}
