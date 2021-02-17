import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { AutoColumn } from 'components/Column'
import { AutoRow } from 'components/Row'
import { Text } from 'rebass'
import { TYPE } from 'theme'
import { useDaiAmountLocked, useStakeBalance, useUnprocessedUnStakeRequest } from 'hooks/FlightDelayStake'

type Props = {
  stableSymbol: string
}

export default function StakeInfo({ stableSymbol }: Props) {
  const theme = useContext(ThemeContext)
  const [daiBalance, dipBalance] = useStakeBalance()
  const daiAmountLocked = useDaiAmountLocked()
  const unprocessedUnstakeRequest = useUnprocessedUnStakeRequest()

  return (
    <AutoColumn gap="md">
      <AutoRow justify="space-around" gap="4px">
        <AutoColumn justify="center">
          <TYPE.black>{daiBalance}</TYPE.black>
          <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
            DIP amount staked
          </Text>
        </AutoColumn>
        <AutoColumn justify="center">
          <TYPE.black>{dipBalance}</TYPE.black>
          <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
            {stableSymbol} amount staked
          </Text>
        </AutoColumn>
        <AutoColumn justify="center">
          <TYPE.black>{daiAmountLocked}</TYPE.black>
          <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
            DAI amount locked
          </Text>
        </AutoColumn>
        <AutoColumn justify="center">
          <TYPE.black>{unprocessedUnstakeRequest}</TYPE.black>
          <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
            Unprocessed Unstake Request
          </Text>
        </AutoColumn>
      </AutoRow>
    </AutoColumn>
  )
}
