import { User } from 'entity/User'
import { FastifyPluginAsync, FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'
import { getRepository } from 'typeorm'

const callback: FastifyPluginAsync<{ fetchUser: boolean }> = async (
  fastify,
  opts = { fetchUser: true }
) => {
  fastify.decorateRequest('userData', null)
  fastify.addHook('preHandler', async (request, reply) => {
    if (!request.user) {
      reply.status(401)
      throw new Error('Unauthorized')
    }
    if (opts.fetchUser) {
      const userData = await getRepository(User).findOne(request.user.id)
      request.userData = userData ?? null
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
