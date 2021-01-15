import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { Asset } from './Asset'

@Entity({
  name: 'symbol_meta',
})
export class SymbolMeta {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'double',
  })
  price: number

  @Column({ type: 'double' })
  market_cap: number

  @Column()
  is_tracking: boolean

  @OneToOne((type) => Asset, (symbol) => symbol.symbol_meta, { cascade: true })
  @JoinColumn({ name: 'asset_id' })
  symbol: Asset
}
