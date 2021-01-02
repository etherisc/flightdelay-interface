import React, { KeyboardEvent, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import { CloseIcon } from '../../theme'
import Column from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween } from '../Row'
import CarrierList from './CarrierList'
import SortButton from './SortButton'
import { PaddedColumn, SearchInput, Separator } from './styleds'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Carrier } from '../../entities/carrier'
import { useAllCarriers } from '../../hooks/Carriers'

interface CarrierSearchProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCarrier?: Carrier | null
  onCarrierSelect: (carrier: Carrier) => void
}

function filterCarriers(carriers: Carrier[], search: string): Carrier[] {
  if (search.length === 0) return carriers

  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter(s => s.length > 0)

  if (lowerSearchParts.length === 0) {
    return carriers
  }

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter(s => s.length > 0)

    return lowerSearchParts.every(p => p.length === 0 || sParts.some(sp => sp.startsWith(p) || sp.endsWith(p)))
  }

  return carriers.filter(carrier => {
    const { iata, name } = carrier

    return (iata && matchesSearch(iata)) || (name && matchesSearch(name))
  })
}

export function CarrierSearch({ selectedCarrier, onCarrierSelect, onDismiss, isOpen }: CarrierSearchProps) {
  const { t } = useTranslation()
  const allCarriers = useAllCarriers()
  const fixedList = useRef<FixedSizeList>()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [invertSearchOrder, setInvertSearchOrder] = useState<boolean>(false)

  const filteredCarriers: Carrier[] = useMemo(() => {
    return filterCarriers(Object.values(allCarriers), searchQuery)
  }, [searchQuery, allCarriers])

  const filteredSortedCarriers: Carrier[] = useMemo(() => {
    function carrierComparator(carrierA: Carrier, carrierB: Carrier) {
      return carrierA.iata.toLowerCase() < carrierB.iata.toLowerCase() ? -1 : 1
    }

    const sorted = filteredCarriers.sort(carrierComparator)
    const queryParts = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter(s => s.length > 0)
    if (queryParts.length > 1) return sorted

    return [
      // sort any exact symbol matches first
      ...sorted.filter(carrier => carrier.iata?.toLowerCase() === queryParts[0]),
      ...sorted.filter(carrier => carrier.iata?.toLowerCase() !== queryParts[0])
    ]
  }, [filteredCarriers, searchQuery])

  const handleCarrierSelect = useCallback(
    (carrier: Carrier) => {
      onCarrierSelect(carrier)
      onDismiss()
    },
    [onDismiss, onCarrierSelect]
  )

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback(event => {
    const input = event.target.value
    setSearchQuery(input)
    fixedList.current?.scrollTo(0)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        if (filteredSortedCarriers.length > 0) {
          if (
            filteredSortedCarriers[0].iata?.toLowerCase() === searchQuery.trim().toLowerCase() ||
            filteredSortedCarriers.length === 1
          ) {
            handleCarrierSelect(filteredSortedCarriers[0])
          }
        }
      }
    },
    [filteredSortedCarriers, handleCarrierSelect, searchQuery]
  )

  return (
    <Column style={{ width: '100%', flex: '1 1' }}>
      <PaddedColumn gap="14px">
        <RowBetween>
          <Text fontWeight={500} fontSize={16}>
            {t('fdd.selectCarrier')}
            <QuestionHelper text={t('fdd.findCarrierInfo')} />
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <SearchInput
          type="text"
          id="token-search-input"
          placeholder={t('fdd.carrierSearchPlaceholder')}
          value={searchQuery}
          ref={inputRef as RefObject<HTMLInputElement>}
          onChange={handleInput}
          onKeyDown={handleEnter}
        />
        <RowBetween>
          <Text fontSize={14} fontWeight={500}>
            {t('fdd.carrierName')}
          </Text>
          <SortButton ascending={invertSearchOrder} toggleSortOrder={() => setInvertSearchOrder(iso => !iso)} />
        </RowBetween>
      </PaddedColumn>

      <Separator />

      <div style={{ flex: '1' }}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <CarrierList
              height={height}
              carriers={filteredSortedCarriers}
              onCarrierSelect={handleCarrierSelect}
              selectedCarrier={selectedCarrier}
              fixedListRef={fixedList}
            />
          )}
        </AutoSizer>
      </div>
    </Column>
  )
}
