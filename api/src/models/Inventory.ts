import {
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Reservation } from './Reservation'
import { Restaurant } from './Restaurant'

@Table({ tableName: 'inventory' })
export class Inventory extends Model<Inventory> {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number

  @ForeignKey(() => Restaurant)
  @Column({ allowNull: false })
  restaurant: number

  // allowing null would mean any number of reservations per time slot
  @Column({ allowNull: false })
  maxRes: number

  // allowing null would mean unlimited number of people per reservation
  @Column({ allowNull: false })
  rGuests: number

  // we could allow null if some place had 24/7 support - seems unnecessary
  @Column({ allowNull: false })
  start: Date

  // we could allow null if some place had 24/7 support - seems unnecessary
  @Column({ allowNull: false })
  end: Date

  @DeletedAt
  deleted_at: string

  @CreatedAt
  created_at: string

  @UpdatedAt
  updated_at: string
}
