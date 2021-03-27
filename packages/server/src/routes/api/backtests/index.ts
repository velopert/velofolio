import { Asset } from 'entity/Asset'
import { Backtest } from 'entity/Backtest'
import { Portfolio } from 'entity/Portfolio'
import { PortfolioAssetWeight } from 'entity/PortfolioAssetWeight'
import { FastifyPluginAsync } from 'fastify'
import upload from 'lib/aws/upload'
import { generateBacktestChart } from 'lib/chart/generateBacktestChart'
import { convertPeriodToMonth } from 'lib/utils'
import userPlugin from 'plugins/userPlugin'
import ProjectDataBodySchema from 'schema/backtests/backtestData/body.json'
import GetBacktestsQuerystringSchema from 'schema/backtests/getBacktests/querystring.json'
import { getManager, getRepository, LessThan, MoreThan } from 'typeorm'
import { BacktestDataBody } from 'types/backtests/backtestData/body'
import { GetBacktestsQuerystring } from 'types/backtests/getBacktests/querystring'
import { backtestService } from './backtestService'

const backtestsRoute: FastifyPluginAsync = async (fastify, opts) => {
  /**
   * GET /api/backtests
   */
  fastify.get<{ Querystring: GetBacktestsQuerystring }>(
    '/',
    { schema: { querystring: GetBacktestsQuerystringSchema } },
    async (request, reply) => {
      const { cursor, user_id } = request.query
      return backtestService.getBacktests({
        userId: user_id,
        cursor,
      })
    }
  )

  fastify.register(protectedRoute, { prefix: '' })
}

const protectedRoute: FastifyPluginAsync = async (fastify) => {
  fastify.register(userPlugin, { fetchUser: true })
  /**
   * POST /api/backtests
   */
  fastify.post<{ Body: BacktestDataBody }>(
    '/',
    { schema: { body: ProjectDataBodySchema } },
    async (request, reply) => {
      const { body, userData } = request
      const { indicators } = body
      const { cashflows } = body.data
      const backtest = new Backtest()
      backtest.user = userData!
      backtest.title = body.title
      backtest.body = ''
      backtest.is_private = false
      backtest.initial_amount = body.data.initialAmount
      backtest.thumbnail = ''
      const { startDate, endDate } = body.data.dateRange

      backtest.start_date = new Date(startDate.year, startDate.month - 1)
      backtest.end_date = new Date(endDate.year, endDate.month - 1)

      if (cashflows.enabled) {
        backtest.cashflow_interval =
          convertPeriodToMonth(cashflows.period) ?? undefined
        backtest.cashflow_value = cashflows.amount
      }
      /*
        TODO: 
         1. Create Portfolios
         2. Create PortfolioAssetWeight
         3. Link PortfolioAssetWeight -> Portfolio
         4. Link Portfolio -> Backtest
         5. Save Backtest
      */

      const manager = getManager()

      const portfoliosPromise = body.data.portfolios.map(async (p, i) => {
        const portfolio = new Portfolio()
        portfolio.backtest = backtest
        portfolio.name = p.name
        portfolio.user = userData!
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

      const portfolios = await Promise.all(portfoliosPromise)
      await manager.save(portfolios)

      backtest.portfolios = portfolios

      const fileDir = await generateBacktestChart(body.returns)
      const result = await upload(fileDir, `backtest_chart/${backtest.id}.png`)
      backtest.thumbnail = `backtest_chart/${backtest.id}.png`
      await manager.save(backtest)

      return backtest.serialize()
    }
  )
}

export default backtestsRoute
