import Winston from '../logger'
import { Op, fn, col } from 'sequelize'
import { ReservationDTO } from '../dtos'
import { Reservation } from '../models'
import { BaseService, ServiceResult } from './BaseService'
import { ReservationFrameCount } from './types'
import { InventoryService } from './InventoryService'
import { getTimeIntervals } from '../utility'

export class ReservationService extends BaseService<Reservation, ReservationDTO> {
  inventoryService: InventoryService
  constructor() {
    super('reservation')
    this.inventoryService = new InventoryService()
  }

  public async get(id: number): Promise<ServiceResult<ReservationDTO>> {
    return await super.get(id)
  }

  public async create(reservation: any): Promise<ServiceResult<{ id: number }>> {
    return await super.create(reservation)
  }

  /**
   * Returns the count of available reservations for each period in the given timeframe
   * @param restaurantId
   * @param start
   * @param end
   * @returns
   */
  public async getReservationAvailability(
    restaurantId: number,
    start: Date,
    end: Date
  ): Promise<ServiceResult<ReservationFrameCount[]>> {
    const inventory = await this.inventoryService.getInventoryForRestaurant(
      restaurantId,
      start,
      end
    )
    if (inventory.error) {
      return inventory as ServiceResult<any>
    }

    if (inventory.value == null || inventory.value.length === 0) {
      const times = getTimeIntervals(start, end)
      const result: ReservationFrameCount[] = []
      for (const time of times) {
        result.push({
          count: 0,
          inventoryId: null,
          timestamp: time,
          guestCount: 0,
        })
      }
      return {
        value: result,
      }
    }

    let timeframes = []
    try {
      timeframes = await Reservation.findAll({
        attributes: ['rTime', [fn('count', col('id')), 'count']],
        where: {
          restaurantId,
          rTime: {
            [Op.gte]: start,
            [Op.lte]: end,
          },
        },
        group: ['rTime'],
      })
    } catch (err) {
      Winston.error(
        `Failed to retrieve existing reservations for restaurant: ${restaurantId}\n${JSON.stringify(
          err
        )}`
      )
      return {
        error: {
          code: 500,
          message: 'Failed to retrieve existing reservations.',
          error: err,
        },
      }
    }

    const mappedTimeFrames = timeframes.reduce((acc, curr) => {
      const current = curr.get()
      const validatedTime = current.rTime?.toISOString?.()
      if (!validatedTime || isNaN(current.rTime?.getTime?.()) || isNaN(current.count)) {
        return acc
      }

      return {
        ...acc,
        [validatedTime]: {
          count: parseInt(current.count),
        },
      }
    }, {})

    const times = getTimeIntervals(start, end)
    const result: ReservationFrameCount[] = []
    for (const time of times) {
      const isoTime = time.toISOString()
      // relevantInventory find statement should not be expensive
      const relevantInventory = inventory.value.find(
        inv => inv.startDate <= time && inv.endDate >= time
      )

      if (!relevantInventory) {
        result.push({
          count: 0,
          inventoryId: null,
          timestamp: time,
          guestCount: 0,
        })
      } else {
        // potential alert if we see a negative reservation relationship
        result.push({
          count: Math.max(
            0,
            relevantInventory.maxReservations - (mappedTimeFrames[isoTime]?.count ?? 0)
          ),
          inventoryId: relevantInventory.id,
          timestamp: time,
          guestCount: relevantInventory.reservationGuests,
        })
      }
    }

    return {
      value: result,
    }
  }
}
