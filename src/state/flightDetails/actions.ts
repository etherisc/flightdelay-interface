import { ActionCreatorWithPayload, createAction } from '@reduxjs/toolkit'
import { Flight } from '../../entities/flight'

export const fetchFlightDetails: Readonly<{
  pending: ActionCreatorWithPayload<{ flight: Flight }>
  fulfilled: ActionCreatorWithPayload<{ flight: Flight; flightDetails: any; flightRatings: any }>
  rejected: ActionCreatorWithPayload<{ flight: Flight; errorMessage: string }>
}> = {
  pending: createAction('fetchFlightDetails/pending'),
  fulfilled: createAction('fetchFlightDetails/fulfilled'),
  rejected: createAction('fetchFlightDetails/rejected')
}
