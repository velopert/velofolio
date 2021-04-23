import 'dotenv/config'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import Syncbot from './Syncbot'
import path from 'path'
import { downloadStockLogo } from './lib/downloadStockLogo'

createConnection().then(async (connection) => {
  const syncbot = new Syncbot()
  await syncbot.syncTreasuryRate()
  await syncbot.syncStocks()
  await syncbot.syncStockImages()
  // await syncbot.clearErrorTickers()
  connection.close()
})
