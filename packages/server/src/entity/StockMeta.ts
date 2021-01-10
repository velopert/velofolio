import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { Stock } from './Stock'

@Entity({
  name: 'stock_meta',
})
export class StockMeta {
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

  @OneToOne((type) => Stock, (stock) => stock.stockMeta, { cascade: true })
  @JoinColumn({ name: 'stock_id' })
  stock: Stock
}
