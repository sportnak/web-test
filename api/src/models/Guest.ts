import {
  Column,
  CreatedAt,
  DeletedAt,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Reservation } from '.'

@Table({ tableName: 'guests' })
export class Guest extends Model<Guest> {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number

  @Column
  name: string

  @Column
  email: string

  @Column
  guestCount: number

  @Column
  timestamp: Date

  @DeletedAt
  deleted_at: string

  @CreatedAt
  created_at: string

  @UpdatedAt
  updated_at: string

  @HasMany(() => Reservation)
  reservations: Reservation[]
}
