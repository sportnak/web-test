import { Controller, Get, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import Winston from '../logger'
import { InventoryService } from '../services'
import { isAuthorized } from '../utility'
import { ServiceResult } from '../services/BaseService'

@Controller('inventory')
export class InventoryController {
  @Post('')
  private async createAsync(
    req: Request,
    res: Response<ServiceResult<{ id: number }>>
  ): Promise<Response<ServiceResult<{ id: number }>>> {
    const iService = new InventoryService()
    if (!isAuthorized(req)) {
      return res.sendStatus(403)
    }

    /**
     * @TODO Check the validity of the restaurant-id specified
     */
    const result = await iService.create(req.body)
    if (result.error) {
      Winston.error(result.error)
      return res.status(result.error.code).send({
        // could strip out error data if desired
        error: result.error,
      })
    }

    return res.json(result).send()
  }

  getAvailableSlots(req: Request) {
    // either get all reservations in time frame and then map the negative
    // or we have to update the reservation counts as they are made.
    // option 1 requires more resources options 2 requires locking and creating more rows from the beginning
  }
}
