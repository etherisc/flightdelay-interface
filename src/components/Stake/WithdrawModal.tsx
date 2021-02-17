import React from 'react'
import { useTranslation } from 'react-i18next'
import { TYPE } from 'theme'

import { ButtonError, ButtonLight, ButtonPrimary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import AppBody from '../../pages/AppBody'

import CurrencyInputPanel from '../../components/CurrencyInputPanel'

import styled from 'styled-components'
import { Text } from 'rebass'

import { AutoRow } from 'components/Row'
import useAmount from 'hooks/useAmount'
import { useStakeBalance, useWithdrawCallback } from 'hooks/FlightDelayStake'

const Wrapper = styled.div`
  position: relative;
`

const BottomGrouping = styled.div`
  margin-top: 1rem;
`

const InputColumn = styled.div`
  flex: 1;
`

type Props = {
  closeModal: () => void
  stableAddr: string
  dipAddr: string
}

export default function WithdrawModal({ closeModal, stableAddr, dipAddr }: Props) {
  const { t } = useTranslation()

  const { account } = useActiveWeb3React()

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  const [daiBalance, dipBalance] = useStakeBalance()
  const { daiAmount, dipAmount, setDaiAmount, setDipAmount } = useAmount()

  const { callback: withdrawCallback } = useWithdrawCallback(daiAmount)

  const confirmWithdraw = async () => {
    if (withdrawCallback) {
      try {
        await withdrawCallback()
      } catch (e) {
        console.error('error', e)
      }
    }
  }

  return (
    <>
      <AppBody>
        <Wrapper id="withdraw-modal">
          <AutoColumn gap={'md'}>
            <TYPE.largeHeader>{t('withdraw')}</TYPE.largeHeader>
            <AutoRow gap="5px">
              <InputColumn>
                <CurrencyInputPanel
                  value={daiAmount}
                  onUserInput={setDaiAmount}
                  showMaxButton={true}
                  address={stableAddr}
                  id="add-liquidity-input-tokena"
                  max={daiBalance}
                />
              </InputColumn>
              <InputColumn>
                <CurrencyInputPanel
                  value={dipAmount}
                  onUserInput={setDipAmount}
                  showMaxButton={true}
                  address={dipAddr}
                  id="add-liquidity-input-tokenb"
                  max={dipBalance}
                />
              </InputColumn>
            </AutoRow>
          </AutoColumn>
          <BottomGrouping>
            {!account ? (
              <ButtonLight onClick={toggleWalletModal}>{t('connectWallet')}</ButtonLight>
            ) : (
              <AutoRow justify="space-between" gap="4px">
                <InputColumn>
                  <ButtonError onClick={() => closeModal()}>
                    <Text fontSize={16} fontWeight={500}>
                      {t('cancel')}
                    </Text>
                  </ButtonError>
                </InputColumn>
                <InputColumn>
                  {!parseInt(daiAmount) ? (
                    <ButtonPrimary disabled={true}>Enter the amount</ButtonPrimary>
                  ) : (
                    <ButtonError onClick={confirmWithdraw}>
                      <Text fontSize={16} fontWeight={500}>
                        {t('confirm')}
                      </Text>
                    </ButtonError>
                  )}
                </InputColumn>
              </AutoRow>
            )}
          </BottomGrouping>
        </Wrapper>
      </AppBody>
    </>
  )
}
