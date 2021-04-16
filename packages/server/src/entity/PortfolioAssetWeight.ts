import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Asset } from './Asset'
import { Portfolio } from './Portfolio'

@Entity({
  name: 'portfolio_asset_weight',
})
export class PortfolioAssetWeight {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.asset_weights, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({ name: 'portfolio_id' })
  portfolio!: Portfolio

  @ManyToOne(() => Asset, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({ name: 'asset_id' })
  asset!: Asset

  @Column({ type: 'double' })
  weight!: number
}
