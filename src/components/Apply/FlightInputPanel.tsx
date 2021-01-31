import React, { useCallback, useContext, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { darken } from 'polished'
import CarrierSearchModal from '../SearchModal/CarrierSearchModal'
import { RowBetween } from '../Row'
import { TYPE } from '../../theme'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'
import { useTranslation } from 'react-i18next'
import { Carrier } from '../../entities/carrier'
import { Input as NumericalInput } from '../NumericalInput'
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
import { SingleDatePicker } from 'react-dates'
import { Moment } from 'moment'
import { Flight } from '../../entities/flight'

const CarrierSelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 2.2rem;
  font-size: ${({ selected }) => (selected ? '20px' : '16px')};
  font-weight: 500;
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.text2)};
  border-radius: 12px;
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;

  :focus,
  :hover {
    background-color: ${({ theme }) => theme.bg3};
  }
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

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;

  path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
    stroke-width: 1.5px;
  }
`

const InputPanel = styled.div<{ hideInput?: boolean; zIndex?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg2};
  z-index: ${({ zIndex }) => zIndex};
`

const Container = styled(RowBetween)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 16px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg1};
`

const InputRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: 0.75rem 0.5rem 0.75rem 1rem;
`

const InputColumn = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  z-index: 1;
`

const StyledCarrier = styled.span<{ active?: boolean }>`
  font-size: ${({ active }) => (active ? '20px' : '16px')};
`

const StyledDatePicker = styled.div<{ active?: boolean }>`
  & .SingleDatePicker,
  .SingleDatePickerInput {
    .DateInput_input {
      font-weight: 500;
      font-size: ${({ active }) => (active ? '20px' : '16px')};
      line-height: 24px;
      padding: 0px 8px;
      height: 2.2rem;
      color: ${({ theme }) => theme.text1};
      background-color: ${({ theme }) => theme.bg2};
      width: 100%;
      border: 0;
      border-radius: 12px;
      :hover {
        background-color: ${({ theme }) => theme.bg3};
      }
    }
    .SingleDatePicker_picker,
    .DayPicker__withBorder,
    .DayPicker_transitionContainer,
    .DayPicker_portal__horizontal {
      border-radius: 20px;
    }
    .DateInput_input__focused {
      outline: 0;
      background: #fff;
      border: 0;
    }
  }
`

interface FlightInputPanelProps {
  flight: Flight
  onCarrierSelect: (carrier: Carrier) => void
  onFlightNumberInput: (val: string) => void
  onDepartureInput: (val: Moment | null) => void
  id: string
}

export default function FlightInputPanel({
  flight,
  onCarrierSelect,
  onFlightNumberInput,
  onDepartureInput,
  id
}: FlightInputPanelProps) {
  const { t } = useTranslation()
  const { carrier, flightNumber, departureDate } = flight
  const [modalOpen, setModalOpen] = useState(false)
  const [datePickerFocused, setDatePickerFocused] = useState(false)
  const theme = useContext(ThemeContext)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <InputPanel id={id} zIndex={2}>
      <Container>
        <InputColumn>
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                {t('fdd.carrier')}
              </TYPE.body>
            </RowBetween>
          </LabelRow>
          <InputRow>
            <CarrierSelect
              selected={!!carrier && !!carrier.iata}
              className="open-carrier-select-button"
              onClick={() => {
                setModalOpen(true)
              }}
            >
              <Aligner>
                <StyledCarrier className="carrier-symbol-container" active={Boolean(carrier && carrier.iata)}>
                  {carrier && carrier.iata ? `${carrier.iata} ${carrier.name}` : '' || t('fdd.selectCarrier')}
                </StyledCarrier>
                <StyledDropDown selected={!!carrier} />
              </Aligner>
            </CarrierSelect>
          </InputRow>
        </InputColumn>
        <InputColumn>
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                {t('fdd.flightNumber')}
              </TYPE.body>
            </RowBetween>
          </LabelRow>
          <InputRow>
            <NumericalInput
              className="flight-number-input"
              active={!!flightNumber}
              value={flightNumber}
              fontSize={'20px'}
              placeholder={t('fdd.flightNumberPlaceholder')}
              onUserInput={val => {
                onFlightNumberInput(val)
              }}
            />
          </InputRow>
        </InputColumn>
        <InputColumn>
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                {t('fdd.departure')}
              </TYPE.body>
            </RowBetween>
          </LabelRow>
          <InputRow>
            <StyledDatePicker active={Boolean(!!departureDate)}>
              <SingleDatePicker
                placeholder={t('fdd.departure')}
                monthFormat="MMMM yyyy"
                displayFormat={'DD.MM.yyyy'}
                numberOfMonths={1}
                noBorder
                hideKeyboardShortcutsPanel
                phrases={{ closeDatePicker: 'close', clearDate: 'clear' }}
                date={departureDate}
                onDateChange={(date: Moment | null) => onDepartureInput(date)}
                focused={datePickerFocused}
                onFocusChange={({ focused }) => setDatePickerFocused(focused)}
                id="departure_datepicker"
              />
            </StyledDatePicker>
          </InputRow>
        </InputColumn>
      </Container>
      {onCarrierSelect && (
        <CarrierSearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCarrierSelect={onCarrierSelect}
          selectedCarrier={carrier}
        />
      )}
    </InputPanel>
  )
}
