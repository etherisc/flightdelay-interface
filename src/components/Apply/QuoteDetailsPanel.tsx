import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { darken } from 'polished'
import { RowBetween } from '../Row'
import { TYPE } from '../../theme'
import { useTranslation } from 'react-i18next'
import { useFlightDetailsState } from '../../state/flightDetails/hooks'
import { useApplyState } from '../../state/apply/hooks'

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg2};
  z-index: 1;
`

const Container = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg1};
`

const Grid = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 16px;
`

const InputColumn = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  z-index: 1;
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`

const InputRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: 0.75rem 0.5rem 0.75rem 1rem;
  font-size: 2rem;
`

interface QuoteDetailsPanelProps {
  id: string
}

export default function QuoteDetailsPanel({ id }: QuoteDetailsPanelProps) {
  const { t } = useTranslation()

  const flightDetails = useFlightDetailsState()
  const apply = useApplyState()
  const theme = useContext(ThemeContext)

  return (
    <InputPanel id={id}>
      <Container>
        <Grid>
          <InputColumn>
            <LabelRow>
              <RowBetween>
                <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                  {t('fdd.priceDelayOnly')}
                </TYPE.body>
              </RowBetween>
            </LabelRow>
            <InputRow>${apply.premium} xDai</InputRow>
          </InputColumn>
          <></>
          <InputColumn>
            <LabelRow>
              <RowBetween>
                <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                  {t('fdd.termsAndConditions')}
                </TYPE.body>
              </RowBetween>
            </LabelRow>
            <InputRow></InputRow>
          </InputColumn>
        </Grid>
        <Grid>
          <InputColumn>
            <LabelRow>
              <RowBetween>
                <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                  {t('fdd.payoutDelayOnly')}
                </TYPE.body>
              </RowBetween>
            </LabelRow>
            <InputRow>${flightDetails.quote.quoteDelayed} xDai</InputRow>
          </InputColumn>
          <InputColumn>
            <LabelRow>
              <RowBetween>
                <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                  {t('fdd.payoutInclCancellation')}
                </TYPE.body>
              </RowBetween>
            </LabelRow>
            <InputRow>${flightDetails.quote.quoteCancelled} xDai</InputRow>
          </InputColumn>
        </Grid>
      </Container>
    </InputPanel>
  )
}
