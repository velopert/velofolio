import { SocialAccount } from 'entity/SocialAccount'
import { User } from 'entity/User'
import { FastifyPluginCallback } from 'fastify'
import getGoogleProfile from 'lib/google/getGoogleProfile'
import GoogleAccessTokenBodySchema from 'schema/auth/googleAccessToken/body.json'
import { getManager, getRepository } from 'typeorm'
import { GoogleAccessTokenBody } from 'types/auth/googleAccessToken/body'

const authRoute: FastifyPluginCallback = (fastify, opts, done) => {
  // google check user registered
  fastify.post<{ Body: GoogleAccessTokenBody }>(
    '/google/check',
    {
      schema: {
        body: GoogleAccessTokenBodySchema,
      },
    },
    async (request, reply) => {
      const { access_token: accessToken } = request.body
      try {
        const profile = await getGoogleProfile(accessToken)

        // find social account
        const socialAccount = await getRepository(SocialAccount).findOne({
          provider: 'google',
          social_id: profile.socialId,
        })

        reply.send({
          exists: !!socialAccount,
        })
      } catch (e) {
        reply.status(401)
        reply.send({
          code: 401,
          error: 'Google Login Error',
          message: 'Failed to retrieve google profile',
        })
      }
    }
  )

  // google login
  fastify.post<{ Body: GoogleAccessTokenBody }>(
    '/google/signin',
    {
      schema: {
        body: GoogleAccessTokenBodySchema,
      },
    },
    async (request, reply) => {
      const { access_token: accessToken } = request.body
      try {
        const profile = await getGoogleProfile(accessToken)

        const socialAccountRepo = getRepository(SocialAccount)
        // find social account
        const exists = await socialAccountRepo.findOne({
          provider: 'google',
          social_id: profile.socialId,
        })

        if (exists) {
          // TODO: generate accessToken
          reply.send({
            user: null,
            access_token: '',
          })
        } else {
          const manager = getManager()
          const user = new User()
          user.email = profile.email
          user.display_name = profile.displayName
          user.photo_url = profile.photo ?? undefined
          user.is_certified = true
          await manager.save(user)
          const socialAccount = new SocialAccount()
          socialAccount.provider = 'google'
          socialAccount.user = user
          socialAccount.social_id = profile.socialId
          await manager.save(socialAccount)
          // await socialAccountRepo.save(socialAccount)
          reply.send({
            user: user,
            access_token: '',
          })
        }
      } catch (e) {
        console.log(e)
        reply.status(401)
        reply.send({
          code: 401,
          error: 'Google Login Error',
          message: 'Failed to retrieve google profile',
        })
      }
    }
  )

  done()
}

export default authRoute
