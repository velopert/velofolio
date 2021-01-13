import 'dotenv/config'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import Syncbot from './Syncbot'

createConnection().then((connection) => {
  const syncbot = new Syncbot()
  syncbot.syncStocks()
})
