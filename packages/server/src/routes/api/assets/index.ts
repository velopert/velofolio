import { FastifyPluginCallback } from 'fastify'
import {
  Between,
  getRepository,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm'
import { Asset } from '../../../entity/Asset'
import AutocompleteQuerystringSchema from 'schema/assets/autocomplete/querystring.json'
import GetTickerParamsSchema from 'schema/assets/getTicker/params.json'
import GetHistoricalPricesParamsSchema from 'schema/assets/getHistoricalPrices/params.json'
import GetHistoricalPricesQuerystringSchema from 'schema/assets/getHistoricalPrices/querystring.json'

import { AutocompleteQuerystring } from 'types/assets/autocomplete/querystring'
import { GetTickerParams } from 'types/assets/getTicker/params'
import { GetHistoricalPricesParams } from 'types/assets/getHistoricalPrices/params'
import { GetHistoricalPricesQuerystring } from 'types/assets/getHistoricalPrices/querystring'
import { HistoricalPrice } from 'entity/HistoricalPrice'
import Etag from 'fastify-etag'

interface SearchAssetQuery {}
interface Headers {}

const assetsRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(Etag)
  // autocomplete
  fastify.get<{ Querystring: AutocompleteQuerystring }>(
    '/',
    {
      schema: {
        querystring: AutocompleteQuerystringSchema,
      },
    },
    (request, reply) => {
      const results = fastify.searchEngine
        .search(request.query.keyword)
        .slice(0, 10)
        .map((result) => ({
          id: result.item.id,
          ticker: result.item.ticker,
          name: result.item.name,
          image: result.item.image,
        }))
      reply.send(results)
    }
  )

  // getTicker
  fastify.get<{ Params: GetTickerParams }>(
    '/:ticker',
    {
      schema: {
        params: GetTickerParamsSchema,
      },
    },
    async (request, reply) => {
      const asset = await getRepository(Asset).findOne({
        where: { ticker: request.params.ticker },
        relations: ['asset_meta', 'sector_weightings'],
      })
      if (!asset) {
        reply.status(404)
        throw new Error('Asset is not found')
      }
      reply.header('Cache-Control', 'max-age=86400')
      reply.send(asset)
    }
  )

  // getHistoricalPrices
  fastify.get<{
    Params: GetHistoricalPricesParams
    Querystring: GetHistoricalPricesQuerystring
  }>(
    '/:ticker/historical-prices',
    {
      schema: {
        params: GetHistoricalPricesParamsSchema,
        querystring: GetHistoricalPricesQuerystringSchema,
      },
    },
    async (request, reply) => {
      const asset = await Asset.findByTicker(request.params.ticker)
      if (!asset) {
        reply.status(404)
        throw new Error('Asset is not found')
      }

      const query = (() => {
        const date = (() => {
          const { from, to } = request.query
          if (!from && !to) return undefined
          if (from && to) {
            return Between(
              new Date(from).toISOString(),
              new Date(to).toISOString()
            )
          }
          if (from) return MoreThanOrEqual(new Date(from).toISOString())
          if (to) return LessThanOrEqual(new Date(to).toISOString())
        })()
        if (date) return { date }
        return {}
      })()

      const historicalPrices = await getRepository(HistoricalPrice).find({
        where: {
          asset_id: asset.id,
          ...query,
        },
        order: { date: 'ASC' },
      })

      // [date, high, low, open, close, adjusted_close]
      const transformed = historicalPrices.map(
        ({ date, high, low, open, close, adjusted_close }) => [
          date,
          high,
          low,
          open,
          close,
          adjusted_close,
        ]
      )
      reply.send(transformed)
    }
  )

  done()
}

export default assetsRoute
