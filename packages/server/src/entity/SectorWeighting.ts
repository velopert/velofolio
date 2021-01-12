import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Stock } from './Stock'

@Entity({
  name: 'sector_weigthings',
})
export class SectorWeighting {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne((type) => Stock, { cascade: true })
  @JoinColumn({
    name: 'stock_id',
  })
  stock: Stock

  @Column()
  sector: string

  @Column({ type: 'double' })
  percentage: number
}
