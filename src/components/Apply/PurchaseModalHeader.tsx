import React, { useContext } from 'react'
import { ArrowDown } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'
import { Purchase } from '../../hooks/usePurchaseCallback'

export default function PurchaseModalHeader({ purchase }: { purchase: Purchase }) {
  const theme = useContext(ThemeContext)
  const {
    flightDetails: {
      flight: {
        carrier: { iata: carrierIata },
        flightNumber,
        departureDateTime
      },
      origin: { iata: originIata, name: originName },
      destination: { iata: destinationIata, name: destinationName }
    }
  } = purchase
  return (
    <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
      <RowBetween align="flex-end">
        <RowFixed gap={'0px'}>
          <Text fontSize={24} fontWeight={500}>
            {`${originIata} ${originName}`}
          </Text>
        </RowFixed>
        <RowFixed gap={'0px'}>
          <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
            {`${carrierIata} ${flightNumber}`}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <ArrowDown size="16" color={theme.text2} style={{ marginLeft: '4px', minWidth: '16px' }} />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap={'0px'}>
          <Text fontSize={24} fontWeight={500}>
            {`${destinationIata} ${destinationName}`}
          </Text>
        </RowFixed>
        <RowFixed gap={'0px'}>
          <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
            {`${departureDateTime ? departureDateTime.format('DD.MM.YYYY HH.mm') : 'n/a'}`}
          </Text>
        </RowFixed>
      </RowBetween>
    </AutoColumn>
  )
}
