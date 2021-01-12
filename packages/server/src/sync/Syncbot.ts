import * as util from 'util'
import * as fs from 'fs/promises'
import * as path from 'path'
import { getStockProfile } from '../finance-api/getStockProfile'
import { getSectorWeightings } from '../finance-api/getSectorWeightings'

const tickersDir = path.resolve(__dirname, 'tickers')

class Syncbot {
  async parseTickers(name: string) {
    const data = await fs.readFile(path.join(tickersDir, `${name}.txt`), 'utf8')
    const lines = data.split('\n')
    const tickers = lines
      .map((line) => line.split('\t')[0])
      .filter((ticker) => !ticker.includes('.'))
    return tickers
  }
  async loadTickers() {
    const tickers = await this.parseTickers('INITIAL')
    // TODO: load more tickers
    return tickers
  }

  async syncStocks() {
    const tickers = await this.loadTickers()
    const profile = await getStockProfile('VV')
    const sectorWeightings = await getSectorWeightings('VV')

    console.log(sectorWeightings)
  }
}

export default Syncbot
