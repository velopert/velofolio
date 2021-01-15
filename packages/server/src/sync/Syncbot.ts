import * as util from 'util'
import * as fs from 'fs/promises'
import * as path from 'path'
import { getStockProfile } from '../finance-api/getStockProfile'
import { getSectorWeightings } from '../finance-api/getSectorWeightings'
import { getHistoricalPrice } from '../finance-api/getHistoricalPrice'
import { groupByMonth } from './lib/groupByMonth'
import { Asset } from '../entity/Asset'

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

  async syncStock(ticker: string) {
    const [profile, historicalPrices] = await Promise.all([
      getStockProfile(ticker),
      getHistoricalPrice(ticker),
    ])
    const sectorWeightings = profile.sector
      ? await getSectorWeightings(ticker)
      : null
    const monthlyHistoricalPrices = groupByMonth(historicalPrices)
    const symbol = new Asset()
  }

  async syncStocks() {
    // TODO: loadTickers
    // create a method that syncs stockProfile, sectorWeightings and historicalData
    // implement bulk sync
    // - limit concurrent request by 10 (3 while development mode)

    // const tickers = await this.loadTickers()
    // const profile = await getStockProfile('VV')
    // const sectorWeightings = await getSectorWeightings('VV')
    const historicalPrices = await getHistoricalPrice('VV')

    console.log(groupByMonth(historicalPrices))
  }
}

export default Syncbot
