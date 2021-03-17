import { SocialAccount } from 'entity/SocialAccount'
import { User } from 'entity/User'
import { FastifyPluginCallback } from 'fastify'
import getGoogleProfile from 'lib/google/getGoogleProfile'
import GoogleAccessTokenBodySchema from 'schema/auth/googleAccessToken/body.json'
import GoogleSignupBodySchema from 'schema/auth/googleSignup/body.json'
import { getManager, getRepository } from 'typeorm'
import { GoogleAccessTokenBody } from 'types/auth/googleAccessToken/body'
import { GoogleSignupBody } from 'types/auth/googleSignup/body'

const authRoute: FastifyPluginCallback = (fastify, opts, done) => {
  /**
   * POST /api/auth/google/check
   * Check whether user already has registered
   */
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

  /**
   * POST /api/auth/google/signin
   * Google Signin
   */
  fastify.post<{ Body: GoogleAccessTokenBody }>(
    '/google/signin',
    {
      schema: {
        body: GoogleAccessTokenBodySchema,
      },
    },
    async (request, reply) => {
      const { access_token: googleAccessToken } = request.body
      try {
        const profile = await getGoogleProfile(googleAccessToken)

        const socialAccountRepo = getRepository(SocialAccount)
        // find social account
        const exists = await socialAccountRepo.findOne(
          {
            provider: 'google',
            social_id: profile.socialId,
          },
          {
            relations: ['user'],
          }
        )

        if (!exists) {
          reply.status(401)
          reply.send({
            code: 401,
            error: 'UserNotFoundError',
            message: 'User is not registered',
          })
          return
        }

        const user = await getRepository(User).findOne({
          id: exists.user.id,
        })
        if (!user) {
          reply.status(500)
          reply.send({
            code: 500,
            error: 'UserNotFoundError',
            message: 'Google login succeed but user not found',
          })
          return
        }
        const accessToken = await user.generateToken()
        reply.setCookie('access_token', accessToken, {
          path: '/',
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 15,
        })

        reply.send({
          user: user,
          access_token: accessToken,
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

  /**
   * POST /api/auth/google/signup
   * Google Signup
   */
  fastify.post<{ Body: GoogleSignupBody }>(
    '/google/signup',
    {
      schema: {
        body: GoogleSignupBodySchema,
      },
    },
    async (request, reply) => {
      const { access_token: accessToken, username } = request.body

      if (!/^[a-zA-Z0-9]{4,16}$/.test(username)) {
        reply.status(400)
        const error = new Error(
          'Username should be 4 ~ 16 alphanumeric letters'
        )
        error.name = 'UsernameBadFormatError'
        throw error
      }

      try {
        const profile = await getGoogleProfile(accessToken)

        const socialAccountRepo = getRepository(SocialAccount)
        // find social account
        const exists = await socialAccountRepo.findOne(
          {
            provider: 'google',
            social_id: profile.socialId,
          },
          {
            relations: ['user'],
          }
        )

        if (exists) {
          const user = await getRepository(User).findOne({
            id: exists.user.id,
          })
          if (!user) {
            reply.status(500)
            reply.send({
              code: 500,
              error: 'UserNotFoundError',
              message: 'Google login succeed but user not found',
            })
            return
          }
          const accessToken = await user.generateToken()
          reply.setCookie('access_token', accessToken, {
            path: '/',
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 15,
          })
          // TODO: generate accessToken
          reply.send({
            user: user,
            access_token: accessToken,
          })
        } else {
          const usernameExists = await getRepository(User).findOne({
            username,
          })
          if (usernameExists) {
            reply.status(409)
            reply.send({
              code: 409,
              error: 'Username Duplicate Error',
              message: 'Username already exists',
            })
          }

          const manager = getManager()
          const user = new User()
          user.username = username
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
          const accessToken = await user.generateToken()
          // await socialAccountRepo.save(socialAccount)
          reply.send({
            user: user,
            access_token: accessToken,
          })
        }
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

  done()
}

export default authRoute
