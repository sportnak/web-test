import { Reservation } from '../models'
import { getValidTime } from '../utility'

interface IReservationDTO {
  id: number
  restaurantId: number
  reservationTime: Date
  guestId: number
  createdDate: Date
}

export class ReservationDTO {
  id: number
  restaurantId: number
  reservationTime: Date
  guestId: number
  createdDate: Date

  constructor(data: Partial<IReservationDTO>) {
    this.id = data?.id
    this.restaurantId = data?.restaurantId
    this.reservationTime = getValidTime(data?.reservationTime)
    this.guestId = data?.guestId
    this.createdDate = getValidTime(data?.createdDate)
  }
}

export function mapToDB(reservation: ReservationDTO): Partial<Reservation> {
  if (!reservation) {
    return null
  }

  return {
    restaurantId: reservation.restaurantId,
    rTime: getValidTime(reservation.reservationTime),
    guest: reservation.guestId,
  }
}

export function mapFromDB(reservation: Reservation): ReservationDTO {
  if (!reservation) {
    return null
  }

  return {
    id: reservation.id,
    restaurantId: reservation.get('restaurantId'),
    reservationTime: getValidTime(reservation.get('rTime')),
    guestId: reservation.get('guest'),
    createdDate: getValidTime(reservation.get('created_at')),
  }
}
