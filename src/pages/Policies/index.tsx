import React, { useEffect } from 'react'
import { AutoColumn } from '../../components/Column'
import AppBody from '../AppBody'
import styled from 'styled-components'
import Logo from '../../assets/images/2020_Etherisc_FlightDelayProtection.svg'
import LogoDark from '../../assets/images/2020_Etherisc_FlightDelayProtectionWhite.svg'
import { useDarkModeManager } from '../../state/user/hooks'
import PolicyTable from '../../components/Policies/PolicyTable'
import { usePoliciesState, getPolicyData } from '../../state/policy/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useDispatch } from 'react-redux'

const Wrapper = styled.div`
  position: relative;
`

const DialogTitle = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  img {
    width: 400px;
  }
  @media (max-width: 600px) {
    img {
      width: 300px;
    }
  }
`
export default function Policies() {
  // const { t } = useTranslation()
  const [isDark] = useDarkModeManager()
  const policyData = usePoliciesState()
  const { account } = useActiveWeb3React()
  const dispatch = useDispatch()
  useEffect(() => {
    getPolicyData(dispatch, account)
  }, [account, dispatch])

  return (
    <>
      <AppBody>
        <Wrapper id="apply-page">
          <AutoColumn gap={'md'}>
            <DialogTitle>
              <img src={isDark ? LogoDark : Logo} alt="logo" />
            </DialogTitle>
          </AutoColumn>
          <PolicyTable policyData={policyData}></PolicyTable>
        </Wrapper>
      </AppBody>
    </>
  )
}
