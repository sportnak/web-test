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
import { Inventory, Reservation } from '.'

@Table({ tableName: 'restaurants' })
export class Restaurant extends Model<Restaurant> {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number

  @Column({ allowNull: false })
  name: string

  @Column({ allowNull: true })
  address: string

  @DeletedAt
  deleted_at: string

  @CreatedAt
  created_at: string

  @UpdatedAt
  updated_at: string

  @HasMany(() => Inventory)
  inventory: Inventory

  @HasMany(() => Reservation)
  reservations: Reservation[]
}
