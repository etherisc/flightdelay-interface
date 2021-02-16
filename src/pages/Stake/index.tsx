import React, { useState } from 'react'

import { ButtonError, ButtonLight } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import AppBody from '../AppBody'
import { useTranslation } from 'react-i18next'

import styled from 'styled-components'
import { Text } from 'rebass'

import { GreyCard, LightCard } from 'components/Card'
import { AutoRow, RowBetween } from 'components/Row'
import { TYPE } from 'theme'
import StakeInfo from 'components/Stake/StakeInfo'

import * as modalModes from 'constants/modalMode.json'

import StakeModal from 'components/Stake/StakeModal'
import WithdrawModal from 'components/Stake/WithdrawModal'

import { stableTokens, dipToken } from '../../constants/tokens'

const Wrapper = styled.div`
  position: relative;
`

const BottomGrouping = styled.div`
  margin-top: 1rem;
`

const InputColumn = styled.div`
  flex: 1;
`

export default function Stake() {
  const { t } = useTranslation()

  const { account } = useActiveWeb3React()

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  const stable = 'DAI'

  const stableAddr = stableTokens[stable]
  const dipAddr = dipToken

  const [modalMode, setModalMode] = useState(modalModes.NONE)
  const closeModal = () => setModalMode(modalModes.NONE)

  return (
    <>
      {modalMode === modalModes.STAKE && (
        <StakeModal closeModal={closeModal} stableAddr={stableAddr} dipAddr={dipAddr} />
      )}
      {modalMode === modalModes.WITHDRAW && (
        <WithdrawModal closeModal={closeModal} stableAddr={stableAddr} dipAddr={dipAddr} />
      )}
      {modalMode === modalModes.NONE && (
        <AppBody>
          <Wrapper id="stake-page">
            <AutoColumn gap={'md'}>
              <TYPE.largeHeader>
                {t('stake')}/{t('withdraw')}
              </TYPE.largeHeader>
              {account && (
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
              )}
            </AutoColumn>
            <BottomGrouping>
              {!account ? (
                <ButtonLight onClick={toggleWalletModal}>{t('connectWallet')}</ButtonLight>
              ) : (
                <AutoRow justify="space-between" gap="4px">
                  <InputColumn>
                    <ButtonError onClick={() => setModalMode(modalModes.STAKE)}>
                      <Text fontSize={16} fontWeight={500}>
                        {t('stake')}
                      </Text>
                    </ButtonError>
                  </InputColumn>
                  <InputColumn>
                    <ButtonError onClick={() => setModalMode(modalModes.WITHDRAW)}>
                      <Text fontSize={16} fontWeight={500}>
                        {t('withdraw')}
                      </Text>
                    </ButtonError>
                  </InputColumn>
                </AutoRow>
              )}
            </BottomGrouping>
          </Wrapper>
        </AppBody>
      )}
    </>
  )
}
