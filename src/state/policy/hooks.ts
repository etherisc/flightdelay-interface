import { useSelector } from 'react-redux'
import { AppState } from '../index'
import { fetchPolicies } from './actions'

export function usePoliciesState(): AppState['policies'] {
  return useSelector<AppState, AppState['policies']>(state => state.policies)
}

export function getPolicyData(dispatch: any, account: any) {
  const environment = process.env.REACT_APP_DEMO === '0' ? 'production' : 'demo'
  const apiURL = `https://fs-api.etherisc.com/api/v1/policies/${account}/${environment}`
  fetch(apiURL)
    .then((response: any) => {
      response.json().then((json: any) => {
        // console.log(`Policies fetched: ${JSON.stringify(json)}`)
        dispatch(fetchPolicies.fulfilled({ account, policies: json.policies }))
      })
    })
    .catch(error => {
      dispatch(fetchPolicies.rejected({ account, errorMessage: error.message }))
    })
}
