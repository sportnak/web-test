import { Controller, Get, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import crypto from 'crypto'
import Winston from '../logger'
import { GuestService, ReservationService } from '../services'
import { isAuthorized, getValidTime } from '../utility'
import { ReservationDTO, ReservationRequestDTO } from '../dtos'
import { ServiceResult } from '../services/BaseService'

@Controller('reservation')
export class ReservationController {
  reservationService: ReservationService
  constructor() {
    this.reservationService = new ReservationService()
  }

  @Get(':id')
  private async getAsync(
    req: Request,
    res: Response
  ): Promise<Response<ServiceResult<ReservationDTO>>> {
    if (!isAuthorized(req)) {
      return res.sendStatus(403)
    }

    let id: number = parseInt(req.params.id, 10)
    if (isNaN(id)) {
      return res.sendStatus(400)
    }

    const result = await this.reservationService.get(id)
    if (result.error) {
      return res.sendStatus(404)
    }
    return res.json(result.value).send()
  }

  /**
   *
   * @param req contains restaurauntId in route and supports start and end query params. Defaults to current day (local server time)
   * @param res
   * @returns
   */
  @Get(':restaurantId/availability')
  private async getAvailability(
    req: Request,
    res: Response
  ): Promise<Response<ServiceResult<ReservationDTO>>> {
    if (!isAuthorized(req)) {
      return res.sendStatus(403)
    }

    let restaurantId: number = parseInt(req.params.restaurantId, 10)
    if (isNaN(restaurantId)) {
      return res.sendStatus(400)
    }

    const now = new Date()
    let startDate: Date =
      getValidTime(req.query.start) ??
      new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
    let endDate: Date =
      getValidTime(req.query.end) ??
      new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1)

    const result = await this.reservationService.getReservationAvailability(
      restaurantId,
      startDate,
      endDate
    )
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
    const guestService = new GuestService()
    if (!isAuthorized(req)) {
      return res.sendStatus(403)
    }

    const mappedRequest = new ReservationRequestDTO(req.body)
    const guestDTO = mappedRequest.getGuestDTO()
    // async blocking behavior
    console.time(`guest:reservation:${req.body.restaurantId}:${req.body.time}:${req.body.name}`)
    const guest = await guestService.getOrCreate(guestDTO)
    // @todo check for error in guest
    // const hashed = crypto
    //   .createHash('md5')
    //   .update(`${req.body.name}:${req.body.email}`)
    //   .digest('hex')
    console.timeEnd(`guest:reservation:${req.body.restaurantId}:${req.body.time}:${req.body.name}`)

    const reservationDTO = mappedRequest.getReservationDTO(guest.value.id)

    const availability = await this.reservationService.getReservationAvailability(
      mappedRequest.restaurantId,
      mappedRequest.time,
      mappedRequest.time
    )

    if (availability.value.length === 0 || !availability.value.some(x => x.count !== 0)) {
      return res.json({
        error: { code: 403, message: 'There is no availability for reservations.' },
      })
    }

    console.time(`reservation:${req.body.restaurantId}:${req.body.time}:${req.body.name}`)
    const result = await this.reservationService.create(reservationDTO)
    console.timeEnd(`reservation:${req.body.restaurantId}:${req.body.time}:${req.body.name}`)
    return res.json(result).send()
  }
}
