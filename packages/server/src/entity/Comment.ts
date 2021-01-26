import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  Index,
  CreateDateColumn,
} from 'typeorm'
import { Backtest } from './Backtest'
import { User } from './User'

@Entity({
  name: 'comments',
})
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'user_id' })
  user!: User

  @ManyToOne((type) => Backtest)
  @JoinColumn({ name: 'backtest_id' })
  backtest!: Backtest

  @Column({ type: 'varchar', length: 512 })
  comment!: string

  @Index()
  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date
}
