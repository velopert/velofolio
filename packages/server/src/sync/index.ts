import 'dotenv/config'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import Syncbot from './Syncbot'
import path from 'path'
import { downloadStockLogo } from './lib/downloadStockLogo'

createConnection().then(async (connection) => {
  const syncbot = new Syncbot()
  await syncbot.syncStocks()
  // await syncbot.registerAssets()
  connection.close()
})

// async function hashFile() {
//   const result = await fsPromise.readFile(emptyImageDir, 'hex')
//   const hash = crypto.createHash('md5').update(result).digest('hex')
//   return hash
// }
