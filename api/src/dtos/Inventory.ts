import { Inventory } from '../models'
import { getValidTime } from '../utility'

export class InventoryDTO {
  id: number
  restaurantId: number
  maxReservations: number
  reservationGuests: number
  /**ISO8601 */
  startDate: Date
  endDate: Date
}

export function mapToDB(inventory: InventoryDTO): Partial<Inventory> {
  if (!inventory) {
    return null
  }

  return {
    id: inventory.id,
    restaurant: inventory.restaurantId,
    maxRes: inventory.maxReservations,
    rGuests: inventory.reservationGuests,
    start: getValidTime(inventory.startDate),
    end: getValidTime(inventory.endDate),
  }
}

export function mapFromDB(inventory: Inventory): InventoryDTO {
  if (!inventory) {
    return null
  }

  return {
    id: inventory.id,
    restaurantId: inventory.get('restaurant'),
    maxReservations: inventory.get('maxRes'),
    reservationGuests: inventory.get('rGuests'),
    startDate: getValidTime(inventory.get('start')),
    endDate: getValidTime(inventory.get('end')),
  }
}
