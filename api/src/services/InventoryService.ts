import { Op, WhereOptions } from 'sequelize'
import Winston from '../logger'
import { InventoryDTO } from '../dtos'
import { Inventory } from '../models'
import { BaseService, ServiceResult } from './BaseService'

export class InventoryService extends BaseService<Inventory, InventoryDTO> {
  constructor() {
    super('inventory')
  }

  public async create(inventory: any): Promise<ServiceResult<{ id: number }>> {
    let startDate = new Date(inventory?.startDate)
    let endDate = new Date(inventory?.endDate)
    if (!startDate || !endDate) {
      return {
        error: {
          code: 400,
          message: 'Valid start and end date is required',
        },
      }
    }
    if (startDate >= endDate) {
      return {
        error: {
          code: 400,
          message: 'Start date for inventory is before end date',
          error: null,
        },
      }
    }

    const currentInventory = await this.getOverlappingInventory(
      inventory?.restaurantId,
      startDate,
      endDate
    )

    if (currentInventory.error) {
      return currentInventory as ServiceResult<any>
    }

    if (currentInventory.value.length) {
      return {
        error: {
          code: 400,
          message: 'Existing inventory overlaps with requested inventory.',
        },
      }
    }

    return await super.create(inventory)
  }

  public async getOverlappingInventory(restaurantId: number, start: Date, end: Date) {
    return await this.getInventoryByDateQuery(restaurantId, {
      [Op.or]: [
        {
          start: {
            [Op.lt]: end,
            [Op.gte]: start,
          },
        },
        {
          end: {
            [Op.lt]: start,
            [Op.gte]: end,
          },
        },
      ],
    })
  }

  public async getInventoryForRestaurant(restaurantId: number, start: Date, end: Date) {
    if (start === end) {
      return await this.getInventoryByDateQuery(restaurantId, {
        start: {
          [Op.lte]: start,
        },
        end: {
          [Op.gte]: end,
        },
      })
    }

    return this.getOverlappingInventory(restaurantId, start, end)
  }

  private async getInventoryByDateQuery(
    restaurantId: number,
    dateQuery: WhereOptions
  ): Promise<ServiceResult<InventoryDTO[]>> {
    let inventoryResults
    try {
      inventoryResults = await Inventory.findAll({
        where: {
          restaurant: restaurantId,
          ...dateQuery,
        },
      })
    } catch (err) {
      Winston.error(
        `Failed to retrieve inventory for restaurant: ${restaurantId}\n${JSON.stringify(err)}`
      )
      return {
        error: {
          code: 500,
          message: 'Failed to retrieve inventory.',
          error: err,
        },
      }
    }

    const inventoryData: InventoryDTO[] = inventoryResults.map(x => this.mapFromDB(x))
    return {
      value: inventoryData,
    }
  }
}
