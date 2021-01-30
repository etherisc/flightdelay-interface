import React, { useCallback } from 'react'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent
} from '../TransactionConfirmationModal'
import PurchaseModalFooter from './PurchaseModalFooter'
import PurchaseModalHeader from './PurchaseModalHeader'

export default function ConfirmSwapModal({
  onConfirm,
  onDismiss,
  isOpen,
  attemptingTxn,
  txHash,
  purchaseErrorMessage
}: {
  onConfirm: () => void
  onDismiss: () => void
  isOpen: boolean
  attemptingTxn: boolean
  txHash: string | undefined
  purchaseErrorMessage: string | undefined
}) {
  const modalHeader = useCallback(() => {
    return <PurchaseModalHeader />
  }, [])

  const modalBottom = useCallback(() => {
    return <PurchaseModalFooter onConfirm={onConfirm} />
  }, [onConfirm])

  // text to show while loading
  const pendingText = `Pending Text ... shown while loading`

  const confirmationContent = useCallback(
    () =>
      purchaseErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={purchaseErrorMessage} />
      ) : (
        <ConfirmationModalContent
          title="Confirm Purchase"
          onDismiss={onDismiss}
          topContent={modalHeader}
          bottomContent={modalBottom}
        />
      ),
    [purchaseErrorMessage, onDismiss, modalBottom, modalHeader]
  )

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
    />
  )
}
