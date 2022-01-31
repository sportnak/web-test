import { GuestDTO, ReservationDTO } from '..'
import { getValidTime } from '../../utility'

class BaseRequestDTO {
  requiredProperties: string[]
  validators: { [key: string]: (dataAtKey: any) => boolean }
  constructor(
    requiredProperties: BaseRequestDTO['requiredProperties'],
    validators?: BaseRequestDTO['validators']
  ) {
    this.requiredProperties = requiredProperties
    this.validators = validators
  }

  isValidRequest() {
    for (const property of this.requiredProperties) {
      if (!this.hasOwnProperty(property)) {
        return false
      } else if (this.validators?.[property] != null) {
        return this.validators[property](this[property])
      }
    }

    return true
  }
}

interface IReservationRequestDTO {
  name: string
  email: string
  guestCount: number
  time: Date
  restaurantId: number
}

export class ReservationRequestDTO extends BaseRequestDTO implements IReservationRequestDTO {
  name: string
  email: string
  guestCount: number
  time: Date
  restaurantId: number

  constructor(data: any) {
    super(['name', 'email', 'guestCount', 'time', 'restaurantId'])
    if (!data) {
      throw new Error('Failed to map reservation request')
    }

    this.name = data.name
    this.email = data.email
    this.guestCount = data.guestCount
    this.time = getValidTime(data.time)
    this.restaurantId = data.restaurantId
  }

  getGuestDTO() {
    return new GuestDTO({
      email: this.email,
      name: this.name,
    })
  }

  getReservationDTO(guestId: number) {
    if (!this.isValidRequest()) {
      return -1
    }

    return new ReservationDTO({
      guestId,
      reservationTime: this.time,
      restaurantId: this.restaurantId,
    })
  }
}
