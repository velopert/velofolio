import { AssetType } from 'entity/AssetType'
import Fuse from 'fuse.js'
import { getRepository } from 'typeorm'
import { Asset } from '../entity/Asset'

class SearchEngine {
  fuse: Fuse<Asset> | null = null

  async initialize() {
    const repo = getRepository(Asset)
    const usStocks = await getRepository(AssetType).findOne({
      type: 'U.S. Stock',
    })
    const assets = await repo.find({
      where: {
        asset_type: usStocks,
      },
    })
    this.fuse = new Fuse(assets, {
      useExtendedSearch: true,
      includeScore: true,
      findAllMatches: false,
      distance: 4,
      threshold: 0.2,
      keys: [
        // 'name',
        // 'ticker',
        {
          name: 'name',
          weight: 1,
        },
        {
          name: 'ticker',
          weight: 4,
        },
      ],
    })
  }

  // TODO:
  reloadFuse() {}

  constructor() {}

  search(keyword: string) {
    if (!this.fuse) {
      throw new Error('Fuse is not initialized')
    }
    return this.fuse.search(keyword)
  }
}

export default SearchEngine
