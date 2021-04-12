import 'dotenv/config'
import { disableKeepAlive } from 'plugins/closePlugin'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import Server from './Server'

const sleep = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration))

createConnection()
  .then(async (connection) => {
    const server = new Server()
    await server.start()
    process.send?.('ready')
    process.on('SIGINT', async () => {
      disableKeepAlive()
      try {
        await connection.close()
      } catch (e) {
        console.log(e)
      }
      process.exit(0)
    })
  })
  .catch((error) => console.log(error))
