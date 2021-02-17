import { useState } from 'react'
import { useRequiredDip } from './FlightDelayStake'

export default function useAmount() {
  const [daiAmount, changeDaiAmount] = useState('0')
  const [dipAmount, changeDipAmount] = useState('0')

  const ratio = useRequiredDip('1')

  const setDaiAmount = (daiAmount: string) => {
    changeDaiAmount(daiAmount)
    changeDipAmount((parseFloat(daiAmount) * parseFloat(ratio)).toString())
  }

  const setDipAmount = (dipAmount: string) => {
    changeDipAmount(dipAmount)
    changeDaiAmount((parseFloat(dipAmount) / parseFloat(ratio)).toString())
  }

  return { daiAmount, dipAmount, setDaiAmount, setDipAmount }
}
