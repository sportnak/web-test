import { Model } from 'sequelize-typescript'
import Winston from '../logger'
import { Guest, Inventory, Reservation, Restaurant } from '../models'
import { Mappers, IMapper, MappedModels } from '../dtos'

// we could move this to a more specific location to make sure people update this to get the generic benefits from the start
const classTypeMap: { [key in MappedModels]: typeof Model } = {
  restaurant: Restaurant,
  inventory: Inventory,
  reservation: Reservation,
  guest: Guest,
}

export class BaseService<T extends Model<T>, DTO> {
  classTypeKey: string
  mappers: IMapper<T, DTO>
  constructor(key: MappedModels) {
    this.classTypeKey = key
    this.mappers = Mappers[key]
    if (!this.mappers) {
      Winston.error(`Mappers are undefined for ${key}`)
    }
  }

  class() {
    return classTypeMap[this.classTypeKey]
  }

  async create(data: any): Promise<ServiceResult<{ id: number }>> {
    try {
      const result: T = await this.class().create(this.mappers.toDB(data))
      return { value: { id: result.id } }
    } catch (err) {
      Winston.error(`Failed to create ${this.classTypeKey}: ${JSON.stringify(err)}`)
      return {
        error: {
          message: 'Failed to create record. Please check the data on your request.',
          code: 400,
          error: err,
        },
      }
    }
  }

  mapFromDB(data: T): DTO {
    return this.mappers.fromDB(data)
  }

  async get(id: number): Promise<ServiceResult<DTO>> {
    try {
      const result: T = await this.class().findOne({
        where: {
          id,
        },
      })

      return {
        value: await this.mappers.fromDB(result),
      }
    } catch (err) {
      Winston.error(`Error encountered: ${JSON.stringify(err)}`)
      return {
        error: {
          message: 'Error while looking up record.',
          code: 500,
          error: err,
        },
      }
    }
  }
}

export interface ServiceError {
  code?: number
  message: string
  error?: Record<string, any>
}

export interface ServiceResultBase {
  error?: ServiceError
}

export interface ServiceResult<T = any> extends ServiceResultBase {
  value?: T
}
