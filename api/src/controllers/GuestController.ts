import { Controller, Get, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import Winston from '../logger'
import { GuestService } from '../services'
import { isAuthorized } from '../utility'
import { GuestDTO, ReservationDTO, RestaurantDTO } from '../dtos'
import { ServiceResult } from '../services/BaseService'

@Controller('guest')
export class GuestController {
  @Get(':id')
  private async getAsync(req: Request, res: Response): Promise<Response<ServiceResult<GuestDTO>>> {
    const rService = new GuestService()
    if (!isAuthorized(req)) {
      return res.sendStatus(403)
    }

    let id: number = parseInt(req.params.id, 10)
    if (isNaN(id)) {
      return res.sendStatus(400)
    }

    const result = await rService.get(id)
    if (result.error) {
      return res.sendStatus(404)
    }
    return res.json(result.value).send()
  }

  @Post('')
  private async createAsync(
    req: Request,
    res: Response<ServiceResult<{ id: number }>>
  ): Promise<Response<ServiceResult<{ id: number }>>> {
    const rService = new GuestService()
    if (!isAuthorized(req)) {
      return res.sendStatus(403)
    }

    const result = await rService.create(req.body)
    if (result.error) {
      Winston.error(result.error)
      return res.send({
        error: {
          message: 'Internal error creating record',
        },
      })
    }

    return res.json(result).send()
  }
}
