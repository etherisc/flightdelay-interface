import React, { CSSProperties, MutableRefObject, useCallback, useMemo } from 'react'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import Column from '../Column'
import { RowFixed } from '../Row'
import { CarrierItem } from './styleds'
import { Carrier, carrierEquals } from '../../entities/carrier'

function CarrierRow({
  carrier,
  onSelect,
  isSelected,
  style
}: {
  carrier: Carrier
  onSelect: () => void
  isSelected: boolean
  style: CSSProperties
}) {
  // only show add or remove buttons if not on selected list
  return (
    <CarrierItem
      style={style}
      className={`carrier-${carrier.iata}`}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={isSelected}
    >
      <Column>
        <Text title={`${carrier.iata} ${carrier.name}`} fontWeight={500}>
          {carrier.iata}
        </Text>
      </Column>
      <Column></Column>
      <RowFixed style={{ justifySelf: 'flex-end' }}>{carrier.name}</RowFixed>
    </CarrierItem>
  )
}

export default function CarrierList({
  height,
  carriers,
  selectedCarrier,
  onCarrierSelect,
  fixedListRef
}: {
  height: number
  carriers: Carrier[]
  selectedCarrier?: Carrier | null
  onCarrierSelect: (carrier: Carrier) => void
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
}) {
  function carrierKey(carrier: Carrier): string {
    return carrier.iata
  }

  const itemData = useMemo(() => carriers, [carriers])

  const Row = useCallback(
    ({ data, index, style }) => {
      const carrier: Carrier = data[index]
      const isSelected = Boolean(selectedCarrier && carrierEquals(selectedCarrier, carrier))
      const handleSelect = () => onCarrierSelect(carrier)
      return <CarrierRow style={style} carrier={carrier} isSelected={isSelected} onSelect={handleSelect} />
    },
    [onCarrierSelect, selectedCarrier]
  )

  const itemKey = useCallback((index: number, data: any) => carrierKey(data[index]), [])

  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={56}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  )
}
