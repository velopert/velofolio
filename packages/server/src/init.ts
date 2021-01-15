import 'dotenv/config'
import 'reflect-metadata'
import { createConnection, getRepository } from 'typeorm'
import { AssetType } from './entity/AssetType'

createConnection().then(async (connection) => {
  const repo = getRepository(AssetType)
  const assetTypes = await repo.find()
  if (assetTypes.length > 0) {
    console.error('AssetType is already initialized')
    connection.close()
    return
  }
  const usStock = new AssetType()
  usStock.type = 'U.S. Stock'
  await repo.save(usStock)
  console.log('AssetType is now initialized')
  connection.close()
})
