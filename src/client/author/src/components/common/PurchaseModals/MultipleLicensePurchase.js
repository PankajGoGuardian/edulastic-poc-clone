import React, { useEffect, useState } from 'react'
import {
  EduButton,
  FieldLabel,
  notification,
  TextInputStyled,
} from '@edulastic/common'
import { IconInfo } from '@edulastic/icons'
import SubscriptionAddonModal from './SubscriptionAddonModal'
import ProductsList from './ProductsList'
import { EmailWrapper, LabelIconWrapper } from './styled'
import { Tooltip, emailRegex } from '../../../../../common/utils/helpers'

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
      <EmailWrapper>
        <LabelIconWrapper>
          <FieldLabel>Bookkeeper Email</FieldLabel>
          <Tooltip title={tooltipMessage}>
            <IconInfo
              width={16}
              height={16}
              style={{
                marginLeft: '5px',
                marginBottom: '5px',
              }}
            />
          </Tooltip>
        </LabelIconWrapper>
        <TextInputStyled
          value={emailValues}
          onChange={handleInputEmailAddress}
          placeholder="Type the emails"
          height="40px"
          data-cy="bookKeeperEmailField"
        />
      </EmailWrapper>
    </SubscriptionAddonModal>
  )
}

export default MultipleLicensePurchase
