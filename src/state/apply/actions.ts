import { createAction } from '@reduxjs/toolkit'
import { Carrier } from '../../entities/carrier'
import { Moment } from 'moment'

export const selectCarrier = createAction<{ carrier: Carrier }>('apply/selectCarrier')
export const inputFlightNumber = createAction<{ flightNumber: string }>('apply/inputFlightNumber')
export const inputDeparture = createAction<{ departure: Moment | null }>('apply/inputDeparture')
