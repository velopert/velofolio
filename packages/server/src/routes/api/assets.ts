import { FastifyPluginCallback } from 'fastify'
import { getRepository } from 'typeorm'
import { Asset } from '../../entity/Asset'

interface SearchAssetQuery {}
interface Headers {}

const assetsRoute: FastifyPluginCallback = (fastify, opts, done) => {
  // autocomplete
  fastify.get<{ Querystring: { keyword: string } }>(
    '/',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            keyword: { type: 'string' },
          },
          required: ['keyword'],
        },
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

  fastify.get<{ Params: { ticker: string } }>(
    '/:ticker',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            ticker: { type: 'string' },
          },
          required: ['ticker'],
        },
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
      reply.send(asset)
    }
  )
  done()
}

export default assetsRoute
