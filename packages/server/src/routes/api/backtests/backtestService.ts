import { Backtest } from 'entity/Backtest'
import CustomError from 'lib/CustomError'
import { getRepository, LessThan } from 'typeorm'

export const backtestService = {
  async getBacktest(id: number) {
    const backtest = await getRepository(Backtest).findOne(id, {
      relations: [
        'user',
        'portfolios',
        'portfolios.asset_weights',
        'portfolios.asset_weights.asset',
      ],
    })
    if (!backtest) {
      const e = new CustomError({
        statusCode: 404,
        message: 'Backtest does not exist',
        name: 'NotFoundError',
      })
      throw e
    }
    return backtest.serialize()
  },
  async getBacktests({ userId, cursor }: { userId?: number; cursor?: number }) {
    const backtests = await getRepository(Backtest).find({
      where: {
        ...(cursor ? { id: LessThan(cursor) } : {}),
        ...(userId ? { user: { id: userId } } : {}),
      },
      relations: [
        'user',
        'portfolios',
        'portfolios.asset_weights',
        'portfolios.asset_weights.asset',
      ],
      take: 20,
      order: {
        id: 'DESC',
      },
    })
    return backtests.map((b) => b.serialize())
  },
}
