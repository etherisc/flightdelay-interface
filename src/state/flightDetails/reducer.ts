import { createReducer } from '@reduxjs/toolkit'
import { Flight } from '../../entities/flight'
import { Airport } from '../../entities/airport'
import { fetchFlightDetails } from './actions'
import moment from 'moment'

export interface FlightDetails {
  flight: Flight
  origin: Airport
  destination: Airport
  rating: any
  pending: boolean
  hasFlights: boolean
  errorMessage: string
}

const initialState: FlightDetails = {
  flight: { carrier: { iata: '', name: '' }, flightNumber: '', departureDate: null },
  origin: { iata: '', name: '' },
  destination: { iata: '', name: '' },
  rating: {},
  pending: false,
  hasFlights: false,
  errorMessage: ''
}

function extractDetails(flight: Flight, flightDetails: any, flightRatings: any): FlightDetails {
  function airport(iata: string) {
    if (flightDetails.appendix && flightDetails.appendix.airports && flightDetails.appendix.airports.length > 0) {
      const airport = flightDetails.appendix.airports.filter((airport: any) => airport.iata === iata)
      return airport && airport.length > 0 ? airport[0].name : ''
    } else return ''
  }

  let result: any = {}
  if (
    !flightDetails.scheduledFlights ||
    flightDetails.scheduledFlights.length === 0 ||
    !flightRatings.ratings ||
    flightRatings.ratings.length === 0
  ) {
    result.hasFlights = false
  } else {
    const firstFlight = flightDetails.scheduledFlights[0]
    result = {
      rating: flightRatings.ratings[0],
      flight: {
        ...flight,
        departureDateTime: moment(firstFlight.departureTime),
        arrivalDateTime: moment(firstFlight.arrivalTime)
      },
      origin: {
        iata: firstFlight.departureAirportFsCode,
        name: airport(firstFlight.departureAirportFsCode)
      },
      destination: {
        iata: firstFlight.arrivalAirportFsCode,
        name: airport(firstFlight.arrivalAirportFsCode)
      },
      pending: false,
      hasFlights: true
    }
  }
  return result
}

export default createReducer(initialState, builder =>
  builder
    .addCase(fetchFlightDetails.pending, state => {
      state.pending = true
    })
    .addCase(fetchFlightDetails.fulfilled, (state, { payload: { flight, flightDetails, flightRatings } }) => {
      return extractDetails(flight, flightDetails, flightRatings)
    })
)
