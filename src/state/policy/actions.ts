import { ActionCreatorWithPayload, createAction } from '@reduxjs/toolkit'
import { PolicyData } from './reducer'

export const fetchPolicies: Readonly<{
  pending: ActionCreatorWithPayload<{ account: string }>
  fulfilled: ActionCreatorWithPayload<{ account: string | null | undefined; policies: PolicyData[] }>
  rejected: ActionCreatorWithPayload<{ account: string | null | undefined; errorMessage: string }>
}> = {
  pending: createAction('fetchPolicies/pending'),
  fulfilled: createAction('fetchPolicies/fulfilled'),
  rejected: createAction('fetchPolicies/rejected')
}
