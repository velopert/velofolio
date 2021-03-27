import { Backtest } from 'entity/Backtest'
import { getRepository, LessThan } from 'typeorm'

export const backtestService = {
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
