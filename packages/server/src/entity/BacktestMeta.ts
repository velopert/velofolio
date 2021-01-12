import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  Index,
} from 'typeorm'
import { Backtest } from './Backtest'

@Entity({
  name: 'backtest_meta',
})
export class BacktestMeta {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne((type) => Backtest)
  @JoinColumn({ name: 'backtest_id' })
  backtest: Backtest

  @Index()
  @Column({ length: 32 })
  type: string

  @Index()
  @Column({ type: 'double' })
  value: number
}
