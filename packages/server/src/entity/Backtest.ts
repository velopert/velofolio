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
import { Asset } from './Asset'
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

  @ManyToMany((type) => Asset)
  @JoinTable({
    name: 'backtests_symbols',
    joinColumn: {
      name: 'backtest_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'asset_id',
      referencedColumnName: 'id',
    },
  })
  assets: Asset[]
}
