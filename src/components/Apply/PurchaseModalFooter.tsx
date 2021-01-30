import React, { useContext } from 'react'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { TYPE } from '../../theme'
import { ButtonError } from '../Button'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { AutoRow, RowBetween, RowFixed } from '../Row'
import { useTranslation } from 'react-i18next'

export default function PurchaseModalFooter({ onConfirm }: { onConfirm: () => void }) {
  const { t } = useTranslation()

  const theme = useContext(ThemeContext)

  return (
    <>
      <AutoColumn gap="0px">
        <RowBetween align="center">
          <Text fontWeight={400} fontSize={14} color={theme.text2}>
            Price
          </Text>
          <Text
            fontWeight={500}
            fontSize={14}
            color={theme.text1}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '10px'
            }}
          >
            Text 11
          </Text>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
          </RowFixed>
          <RowFixed>
            <TYPE.black fontSize={14}>Text 12</TYPE.black>
            <TYPE.black fontSize={14} marginLeft={'4px'}>
              Text 13
            </TYPE.black>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black color={theme.text2} fontSize={14} fontWeight={400}>
              Price Impact
            </TYPE.black>
            <QuestionHelper text="The difference between the market price and your price due to trade size." />
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              Liquidity Provider Fee
            </TYPE.black>
            <QuestionHelper text="A portion of each trade (0.30%) goes to liquidity providers as a protocol incentive." />
          </RowFixed>
          <TYPE.black fontSize={14}>Text 14</TYPE.black>
        </RowBetween>
      </AutoColumn>

      <AutoRow>
        <ButtonError onClick={onConfirm} style={{ margin: '10px 0 0 0' }} id="confirm-swap-or-send">
          <Text fontSize={20} fontWeight={500}>
            {t('fdd.confirmPurchase')}
          </Text>
        </ButtonError>
      </AutoRow>
    </>
  )
}
