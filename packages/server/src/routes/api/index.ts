import { FastifyPluginCallback } from 'fastify'
import assetsRoute from './assets'
import authRoute from './auth'

const apiRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(assetsRoute, { prefix: '/assets' })
  fastify.register(authRoute, { prefix: '/auth' })
  done()
}

export default apiRoute
