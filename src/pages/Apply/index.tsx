import React, { useCallback, useState } from 'react'
import { ButtonError, ButtonLight } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import AppBody from '../AppBody'
import { useTranslation } from 'react-i18next'
import FlightInputPanel from '../../components/Apply/FlightInputPanel'
import FlightDetailsPanel from '../../components/Apply/FlightDetailsPanel'
import QuoteDetailsPanel from '../../components/Apply/QuoteDetailsPanel'
import ConfirmPurchaseModal from '../../components/Apply/ConfirmPurchaseModal'

import { useApplyActionHandlers, useApplyState } from '../../state/apply/hooks'

import { Carrier } from '../../entities/carrier'
import { Moment } from 'moment'
import styled from 'styled-components'
import { Text } from 'rebass'

import Logo from '../../assets/images/2020_Etherisc_FlightDelayProtection.svg'
import { isDefinedFlight } from '../../entities/flight'
import { useFlightDetailsState } from '../../state/flightDetails/hooks'
import { usePurchaseCallback } from '../../hooks/usePurchaseCallback'

const Wrapper = styled.div`
  position: relative;
`

const BottomGrouping = styled.div`
  margin-top: 1rem;
`

const DialogTitle = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
`
export default function Apply() {
  const { t } = useTranslation()
  const flightDetails = useFlightDetailsState()
  const premium = '15000000000000000000'

  const { account } = useActiveWeb3React()

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  // apply state
  const { flight } = useApplyState()

  const { onCarrierSelection, onFlightNumberInput, onDepartureInput } = useApplyActionHandlers()

  // the callback to execute the purchase
  const { callback: purchaseCallback } = usePurchaseCallback({ flightDetails, premium })

  // modal and loading
  const [{ showConfirm, attemptingTxn, txHash, purchaseErrorMessage }, setPurchaseState] = useState<{
    showConfirm: boolean
    attemptingTxn: boolean
    txHash: string | undefined
    purchaseErrorMessage: string | undefined
  }>({
    showConfirm: false,
    attemptingTxn: false,
    txHash: undefined,
    purchaseErrorMessage: undefined
  })

  const showFlightDetails = isDefinedFlight(flight)
  const showQuote = isDefinedFlight(flight) && flightDetails.hasFlights

  const handleCarrierSelect = useCallback(
    (value: Carrier) => {
      onCarrierSelection(value)
    },
    [onCarrierSelection]
  )

  const handleFlightNumberInput = useCallback(
    (value: string) => {
      onFlightNumberInput(value)
    },
    [onFlightNumberInput]
  )

  const handleDepartureInput = useCallback(
    (value: Moment | null) => {
      onDepartureInput(value)
    },
    [onDepartureInput]
  )

  const handlePurchase = useCallback(() => {
    if (!purchaseCallback) {
      return
    }
    setPurchaseState({ attemptingTxn: true, showConfirm, purchaseErrorMessage: undefined, txHash: undefined })
    purchaseCallback()
      .then((hash: any) => {
        setPurchaseState({ attemptingTxn: false, showConfirm, purchaseErrorMessage: undefined, txHash: hash })
      })
      .catch((error: { message: any }) => {
        setPurchaseState({
          attemptingTxn: false,
          showConfirm,
          purchaseErrorMessage: error.message,
          txHash: undefined
        })
      })
  }, [purchaseCallback, showConfirm])

  const handleConfirmDismiss = useCallback(() => {
    setPurchaseState({ showConfirm: false, attemptingTxn, txHash, purchaseErrorMessage: undefined })
  }, [attemptingTxn, txHash])

  return (
    <>
      <AppBody>
        <Wrapper id="apply-page">
          <ConfirmPurchaseModal
            onConfirm={handlePurchase}
            onDismiss={handleConfirmDismiss}
            isOpen={showConfirm}
            attemptingTxn={attemptingTxn}
            txHash={txHash}
            purchaseErrorMessage={purchaseErrorMessage}
          ></ConfirmPurchaseModal>
          <AutoColumn gap={'md'}>
            <DialogTitle>
              <img width={'400px'} src={Logo} alt="logo" />
            </DialogTitle>
            <FlightInputPanel
              flight={flight}
              onCarrierSelect={handleCarrierSelect}
              onFlightNumberInput={handleFlightNumberInput}
              onDepartureInput={handleDepartureInput}
              id="carrier-select-input"
            />
            {showFlightDetails ? <FlightDetailsPanel id="flight-details-input-2" /> : null}
            {showQuote ? <QuoteDetailsPanel id="flight-details-input-2" /> : null}
          </AutoColumn>
          <BottomGrouping>
            {!account ? (
              <ButtonLight onClick={toggleWalletModal}>{t('connectWallet')}</ButtonLight>
            ) : (
              <ButtonError
                onClick={() => {
                  setPurchaseState({
                    attemptingTxn: false,
                    showConfirm: true,
                    txHash: undefined,
                    purchaseErrorMessage: undefined
                  })
                }}
                id="purchase-button"
                disabled={!showQuote}
              >
                <Text fontSize={16} fontWeight={500}>
                  {t('fdd.purchaseProtection')}
                </Text>
              </ButtonError>
            )}
          </BottomGrouping>
        </Wrapper>
      </AppBody>
    </>
  )
}
