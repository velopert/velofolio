import 'dotenv/config'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import Server from './Server'

createConnection()
  .then(async (connection) => {
    const server = new Server()
    server.start()
  })
  .catch((error) => console.log(error))
