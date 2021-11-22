import React from 'react'
import { useTranslation } from 'react-i18next'
import { TYPE } from 'theme'

import { ButtonError, ButtonLight, ButtonPrimary } from '../Button'
import { AutoColumn } from '../Column'

import { useActiveWeb3React } from '../../hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import AppBody from '../../pages/AppBody'

import CurrencyInputPanel from '../../components/CurrencyInputPanel'

import styled from 'styled-components'
import { Text } from 'rebass'

import { AutoRow } from 'components/Row'
import useAmount from 'hooks/useAmount'
import { useStakeCallback } from 'hooks/FlightDelayStake'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { useCurrency } from 'hooks/Tokens'
import { tryParseAmount } from 'utils/tryParseAmount'

import deployments from 'constants/deployments.json'

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

export default function StakeModal({ closeModal, stableAddr, dipAddr }: Props) {
  const { t } = useTranslation()

  const { account } = useActiveWeb3React()

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  const { daiAmount, dipAmount, setDaiAmount, setDipAmount } = useAmount()

  const { callback: stakeCallback } = useStakeCallback(dipAmount, daiAmount)

  const stableCurrency = useCurrency(stableAddr)

  const stableCurrencyAmount = tryParseAmount(daiAmount, stableCurrency || undefined)
  const dipCurrency = useCurrency(dipAddr)
  const dipCurrencyAmount = tryParseAmount(dipAmount, dipCurrency || undefined)

  const [approvalDai, approveDaiCallback] = useApproveCallback(stableCurrencyAmount, deployments.Staking.address)
  const [approvalDip, approveDipCallback] = useApproveCallback(dipCurrencyAmount, deployments.Staking.address)

  const confirmStake = async () => {
    if (stakeCallback) {
      try {
        await stakeCallback()
      } catch (e) {
        console.error('error', e)
      }
    }
  }

  return (
    <>
      <AppBody>
        <Wrapper id="stake-modal">
          <AutoColumn gap={'md'}>
            <TYPE.largeHeader>{t('stake')}</TYPE.largeHeader>
            <AutoRow gap="5px">
              <InputColumn>
                <CurrencyInputPanel
                  value={daiAmount}
                  onUserInput={setDaiAmount}
                  showMaxButton={true}
                  address={stableAddr}
                  id="add-liquidity-input-tokena"
                />
              </InputColumn>
              <InputColumn>
                <CurrencyInputPanel
                  value={dipAmount}
                  onUserInput={setDipAmount}
                  showMaxButton={true}
                  address={dipAddr}
                  id="add-liquidity-input-tokenb"
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
                  ) : approvalDai === ApprovalState.NOT_APPROVED || approvalDai === ApprovalState.PENDING ? (
                    <ButtonPrimary onClick={approveDaiCallback} disabled={approvalDai === ApprovalState.PENDING}>
                      {approvalDai === ApprovalState.PENDING ? 'Approving Dai' : 'Approve Dai'}
                    </ButtonPrimary>
                  ) : approvalDip === ApprovalState.NOT_APPROVED || approvalDip === ApprovalState.PENDING ? (
                    <ButtonPrimary onClick={approveDipCallback} disabled={approvalDip === ApprovalState.PENDING}>
                      {approvalDip === ApprovalState.PENDING ? 'Approving Dip' : 'Approve Dip'}
                    </ButtonPrimary>
                  ) : (
                    // <ButtonError onClick={confirmStake}>
                    <ButtonError disabled={true} onClick={confirmStake}>
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
