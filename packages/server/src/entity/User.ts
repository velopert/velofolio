import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm'

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  email!: string

  @Column({ length: 16 })
  username!: string

  @Column({ length: 48 })
  display_name!: string

  @Index()
  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date

  @Index()
  @Column()
  is_certified!: boolean
}
