import { User } from 'entity/User'
import { FastifyPluginAsync } from 'fastify'
import userPlugin from 'plugins/userPlugin'
import UpdateUserBodySchema from 'schema/me/updateUser/body.json'
import { getRepository } from 'typeorm'
import { UpdateUserBody } from 'types/me/updateUser/body'

const meRoute: FastifyPluginAsync = async (fastify, opts) => {
  fastify.register(userPlugin, { fetchUser: true })

  /**
   * GET /api/me
   */
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

    reply.send({ ...user, member_id: user.member_id })
  })

  /**
   * PATCH /api/me
   */
  fastify.patch<{ Body: UpdateUserBody }>(
    '/',
    {
      schema: {
        body: UpdateUserBodySchema,
      },
    },
    async (request, reply) => {
      const userRepo = getRepository(User)
      const { username } = request.body
      const { userData } = request

      if (username) {
        if (request.userData?.username) {
          reply.status(403)
          const error = new Error('Username already set')
          error.name = 'UsernameAlreadySetError'
          throw error
        }
        if (!/^[a-zA-Z0-9]{4,16}$/.test(username)) {
          reply.status(400)
          const error = new Error(
            'Username should be 4 ~ 16 alphanumeric letters'
          )
          error.name = 'UsernameBadFormatError'
          throw error
        }

        const usernameExists = await userRepo.findOne({
          username: username,
        })
        if (usernameExists) {
          reply.status(409)
          const error = new Error('Username exists')
          error.name = 'DuplicatedUsernameError'
          throw error
        }
        userData!.username = username
        await userRepo.save(userData!)
      }

      reply.send({
        ...userData,
        member_id: userData!.member_id,
      })
    }
  )
}

export default meRoute
