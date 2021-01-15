import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Asset } from './Asset'

@Entity({
  name: 'sector_weigthings',
})
export class SectorWeighting {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne((type) => Asset, { cascade: true })
  @JoinColumn({
    name: 'asset_id',
  })
  symbol: Asset

  @Column()
  sector: string

  @Column({ type: 'double' })
  percentage: number
}
