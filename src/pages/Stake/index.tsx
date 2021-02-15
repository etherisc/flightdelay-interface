import React from 'react'

import { ButtonError, ButtonLight } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import AppBody from '../AppBody'
import { useTranslation } from 'react-i18next'

import CurrencyInputPanel from '../../components/CurrencyInputPanel'

import styled from 'styled-components'
import { Text } from 'rebass'

import { stableTokens, dipToken } from '../../constants/tokens'

import Logo from '../../assets/images/2020_Etherisc_FlightDelayProtection.svg'
import { GreyCard, LightCard } from 'components/Card'
import { AutoRow, RowBetween } from 'components/Row'
import { TYPE } from 'theme'
import StakeInfo from 'components/Stake/StakeInfo'
import useAmount from 'hooks/useAmount'

const Wrapper = styled.div`
  position: relative;
`

const BottomGrouping = styled.div`
  margin-top: 1rem;
`

const InputColumn = styled.div`
  flex: 1;
`

const DialogTitle = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
`
export default function Apply() {
  const { t } = useTranslation()

  const { account } = useActiveWeb3React()

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  const { daiAmount, dipAmount, setDaiAmount, setDipAmount } = useAmount()

  const stable = 'DAI'

  const stableAddr = stableTokens[stable]
  const dipAddr = dipToken

  return (
    <>
      <AppBody>
        <Wrapper id="apply-page">
          <AutoColumn gap={'md'}>
            <DialogTitle>
              <img width={'400px'} src={Logo} alt="logo" />
            </DialogTitle>
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
            <GreyCard padding="0px" borderRadius={'20px'}>
              <RowBetween padding="1rem">
                <TYPE.subHeader fontWeight={500} fontSize={14}>
                  Stake Info
                </TYPE.subHeader>
              </RowBetween>{' '}
              <LightCard padding="1rem" borderRadius={'20px'}>
                <StakeInfo stableSymbol={stable} />
              </LightCard>
            </GreyCard>
          </AutoColumn>
          <BottomGrouping>
            {!account ? (
              <ButtonLight onClick={toggleWalletModal}>{t('connectWallet')}</ButtonLight>
            ) : (
              <ButtonError
              // onClick={() => {
              //   setPurchaseState({
              //     attemptingTxn: false,
              //     showConfirm: true,
              //     txHash: undefined,
              //     purchaseErrorMessage: undefined
              //   })
              // }}
              // id="purchase-button"
              // disabled={!showQuote}
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
