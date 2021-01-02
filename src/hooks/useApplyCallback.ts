export enum ApplyCallbackState {
  INVALID,
  LOADING,
  VALID
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useApplyCallback(): {
  //  trade: Trade | undefined, // trade to execute, required
  //  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  //  recipientAddressOrName: string | null // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  state: ApplyCallbackState
  callback: null | (() => Promise<string>)
  error: string | null
} {
  // const { account, chainId, library } = useActiveWeb3React()

  return { state: 0, callback: null, error: 'Not implemented' }
}
