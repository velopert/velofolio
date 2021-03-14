import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm'
import { User } from './User'

@Entity({
  name: 'social_accounts',
})
@Index(['provider', 'social_id'])
export class SocialAccount {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 12 })
  provider!: string

  @Column({ length: 255 })
  social_id!: string

  @OneToOne((type) => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User
}
