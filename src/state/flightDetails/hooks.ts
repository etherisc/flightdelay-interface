import { AppState } from '../index'
import { useSelector } from 'react-redux'
import { isDefinedFlight } from '../../entities/flight'
import { getFlightSchedule, getFlightQuote } from '../../utils/getFlightDetails'

export function useFlightDetailsState(): AppState['flightDetails'] {
  return useSelector<AppState, AppState['flightDetails']>(state => state.flightDetails)
}

export async function fetchDetailsThunk(dispatch: any, getState: any) {
  const flight = getState().apply.flight
  const premium = getState().apply.premium
  if (isDefinedFlight(flight)) {
    dispatch({ type: 'fetchFlightDetails/pending' })
    try {
      const flightDetails = await getFlightSchedule(flight)
      const { rating, quote } = await getFlightQuote(premium, flight)
      dispatch({
        type: 'fetchFlightDetails/fulfilled',
        payload: { flight, flightDetails, rating, quote }
      })
    } catch (e) {
      dispatch({ type: 'fetchFlightDetails/rejected' })
    }
  }
}
