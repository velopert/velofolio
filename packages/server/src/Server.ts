import fastify from 'fastify'
import cookie from 'fastify-cookie'
import apiRoute from './routes/api'
import searchPlugin from './plugins/searchPlugin'
import compress from 'fastify-compress'
import jwtPlugin from 'plugins/jwtPlugin'

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
  }

  start() {
    try {
      this.app.listen(PORT)
    } catch (e) {
      this.app.log.error(e)
    }
  }
}
