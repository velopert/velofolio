import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Index,
  UpdateDateColumn,
} from 'typeorm'
import { Asset } from './Asset'

@Entity({
  name: 'asset_meta',
})
export class AssetMeta {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    type: 'double',
  })
  price!: number

  @Column({ type: 'double' })
  market_cap!: number

  @Column()
  is_tracking!: boolean

  @OneToOne((type) => Asset, (asset) => asset.asset_meta, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({ name: 'asset_id' })
  asset!: Asset

  @Index()
  @Column({ type: 'double' })
  changes!: number

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date
}
