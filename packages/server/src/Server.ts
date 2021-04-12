import fastify from 'fastify'
import cookie from 'fastify-cookie'
import apiRoute from './routes/api'
import searchPlugin from './plugins/searchPlugin'
import compress from 'fastify-compress'
import jwtPlugin from 'plugins/jwtPlugin'
import closePlugin from 'plugins/closePlugin'

const PORT = parseInt(process.env.PORT!, 10)

export default class Server {
  app = fastify({ logger: true })

  constructor() {
    this.setup()
  }

  setup() {
    this.app.register(cookie)
    this.app.register(compress)
    this.app.register(searchPlugin)
    this.app.register(jwtPlugin)
    this.app.register(apiRoute, { prefix: '/api' })
    this.app.register(closePlugin)

    this.app.setErrorHandler((error, request, reply) => {
      reply.send({
        statusCode: error.statusCode,
        name: error.name,
        message: error.message,
        validation: error.validation,
        stack: error.stack,
      })
    })
  }

  start() {
    return this.app.listen(PORT)
  }

  close() {
    return this.app.close()
  }
}
