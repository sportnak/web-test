import { Restaurant } from '../models'

export interface RestaurantDTO {
  id: number
  name: string
  address: string
}

export function mapFromDB(restaurant: Restaurant): RestaurantDTO {
  if (!restaurant) {
    return null
  }

  return {
    id: restaurant.id,
    name: restaurant.get('name'),
    address: restaurant.get('address'),
  }
}

export function mapToDB(restaurant: RestaurantDTO): Partial<Restaurant> {
  return {
    id: restaurant.id,
    name: restaurant.name,
    address: restaurant.address,
  }
}
