export { RestaurantDTO } from './Restaurant'
export { InventoryDTO } from './Inventory'
export { ReservationDTO } from './Reservation'
export { GuestDTO } from './Guest'
export * from './Requests'

export { Mappers, IMapper } from './mappers'

export type MappedModels = 'restaurant' | 'inventory' | 'reservation' | 'guest'
export const MappedModelNames: MappedModels[] = ['restaurant', 'inventory', 'reservation', 'guest']
