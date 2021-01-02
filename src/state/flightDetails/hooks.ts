import { AppState } from '../index'
import { useSelector } from 'react-redux'
import { isDefinedFlight } from '../../entities/flight'
import { getFlightSchedule, getFlightRatings } from '../../utils/getFlightDetails'

export function useFlightDetailsState(): AppState['flightDetails'] {
  return useSelector<AppState, AppState['flightDetails']>(state => state.flightDetails)
}

export async function fetchDetailsThunk(dispatch: any, getState: any) {
  const flight = getState().apply.flight
  if (isDefinedFlight(flight)) {
    dispatch({ type: 'fetchFlightDetails/pending' })
    const flightDetails = await getFlightSchedule(flight)
    const flightRatings = await getFlightRatings(flight)
    dispatch({ type: 'fetchFlightDetails/fulfilled', payload: { flight, flightDetails, flightRatings } })
  }
}
