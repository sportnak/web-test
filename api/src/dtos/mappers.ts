import { mapToDB as inventoryToDB, mapFromDB as inventoryFromDB } from './Inventory'
import { mapToDB as restaurantToDB, mapFromDB as restaurantFromDB } from './Restaurant'
import { mapToDB as guestToDB, mapFromDB as guestFromDB } from './Guest'
import { mapToDB as reservationToDB, mapFromDB as reservationFromDB } from './Reservation'
import { MappedModels } from './index'

export const Mappers: { [key in MappedModels]: IMapper<any, any> } = {
  inventory: {
    fromDB: inventoryFromDB,
    toDB: inventoryToDB,
  },
  restaurant: {
    fromDB: restaurantFromDB,
    toDB: restaurantToDB,
  },
  guest: {
    fromDB: guestFromDB,
    toDB: guestToDB,
  },
  reservation: {
    fromDB: reservationFromDB,
    toDB: reservationToDB,
  },
} as const

export interface IMapper<T, DTO> {
  fromDB: (_: T) => DTO
  toDB: (_: DTO) => T
}
