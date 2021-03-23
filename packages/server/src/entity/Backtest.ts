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
  OneToMany,
} from 'typeorm'
import { Asset } from './Asset'
import { Portfolio } from './Portfolio'
import { User } from './User'

@Entity({
  name: 'backtests',
})
export class Backtest {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  title!: string

  @Column({ type: 'text', nullable: true })
  body!: string

  @Column({ type: 'timestamp' })
  start_date!: Date

  @Column({ type: 'timestamp' })
  end_date!: Date

  @Column()
  initial_amount!: number

  @Column({
    nullable: true,
  })
  cashflow_value?: number

  @Column({
    type: 'tinyint',
    precision: 4,
    nullable: true,
  })
  cashflow_interval?: number

  @Index()
  @Column()
  is_private!: boolean

  @ManyToOne((type) => User, { onDelete: 'CASCADE', cascade: true })
  @JoinColumn({ name: 'user_id' })
  user!: User

  @Index()
  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date

  @OneToMany(() => Portfolio, (portfolio) => portfolio.backtest)
  portfolios!: Portfolio[]

  serialize() {
    const { user, portfolios, ...rest } = this
    return {
      ...rest,
      user: user.serialize(),
      portfolios: portfolios.map((p) => p.serialize()),
    }
  }

  // @ManyToMany((type) => Asset)
  // @JoinTable({
  //   name: 'backtests_assets',
  //   joinColumn: {
  //     name: 'backtest_id',
  //     referencedColumnName: 'id',
  //   },
  //   inverseJoinColumn: {
  //     name: 'asset_id',
  //     referencedColumnName: 'id',
  //   },
  // })
  // assets!: Asset[]
}
