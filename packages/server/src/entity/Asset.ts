import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { SymbolMeta } from './SymbolMeta'
import { AssetType } from './SymbolType'

@Entity({
  name: 'assets',
})
export class Asset {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 10,
  })
  ticker: string

  @Column({ length: 128 })
  name: string

  @Column({
    type: 'varchar',
    length: 2048,
  })
  description: string

  @Column()
  sector: string

  @Column({
    type: 'timestamp',
  })
  ipo_date: Date

  @Column({
    nullable: true,
  })
  image: string

  @Column()
  is_etf: boolean

  @OneToOne((type) => SymbolMeta, (symbolMeta) => symbolMeta.symbol)
  symbol_meta: SymbolMeta

  @ManyToOne((type) => AssetType, { cascade: true })
  @JoinColumn({
    name: 'symbol_type_id',
  })
  symbol_type: AssetType
}
