import React, { useCallback } from 'react'
import { ButtonLight } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import AppBody from '../AppBody'
import { useTranslation } from 'react-i18next'
import FlightInputPanel from '../../components/FlightInputPanel'
import FlightDetailsPanel from '../../components/FlightDetailsPanel'
import QuoteDetailsPanel from '../../components/QuoteDetailsPanel'
import { useApplyActionHandlers, useApplyState } from '../../state/apply/hooks'

import { Carrier } from '../../entities/carrier'
import { Moment } from 'moment'
import styled from 'styled-components'
import Logo from '../../assets/images/2020_Etherisc_FlightDelayProtection.svg'
import { isDefinedFlight } from '../../entities/flight'

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

  const { account } = useActiveWeb3React()

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  // apply state
  const { flight } = useApplyState()

  const { onCarrierSelection, onFlightNumberInput, onDepartureInput } = useApplyActionHandlers()

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

  const showFlightDetails = isDefinedFlight(flight)

  return (
    <>
      <AppBody>
        <Wrapper id="apply-page">
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
            {showFlightDetails ? <FlightDetailsPanel flight={flight} id="flight-details-input-2" /> : null}
            <QuoteDetailsPanel id="flight-details-input-2" />
          </AutoColumn>
          <BottomGrouping>
            {!account ? (
              <ButtonLight onClick={toggleWalletModal}>{t('connectWallet')}</ButtonLight>
            ) : (
              <ButtonLight onClick={toggleWalletModal}>{t('fdd.applyForPolicy')}</ButtonLight>
            )}
          </BottomGrouping>
        </Wrapper>
      </AppBody>
    </>
  )
}
