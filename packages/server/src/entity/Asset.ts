import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { AssetMeta } from './AssetMeta'
import { AssetType } from './AssetType'

@Entity({
  name: 'assets',
})
export class Asset {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 10,
  })
  ticker: string

  @Column({ length: 128 })
  name: string

  @Column({
    type: 'varchar',
    length: 2048,
  })
  description: string

  @Column()
  sector: string

  @Column({
    type: 'timestamp',
  })
  ipo_date: Date

  @Column({
    nullable: true,
  })
  image: string

  @Column()
  is_etf: boolean

  @OneToOne((type) => AssetMeta, (assetMeta) => assetMeta.asset)
  asset_meta: AssetMeta

  @ManyToOne((type) => AssetType, { cascade: true })
  @JoinColumn({
    name: 'asset_type_id',
  })
  asset_type: AssetType
}
