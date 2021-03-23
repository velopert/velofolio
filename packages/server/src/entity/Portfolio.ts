import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { Backtest } from './Backtest'
import { PortfolioAssetWeight } from './PortfolioAssetWeight'
import { User } from './User'

@Entity({
  name: 'portfolios',
})
export class Portfolio {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => Backtest, (backtest) => backtest.portfolios, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({ name: 'backtest_id' })
  backtest!: Backtest

  @ManyToOne((type) => User, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({ name: 'user_id' })
  user!: User

  @Column()
  name!: string

  @Column({ type: 'text', nullable: true })
  body!: string

  @Column({
    type: 'tinyint',
    precision: 4,
    nullable: true,
  })
  rebalancing?: number

  @OneToMany(() => PortfolioAssetWeight, (assetWeight) => assetWeight.portfolio)
  asset_weights!: PortfolioAssetWeight[]

  serialize() {
    const { backtest, asset_weights, ...rest } = this
    return {
      ...rest,
      assets: asset_weights.map((aw) => ({
        id: aw.asset.id,
        ticker: aw.asset.ticker,
        weight: aw.weight,
        image: aw.asset.image,
      })),
    }
  }
}
