import React, { useState, useMemo, useCallback, useEffect, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { TYPE } from 'theme'
import { GreyCard } from 'components/Card'
import { PolicyData } from '../../state/policy/reducer'
import Loader, { LoadingRows } from 'components/Loader'
// import { Link } from 'react-router-dom'
import { AutoColumn } from 'components/Column'
import { Label, ClickableText } from '../Text'
import { PageButtons, Arrow, Break } from 'components/shared'

const Wrapper = styled(GreyCard)`
  width: 100%;
`

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;

  grid-template-columns: 20px 1fr repeat(4, 1fr);

  @media screen and (max-width: 900px) {
    grid-template-columns: 20px 1fr repeat(3, 1fr);
    & :nth-child(4) {
      display: none;
    }
  }

  @media screen and (max-width: 800px) {
    grid-template-columns: 20px 1fr repeat(2, 1fr);
    & :nth-child(6) {
      display: none;
    }
  }

  @media screen and (max-width: 670px) {
    grid-template-columns: repeat(2, 1fr);
    > *:first-child {
      display: none;
    }
    > *:nth-child(3) {
      display: none;
    }
  }
`
/*
const LinkWrapper = styled(Link)`
  text-decoration: none;
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`
*/

const DataRow = ({ policyData, index }: { policyData: PolicyData; index: number }) => {
  // const theme = useTheme()
  const arrival = new Date(policyData.arrivalTime)
    .toISOString()
    .slice(0, 10)
    .replaceAll('-', '/')
  return (
    <ResponsiveGrid>
      <Label>{index + 1}</Label>
      <Label>{policyData.carrierFlightNumber}</Label>
      <Label end={1} fontWeight={400}>
        {arrival}
      </Label>
      <Label end={1} fontWeight={400}>
        {policyData.premium}
      </Label>
      <Label end={1} fontWeight={400}>
        A
      </Label>
      <Label end={1} fontWeight={400}>
        {policyData.delayInMinutes} min.
      </Label>
    </ResponsiveGrid>
  )
}

const MAX_ITEMS = 10

export default function PolicyTable({
  policyData,
  maxItems = MAX_ITEMS
}: {
  policyData: PolicyData[] | undefined
  maxItems?: number
}) {
  // theming
  const theme = useContext(ThemeContext)

  // for sorting
  const [sortField /*, setSortField*/] = useState('' /* SORT_FIELD.tvlUSD */)
  const [sortDirection /*, setSortDirection */] = useState<boolean>(true)

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  useEffect(() => {
    let extraPages = 1
    if (policyData) {
      if (policyData.length % maxItems === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(policyData.length / maxItems) + extraPages)
    }
  }, [maxItems, policyData])

  const sortedPolicies = useMemo(() => {
    return policyData
      ? policyData
      : /*
          .filter(x => !!x && !policy_HIDE.includes(x.address))
          .sort((a, b) => {
            if (a && b) {
              return a[sortField as keyof policyData] > b[sortField as keyof policyData]
                ? (sortDirection ? -1 : 1) * 1
                : (sortDirection ? -1 : 1) * -1
            } else {
              return -1
            }
          })
          .slice(maxItems * (page - 1), page * maxItems)
         */
        []
  }, [policyData /*, maxItems, page, sortDirection, sortField */])

  /*
  const handleSort = useCallback(
    (newField: string) => {
      setSortField(newField)
      setSortDirection(sortField !== newField ? true : !sortDirection)
    },
    [sortDirection, sortField]
  )
   */

  const arrow = useCallback(
    (field: string) => {
      return sortField === field ? (!sortDirection ? '↑' : '↓') : ''
    },
    [sortDirection, sortField]
  )

  if (!policyData) {
    return <Loader />
  }

  return (
    <Wrapper>
      {sortedPolicies.length > 0 ? (
        <AutoColumn gap="16px">
          <ResponsiveGrid>
            <Label color={theme.text2}>#</Label>
            <ClickableText
              color={theme.text2}
              onClick={() => {
                /* handleSort(SORT_FIELD.name) */
              }}
            >
              Flight Number {arrow('' /* SORT_FIELD.name */)}
            </ClickableText>
            <ClickableText
              color={theme.text2}
              end={1}
              onClick={() => {
                /* handleSort(SORT_FIELD.priceUSDChange) */
              }}
            >
              Arrival {arrow('' /* SORT_FIELD.priceUSDChange */)}
            </ClickableText>
            {/* <ClickableText end={1} onClick={() => handleSort(SORT_FIELD.priceUSDChangeWeek)}>
            7d {arrow(SORT_FIELD.priceUSDChangeWeek)}
          </ClickableText> */}
            <ClickableText
              color={theme.text2}
              end={1}
              onClick={() => {
                /* handleSort(SORT_FIELD.volumeUSD) */
              }}
            >
              Premium {arrow('' /* SORT_FIELD.volumeUSD */)}
            </ClickableText>
            <ClickableText
              color={theme.text2}
              end={1}
              onClick={() => {
                /* handleSort(SORT_FIELD.tvlUSD) */
              }}
            >
              Status {arrow('' /* SORT_FIELD.tvlUSD */)}
            </ClickableText>
            <ClickableText
              color={theme.text2}
              end={1}
              onClick={() => {
                /* handleSort(SORT_FIELD.tvlUSD) */
              }}
            >
              Delay {arrow('' /* SORT_FIELD.tvlUSD */)}
            </ClickableText>
          </ResponsiveGrid>

          <Break />
          {sortedPolicies.map((data, i) => {
            if (data) {
              return (
                <React.Fragment key={i}>
                  <DataRow index={(page - 1) * MAX_ITEMS + i} policyData={data} />
                  <Break />
                </React.Fragment>
              )
            }
            return null
          })}
          <PageButtons>
            <div
              onClick={() => {
                setPage(page === 1 ? page : page - 1)
              }}
            >
              <Arrow faded={page === 1}>←</Arrow>
            </div>
            <TYPE.body>{'Page ' + page + ' of ' + maxPage}</TYPE.body>
            <div
              onClick={() => {
                setPage(page === maxPage ? page : page + 1)
              }}
            >
              <Arrow faded={page === maxPage}>→</Arrow>
            </div>
          </PageButtons>
        </AutoColumn>
      ) : (
        <LoadingRows>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </LoadingRows>
      )}
    </Wrapper>
  )
}
