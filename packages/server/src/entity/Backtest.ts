import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { Stock } from './Stock'
import { User } from './User'

@Entity({
  name: 'backtests',
})
export class Backtest {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column({ type: 'text' })
  body: string

  @Index()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date

  @Column({ type: 'text' })
  options: string

  @Index()
  @Column()
  is_private: boolean

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToMany((type) => Stock)
  @JoinTable({
    name: 'backtests_stocks',
    joinColumn: {
      name: 'backtest_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'stock_id',
      referencedColumnName: 'id',
    },
  })
  stocks: Stock[]
}
