import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm'
import { StockMeta } from './StockMeta'

@Entity({
  name: 'stocks',
})
export class Stock {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 10,
  })
  symbol: string

  @Column({
    type: 'varchar',
    length: 4096,
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

  @OneToOne((type) => StockMeta, (stockMeta) => stockMeta.stock)
  stockMeta: StockMeta
}
