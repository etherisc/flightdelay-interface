import React, { useCallback } from 'react'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent
} from '../TransactionConfirmationModal'
import PurchaseModalFooter from './PurchaseModalFooter'
import PurchaseModalHeader from './PurchaseModalHeader'
import { Purchase } from '../../hooks/usePurchaseCallback'
import { useTranslation } from 'react-i18next'

export default function ConfirmPurchaseModal({
  purchase,
  onConfirm,
  onDismiss,
  isOpen,
  attemptingTxn,
  txHash,
  purchaseErrorMessage
}: {
  purchase: Purchase
  onConfirm: () => void
  onDismiss: () => void
  isOpen: boolean
  attemptingTxn: boolean
  txHash: string | undefined
  purchaseErrorMessage: string | undefined
}) {
  const { t } = useTranslation()

  const modalHeader = useCallback(() => {
    return <PurchaseModalHeader purchase={purchase} />
  }, [purchase])

  const modalBottom = useCallback(() => {
    return <PurchaseModalFooter purchase={purchase} onConfirm={onConfirm} />
  }, [onConfirm, purchase])

  // text to show while loading
  const pendingText = t('pendingTransactionText')

  const makeReadable = (message: string) => {
    const key = message.includes('PFE-006')
      ? 'ui-error-PFE-006'
      : message.includes('PFD-007')
      ? 'ui-error-PFD-007'
      : message.includes('insufficient funds for transfer')
      ? 'ui-error-insufficient-funds'
      : message

    return t(key)
  }

  const confirmationContent = useCallback(
    () =>
      purchaseErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={makeReadable(purchaseErrorMessage)} />
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
