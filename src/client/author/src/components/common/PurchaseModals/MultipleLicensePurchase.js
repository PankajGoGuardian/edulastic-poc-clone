import React, { useEffect, useState } from 'react'
import { EduButton, notification } from '@edulastic/common'
import SubscriptionAddonModal from './SubscriptionAddonModal'
import ProductsList from './ProductsList'
import { emailRegex } from '../../../../../common/utils/helpers'
import BookkeeperInfoIconWrapper from './BookkeeperInfoIconWrapper'

const MultipleLicensePurchase = ({
  isVisible,
  handleCloseModal,
  products,
  handleClick,
  setTotalAmount,
  teacherPremium,
  setQuantities,
  quantities,
  setSelectedProductIds,
  selectedProductIds,
  bulkInviteBookKeepers,
  districtId,
  isBookKeepersInviteSuccess,
  setBookKeepersInviteSuccess,
  handleOpenRequestInvoiceModal,
}) => {
  const [emailValues, setEmailValues] = useState('')

  useEffect(() => {
    if (!selectedProductIds.includes(teacherPremium.id)) {
      setSelectedProductIds((x) => (x || []).concat(teacherPremium.id))
    }
  }, [])

  useEffect(() => {
    return () => {
      setSelectedProductIds([])
      setQuantities({})
    }
  }, [])

  useEffect(() => {
    if (isBookKeepersInviteSuccess) {
      const emails = emailValues
        .split(',')
        .map((x) => x.replace(/\s/g, ''))
        .filter((x) => x)

      handleClick({
        emails,
        shouldPayWithCC: true,
      })
    }
    return () => {
      if (isBookKeepersInviteSuccess) {
        setBookKeepersInviteSuccess(false)
      }
    }
  }, [emailValues, isBookKeepersInviteSuccess])

  const handleInputEmailAddress = (ele) => {
    const value = ele.target.value
    setEmailValues(value)
  }

  const handleProceed = () => {
    const emails = emailValues
      .split(',')
      .map((x) => x.replace(/\s/g, ''))
      .filter((x) => x)

    for (const email of emails) {
      if (!emailRegex.test(email)) {
        return notification({
          type: 'warn',
          msg: `${email} is invalid email!`,
        })
      }
    }

    bulkInviteBookKeepers({
      districtId,
      userDetails: emails,
    })
  }

  const tooltipMessage = 'This user(s) will get manage subscriptions permission'

  const footer = [
    <EduButton
      isGhost
      onClick={handleOpenRequestInvoiceModal}
      data-cy="requestInvoice"
      width="220px"
      height="45px"
    >
      REQUEST INVOICE
    </EduButton>,
    <EduButton
      onClick={handleProceed}
      data-cy="proceedPayment"
      width="220px"
      height="45px"
      disabled={!quantities[teacherPremium.id]}
    >
      Pay with Credit Card
    </EduButton>,
  ]

  return (
    <SubscriptionAddonModal
      isVisible={isVisible}
      title="Upgrade Multiple Accounts"
      handleCloseModal={handleCloseModal}
      footer={footer}
    >
      <ProductsList
        showMultiplePurchaseModal
        productsToshow={products}
        setTotalPurchaseAmount={setTotalAmount}
        teacherPremium={teacherPremium}
        setQuantities={setQuantities}
        quantities={quantities}
        setSelectedProductIds={setSelectedProductIds}
        selectedProductIds={selectedProductIds}
      />
      <BookkeeperInfoIconWrapper
        tooltipMessage={tooltipMessage}
        emailValues={emailValues}
        handleInputEmailAddress={handleInputEmailAddress}
      />
    </SubscriptionAddonModal>
  )
}

export default MultipleLicensePurchase
