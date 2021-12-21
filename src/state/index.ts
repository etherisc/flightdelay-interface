import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { load, save } from 'redux-localstorage-simple'

import application from './application/reducer'
import { updateVersion } from './global/actions'
import user from './user/reducer'
import apply from './apply/reducer'
import flightDetails from './flightDetails/reducer'
import policies from './policy/reducer'
import transactions from './transactions/reducer'
import multicall from './multicall/reducer'

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists']

const store = configureStore({
  reducer: {
    application,
    apply,
    flightDetails,
    policies,
    user,
    transactions,
    multicall
  },
  middleware: [
    ...getDefaultMiddleware({ thunk: true, immutableCheck: false, serializableCheck: false }),
    save({ states: PERSISTED_KEYS })
  ],
  preloadedState: load({ states: PERSISTED_KEYS })
})

store.dispatch(updateVersion())

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
