import Fuse from 'fuse.js'
import { getRepository } from 'typeorm'
import { Asset } from '../entity/Asset'

class SearchEngine {
  fuse: Fuse<Asset> | null = null

  async initialize() {
    const repo = getRepository(Asset)
    const assets = await repo.find()
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

  constructor() {}

  search(keyword: string) {
    if (!this.fuse) {
      throw new Error('Fuse is not initialized')
    }
    return this.fuse.search(keyword)
  }
}

export default SearchEngine
