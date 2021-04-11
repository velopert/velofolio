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
const LIMIT = 10

const sleep = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration))

class Syncbot {
  async parseTickers() {
    const data = await fs.readFile(path.join(tickersDir, `stocks.txt`), 'utf8')
    const lines = data.split('\n')
    const tickers = lines.map((line) => line.split('\t')[0])
    return tickers.filter(
      (ticker) => !['.', '-'].some((c) => ticker.includes(c))
    )
  }

  async syncStock(ticker: string) {
    const exists = await getRepository(Asset).findOne({ where: { ticker } })
    if (exists) return exists
    const assetType = await getRepository(AssetType).findOne({
      where: {
        type: 'U.S. Stock',
      },
    })

    await sleep(500)

    const profile = await getStockProfile(ticker)

    await sleep(500)

    const rawHistoricalPrices = await getHistoricalPrice(ticker, {
      from: '1985-01-01',
    })
    await sleep(500)

    const sectorWeightingsData =
      profile.sector === '' ? await getSectorWeightings(ticker) : null

    await sleep(500)

    const monthlyHistoricalPrices = groupByMonth(rawHistoricalPrices)

    const asset = new Asset()
    asset.name =
      profile.companyName.length > 128
        ? profile.companyName.slice(0, 125).concat('...')
        : profile.companyName
    const description = profile.description ?? ''
    asset.description =
      description.length > 2048
        ? description.slice(0, 2045).concat('...')
        : description
    asset.asset_type = assetType!
    asset.ipo_date = profile.ipoDate ? new Date(profile.ipoDate) : null
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
      asset.image = `logos/us_stock/${ticker}.png`
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
        if (sw.sector === 'Consumer Cyclicals') {
          sectorWeighting.sector = 'Consumer Cyclical'
        }
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

  async syncStocks() {
    const tickers = await this.parseTickers()
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
      console.log(ticker)
      this.syncStock(ticker!)
        .catch((e) => {
          console.log(e)
          console.log(`Error: ${ticker}`)
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

  async syncStockImage(ticker: string) {
    const repo = getRepository(Asset)
    const asset = await repo.findOne({ ticker })
    if (!asset) return

    try {
      const imageDir = path.resolve(
        __dirname,
        'logos/us_stocks',
        `${ticker}.png`
      )
      await downloadStockLogo(ticker, imageDir)
      asset.image = `logos/us_stock/${ticker}.png`
      await repo.save(asset)
    } catch (e) {}
  }

  async syncStockImages() {
    const tickers = await this.parseTickers()
    const bar = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic
    )

    bar.start(tickers.length, 0)

    let busyWorkers = 0
    while (tickers.length > 0 || busyWorkers !== 0) {
      if (busyWorkers >= LIMIT || tickers.length === 0) {
        await sleep(6)
        continue
      }
      busyWorkers += 1
      const ticker = tickers.pop()
      this.syncStockImage(ticker!).finally(() => {
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

  async clearErrorTickers() {
    const data = await fs.readFile(
      path.join(__dirname, `error_tickers.txt`),
      'utf8'
    )
    const tickers = data.split('\n')

    const repo = getRepository(Asset)

    for (let i = 0; i < tickers.length; i++) {
      await repo.delete({ ticker: tickers[i] })
    }
  }
}

export default Syncbot
