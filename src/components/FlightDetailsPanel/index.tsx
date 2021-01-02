import React, { /* useCallback ,*/ useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { darken } from 'polished'
import { RowBetween } from '../Row'
import { TYPE } from '../../theme'
import { useTranslation } from 'react-i18next'
import { useFlightDetailsState } from '../../state/flightDetails/hooks'
import { Moment } from 'moment'

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
`

interface FlightDetailsPanelProps {
  id: string
}

export default function FlightDetailsPanel({ id }: FlightDetailsPanelProps) {
  const { t } = useTranslation()

  const theme = useContext(ThemeContext)
  const flightDetails = useFlightDetailsState()

  function timeFormatted(dateTime: Moment | null | undefined): string {
    return dateTime ? dateTime.format('DD.MM.YYYY HH.mm') : 'n/a'
  }

  function probabilityLate() {
    const prob = (1 - flightDetails.rating.ontime / flightDetails.rating.observations) * 100
    return prob.toFixed(2)
  }

  function probabilityCancelled() {
    const prob = (flightDetails.rating.cancelled / flightDetails.rating.observations) * 100
    return prob.toFixed(2)
  }

  return flightDetails.hasFlights ? (
    <InputPanel id={id}>
      <Container>
        <Grid>
          <InputColumn>
            <LabelRow>
              <RowBetween>
                <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                  {t('fdd.origin')}
                </TYPE.body>
              </RowBetween>
            </LabelRow>
            <InputRow>{`${flightDetails.origin.iata} ${flightDetails.origin.name}`}</InputRow>
          </InputColumn>
          <InputColumn>
            <LabelRow>
              <RowBetween>
                <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                  {t('fdd.departureTime')}
                </TYPE.body>
              </RowBetween>
            </LabelRow>
            <InputRow>{timeFormatted(flightDetails.flight.departureDateTime)}</InputRow>
          </InputColumn>
          <InputColumn>
            <LabelRow>
              <RowBetween>
                <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                  {t('fdd.delay45m')}
                </TYPE.body>
              </RowBetween>
            </LabelRow>
            <InputRow>{`${probabilityLate()}% ${t('fdd.probability')}`}</InputRow>
          </InputColumn>
        </Grid>
        <Grid>
          <InputColumn>
            <LabelRow>
              <RowBetween>
                <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                  {t('fdd.destination')}
                </TYPE.body>
              </RowBetween>
            </LabelRow>
            <InputRow>{`${flightDetails.destination.iata} ${flightDetails.destination.name}`}</InputRow>
          </InputColumn>
          <InputColumn>
            <LabelRow>
              <RowBetween>
                <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                  {t('fdd.arrivalTime')}
                </TYPE.body>
              </RowBetween>
            </LabelRow>
            <InputRow>{timeFormatted(flightDetails.flight.arrivalDateTime)}</InputRow>
          </InputColumn>
          <InputColumn>
            <LabelRow>
              <RowBetween>
                <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                  {t('fdd.delayCancel')}
                </TYPE.body>
              </RowBetween>
            </LabelRow>
            <InputRow>{`${probabilityCancelled()}% ${t('fdd.probability')}`}</InputRow>
          </InputColumn>
        </Grid>
      </Container>
    </InputPanel>
  ) : !flightDetails.pending ? (
    <InputPanel id={id}>
      <Container>
        <InputColumn>
          <InputRow>
            <TYPE.red>No flights available for given carrier & flight number on departure date</TYPE.red>
          </InputRow>
        </InputColumn>
      </Container>
    </InputPanel>
  ) : (
    <></>
  )
}
