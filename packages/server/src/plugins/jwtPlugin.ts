import { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'
import { decodeToken } from '../lib/token/jwt'

const callback: FastifyPluginCallback = async (fastify, opts, done) => {
  fastify.decorateRequest('user', null)
  fastify.addHook('preHandler', async (request, reply) => {
    const accessToken: string | undefined = request.cookies.access_token
    try {
      const decoded = await decodeToken<UserTokenDecoded>(accessToken)
      request.user = {
        id: decoded.userId,
      }
    } catch (e) {}
  })
  done()
}

const jwtPlugin = fp(callback, {
  name: 'jwtPlugin',
})

export default jwtPlugin

type UserTokenDecoded = {
  subject: string
  userId: number
  iat: number
  exp: number
}

declare module 'fastify' {
  interface FastifyRequest {
    user: null | { id: number }
  }
}
