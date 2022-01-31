import { RestaurantDTO } from '../dtos'
import { Restaurant } from '../models'
import { BaseService, ServiceResult } from './BaseService'

export class RestaurantService extends BaseService<Restaurant, RestaurantDTO> {
  constructor() {
    super('restaurant')
  }

  public async get(id: number): Promise<ServiceResult<RestaurantDTO>> {
    return await super.get(id)
  }

  public async create(restaurant: any): Promise<ServiceResult<{ id: number }>> {
    return await super.create(restaurant)
  }
}
