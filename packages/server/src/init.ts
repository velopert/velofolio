import 'dotenv/config'
import 'reflect-metadata'
import { createConnection, getRepository } from 'typeorm'
import { AssetType } from './entity/AssetType'

async function createIfNotExists(type: string) {
  const repo = getRepository(AssetType)
  const exists = await repo.findOne({
    type: type,
  })
  if (exists) return
  const assetType = new AssetType()
  assetType.type = type
  return repo.save(assetType)
}

createConnection().then(async (connection) => {
  await createIfNotExists('U.S. Stock')
  await createIfNotExists('U.S. Interest Rate')
  console.log('Asset Types are ready')
  connection.close()
})
