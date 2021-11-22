import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { defaultAbiCoder, formatBytes32String, parseUnits } from 'ethers/lib/utils'
import { useMemo } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin, getContract } from '../utils'
import isZero from '../utils/isZero'
import { useActiveWeb3React } from './index'
import { FlightDetails } from '../state/flightDetails/reducer'
import { abi } from './FlightDelayAbi.json'

export enum PurchaseCallbackState {
  INVALID,
  LOADING,
  VALID
}

// TODO: Use addressresolver or API call

const FlightDelayContractAddress = '0xbBe7c65cC7Ad821B0a94eE5CB0B0f9E343e271ae'

interface PurchaseParameters {
  /**
   * The method to call on the Uniswap V2 Router.
   */
  methodName: string
  /**
   * The arguments to pass to the method, all hex encoded.
   */
  args: (string | string[])[]
  /**
   * The amount of wei to send in hex.
   */
  value: string
}

export interface Purchase {
  flightDetails: FlightDetails
  premium: string
}

interface PurchaseCall {
  contract: Contract
  parameters: PurchaseParameters
}

interface SuccessfulCall {
  call: PurchaseCall
  gasEstimate: BigNumber
}

interface FailedCall {
  call: PurchaseCall
  error: Error
}

type EstimatedPurchaseCall = SuccessfulCall | FailedCall

/**
 * Returns the swap calls that can be used to make the trade
 */

function usePurchaseCallArguments(purchase: Purchase): PurchaseCall | null {
  const { account, library } = useActiveWeb3React()
  const toHex = (arg: string | number) => BigNumber.from(arg).toString()
  const toWei = (arg: string) => parseUnits(arg).toString()

  return useMemo(() => {
    console.log('Purchase', purchase)
    if (!purchase || !purchase.flightDetails || !purchase.flightDetails.hasFlights) {
      return null
    }
    const {
      flightDetails: {
        quote,
        flight: {
          carrier: { iata },
          flightNumber,
          arrivalDateTime,
          departureDateTime
        }
      },
      premium
    } = purchase

    if (!arrivalDateTime || !departureDateTime) {
      return null
    }
    // const departureYearMonthDay = departureDateTime => {
    //    format YYYY/MM/DD
    // }
    // const

    const parameters = {
      methodName: 'applyForPolicy',
      args: [
        formatBytes32String(`${iata}/${flightNumber}`), // carrierFlight
        formatBytes32String(departureDateTime.format('YYYY/MM/DD')), // yearMonthDay TODO: check for UTC consistency
        toHex(departureDateTime.unix()), // departureTime TODO: check for UTC consistency
        toHex(arrivalDateTime.unix()), // arrivalTime TODO: check for UTC consistency
        ['0', '0', quote.quoteDelayed15, quote.quoteCancelled, quote.quoteDiverted].map(toWei) // payoutOptions
      ],
      value: toWei(premium)
    }

    if (!library || !account) return null
    const contract: Contract = getContract(FlightDelayContractAddress, abi, library, account)
    if (!contract) {
      return null
    }
    console.log('Parameters', parameters)
    return { contract, parameters }
  }, [account, purchase, library])
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function usePurchaseCallback(
  purchase: Purchase
): {
  state: PurchaseCallbackState
  callback: null | (() => Promise<string>)
  error: string | null
} {
  const { account, chainId, library } = useActiveWeb3React()

  const purchaseCall = usePurchaseCallArguments(purchase)
  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    if (!purchaseCall || !library || !account || !chainId) {
      return { state: PurchaseCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }

    return {
      state: PurchaseCallbackState.VALID,
      callback: async function onPurchase(): Promise<string> {
        const {
          contract,
          parameters: { methodName, args, value }
        } = purchaseCall

        const options = !value || isZero(value) ? {} : { value }

        const estimatedPurchaseCall: EstimatedPurchaseCall = await contract.estimateGas[methodName](...args, options)
          .then(gasEstimate => {
            return {
              call: purchaseCall,
              gasEstimate
            }
          })
          .catch(gasError => {
            console.debug('Gas estimate failed, trying eth_call to extract error', purchaseCall)

            return contract.callStatic[methodName](...args, options)
              .then(result => {
                console.debug('Unexpected successful call after failed estimate gas', purchaseCall, gasError, result)
                return {
                  call: purchaseCall,
                  error: new Error('Unexpected issue with estimating the gas. Please try again.')
                }
              })
              .catch(callError => {
                console.debug('Call threw error', purchaseCall, callError)
                const reason = callError.reason
                  ? callError.reason
                  : callError.code
                  ? callError.data.data.slice(0, 8) === 'Reverted'
                    ? `Error: Revert; Reason: ${
                        defaultAbiCoder.decode(['string'], '0x' + callError.data.data.slice(19))[0]
                      }; Message = ${callError.data.message}`
                    : `Error: Code = ${callError.code}, data = ${JSON.stringify(callError.data)}`
                  : JSON.stringify(callError)
                return { call: purchaseCall, error: new Error(reason) }
              })
          })

        if ('error' in estimatedPurchaseCall) {
          console.debug('Error in estimatePurchaseCall, error=', estimatedPurchaseCall.error)
          throw estimatedPurchaseCall.error
        }

        // now everything is prepared, execute the call
        return contract[methodName](...args, {
          gasLimit: calculateGasMargin(estimatedPurchaseCall.gasEstimate),
          ...(value && !isZero(value) ? { value, from: account } : { from: account })
        })
          .then((response: any) => {
            const {
              flightDetails: {
                flight: {
                  carrier: { iata: carrierIata },
                  flightNumber,
                  departureDateTime
                }
              }
            } = purchase
            const departureYMD = departureDateTime ? `on ${departureDateTime.format('DD/MM/YYYY')}` : ''
            const summary = `Purchase insurance for ${carrierIata} ${flightNumber} ${departureYMD}`
            addTransaction(response, {
              summary
            })

            return response.hash
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error('Transaction rejected.')
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Purchase failed`, error, methodName, args, value)
              throw new Error(`Purchase failed: ${error.message}`)
            }
          })
      },
      error: null
    }
  }, [purchase, purchaseCall, library, account, chainId, addTransaction])
}
