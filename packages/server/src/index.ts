import 'dotenv/config'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { User } from './entity/User'
import Server from './Server'

createConnection()
  .then(async (connection) => {
    const server = new Server()
    server.start()
  })
  .catch((error) => console.log(error))
