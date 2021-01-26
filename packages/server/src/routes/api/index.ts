import { FastifyPluginCallback } from 'fastify'
import assetsRoute from './assets'

const apiRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(assetsRoute, { prefix: '/assets' })
  done()
}

export default apiRoute
