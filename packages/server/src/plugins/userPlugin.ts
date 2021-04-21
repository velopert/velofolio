import { User } from 'entity/User'
import { FastifyPluginAsync, FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'
import CustomError from 'lib/CustomError'
import { getRepository } from 'typeorm'

const callback: FastifyPluginAsync<{ fetchUser: boolean }> = async (
  fastify,
  opts
) => {
  const { fetchUser = true } = opts
  fastify.decorateRequest('userData', null)
  fastify.addHook('preHandler', async (request, reply) => {
    if (!request.user) {
      reply.status(401)
      throw new Error('Unauthorized')
    }
    if (fetchUser) {
      const userData = await getRepository(User).findOne(request.user.id)
      request.userData = userData ?? null
      if (!userData) {
        throw new CustomError({
          statusCode: 401,
          name: 'UnauthorizedError',
          message: 'Not logged in',
        })
      }
    }
  })
}

declare module 'fastify' {
  interface FastifyRequest {
    userData: User | null
  }
}

const userPlugin = fp(callback, {
  name: 'userPlugin',
})

export default userPlugin
