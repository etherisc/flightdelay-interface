import { createReducer } from '@reduxjs/toolkit'
import { inputDeparture, inputFlightNumber, selectCarrier } from './actions'
import { Flight } from '../../entities/flight'
import { Airport } from '../../entities/airport'

export interface ApplyState {
  readonly flight: Flight
  readonly origin: Airport
  readonly destination: Airport
  readonly premium: string
}

const initialState: ApplyState = {
  flight: { carrier: { iata: '', name: '' }, flightNumber: '', departureDate: null },
  origin: { iata: '', name: '' },
  destination: { iata: '', name: '' },
  premium: '0.15'
}

export default createReducer<ApplyState>(initialState, builder =>
  builder
    .addCase(selectCarrier, (state, { payload: { carrier } }) => {
      state.flight.carrier = carrier
    })
    .addCase(inputFlightNumber, (state, { payload: { flightNumber } }) => {
      state.flight.flightNumber = flightNumber
    })
    .addCase(inputDeparture, (state, { payload: { departure } }) => {
      state.flight.departureDate = departure
    })
)
