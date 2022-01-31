import Winston from '../logger'
import { GuestDTO } from '../dtos'
import { Guest } from '../models'
import { BaseService, ServiceResult } from './BaseService'

export class GuestService extends BaseService<Guest, GuestDTO> {
  constructor() {
    super('guest')
  }

  public async get(id: number): Promise<ServiceResult<GuestDTO>> {
    return await super.get(id)
  }

  public async create(guest: any): Promise<ServiceResult<{ id: number }>> {
    return await super.create(guest)
  }

  /**
   *
   * @todo error handling & line 37
   * @returns
   */
  public async getOrCreate(guest: GuestDTO): Promise<ServiceResult<GuestDTO>> {
    let guestResult: Guest[]
    try {
      guestResult = await Guest.findAll({
        where: {
          name: guest.name,
          email: guest.email,
        },
      })
    } catch (err) {
      Winston.error(`Failed to retrieve guest data ${err}`)
      return {
        error: {
          code: 500,
          message: `Error retrieving guest`,
        },
      }
    }

    if (guestResult.length === 0) {
      Winston.info(`Creating a new guest: ${guest}`)
      const response = await this.create(guest)
      /* @TODO we can coalesce this and return the full guest from the super method (would require some refactoring of generics) */
      return this.get(response.value.id)
    }

    return {
      value: super.mapFromDB(guestResult[0]),
    }
  }
}
