import {
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Guest } from './Guest'
import { Restaurant } from './Restaurant'

@Table({ tableName: 'reservations' })
export class Reservation extends Model<Reservation> {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number

  @ForeignKey(() => Restaurant)
  @Column
  restaurantId: number

  @Column
  rTime: Date

  @ForeignKey(() => Guest)
  @Column
  guest: number

  @DeletedAt
  deleted_at: string

  @CreatedAt
  created_at: string

  @UpdatedAt
  updated_at: string
}
