import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

let isClosing = false

export function disableKeepAlive() {
  isClosing = true
}

const pluginFn: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onResponse', async (request, reply) => {
    if (isClosing) {
      reply.header('Connection', 'close')
    }
  })
}

const closePlugin = fp(pluginFn, {
  name: 'closePlugin',
})

export default closePlugin
