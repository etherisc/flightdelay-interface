import { Carrier } from './carrier'
import { Moment } from 'moment'

export interface Flight {
  carrier: Carrier
  flightNumber: string
  departureDate: Moment | null
  departureDateTime?: Moment | null
  arrivalDateTime?: Moment | null
}

export function isDefinedFlight(flight: Flight) {
  const { carrier, flightNumber, departureDate } = flight
  return carrier && carrier.iata && flightNumber && departureDate
}
