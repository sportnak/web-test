import { Guest } from '../models'
import { getValidTime } from '../utility'
interface IGuestDTO {
  id: number
  name: string
  email: string
  guestCount: number
  timestamp: Date
  createdDate: Date
}

export class GuestDTO implements IGuestDTO {
  id: number
  name: string
  email: string
  guestCount: number
  timestamp: Date
  createdDate: Date

  constructor(data: Partial<IGuestDTO>) {
    this.id = data?.id
    this.name = data?.name
    this.email = data?.email
    this.guestCount = data?.guestCount
    this.timestamp = getValidTime(data?.timestamp)
    this.createdDate = getValidTime(data?.createdDate)
  }
}

export function mapToDB(guest: GuestDTO): Partial<Guest> {
  if (!guest) {
    return null
  }

  return {
    id: guest.id,
    name: guest.name,
    email: guest.email,
    guestCount: guest.guestCount,
    timestamp: guest.timestamp,
  }
}

export function mapFromDB(guest: Guest): GuestDTO {
  if (!guest) {
    return null
  }

  return {
    id: guest.id,
    name: guest.get('name'),
    email: guest.get('email'),
    guestCount: guest.get('guestCount'),
    timestamp: guest.get('timestamp'),
    createdDate: new Date(guest.get('created_at')),
  }
}
