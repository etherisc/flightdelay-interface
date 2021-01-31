import React, { useContext } from 'react'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
// import { TYPE } from '../../theme'
import { ButtonError } from '../Button'
import { AutoColumn } from '../Column'
// import QuestionHelper from '../QuestionHelper'
import { AutoRow, RowBetween /* RowFixed */ } from '../Row'
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
            15.00 xDai
          </Text>
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
