import { generateToken } from '../lib/token/jwt'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm'
import { sha256 } from 'js-sha256'

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Index()
  @Column()
  email!: string

  @Index()
  @Column({ length: 16, nullable: true })
  username?: string

  @Column({ length: 48 })
  display_name!: string

  @Column({ length: 255, nullable: true })
  photo_url?: string

  @Index()
  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date

  @Index()
  @Column()
  is_certified!: boolean

  async generateToken() {
    return generateToken(
      {
        subject: 'accessToken',
        userId: this.id,
      },
      {
        expiresIn: '15d', // TODO: Set this to 3days later on
      }
    )
  }

  serialize() {
    const { is_certified, created_at, email, ...rest } = this
    return rest
  }

  get member_id() {
    return sha256.hmac(process.env.JWT_SECRET!, this.id.toString())
  }
}
