import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Asset } from './Asset'

@Entity({
  name: 'sector_weightings',
})
export class SectorWeighting {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne((type) => Asset, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'asset_id',
  })
  asset!: Asset

  @Column()
  sector!: string

  @Column({ type: 'double' })
  percentage!: number
}
