import * as util from 'util'
import * as fs from 'fs/promises'
import * as path from 'path'
import { getStockProfile } from '../lib/finance-api/getStockProfile'
import { getSectorWeightings } from '../lib/finance-api/getSectorWeightings'
import { getHistoricalPrice } from '../lib/finance-api/getHistoricalPrice'
import { groupByMonth } from './lib/groupByMonth'
import { Asset } from '../entity/Asset'
import { downloadStockLogo } from './lib/downloadStockLogo'
import { AssetType } from '../entity/AssetType'
import { getRepository } from 'typeorm'
import { AssetMeta } from '../entity/AssetMeta'
import { SectorWeighting } from '../entity/SectorWeighting'
import { HistoricalPrice } from '../entity/HistoricalPrice'
import cliProgress from 'cli-progress'
import getThreeMonthsTreasuryRate from './lib/getThreeMonthsTreasuryRate'

const tickersDir = path.resolve(__dirname, 'tickers')
const LIMIT = 5

const sleep = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration))

class Syncbot {
  async parseTickers(name: string) {
    const data = await fs.readFile(path.join(tickersDir, `${name}.txt`), 'utf8')
    const lines = data.split('\n')
    const tickers = lines
      .map((line) => line.split('\t')[0])
      .filter((ticker) => !ticker.includes('.'))
    return tickers
  }

  async parseTickersAndNames(name: string) {
    const data = await fs.readFile(path.join(tickersDir, `${name}.txt`), 'utf8')
    const lines = data.split('\n')
    const tickersAndNames = lines
      .map((line) => line.split('\t'))
      .filter((ticker) => !ticker[0].includes('.'))
    return tickersAndNames
  }

  async loadTickers() {
    const tickers = await this.parseTickers('INITIAL')
    // const amex = await this.parseTickers('AMEX')
    // const nasdaq = await this.parseTickers('NASDAQ')
    // const nyse = await this.parseTickers('nyse')
    // TODO: load more tickers
    return tickers
    // return [...amex, ...nasdaq, ...nyse]
  }

  async syncStock(ticker: string) {
    const exists = await getRepository(Asset).findOne({ where: { ticker } })
    if (exists) return exists
    const assetType = await getRepository(AssetType).findOne({
      where: {
        type: 'U.S. Stock',
      },
    })

    const profile = await getStockProfile(ticker)

    const rawHistoricalPrices = await getHistoricalPrice(ticker)

    const sectorWeightingsData =
      profile.sector === '' ? await getSectorWeightings(ticker) : null

    const monthlyHistoricalPrices = groupByMonth(rawHistoricalPrices)

    const asset = new Asset()
    asset.name = profile.companyName
    asset.description = profile.description
    asset.asset_type = assetType!
    asset.ipo_date = new Date(profile.ipoDate)
    asset.is_etf = profile.sector === ''
    asset.sector = profile.sector || ''
    asset.ticker = ticker

    try {
      const imageDir = path.resolve(
        __dirname,
        'logos/us_stocks',
        `${ticker}.png`
      )
      await downloadStockLogo(ticker, imageDir)
      asset.image = `/logos/us_stock/${ticker}.png`
    } catch (e) {}
    const assetMeta = new AssetMeta()
    assetMeta.asset = asset
    assetMeta.price = profile.price
    assetMeta.changes = profile.changes
    assetMeta.is_tracking = false
    assetMeta.market_cap = profile.mktCap

    await getRepository(AssetMeta).save(assetMeta)

    if (sectorWeightingsData) {
      const sectorWeightings = sectorWeightingsData.map((sw) => {
        const sectorWeighting = new SectorWeighting()
        sectorWeighting.asset = asset
        sectorWeighting.percentage = parseFloat(sw.weightPercentage)
        sectorWeighting.sector = sw.sector
        return sectorWeighting
      })
      await getRepository(SectorWeighting).save(sectorWeightings)
    }

    const historicalPrices = monthlyHistoricalPrices.map((mhp) => {
      const historicalPrice = new HistoricalPrice()
      historicalPrice.asset = asset
      historicalPrice.volume = mhp.volume
      historicalPrice.close = mhp.close
      historicalPrice.date = new Date(mhp.closeDate)
      historicalPrice.high = mhp.high
      historicalPrice.low = mhp.low
      historicalPrice.type = 'monthly'
      historicalPrice.open = mhp.open
      historicalPrice.adjusted_close = mhp.adjustedClose
      return historicalPrice
    })
    await getRepository(HistoricalPrice).save(historicalPrices)

    return asset
  }

  async registerAsset(ticker: string, name: string) {
    const asset = new Asset()
    const assetType = await getRepository(AssetType).findOne({
      where: {
        type: 'U.S. Stock',
      },
    })

    asset.name = name
    asset.ticker = ticker
    asset.asset_type = assetType!
    asset.description = ''
    asset.sector = ''
    asset.ipo_date = new Date()
    asset.is_etf = false
    await getRepository(Asset).save(asset)
  }

  // TEMP
  async registerAssets() {
    const amex = await this.parseTickersAndNames('AMEX')
    const nasdaq = await this.parseTickersAndNames('NASDAQ')
    const nyse = await this.parseTickersAndNames('nyse')
    const data = [...amex, ...nasdaq, ...nyse]

    const bar = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic
    )
    bar.start(data.length, 0)

    let busyWorkers = 0
    while (data.length > 0 || busyWorkers !== 0) {
      if (busyWorkers >= LIMIT || data.length === 0) {
        await sleep(6)
        continue
      }
      busyWorkers += 1
      const ticker = data.pop()
      this.registerAsset(ticker![0], ticker![1])
        .catch((e) => {
          console.log(e)
        })
        .finally(() => {
          busyWorkers -= 1
          bar.increment(1)
        })
    }
    bar.stop()
  }

  async syncStocks() {
    const tickers = await this.loadTickers()
    const bar = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic
    )
    const errorsDir = path.resolve(__dirname, 'error_tickers.txt')
    bar.start(tickers.length, 0)

    let busyWorkers = 0
    const failedTickers: string[] = []
    while (tickers.length > 0 || busyWorkers !== 0) {
      if (busyWorkers >= LIMIT || tickers.length === 0) {
        await sleep(6)
        continue
      }
      busyWorkers += 1
      const ticker = tickers.pop()
      this.syncStock(ticker!)
        .catch((e) => {
          console.log(e)
          failedTickers.push(ticker!)
          fs.appendFile(errorsDir, `${ticker}\n`, 'utf8')
        })
        .finally(() => {
          busyWorkers -= 1
          bar.increment(1)
        })
    }
    bar.stop()
  }

  async syncTreasuryRate() {
    const data = await getThreeMonthsTreasuryRate()
    const exists = await getRepository(Asset).findOne({ ticker: 'DTB3' })
    if (exists) {
      // TODO: only update
      return
    }

    const assetType = await getRepository(AssetType).findOne({
      type: 'U.S. Interest Rate',
    })
    const asset = new Asset()
    asset.asset_type = assetType!
    asset.name = '3-Month Treasury Bill'
    asset.ticker = 'DTB3'
    asset.description = ''
    asset.is_etf = false
    asset.sector = ''

    const historicalPrices = data.map(({ date, value }) => {
      const historicalPrice = new HistoricalPrice()
      historicalPrice.asset = asset
      historicalPrice.volume = 0
      historicalPrice.close = value
      historicalPrice.date = new Date(date)
      historicalPrice.high = value
      historicalPrice.low = value
      historicalPrice.type = 'monthly'
      historicalPrice.open = value
      historicalPrice.adjusted_close = value
      return historicalPrice
    })

    await getRepository(Asset).save(asset)
    await getRepository(HistoricalPrice).save(historicalPrices)
  }
}

export default Syncbot
