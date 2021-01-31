import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { defaultAbiCoder, formatBytes32String, parseUnits } from 'ethers/lib/utils'
import { useMemo } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin, getContract } from '../utils'
import isZero from '../utils/isZero'
import { useActiveWeb3React } from './index'
import { FlightDetails } from '../state/flightDetails/reducer'

export enum PurchaseCallbackState {
  INVALID,
  LOADING,
  VALID
}

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

interface Purchase {
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

  const th = (arg: string | number) => BigNumber.from(arg).toHexString()
  const toWei = (arg: string | number) => parseUnits(BigNumber.from(arg).toString()).toHexString()

  return useMemo(() => {
    const abi = [
      {
        inputs: [
          {
            internalType: 'bytes32',
            name: '_carrierFlightNumber',
            type: 'bytes32'
          },
          {
            internalType: 'bytes32',
            name: '_departureYearMonthDay',
            type: 'bytes32'
          },
          {
            internalType: 'uint256',
            name: '_departureTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: '_arrivalTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256[]',
            name: '_payoutOptions',
            type: 'uint256[]'
          }
        ],
        name: 'applyForPolicy',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
        payable: true
      }
    ]
    const parameters = {
      methodName: 'applyForPolicy',
      args: [
        formatBytes32String('LH/117'), // carrierFlight
        formatBytes32String('2021/01/30'), // yearMonthDay
        th(1612021741), // departureTime
        th(1612021741), // arrivalTime
        [0, 0, 0, 15, 15].map(toWei) // payoutOptions
      ], // TODO
      value: purchase.premium // TODO
    }

    if (!library || !account) return null
    const contract: Contract = getContract('0xc19C7F5A4bdaAC5db399cD6eabB22DdB83720F0F', abi, library, account) // TODO: Add address, ABI
    if (!contract) {
      return null
    }

    return { contract, parameters }
  }, [account, purchase.premium, library])
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
          console.log(estimatedPurchaseCall.error)
          throw estimatedPurchaseCall.error
        }

        // now everything is prepared, execute the call
        console.log(value, account, estimatedPurchaseCall)
        return contract[methodName](...args, {
          gasLimit: calculateGasMargin(estimatedPurchaseCall.gasEstimate),
          ...(value && !isZero(value) ? { value, from: account } : { from: account })
        })
          .then((response: any) => {
            const summary = `Purchase insurance for xxx` // TODO: Add purchase details
            console.log(summary)
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
              console.log(account, chainId, library)
              console.error(`Purchase failed`, error, methodName, args, value)
              throw new Error(`Purchase failed: ${error.message}`)
            }
          })
      },
      error: null
    }
  }, [purchaseCall, library, account, chainId, addTransaction])
}
