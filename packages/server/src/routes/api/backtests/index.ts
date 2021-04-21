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

  /**
   * GET /api/backtests/:id
   */
  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const parsedId = parseInt(request.params.id)
    return backtestService.getBacktest(parsedId)
  })

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
    async (request) => {
      const { body, userData } = request
      return backtestService.createBacktest(body, userData!)
    }
  )

  /**
   * PUT /api/backtests/:id
   */
  fastify.put<{ Body: BacktestDataBody; Params: { id: string } }>(
    '/:id',
    { schema: { body: ProjectDataBodySchema } },
    async (request) => {
      const { body, userData } = request
      const id = parseInt(request.params.id, 10)
      return backtestService.updateBacktest(id, body, userData!)
    }
  )

  /**
   * DELETE /api/backtests/:id
   */
  fastify.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const { userData } = request
    const id = parseInt(request.params.id, 10)
    await backtestService.deleteBacktest(id, userData!)
    reply.status(204)
  })
  // fastify.put<{ Body: BacktestDataBody; Params: { id: string } }>('/:id', {
  //   schema: { body: ProjectDataBodySchema },
  //   async (request, reply) => {}
  // })
}

export default backtestsRoute
