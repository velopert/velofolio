import { User } from 'entity/User'
import { FastifyPluginAsync } from 'fastify'
import userPlugin from 'plugins/userPlugin'
import { getRepository } from 'typeorm'

const meRoute: FastifyPluginAsync = async (fastify, opts) => {
  fastify.register(userPlugin)

  fastify.get('/', async (request, reply) => {
    if (!request.user) {
      reply.status(401)
      const error = new Error('Unauthorized')
      error.name = 'UnauthorizedError'
      throw error
    }

    const user = await getRepository(User).findOne(request.user.id)

    if (!user) {
      reply.status(404)
      const error = new Error('UserNotFound')
      error.name = 'UserNotFoundError'
      throw error
    }

    reply.send(user)
  })
  fastify.get('/testing', async (request, reply) => {
    reply.send({
      data: 'helloworld',
    })
  })
}

export default meRoute
