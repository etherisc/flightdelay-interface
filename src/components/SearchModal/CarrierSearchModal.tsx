import React, { useCallback, useEffect, useState } from 'react'
import useLast from '../../hooks/useLast'
import Modal from '../Modal'
import { CarrierSearch } from './CarrierSearch'
import { Carrier } from '../../entities/carrier'

interface CarrierSearchModalProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCarrier?: Carrier | null
  onCarrierSelect: (carrier: Carrier) => void
}

export default function CarrierSearchModal({
  isOpen,
  onDismiss,
  onCarrierSelect,
  selectedCarrier
}: CarrierSearchModalProps) {
  const [listView, setListView] = useState<boolean>(false)
  const lastOpen = useLast(isOpen)

  useEffect(() => {
    if (isOpen && !lastOpen) {
      setListView(false)
    }
  }, [isOpen, lastOpen])

  const handleCarrierSelect = useCallback(
    (carrier: Carrier) => {
      onCarrierSelect(carrier)
      onDismiss()
    },
    [onDismiss, onCarrierSelect]
  )

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={80} minHeight={listView ? 40 : 80}>
      <CarrierSearch
        isOpen={isOpen}
        onDismiss={onDismiss}
        onCarrierSelect={handleCarrierSelect}
        selectedCarrier={selectedCarrier}
      />
    </Modal>
  )
}
