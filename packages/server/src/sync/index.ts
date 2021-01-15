import 'dotenv/config'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import Syncbot from './Syncbot'
import path from 'path'
import fsPromise from 'fs/promises'
import { Asset } from '../entity/Asset'

const emptyImageDir = path.join(__dirname, 'CALF.png')

async function hash() {
  const result = await fsPromise.readFile(emptyImageDir, 'hex')
  console.log(result)
}

hash()

createConnection().then((connection) => {
  const syncbot = new Syncbot()
  syncbot.syncStocks()
})
