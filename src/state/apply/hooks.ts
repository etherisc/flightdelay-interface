import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../index'
import { inputDeparture, inputFlightNumber, selectCarrier } from './actions'
import { Carrier } from '../../entities/carrier'
import { Moment } from 'moment'
import { fetchDetailsThunk } from '../flightDetails/hooks'

export function useApplyState(): AppState['apply'] {
  return useSelector<AppState, AppState['apply']>(state => state.apply)
}

export function checkResetFlightNumber(newCarrier: Carrier) {
  return function resetFlightNumber(dispatch: any, getState: any) {
    const oldCarrier = getState().apply.flight.carrier
    if (oldCarrier.iata !== newCarrier.iata) {
      dispatch(inputFlightNumber({ flightNumber: '' }))
    }
  }
}

export function useApplyActionHandlers(): {
  onCarrierSelection: (carrier: Carrier) => void
  onFlightNumberInput: (flightNumber: string) => void
  onDepartureInput: (departure: Moment | null) => void
} {
  const dispatch = useDispatch()
  const onCarrierSelection = useCallback(
    (carrier: Carrier) => {
      dispatch(checkResetFlightNumber(carrier))
      dispatch(
        selectCarrier({
          carrier: carrier
        })
      )
      dispatch(fetchDetailsThunk)
    },
    [dispatch]
  )

  const onFlightNumberInput = useCallback(
    (flightNumber: string) => {
      dispatch(
        inputFlightNumber({
          flightNumber: flightNumber
        })
      )
      dispatch(fetchDetailsThunk)
    },
    [dispatch]
  )

  const onDepartureInput = useCallback(
    (departure: Moment | null) => {
      dispatch(
        inputDeparture({
          departure: departure
        })
      )
      dispatch(fetchDetailsThunk)
    },
    [dispatch]
  )

  return {
    onCarrierSelection,
    onFlightNumberInput,
    onDepartureInput
  }
}
