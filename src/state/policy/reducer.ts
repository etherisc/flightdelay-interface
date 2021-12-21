import { createReducer } from '@reduxjs/toolkit'
import { fetchPolicies } from './actions'

export type PolicyData = {
  carrierFlightNumber?: string
  departureYearMonthDay?: string
  arrivalTime: string
  premium?: number
  delayInMinutes?: number
}

export interface PolicyState {
  policies: PolicyData[]
  pending: boolean
}

const initialState: PolicyState = {
  policies: [],
  pending: false
}

export default createReducer(initialState, builder =>
  builder
    .addCase(fetchPolicies.pending, state => {
      state.pending = true
    })
    .addCase(fetchPolicies.fulfilled, (state, { payload: { policies } }) => {
      state.policies = policies
      state.pending = false
    })
    .addCase(fetchPolicies.rejected, state => {
      state.pending = false
      state.policies = []
    })
)
